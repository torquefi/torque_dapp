import { NumericFormat } from 'react-number-format'
import Modal from '.'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/react'
import { useEffect, useState } from 'react'
import {
    tokenBtcContract,
    tokenEthContract,
    tokenTusdContract,
} from '@/components/pages/Borrow/constants/contract'
import { getBalanceByContractToken } from '@/constants/utils'

interface DepositCoinDetail {
    amount: any
    symbol: string
    icon: string
}

export interface SwapModalProps {
    coinFrom: DepositCoinDetail
    coinTo: DepositCoinDetail
    open: boolean
    handleClose: () => void
    setAmountRaw: any
    setAmountReceiveRaw: any
}

export default function SwapModal({
    coinFrom,
    coinTo,
    open,
    handleClose,
    setAmountRaw,
    setAmountReceiveRaw,
}: SwapModalProps) {
    const { open: openWalletModal } = useWeb3Modal()
    const { address } = useAccount()
    console.log('coinTo :>> ', coinTo);

    const theme = useSelector((store: AppStore) => store.theme.theme)
    const [balanceCoinTo, setBalanceCoinTo] = useState('0')
    const [balanceCoinFrom, setBalanceCoinFrom] = useState('0')
    const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)
    console.log('usdPrice :>> ', usdPrice);

    const usdCoinFromToken = usdPrice?.[coinFrom.symbol]
    const usdCoinToToken = usdPrice?.[coinTo.symbol] || 1;

    useEffect(() => {
        if (address && open) {
            ; (async () => {
                if (coinFrom.symbol === 'WBTC') {
                    const amount = await getBalanceByContractToken(
                        tokenBtcContract.abi,
                        tokenBtcContract.address,
                        address
                    )
                    setBalanceCoinFrom(amount?.toString())
                } else if (coinFrom.symbol === 'WETH') {
                    const amount = await getBalanceByContractToken(
                        tokenEthContract.abi,
                        tokenEthContract.address,
                        address
                    )
                    setBalanceCoinFrom(amount?.toString())
                } else if (coinFrom.symbol === 'TUSD') {
                    const amount = await getBalanceByContractToken(
                        tokenTusdContract.abi,
                        tokenTusdContract.address,
                        address
                    )
                    setBalanceCoinFrom(amount?.toString())
                }
            })()
        }
    }, [coinFrom.symbol, address, open])

    useEffect(() => {
        if (address && open) {
            ; (async () => {
                if (coinTo.symbol === 'TUSD') {
                    const amount = await getBalanceByContractToken(
                        tokenTusdContract.abi,
                        tokenTusdContract.address,
                        address
                    )
                    setBalanceCoinTo(amount?.toString())
                }
            })()
        }
    }, [coinFrom.symbol, address, open])

    const handleChangeMax = () => {
        setAmountRaw(balanceCoinFrom)
    }

    const renderSubmitText = () => {
        if (!address) {
            return 'Connect Wallet'
        }
        return 'Create Vault'
    }

    return (
        <Modal
            className="mx-auto w-[90%] max-w-[360px] bg-[#FCFAFF] px-[22px] dark:bg-[#030303]"
            open={open}
            handleClose={handleClose}
            hideCloseIcon
        >
            <div className="flex items-center justify-between py-1">
                <div className="font-larken text-[24px] font-[400] text-[#030303] md:text-[28px] dark:text-white">
                    Create Vault
                </div>
                <AiOutlineClose
                    className="cursor-pointer text-[#030303] dark:text-[#ffff]"
                    onClick={handleClose}
                />
            </div>
            <div
                className={
                    `mt-2 hidden h-[1px] w-full md:block` +
                    `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
                    }`
                }
            ></div>
            <div className="mt-[1px] w-full py-[18px]">
                <div className="relative">
                    <div className="rounded-[8px] border-[1px] border-solid border-[#ececec] bg-[#fff] px-[14px] pl-[12px] pr-[12px] pt-[9px]">
                        <div className="flex items-center justify-between">
                            <NumericFormat
                                className={`${coinFrom?.amount ? 'text-[#030303]' : 'text-[#959595]'
                                    } w-full max-w-[60%] text-[20px] placeholder-[#959595] dark:placeholder-[#959595] `}
                                value={coinFrom?.amount}
                                onChange={(event: any) => {
                                    setAmountRaw(event.target.value);
                                }}
                                thousandSeparator
                                placeholder="0.00"
                                decimalScale={5}
                            />
                            <div className="flex items-center gap-[6px]">
                                <p
                                    className="cursor-pointer border-[#030303] text-[10px] uppercase text-[#030303] underline dark:text-white"
                                    onClick={handleChangeMax}
                                >
                                    Max
                                </p>
                                <div className="flex items-center gap-[6px] text-[#030303]">
                                    <img
                                        src={coinFrom?.icon}
                                        alt=""
                                        className="h-[18px] rounded-full"
                                    />
                                    <p>{coinFrom?.symbol}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                            <div className="text-[12px] text-[#959595]">
                                <NumericFormat
                                    value={
                                        coinFrom?.amount
                                            ? Number(coinFrom?.amount || 0) *
                                            Number(usdCoinFromToken || 0)
                                            : Number('0').toFixed(2)
                                    }
                                    onChange={(event: any) => {
                                        setAmountReceiveRaw(event.target.value)
                                    }}
                                    thousandSeparator
                                    decimalScale={5}
                                    prefix="$"
                                />
                            </div>
                            <div className="text-[12px] text-[#959595]">
                                Balance:{' '}
                                <NumericFormat
                                    value={
                                        address && Number(balanceCoinFrom) ? balanceCoinFrom : 0
                                    }
                                    displayType="text"
                                    thousandSeparator
                                    decimalScale={6}
                                />
                            </div>
                        </div>
                    </div>
                    <button className="absolute left-1/2 top-[31%] w-full max-w-[26px] translate-x-[-50%] cursor-pointer rounded-md border-[1px] border-solid border-[#ececec] bg-[#fff] px-[5px] py-[4px] shadow-xl">
                        <img
                            src="/assets/wallet/arrow-down.svg"
                            alt=""
                            className="invert"
                        />
                    </button>
                    <div className="mt-[5px] rounded-[8px] border-[1px] border-solid border-[#ececec] bg-[#fff] px-[14px] pl-[12px] pr-[12px] pt-[9px]">
                        <div className="flex items-center justify-between">
                            <NumericFormat
                                className={`${coinTo?.amount ? 'text-[#030303]' : 'text-[#959595]'
                                    } w-full max-w-[60%] text-[20px] placeholder-[#959595]`}
                                value={coinTo?.amount || ''}
                                displayType="text"
                                thousandSeparator
                                placeholder="0.00"
                                decimalScale={6}
                            />
                            <div className="flex items-center gap-[6px] text-[#030303]">
                                <img src={coinTo?.icon} alt="torque usd" className="h-[18px]" />
                                <p>{coinTo?.symbol}</p>
                            </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                            <div className="text-[12px] text-[#959595]">
                                <NumericFormat
                                    value={
                                        coinTo?.amount
                                            ? Number(coinTo?.amount || 0) *
                                            Number(usdCoinToToken || 0)
                                            : Number('0').toFixed(2)
                                    }
                                    displayType="text"
                                    thousandSeparator
                                    decimalScale={4}
                                    prefix="$"
                                />
                            </div>
                            <div className="text-[12px] text-[#959595]">
                                Balance:{' '}
                                <NumericFormat
                                    value={address && Number(balanceCoinTo) ? balanceCoinTo : 0}
                                    displayType="text"
                                    thousandSeparator
                                    decimalScale={4}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (!address) {
                                openWalletModal()
                            }
                        }}
                        className="font-mona mt-[12px] w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[12px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]"
                    >
                        {renderSubmitText()}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
