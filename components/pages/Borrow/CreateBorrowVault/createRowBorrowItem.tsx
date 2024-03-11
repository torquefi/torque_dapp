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
import SwapModal from '@/components/common/Modal/SwapModal'
interface CreateRowBorrowItemProps {
    item: IBorrowInfo
    setIsFetchBorrowLoading?: any
}

export default function CreateRowBorrowItem({
    item,
    setIsFetchBorrowLoading,
}: CreateRowBorrowItemProps) {
    const web3 = new Web3(Web3.givenProvider)
    const [dataBorrow, setDataBorrow] = useState(item)
    const [isLoading, setIsLoading] = useState(true)
    const { address, isConnected } = useAccount()
    const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
        useState(false)
    const [amountRaw, setAmountRaw] = useState('')
    const [aprBorrow, setAprBorrow] = useState('')
    const [openSwapModal, setOpenSwapModal] = useState(false)
    const [amountReceiveRaw, setAmountReceiveRaw] = useState(0)
    const [totalSupplied, setTotalSupplied] = useState('')
    const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
    const [tokenHover, setTokenHover] = useState('')
    const usdPrice: any = useSelector((store: AppStore) => store.usdPrice?.price)
    const theme = useSelector((store: AppStore) => store.theme.theme)


    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000)
    }, [])

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

    const handleGetTotalSupply = async () => {
        if (!borrowContract || !tokenContract) {
            return;
        }
        try {
            const totalSupply = await borrowContract.methods
                .totalSupplied()
                .call()
            const tokenDecimal = await tokenContract.methods
                .decimals()
                .call()

            const totalSupplied = new BigNumber(
                ethers.utils.formatUnits(totalSupply, tokenDecimal).toString()
            )
                .multipliedBy(new BigNumber(usdPrice?.[`${dataBorrow.depositTokenSymbol.toLowerCase()}`] || 0))
                .toString()
            setTotalSupplied(totalSupplied)
            console.log('totalSupplied :>> ', totalSupplied);
        } catch (error) {
            console.log('handleGetTotalSupply error :>> ', error);
        }
    }

    useEffect(() => {
        handleGetTotalSupply()
    }, [borrowContract, tokenContract, usdPrice])

    const handleConfirmDeposit = async () => {
        if (!isConnected) {
            setOpenConnectWalletModal(true)
            return
        }
        setOpenConfirmDepositModal(true)
    }

    const onBorrow = async () => {
        if (Number(amountRaw) <= 0) {
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
                    new BigNumber(Number(amountRaw).toFixed(tokenDepositDecimals))
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

                let tusdBorrowAmount = await borrowContract.methods
                    .getMintableToken(newUsdcBorrowAmount, tusdBorrowedAmount, 0)
                    .call()

                const tokenBorrowDecimal = await tokenBorrowContract.methods
                    .decimals()
                    .call()
                console.log('tokenDecimal :>> ', tokenBorrowDecimal)
                console.log('amountReceiveRaw :>> ', amountReceiveRaw)
                if (amountReceiveRaw) {
                    tusdBorrowAmount = ethers.utils
                        .parseUnits(
                            Number(amountReceiveRaw).toFixed(tokenBorrowDecimal).toString(),
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
                setAmountRaw('')
                setAmountReceiveRaw(0)
                setOpenSwapModal(false)
            }
            if (item.depositTokenSymbol == 'WETH') {
                const tokenDepositDecimals = await tokenContract.methods
                    .decimals()
                    .call()
                const borrow = Number(
                    new BigNumber(Number(amountRaw).toFixed(tokenDepositDecimals))
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

                if (amountReceiveRaw) {
                    tusdBorrowAmount = ethers.utils
                        .parseUnits(
                            Number(amountReceiveRaw).toFixed(tokenBorrowDecimal).toString(),
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
                setAmountRaw('')
                setAmountReceiveRaw(0)
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

    const handleChangeAmountRow = (value: string) => {
        setAmountRaw(value)
        setAmountReceiveRaw(
            Number(value || 0) * usdPrice?.[`${dataBorrow.depositTokenSymbol.toLowerCase()}`] *
            (dataBorrow.loanToValue / 140)
        )
    }

    return (
        <>
            <tr
                key={dataBorrow.depositTokenSymbol}
                onClick={() => {
                    setAmountRaw('')
                    setAmountReceiveRaw(0)
                    setOpenSwapModal(true)
                }}
                className={`cursor-pointer relative ${dataBorrow.depositTokenSymbol === tokenHover ? 'bg-[#f6f4f8] dark:bg-[#141414]' : ''}`}
                onMouseOver={() => setTokenHover(dataBorrow.depositTokenSymbol)}
                onMouseLeave={() => setTokenHover('')}
            >
                <td className='py-[6px]'>
                    <div className="inline-flex items-center">
                        <img
                            className="w-[32px] h-[32px] mr-1"
                            src={`/icons/coin/${item.depositTokenSymbol.toLowerCase()}.png`}
                            alt=""
                        />
                        <div className="inline-flex flex-1 flex-col">
                            <p className="text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white">
                                {item?.depositTokenSymbol?.toUpperCase()}
                            </p>
                        </div>
                    </div>
                </td>
                <td className='py-[6px]'>
                    <div className="inline-flex items-center">
                        <img
                            className="w-[32px] h-[32px] mr-1"
                            src={`/icons/coin/${item.borrowTokenSymbol.toLowerCase()}.png`}
                            alt=""
                        />
                        <p className="text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white">
                            {item?.borrowTokenSymbol?.toUpperCase()}
                        </p>
                    </div>
                </td>
                <td className='py-[6px]'>
                    <div className="inline-flex flex-none items-center flex-col gap-[4px]">
                        <p className='text-[16px] font-[400] tracking-[0em] text-[#030303] dark:text-white'>
                            {'<'}
                            {item?.loanToValue}%
                        </p>
                    </div>
                </td>
                <td className='py-[6px]'>
                    <div className="inline-flex flex-none items-center flex-col gap-[4px]">
                        <p className='text-[16px] font-[400] tracking-[0em] text-[#030303] dark:text-white'>
                            {!aprBorrow
                                ? '-0.00%'
                                : (-Number(aprBorrow) * 100).toFixed(2) + '%'}
                        </p>
                    </div>
                </td>
                <td className='py-[6px]'>
                    <div className="inline-flex flex-none items-center flex-col gap-[4px]">
                        <p className='text-[16px] font-[400] tracking-[0em] lowercase text-[#030303] dark:text-white'>
                            {!item?.liquidity ? '0.00%' : '$' + toMetricUnits(item?.liquidity)}
                        </p>
                    </div>
                </td>
                <td className='py-[6px]'>
                    <div className="inline-flex flex-none items-center flex-col gap-[4px]">
                        <div className="flex items-center gap-[6px]">
                            <img
                                src="/assets/t-logo-circle.png"
                                alt=""
                                className="w-[24px]"
                            />
                            <div className="text-[16px] font-[400] tracking-[0em] pt-[1px] text-[#030303] dark:text-white">
                                0.00
                            </div>
                        </div>
                    </div>
                </td>
                <td className='py-[6px]'>

                    <span className='text-[#030303] dark:text-white text-[16px] font-[400] tracking-[0em] pt-[1px'>
                        {!Number(totalSupplied) ? '$0.00' : '$' + toMetricUnits(Number(totalSupplied))}
                    </span>
                </td>
                <div
                    className={
                        `absolute left-0 h-[1px] w-full ` +
                        `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
                        }`
                    }
                ></div>
            </tr >

            <SwapModal
                open={openSwapModal}
                handleClose={() => {
                    setOpenSwapModal(false)
                }}
                coinFrom={{
                    amount: amountRaw,
                    symbol: item.depositTokenSymbol,
                    icon: `/icons/coin/${item.depositTokenSymbol.toLocaleLowerCase()}.png`,
                }}
                coinTo={{
                    amount: amountReceiveRaw,
                    icon: `/icons/coin/${item.borrowTokenSymbol.toLocaleLowerCase()}.png`,
                    symbol: item.borrowTokenSymbol,
                }}
                setAmountRaw={handleChangeAmountRow}
                setAmountReceiveRaw={setAmountReceiveRaw}
                onCreateVault={() => {
                    handleConfirmDeposit()
                    setOpenSwapModal(false)
                }}
            />


            <ConfirmDepositModal
                open={isOpenConfirmDepositModal}
                handleClose={() => {
                    setOpenConfirmDepositModal(false)
                }}
                confirmButtonText="Supply & Borrow"
                onConfirm={() => onBorrow()}
                loading={isLoading}
                coinFrom={{
                    amount: amountRaw,
                    icon: `/icons/coin/${item.depositTokenSymbol.toLocaleLowerCase()}.png`,
                    symbol: item.depositTokenSymbol,
                }}
                coinTo={{
                    amount: amountReceiveRaw,
                    icon: `/icons/coin/${item.borrowTokenSymbol.toLocaleLowerCase()}.png`,
                    symbol: item.borrowTokenSymbol,
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
