import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import { useTokensDataRequest } from '@/domain/synthetics/tokens'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { bigNumberify } from '@/lib/numbers'
import { AppStore } from '@/types/store'
import { useWeb3Modal } from '@web3modal/react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount, useChainId } from 'wagmi'
import { arbitrum } from 'wagmi/dist/chains'
import Web3 from 'web3'
import {
    estimateExecuteDepositGasLimit,
    getExecutionFee,
} from '../hooks/getExecutionFee'
import { useGasLimits } from '../hooks/useGasLimits'
import { useGasPrice } from '../hooks/useGasPrice'
import SwapModal from '@/components/common/Modal/SwapModal'

const RPC = 'https://arb1.arbitrum.io/rpc'

export function CreateRowBoostItem({
    item,
    setIsFetchBoostLoading,
    earnToken,
}: any) {
    const { open } = useWeb3Modal()
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const [btnLoading, setBtnLoading] = useState(false)
    const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
    const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
        useState(false)
    const [isUsdDepositToken, setIsUsdDepositToken] = useState(true)
    const [amountRaw, setAmountRaw] = useState('')
    const [amountReceiveRaw, setAmountReceiveRaw] = useState('')
    const [totalSupply, setTotalSupply] = useState('')
    const theme = useSelector((store: AppStore) => store.theme.theme)
    const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)
    const { tokensData, pricesUpdatedAt } = useTokensDataRequest(chainId)
    const { gasPrice } = useGasPrice(chainId)
    const [deposited, setDeposited] = useState('')
    const [tokenHover, setTokenHover] = useState('')
    const [openSwapModal, setOpenSwapModal] = useState(false)

    const tokenContract = useMemo(() => {
        const web3 = new Web3(Web3.givenProvider)
        if (!item?.tokenContractInfo?.abi) {
            console.error('Token contract ABI is undefined')
            return null
        }
        return new web3.eth.Contract(
            JSON.parse(item.tokenContractInfo.abi),
            item.tokenContractInfo.address
        )
    }, [Web3.givenProvider, item.tokenContractInfo])

    const boostContract = useMemo(() => {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
            JSON.parse(item?.boostContractInfo?.abi),
            item?.boostContractInfo?.address
        )
        return contract
    }, [Web3.givenProvider, item?.tokenSymbol])

    const boostReadContract = useMemo(() => {
        const web3 = new Web3(RPC)
        if (!item?.boostContractInfo?.abi) {
            console.error('Token contract ABI is undefined')
            return null
        }
        return new web3.eth.Contract(
            JSON.parse(item.boostContractInfo.abi),
            item.boostContractInfo.address
        )
    }, [Web3.givenProvider, item.boostContractInfo])

    const handleGetBoostData = async () => {
        if (!boostContract || !address || !tokenContract) {
            return
        }

        try {
            const tokenDecimal = await tokenContract.methods.decimals().call()
            const deposited = await boostContract.methods.balanceOf(address).call()
            setDeposited(
                new BigNumber(
                    ethers.utils.formatUnits(deposited, tokenDecimal)
                ).toString()
            )
        } catch (error) {
            console.log('error get boost data item :>> ', error)
        }
    }

    useEffect(() => {
        handleGetBoostData()
    }, [boostContract, address, tokenContract])

    const handleGetTotalSupply = async () => {
        if (!tokenContract || !boostReadContract) {
            return
        }
        try {
            const tokenDecimal = await tokenContract.methods.decimals().call()
            const totalSupply = await boostReadContract.methods.totalSupply().call()
            setTotalSupply(
                new BigNumber(
                    ethers.utils.formatUnits(totalSupply, tokenDecimal)
                ).toString()
            )
        } catch (error) {
            console.log('handleGetTotalSupply error :>> ', error)
        }
    }

    useEffect(() => {
        handleGetTotalSupply()
    }, [boostReadContract, tokenContract])

    const { gasLimits } = useGasLimits(arbitrum.id)

    const handleConfirmDeposit = async () => {
        if (!isConnected || !address) {
            setOpenConnectWalletModal(true)
            return
        }
        if (!+amountRaw) {
            return toast.error('You must input amount to supply')
        }
        setOpenConfirmDepositModal(true)
    }

    const onDeposit = async () => {
        try {
            setBtnLoading(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner(address)
            const tokenContract = new ethers.Contract(
                item?.tokenContractInfo?.address,
                JSON.parse(item?.tokenContractInfo?.abi),
                signer
            )
            const tokenDecimal = await tokenContract.decimals()
            const depositToken = ethers.utils
                .parseUnits(Number(amountRaw).toFixed(tokenDecimal), tokenDecimal)
                .toString()

            const usdcDecimal = 6
            const estimateExecuteDepositGasLimitValue =
                estimateExecuteDepositGasLimit(gasLimits, {
                    longTokenSwapsCount: 1,
                    shortTokenSwapsCount: 1,
                    initialLongTokenAmount: ethers.utils.parseUnits(
                        (Number(amountRaw) / 2).toFixed(tokenDecimal),
                        tokenDecimal
                    ),
                    // initialShortTokenAmount: ethers.utils.parseUnits(
                    //   (((amount / 2) * usdPrice[item?.token]) / usdPrice['USDC']).toFixed(
                    //     usdcDecimal
                    //   ),
                    //   usdcDecimal
                    // ),
                    initialShortTokenAmount: bigNumberify(0),
                })

            console.log(
                'estimateExecuteDepositGasLimitValue',
                estimateExecuteDepositGasLimitValue?.toString()
            )

            const executionFee = getExecutionFee(
                chainId,
                gasLimits,
                tokensData,
                estimateExecuteDepositGasLimitValue,
                gasPrice
            )

            const executionFeeAmount = bigNumberify(
                executionFee?.feeTokenAmount
            ).toString()

            console.log('executionFeeAmount', executionFeeAmount, executionFee)

            // const executionFee = estimateExecuteDepositGasLimitValue?.toString()

            const allowance = await tokenContract.allowance(
                address,
                item.boostContractInfo.address
            )
            if (
                new BigNumber(allowance?.toString()).lte(new BigNumber('0')) ||
                new BigNumber(allowance?.toString()).lte(new BigNumber(depositToken))
            ) {
                console.log('allowance 11111:>> ', allowance)
                const tx = await tokenContract.approve(
                    item?.boostContractInfo?.address,
                    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                )
                await tx.wait()
            }

            const boostContract2 = new ethers.Contract(
                item?.boostContractInfo?.address,
                JSON.parse(item?.boostContractInfo?.abi),
                signer
            )

            if (item.token === 'WETH') {
                const tx = await boostContract2.depositETH(depositToken, {
                    value: executionFeeAmount,
                })
                await tx.wait()
            } else {
                console.log('depositToken wbtc:>> ', depositToken)
                console.log('fee wbtc:>> ', executionFeeAmount)
                const tx = await boostContract2.depositBTC(depositToken, {
                    value: executionFeeAmount,
                })
                await tx.wait()
            }
            toast.success('Boost Successful')
            setIsFetchBoostLoading && setIsFetchBoostLoading((prev: any) => !prev)
            handleGetTotalSupply()
            setOpenConfirmDepositModal(false)
            setOpenSwapModal(false)
        } catch (e) {
            console.log('11111', e)
            toast.error('Boost Failed')
        } finally {
            setBtnLoading(false)
        }
    }

    const handleChangeAmountRow = (value: string) => {
        setAmountRaw(value)
    }

    return (
        <>
            <tr
                key={item.token}
                onClick={() => {
                    setAmountRaw('')
                    setOpenSwapModal(true)
                }}
                className={`relative cursor-pointer ${item.token === tokenHover ? 'bg-[#f9f9f9] dark:bg-[#141414]' : ''
                    }`}
                onMouseOver={() => setTokenHover(item.token)}
                onMouseLeave={() => setTokenHover('')}
            >
                <td className="py-[6px] w-[17%]">
                    <div className="inline-flex items-center mt-1">
                        <img
                            className="mr-[8px] w-[24px]"
                            src={`/icons/coin/${item.token.toLowerCase()}.svg`}
                            alt="Asset icon"
                        />
                        <div className="inline-flex flex-1 flex-col">
                            <p className="text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white">
                                {item?.token?.toUpperCase()}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="py-[6px] w-[17%]">
                    <div className="flex items-center">
                        <div className="ml-[-0.75rem] flex items-center">
                            <Link
                                href={item.link_yield1}
                                className="translate-x-3"
                                target={'_blank'}
                            >
                                <img src={item.yield_provider1} alt="" className="w-[24px]" />
                            </Link>
                            <Link href={item.link_yield2} className="" target={'_blank'}>
                                <img src={item.yield_provider2} alt="" className="w-[24px]" />
                            </Link>
                        </div>
                        <span className="ml-2 text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white">
                            {item.routed}
                        </span>
                    </div>
                </td>
                <td className="py-[6px] w-[16%]">
                    <span className="text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white">
                        50:50
                    </span>
                </td>
                <td className="py-[6px] w-[16%]">
                    <NumericFormat
                        displayType="text"
                        value={item?.APR}
                        // value="0.00" // hardcoded for now
                        suffix="%"
                        decimalScale={2}
                        fixedDecimalScale={true}
                        className="text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white"
                    />
                </td>
                <td className="py-[6px] w-[16%]">
                    <div className="inline-flex flex-none flex-col items-center gap-[4px]">
                        <div className="flex items-center gap-[6px]">
                            <img
                                src="/assets/t-logo-circle.png"
                                alt="TORQ icon"
                                className="w-[18px]"
                            />
                            <div className="pt-[1px] text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white">
                            {Number(item.bonus).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="py-[6px] w-[18%]">
                    <NumericFormat
                        prefix="$"
                        value={Number(
                            new BigNumber(totalSupply || 0)
                                .multipliedBy(usdPrice?.[item.token] || 0)
                                .toString()
                        ).toFixed(2)}
                        displayType="text"
                        className="text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white"
                    />
                </td>
                <div
                    className={
                        `absolute left-0 h-[1px] w-full ` +
                        `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
                        }`
                    }
                ></div>
            </tr>
            <ConnectWalletModal
                openModal={isOpenConnectWalletModal}
                handleClose={() => setOpenConnectWalletModal(false)}
            />

            <SwapModal
                open={openSwapModal}
                handleClose={() => {
                    setOpenSwapModal(false)
                    setAmountRaw('')
                    setAmountReceiveRaw('')
                }}
                title="Create Vehicle"
                createButtonText="Create Vehicle"
                coinFrom={{
                    amount: amountRaw,
                    symbol: item.token,
                    icon: `/icons/coin/${item.token.toLocaleLowerCase()}.png`,
                }}
                coinTo={{
                    amount: amountRaw,
                    icon: `/icons/coin/${item.token.toLocaleLowerCase()}.png`,
                    symbol: item.earnToken,
                }}
                setAmountRaw={handleChangeAmountRow}
                setAmountReceiveRaw={setAmountReceiveRaw}
                onCreateVault={() => {
                    onDeposit()
                    // setOpenSwapModal(false)
                }}
                disabledOutput
                usdTokenOutPrice={usdPrice?.[item.token] || 0}
                tokenContract={tokenContract}
                boostContract={boostContract}
                loading={btnLoading}
            />
        </>
    )
}
