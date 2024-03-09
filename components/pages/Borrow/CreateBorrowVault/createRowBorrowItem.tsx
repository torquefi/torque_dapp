import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import { toMetricUnits } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import { useWeb3Modal } from '@web3modal/react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { borrowBtcContract, borrowEthContract } from '../constants/contract'
import { IBorrowInfo } from '../types'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
interface CreateRowBorrowItemProps {
    item: IBorrowInfo
    setIsFetchBorrowLoading?: any
}

export default function CreateRowBorrowItem({
    item,
    setIsFetchBorrowLoading,
}: CreateRowBorrowItemProps) {
    const web3 = new Web3(Web3.givenProvider)
    const { open } = useWeb3Modal()

    const [dataBorrow, setDataBorrow] = useState(item)
    const [isLoading, setIsLoading] = useState(true)
    const [amount, setAmount] = useState(0)
    const [amountReceive, setAmountReceive] = useState(0)
    const [buttonLoading, setButtonLoading] = useState('')
    const { address, isConnected } = useAccount()
    const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
        useState(false)
    const [aprBorrow, setAprBorrow] = useState('')
    const [amountRaw, setAmountRaw] = useState(0)
    const [amountReceiveRaw, setAmountReceiveRaw] = useState(0)
    const [isUsdBorrowToken, setIsUsdBorrowToken] = useState(true)
    const [isUsdDepositToken, setIsUsdDepositToken] = useState(true)
    const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000)
    }, [])

    const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

    const initContract = async () => {
        try {
            const contractBorrowETH = new web3.eth.Contract(
                JSON.parse(borrowEthContract?.abi),
                borrowEthContract?.address
            )

            let contractBorrowBTC = new web3.eth.Contract(
                JSON.parse(borrowBtcContract?.abi),
                borrowBtcContract?.address
            )
            if (contractBorrowETH && item.depositTokenSymbol === 'WETH') {
                const aprBorrowETH = await contractBorrowETH.methods.getApr().call({
                    from: address,
                })
                setAprBorrow(web3.utils.fromWei(aprBorrowETH.toString(), 'ether'))
            }

            if (contractBorrowBTC && item.depositTokenSymbol === 'WBTC') {
                const aprBorrowBTC = await contractBorrowBTC.methods.getApr().call({
                    from: address,
                })
                setAprBorrow(web3.utils.fromWei(aprBorrowBTC.toString(), 'ether'))
            }
        } catch (e) {
            console.log(e)
        }
    }

    const tokenBorrowContract = useMemo(() => {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
            JSON.parse(item?.tokenBorrowContractInfo?.abi),
            item?.tokenBorrowContractInfo?.address
        )
        return contract
    }, [Web3.givenProvider, item.tokenContractInfo])

    const tokenContract = useMemo(() => {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
            JSON.parse(item?.tokenContractInfo?.abi),
            item?.tokenContractInfo?.address
        )
        return contract
    }, [Web3.givenProvider, item.tokenContractInfo])

    const borrowContract = useMemo(() => {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
            JSON.parse(item?.borrowContractInfo?.abi),
            item?.borrowContractInfo?.address
        )
        return contract
    }, [Web3.givenProvider, item.borrowContractInfo])

    const handleConfirmDeposit = async () => {
        if (!isConnected) {
            // await open()
            setOpenConnectWalletModal(true)
            return
        }
        setOpenConfirmDepositModal(true)
    }

    const onBorrow = async () => {
        if (amount <= 0) {
            toast.error(`You must supply ${item.depositTokenSymbol} to borrow`)
            return
        }
        // if (amountReceive <= 0) {
        //   toast.error('Can not borrow less than 0 TUSD')
        //   return
        // }
        try {
            setIsLoading(true)
            if (item.depositTokenSymbol == 'WBTC') {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner(address)
                const tokenDepositDecimals = await tokenContract.methods
                    .decimals()
                    .call()
                const borrow = Number(
                    new BigNumber(Number(amount).toFixed(tokenDepositDecimals))
                        .multipliedBy(10 ** tokenDepositDecimals)
                        .toString()
                )
                const usdcBorrowAmount = await borrowContract.methods
                    .getBorrowableUsdc(borrow)
                    .call()
                const newUsdcBorrowAmount = new BigNumber(usdcBorrowAmount)
                    .multipliedBy(0.98)
                    .toFixed(0)
                    .toString()

                const borrowInfoMap = await borrowContract.methods
                    .borrowInfoMap(address)
                    .call()
                console.log('borrow :>> ', borrow)

                const tusdBorrowedAmount = borrowInfoMap?.baseBorrowed
                console.log('tusdBorrowedAmount :>> ', tusdBorrowedAmount)
                console.log('amountReceive :>> ', amountReceive)

                let tusdBorrowAmount = await borrowContract.methods
                    .getMintableToken(newUsdcBorrowAmount, tusdBorrowedAmount, 0)
                    .call()

                const tokenBorrowDecimal = await tokenBorrowContract.methods
                    .decimals()
                    .call()
                console.log('tokenDecimal :>> ', tokenBorrowDecimal)
                console.log('amountReceive :>> ', amountReceive)
                if (amountReceive) {
                    tusdBorrowAmount = ethers.utils
                        .parseUnits(
                            Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
                            tokenBorrowDecimal
                        )
                        .toString()
                }

                console.log(
                    'params :>> ',
                    borrow.toString(),
                    newUsdcBorrowAmount,
                    tusdBorrowAmount
                )

                const allowance = await tokenContract.methods
                    .allowance(address, item.borrowContractInfo.address)
                    .call()
                const gasPrice = await provider.getGasPrice()
                console.log('gasPrice :>> ', gasPrice)
                const tokenContract1 = new ethers.Contract(
                    item?.tokenContractInfo?.address,
                    item?.tokenContractInfo?.abi,
                    signer
                )
                if (
                    new BigNumber(allowance).lte(new BigNumber('0')) ||
                    new BigNumber(allowance).lte(new BigNumber(tusdBorrowAmount))
                ) {
                    const tx = await tokenContract1.approve(
                        item?.borrowContractInfo?.address,
                        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    )
                    // .send({
                    //   from: address,
                    // })
                    await tx.wait()
                }

                // await borrowContract.methods
                //   .borrow(borrow.toString(), newUsdcBorrowAmount, tusdBorrowAmount)
                //   .send({
                //     from: address,
                //     gasPrice: '5000000000'
                //   })

                const borrowContract2 = new ethers.Contract(
                    item?.borrowContractInfo?.address,
                    item?.borrowContractInfo?.abi,
                    signer
                )

                const tx = await borrowContract2.borrow(
                    borrow.toString(),
                    newUsdcBorrowAmount,
                    tusdBorrowAmount
                )
                await tx.wait()
                toast.success('Borrow Successful')
                setOpenConfirmDepositModal(false)
                setIsLoading(false)
                setIsFetchBorrowLoading && setIsFetchBorrowLoading((prev: any) => !prev)
            }
            if (item.depositTokenSymbol == 'WETH') {
                const tokenDepositDecimals = await tokenContract.methods
                    .decimals()
                    .call()
                const borrow = Number(
                    new BigNumber(Number(amount).toFixed(tokenDepositDecimals))
                        .multipliedBy(10 ** tokenDepositDecimals)
                        .toString()
                )
                const usdcBorrowAmount = await borrowContract.methods
                    .getBorrowableUsdc(borrow)
                    .call()
                const newUsdcBorrowAmount = new BigNumber(usdcBorrowAmount)
                    .multipliedBy(0.98)
                    .toFixed(0)
                    .toString()

                const borrowInfoMap = await borrowContract.methods
                    .borrowInfoMap(address)
                    .call()
                const tusdBorrowedAmount = borrowInfoMap?.baseBorrowed
                console.log('tusdBorrowedAmount :>> ', tusdBorrowedAmount)

                let tusdBorrowAmount = await borrowContract.methods
                    .getMintableToken(newUsdcBorrowAmount, tusdBorrowedAmount, 0)
                    .call()

                const tokenBorrowDecimal = await tokenBorrowContract.methods
                    .decimals()
                    .call()

                console.log('tokenDecimal :>> ', tokenBorrowDecimal)

                if (amountReceive) {
                    tusdBorrowAmount = ethers.utils
                        .parseUnits(
                            Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
                            tokenBorrowDecimal
                        )
                        .toString()
                }

                console.log(
                    'params :>> ',
                    borrow.toString(),
                    newUsdcBorrowAmount,
                    tusdBorrowAmount
                )

                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner(address)

                const tokenContract1 = new ethers.Contract(
                    item?.tokenContractInfo?.address,
                    item?.tokenContractInfo?.abi,
                    signer
                )

                const allowance = await tokenContract.methods
                    .allowance(address, item.borrowContractInfo.address)
                    .call()

                if (
                    new BigNumber(allowance).lte(new BigNumber('0')) ||
                    new BigNumber(allowance).lte(tusdBorrowAmount)
                ) {
                    const tx = await tokenContract1.approve(
                        item?.borrowContractInfo?.address,
                        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    )
                    // .send({
                    //   from: address,
                    // })
                    await tx.wait()
                }

                const borrowContract2 = new ethers.Contract(
                    item?.borrowContractInfo?.address,
                    item?.borrowContractInfo?.abi,
                    signer
                )

                const tx = await borrowContract2.borrow(
                    borrow.toString(),
                    newUsdcBorrowAmount,
                    tusdBorrowAmount
                )
                await tx.wait()
                toast.success('Borrow Successful')
                setOpenConfirmDepositModal(false)
                setIsLoading(false)
                setIsFetchBorrowLoading && setIsFetchBorrowLoading((prev: any) => !prev)
            }
            // dispatch(updateborrowTime(new Date().getTime() as any))
        } catch (e) {
            console.log('CreateBorrowItem.onBorrow', e)
            toast.error('Borrow Failed')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        initContract()
    }, [])

    const renderSubmitText = () => {
        if (!address) {
            return 'Connect Wallet'
        }
        // return 'Deposit & Borrow'
        return 'Confirm Borrow'
    }

    console.log('item :>> ', item)

    return (
        <>
            <div
                className="cursor-pointer rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-5 pt-3 text-[#030303] xl:px-[32px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white mb-3"
                key={dataBorrow.depositTokenSymbol}
            >
                <div className="flex items-center overflow-x-auto">
                    <div className="w-1/4 lg:w-1/6 inline-flex flex-none items-center">
                        <img
                            className="w-[54px] mr-2"
                            src={`/icons/coin/${item.depositTokenSymbol.toLowerCase()}.png`}
                            alt=""
                        />
                        <div className="inline-flex flex-1 flex-col">
                            <p className="font-larken text-[28px] font-[400] leading-[34px] tracking-[0em]">
                                {item?.name}
                            </p>
                            <p className="text-[20px] font-[500] tracking-[0em] text-[#959595]">
                                {item?.depositTokenSymbol?.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="w-1/4 lg:w-1/6 inline-flex flex-none flex-col items-center gap-[4px]">
                        <div className="flex items-center">
                            <Link
                                href={'https://compound.finance/'}
                                className="translate-x-3"
                                target={'_blank'}
                            >
                                <img
                                    src={'/icons/coin/compound.svg'}
                                    alt="Compound"
                                    className="w-[24px]"
                                />
                            </Link>
                            <Link
                                href={'https://tusd.torque.fi/'}
                                className=""
                                target={'_blank'}
                            >
                                <img
                                    src={'/icons/coin/torq-yi.svg'}
                                    alt="Torque USD"
                                    className="w-[24px]"
                                />
                            </Link>
                        </div>
                        <div className="text-[20px] font-[500] tracking-[0em] text-[#959595]">
                            Loan providers
                        </div>
                    </div>
                    <div className="w-1/4 lg:w-1/6 inline-flex flex-none items-center flex-col gap-[4px]">
                        <p className='font-larken text-[24px] font-[400] tracking-[0em]'>
                            {'<'}
                            {item?.loanToValue}%
                        </p>
                        <div className='text-[20px] font-[500] tracking-[0em] text-[#959595]'>Loan-to-value</div>
                    </div>
                    <div className="w-1/4 lg:w-1/6 inline-flex flex-none items-center flex-col gap-[4px]">
                        <p className='font-larken text-[24px] font-[400] tracking-[0em]'>
                            {!aprBorrow
                                ? '-0.00%'
                                : (-Number(aprBorrow) * 100).toFixed(2) + '%'}
                        </p>
                        <div className='text-[20px] font-[500] tracking-[0em] text-[#959595]'>Variable APR</div>
                    </div>
                    <div className="w-1/4 lg:w-1/6 inline-flex flex-none items-center flex-col gap-[4px]">
                        <p className='font-larken text-[24px] font-[400] tracking-[0em]'>
                            {!item?.liquidity ? '0.00%' : '$' + toMetricUnits(item?.liquidity)}
                        </p>
                        <div className='text-[20px] font-[500] tracking-[0em] text-[#959595]'>Liquidity</div>
                    </div>
                    <div className="w-1/4 lg:w-1/6 inline-flex flex-none items-center flex-col gap-[4px]">
                        <div className="flex items-center gap-[6px]">
                            <img
                                src="/assets/t-logo-circle.png"
                                alt=""
                                className="w-[24px]"
                            />
                            <div className="font-larken text-[24px] font-[400] tracking-[0em]">
                                0.00
                            </div>
                        </div>
                        <div className='text-[20px] font-[500] tracking-[0em] text-[#959595]'>Rewards</div>
                    </div>
                </div>
            </div>
            <ConfirmDepositModal
                open={isOpenConfirmDepositModal}
                handleClose={() => setOpenConfirmDepositModal(false)}
                confirmButtonText="Supply & Borrow"
                onConfirm={() => onBorrow()}
                loading={isLoading}
                coinFrom={{
                    amount: amountRaw,
                    icon: `/icons/coin/${item.depositTokenSymbol.toLocaleLowerCase()}.png`,
                    symbol: item.depositTokenSymbol,
                    isUsd: isUsdDepositToken,
                }}
                coinTo={{
                    amount: amountReceiveRaw,
                    icon: `/icons/coin/${item.borrowTokenSymbol.toLocaleLowerCase()}.png`,
                    symbol: item.borrowTokenSymbol,
                    isUsd: isUsdBorrowToken,
                }}
                details={[
                    {
                        label: 'Loan-to-value',
                        value: `<${item?.loanToValue}%`,
                    },
                    {
                        label: 'Variable APR',
                        value: !aprBorrow
                            ? '-0.00%'
                            : -(Number(aprBorrow) * 100).toFixed(2) + '%',
                    },
                ]}
            />

            <ConnectWalletModal
                openModal={isOpenConnectWalletModal}
                handleClose={() => setOpenConnectWalletModal(false)}
            />
        </>
    )
}
