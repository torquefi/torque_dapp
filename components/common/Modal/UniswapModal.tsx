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

    const [loading, setLoading] = useState(false)
    const [coinTo, setCoinTo] = useState<any>(listSwapCoin[1])
    const [balanceTo, setBalanceTo] = useState('')
    const [coinFrom, setCoinFrom] = useState<any>(listSwapCoin[0])
    const [balanceFrom, setBalanceFrom] = useState('')
    const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
    const [listBalances, setListBalances] = useState<any>([])

    const handleGetBalanceToken = async (item: any) => {
        try {
            const amount = await getBalanceByContractToken(
                item.tokenContractInfo.abi,
                item.tokenContractInfo.address,
                address
            )
            return amount
        } catch (error) {

        }
    }

    const handleGetListBalances = async () => {
        try {
            const listBalances = await Promise.all(listSwapCoin.map(handleGetBalanceToken))
            console.log('listBalances :>> ', listBalances);
        } catch (error) {

        }
    }

    useEffect(() => {
        if (address) {
            handleGetListBalances()
        }
    }, [address]);

    const renderSubmitText = () => {
        if (!address) {
            return 'Connect Wallet'
        }
        return createButtonText ? createButtonText : 'Begin Swap'
    }

    return (
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
                    <div className="rounded-[8px] border-[1px] border-solid border-[#ececec] bg-[#fff] px-[14px] pl-[12px] pr-[12px] pt-[9px] dark:border-[#181818] dark:bg-[linear-gradient(180deg,#0d0d0d_0%,#0e0e0e_100%)]">
                        <div className="flex items-center justify-between">
                            <NumericFormat
                                className={`${coinFrom?.amount
                                    ? 'text-[#030303] dark:text-[#fff]'
                                    : 'text-[#959595]'
                                    } w-full max-w-[60%] text-[20px] placeholder-[#959595] dark:bg-transparent dark:placeholder-[#959595]`}
                                value={coinFrom?.amount}
                                // onChange={(event: any) => {
                                //     setAmountRaw(event.target.value)
                                // }}
                                thousandSeparator
                                placeholder="0.00"
                                decimalScale={5}
                            />
                            <div className="flex items-center gap-[6px]">
                                <p
                                    className="cursor-pointer border-[#030303] text-[10px] uppercase text-[#030303] underline dark:text-white"
                                // onClick={handleChangeMax}
                                >
                                    Max
                                </p>
                                <div className="flex items-center gap-[2px] text-[#030303] dark:text-[#959595]">
                                    <img
                                        src={`/icons/coin/${coinFrom.symbol.toLocaleLowerCase()}.png`}
                                        alt=""
                                        className="h-[32px] rounded-full"
                                    />
                                    <p className='cursor-pointer'>{coinFrom?.symbol}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                            <div className="text-[12px] text-[#959595]">
                                <NumericFormat
                                    value={0}
                                    // onChange={(event: any) => {
                                    //     setAmountRaw(event.target.value)
                                    // }}
                                    displayType="text"
                                    thousandSeparator
                                    decimalScale={2}
                                    prefix="$"
                                />
                            </div>
                            <div className="text-[12px] text-[#959595]">
                                Balance:{' '}
                                <NumericFormat
                                    // value={
                                    //     address && Number(balanceCoinFrom) ? balanceCoinFrom : 0
                                    // }
                                    displayType="text"
                                    thousandSeparator
                                    decimalScale={5}
                                />
                            </div>
                        </div>
                    </div>
                    <button className="absolute left-1/2 top-[31%] w-full max-w-[26px] translate-x-[-50%] cursor-pointer rounded-md border-[1px] border-solid border-[#ececec] bg-[#fff] px-[5px] py-[4px] shadow-xl dark:border-[#181818] dark:bg-[linear-gradient(180deg,#0d0d0d_0%,#0e0e0e_100%)]">
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
                    <div className="mt-[5px] rounded-[8px] border-[1px] border-solid border-[#ececec] bg-[#fff] px-[14px] pl-[12px] pr-[12px] pt-[9px] dark:border-[#181818] dark:bg-[linear-gradient(180deg,#0d0d0d_0%,#0e0e0e_100%)]">
                        <div className="flex items-center justify-between">
                            {!coinTo?.amount ? (
                                <span className="text-[20px] text-[#959595]">0.00</span>
                            ) : (
                                <NumericFormat
                                    className={`${coinTo?.amount
                                        ? 'text-[#030303] dark:text-[#fff]'
                                        : 'text-[#959595]'
                                        } w-full max-w-[60%] text-[20px] placeholder-[#959595] dark:bg-transparent`}
                                    value={coinTo?.amount}
                                    thousandSeparator
                                    placeholder="0.00"
                                    decimalScale={5}
                                // onChange={(event: any) => {
                                //     setAmountReceiveRaw(event.target.value)
                                // }}
                                />
                            )}

                            <Popover
                                placement="bottom-right"
                                className={`mt-[12px] w-[200px] leading-none`}
                                content={
                                    <HoverIndicator
                                        divider
                                        direction="vertical"
                                        indicatorClassName="rounded-[6px]"
                                    >

                                    </HoverIndicator>
                                }
                            >
                                <div className="flex items-center gap-[2px] text-[#030303] dark:text-[#959595] cursor-pointer">
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
                                    // value={
                                    //     coinTo?.amount
                                    //         ? Number(coinTo?.amount || 0) *
                                    //         Number(usdTokenOutPrice || usdCoinToToken || 0)
                                    //         : Number('0').toFixed(2)
                                    // }
                                    displayType="text"
                                    thousandSeparator
                                    decimalScale={2}
                                    prefix="$"
                                />
                            </div>
                            <div className="text-[12px] text-[#959595]">
                                Balance:{' '}
                                <NumericFormat
                                    // value={address && Number(balanceCoinTo) ? balanceCoinTo : 0}
                                    displayType="text"
                                    thousandSeparator
                                    decimalScale={5}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (!address) {
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

            <ConnectWalletModal
                openModal={isOpenConnectWalletModal}
                handleClose={() => setOpenConnectWalletModal(false)}
            />
        </Modal>
    )
}
