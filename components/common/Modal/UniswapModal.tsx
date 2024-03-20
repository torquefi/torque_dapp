import { useSelector } from 'react-redux'
import Modal from '.'
import { AppStore } from '@/types/store'
import { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'
import LoadingCircle from '../Loading/LoadingCircle'
import { useAccount } from 'wagmi'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { listSwapCoin } from './constants'
import { getBalanceByContractToken } from '@/constants/utils'
import Popover from '../Popover'
import HoverIndicator from '../HoverIndicator'
import NumberFormat from '../NumberFormat'
import BigNumber from 'bignumber.js'

export interface UniSwapModalProps {
    open: boolean
    handleClose: () => void
    title?: string
    createButtonText?: string
}

export default function UniSwapModal({
    open,
    handleClose,
    title,
    createButtonText,
}: UniSwapModalProps) {
    const { address } = useAccount()
    const theme = useSelector((store: AppStore) => store.theme.theme)
    const [openPopover, setOpenPopover] = useState(false)

    const [loading, setLoading] = useState(false)
    const [coinFrom, setCoinFrom] = useState<any>(listSwapCoin[0])
    const [coinTo, setCoinTo] = useState<any>(listSwapCoin[2])
    const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
    const [listBalances, setListBalances] = useState<any>({})
    const [amountFrom, setAmountFrom] = useState('')
    const [amountTo, setAmountTo] = useState('')
    const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

    const convertRate =
        Number(usdPrice[coinFrom?.symbol]) / Number(usdPrice[coinTo?.symbol] || 1)

    const handleGetBalanceToken = async (item: any) => {
        try {
            const amount = await getBalanceByContractToken(
                item.tokenContractInfo.abi,
                item.tokenContractInfo.address,
                address
            )
            return amount
        } catch (error) { }
    }

    const handleGetListBalances = async () => {
        try {
            const listBalances = await Promise.all(
                listSwapCoin.map(handleGetBalanceToken)
            )
            const convertListBalances = listBalances.reduce(
                (acc: any, item: any, i: number) => {
                    acc[listSwapCoin[i].symbol] = item
                    return acc
                },
                {}
            )
            setListBalances(convertListBalances)
        } catch (error) { }
    }

    useEffect(() => {
        if (address) {
            handleGetListBalances()
        }
    }, [address])

    const renderSubmitText = () => {
        if (!address) {
            return 'Connect Wallet'
        }
        return createButtonText ? createButtonText : 'Begin Swap'
    }

    const handleSwap = async () => {

    }

    return (
        <>
            <Modal
                className="mx-auto w-[90%] max-w-[360px] bg-[#FCFAFF] px-[18px] dark:bg-[#030303]"
                open={open}
                handleClose={handleClose}
                hideCloseIcon
            >
                {/* <iframe
                src={`https://app.uniswap.org/#/swap?inputCurrency=0x82aF49447D8a07e3bd95BD0d56f35241523fBab1&outputCurrency=0xb56c29413af8778977093b9b4947efeea7136c36&theme=${theme === 'light' ? 'light' : 'dark'}`}
                height="420px"
                width="100%"
                style={{ borderRadius: '24px', overflow: 'auto' }}
            /> */}

                <div className="flex items-center justify-between py-1">
                    <div className="font-larken text-[24px] font-[400] text-[#030303] dark:text-white">
                        {title || 'Swap'}
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
                <div className="mt-[14px] w-full">
                    <div className="relative">
                        {/* from */}
                        <div className="rounded-[8px] border-[1px] border-solid border-[#ececec] bg-[#fff] px-[14px] pl-[12px] pr-[12px] pt-[9px] dark:border-[#181818] dark:bg-[linear-gradient(180deg,#0d0d0d_0%,#0e0e0e_100%)]">
                            <div className="flex items-center justify-between">
                                <NumberFormat
                                    className={`${amountFrom
                                        ? 'text-[#030303] dark:text-[#fff]'
                                        : 'text-[#959595]'
                                        } w-full max-w-[60%] text-[20px] placeholder-[#959595] dark:bg-transparent dark:placeholder-[#959595]`}
                                    value={amountFrom}
                                    onChange={(event: any, value2: any) => {
                                        setAmountFrom(value2)
                                        setAmountTo(
                                            value2
                                                ? new BigNumber(value2)
                                                    .multipliedBy(convertRate)
                                                    .toString()
                                                : ''
                                        )
                                    }}
                                    thousandSeparator
                                    placeholder="0.00"
                                    decimalScale={6}
                                />
                                <div className="flex items-center gap-[6px]">
                                    <p
                                        className="cursor-pointer border-[#030303] text-[10px] uppercase text-[#030303] underline dark:text-white"
                                        onClick={() => {
                                            setAmountFrom(
                                                listBalances?.[coinFrom?.symbol]
                                                    ? listBalances?.[coinFrom?.symbol]
                                                    : ''
                                            )
                                            setAmountTo(
                                                listBalances?.[coinFrom?.symbol]
                                                    ? new BigNumber(listBalances?.[coinFrom?.symbol])
                                                        .multipliedBy(convertRate)
                                                        .toString()
                                                    : ''
                                            )
                                        }}
                                    >
                                        Max
                                    </p>
                                    <Popover
                                        placement="bottom-right"
                                        trigger="click"
                                        className={`z-[10] mt-[12px] w-[100px] leading-none`}
                                        externalOpen={openPopover}
                                        content={
                                            <HoverIndicator
                                                divider
                                                direction="vertical"
                                                indicatorClassName="rounded-[6px]"
                                            >
                                                {listSwapCoin?.map((coin) => (
                                                    <div
                                                        key={coin?.symbol}
                                                        onClick={() => {
                                                            let newCoinTo = coinTo;
                                                            if (coin?.symbol === coinTo?.symbol) {
                                                                newCoinTo = coinFrom;
                                                                setCoinTo(coinFrom)
                                                            }
                                                            setCoinFrom(coin)
                                                            const convertRate =
                                                                Number(usdPrice[coin?.symbol]) / Number(usdPrice[newCoinTo?.symbol] || 1)
                                                            setAmountTo(
                                                                amountFrom
                                                                    ? new BigNumber(amountFrom)
                                                                        .multipliedBy(convertRate)
                                                                        .toString()
                                                                    : ''
                                                            )
                                                            setOpenPopover((openPopover) => !openPopover)
                                                        }}
                                                        className="flex cursor-pointer items-center gap-[2px] text-[#030303] dark:text-[#959595]"
                                                    >
                                                        <img
                                                            src={`/icons/coin/${coin.symbol.toLocaleLowerCase()}.png`}
                                                            alt="torque usd"
                                                            className="h-[32px]"
                                                        />
                                                        <p>{coin?.symbol}</p>
                                                    </div>
                                                ))}
                                            </HoverIndicator>
                                        }
                                    >
                                        <div className="flex items-center gap-[2px] text-[#030303] dark:text-[#959595]">
                                            <img
                                                src={`/icons/coin/${coinFrom.symbol.toLocaleLowerCase()}.png`}
                                                alt=""
                                                className="h-[32px] rounded-full"
                                            />
                                            <p className="cursor-pointer">{coinFrom?.symbol}</p>
                                        </div>
                                    </Popover>
                                </div>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <div className="text-[12px] text-[#959595]">
                                    <NumericFormat
                                        value={
                                            amountFrom
                                                ? Number(amountFrom || 0) *
                                                Number(usdPrice?.[coinFrom?.symbol] || 0)
                                                : Number('0').toFixed(2)
                                        }
                                        displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        prefix="$"
                                    />
                                </div>
                                <div className="text-[12px] text-[#959595]">
                                    Balance:{' '}
                                    <NumericFormat
                                        value={
                                            address && Number(listBalances?.[coinFrom?.symbol] || 0)
                                                ? listBalances?.[coinFrom?.symbol]
                                                : 0
                                        }
                                        displayType="text"
                                        thousandSeparator
                                        decimalScale={6}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setCoinFrom(coinTo)
                                setCoinTo(coinFrom)
                                setAmountFrom(amountTo)
                                const convertRate =
                                    Number(usdPrice[coinTo?.symbol]) / Number(usdPrice[coinFrom?.symbol] || 1)
                                setAmountTo(
                                    amountTo
                                        ? new BigNumber(amountTo)
                                            .multipliedBy(convertRate)
                                            .toString()
                                        : ''
                                )
                            }}
                            className="absolute left-1/2 top-[31%] w-full max-w-[26px] translate-x-[-50%] cursor-pointer rounded-md border-[1px] border-solid border-[#ececec] bg-[#fff] px-[5px] py-[4px] shadow-xl dark:border-[#181818] dark:bg-[linear-gradient(180deg,#0d0d0d_0%,#0e0e0e_100%)]"
                        >
                            <img
                                src={
                                    theme === 'light'
                                        ? '/assets/wallet/arrow-down.svg'
                                        : '/assets/wallet/arrow-down-dark.svg'
                                }
                                alt=""
                                className={theme === 'light' ? 'invert' : ''}
                            />
                        </button>
                        {/* to */}
                        <div className="mt-[5px] rounded-[8px] border-[1px] border-solid border-[#ececec] bg-[#fff] px-[14px] pl-[12px] pr-[12px] pt-[9px] dark:border-[#181818] dark:bg-[linear-gradient(180deg,#0d0d0d_0%,#0e0e0e_100%)]">
                            <div className="flex items-center justify-between">
                                <NumberFormat
                                    className={`${amountTo
                                        ? 'text-[#030303] dark:text-[#fff]'
                                        : 'text-[#959595]'
                                        } w-full max-w-[60%] text-[20px] placeholder-[#959595] dark:bg-transparent`}
                                    value={amountTo}
                                    thousandSeparator
                                    placeholder="0.00"
                                    decimalScale={6}
                                    onChange={(event: any, value2: any) => {
                                        setAmountTo(value2)
                                        setAmountFrom(
                                            value2 ? new BigNumber(value2).dividedBy(convertRate || 1).toString() : ''
                                        )
                                    }}
                                />

                                <Popover
                                    placement="bottom-right"
                                    trigger="click"
                                    className={`mt-[12px] w-[100px] leading-none`}
                                    externalOpen={openPopover}
                                    content={
                                        <HoverIndicator
                                            divider
                                            direction="vertical"
                                            indicatorClassName="rounded-[6px]"
                                        >
                                            {listSwapCoin?.map((coin) => (
                                                <div
                                                    key={coin?.symbol}
                                                    className="flex cursor-pointer items-center gap-[2px] text-[#030303] dark:text-[#959595]"
                                                    onClick={() => {
                                                        setCoinTo(coin)
                                                        setOpenPopover((openPopover) => !openPopover)
                                                        if (coin?.symbol === coinFrom?.symbol) {
                                                            setCoinFrom(coinTo)
                                                            setAmountFrom(amountTo)
                                                        }
                                                    }}
                                                >
                                                    <img
                                                        src={`/icons/coin/${coin.symbol.toLocaleLowerCase()}.png`}
                                                        alt="torque usd"
                                                        className="h-[32px]"
                                                    />
                                                    <p>{coin?.symbol}</p>
                                                </div>
                                            ))}
                                        </HoverIndicator>
                                    }
                                >
                                    <div className="flex cursor-pointer items-center gap-[2px] text-[#030303] dark:text-[#959595]">
                                        <img
                                            src={`/icons/coin/${coinTo.symbol.toLocaleLowerCase()}.png`}
                                            alt="torque usd"
                                            className="h-[32px]"
                                        />
                                        <p>{coinTo?.symbol}</p>
                                    </div>
                                </Popover>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <div className="text-[12px] text-[#959595]">
                                    <NumericFormat
                                        value={
                                            amountTo
                                                ? Number(amountTo || 0) *
                                                Number(usdPrice?.[coinTo?.symbol] || 0)
                                                : Number('0').toFixed(2)
                                        }
                                        displayType="text"
                                        thousandSeparator
                                        decimalScale={2}
                                        prefix="$"
                                    />
                                </div>
                                <div className="text-[12px] text-[#959595]">
                                    Balance:{' '}
                                    <NumericFormat
                                        value={
                                            address && Number(listBalances?.[coinTo?.symbol] || 0)
                                                ? listBalances?.[coinTo?.symbol]
                                                : 0
                                        }
                                        displayType="text"
                                        thousandSeparator
                                        decimalScale={6}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (!address) {
                                    handleClose()
                                    setOpenConnectWalletModal(true)
                                } else {
                                    // onCreateVault()
                                }
                            }}
                            className="font-mona mt-[12px] w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[12px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]"
                        >
                            {loading && <LoadingCircle />}
                            {renderSubmitText()}
                        </button>
                    </div>
                </div>
            </Modal>

            <ConnectWalletModal
                openModal={isOpenConnectWalletModal}
                handleClose={() => setOpenConnectWalletModal(false)}
            />
        </>
    )
}
