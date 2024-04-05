import {
  tokenEthContract,
  tokenUsdcContract,
} from '@/components/pages/Borrow/constants/contract'
import { swapContract } from '@/constants/contracts'
import { getBalanceByContractToken } from '@/constants/utils'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { bigNumberify } from '@/lib/numbers'
import { AppStore } from '@/types/store'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Modal from '.'
import HoverIndicator from '../HoverIndicator'
import LoadingCircle from '../Loading/LoadingCircle'
import NumberFormat from '../NumberFormat'
import Popover from '../Popover'
import { listSwapCoin } from './constants'

export const swapFee: any = {
  ['WBTC-WETH']: 500,
  ['WETH-WBTC']: 500,
  ['USDC-WETH']: 3000,
  ['WETH-USDC']: 3000,
  ['USDC-TUSD']: 100,
  ['TUSD-USDC']: 100,
  ['TORQ-WETH']: 3000,
  ['WETH-TORQ']: 3000,
}

export const swapHop: any = {
  ['TUSD-WBTC']: {
    type: 'multi',
    tokenIntermediate: tokenUsdcContract.address,
    fee1: 100,
    fee2: 500,
  },
  ['TUSD-USDC']: { type: 'single' },
  ['TUSD-WETH']: {
    type: 'multi',
    tokenIntermediate: tokenUsdcContract.address,
    fee1: 100,
    fee2: 500,
  },
  ['TUSD-TORQ']: { type: 'not-allowed' },
  ['USDC-TUSD']: {
    type: 'single',
  },
  ['USDC-WBTC']: {
    type: 'single',
  },
  ['USDC-WETH']: {
    type: 'single',
  },
  ['USDC-TORQ']: {
    type: 'multi',
    tokenIntermediate: tokenEthContract.address,
    fee1: 500,
    fee2: 3000,
  },
  ['WBTC-TUSD']: {
    type: 'multi',
    tokenIntermediate: tokenUsdcContract.address,
    fee1: 500,
    fee2: 100,
  },
  ['WBTC-USDC']: {
    type: 'single',
  },
  ['WBTC-WETH']: {
    type: 'single',
  },
  ['WBTC-TORQ']: {
    type: 'multi',
    tokenIntermediate: tokenEthContract.address,
    fee1: 500,
    fee2: 3000,
  },
  ['WETH-TUSD']: {
    type: 'multi',
    tokenIntermediate: tokenUsdcContract.address,
    fee1: 500,
    fee2: 100,
  },
  ['WETH-USDC']: {
    type: 'single',
  },
  ['WETH-WBTC']: {
    type: 'single',
  },
  ['WETH-TORQ']: {
    type: 'single',
  },
  ['TORQ-TUSD']: {
    type: 'not-allowed',
  },
  ['TORQ-USDC']: {
    type: 'multi',
    tokenIntermediate: tokenEthContract.address,
    fee1: 3000,
    fee2: 3000,
  },
  ['TORQ-WBTC']: {
    type: 'multi',
    tokenIntermediate: tokenEthContract.address,
    fee1: 3000,
    fee2: 500,
  },
  ['TORQ-WETH']: {
    type: 'single',
  },
}

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

  const handleSwap = async () => {
    setLoading(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const fromTokenContract = new ethers.Contract(
        coinFrom?.tokenContractInfo?.address,
        JSON.parse(coinFrom?.tokenContractInfo?.abi),
        signer
      )

      const decimals = await fromTokenContract?.decimals()
      const amountParsed = ethers.utils
        .parseUnits(amountFrom, bigNumberify(decimals))
        .toString()

      console.log(amountParsed, decimals, {
        fromTokenAddress: coinFrom?.tokenContractInfo?.address,
        toTokenAddress: coinTo?.tokenContractInfo?.address,
        amount: amountParsed,
        fromAddress: address,
      })

      const allowance = await fromTokenContract.allowance(
        address,
        swapContract.address
      )

      if (
        new BigNumber(allowance?.toString()).lte(new BigNumber('0')) ||
        new BigNumber(allowance?.toString()).lte(new BigNumber(amountParsed))
      ) {
        console.log('allowance 11111:>> ', allowance)
        const tx = await fromTokenContract.approve(
          swapContract.address,
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        )
        await tx.wait()
      }

      const swapContract1 = new ethers.Contract(
        swapContract?.address,
        JSON.parse(swapContract?.abi),
        signer
      )

      const fromSymbol = coinFrom.symbol
      const toSymbol = coinTo.symbol
      const combineSymbol = `${fromSymbol}-${toSymbol}`
      const swapType = swapHop?.[`${fromSymbol}-${toSymbol}`]
      if (swapType?.type === 'not-allowed') {
        return toast.error('Swap Failed: Not Allowing')
      } else if (swapType?.type === 'single') {
        console.log('typeSwap :>> ', swapType)
        const fee = swapFee?.[`${fromSymbol}-${toSymbol}`] || 500
        console.log('fee :>> ', fee)

        console.log(
          'params ',
          amountParsed,
          0,
          fee,
          coinFrom.tokenContractInfo.address,
          coinTo.tokenContractInfo.address
        )

        const tx = await swapContract1.swapExactInputSingleHop(
          amountParsed,
          0,
          fee,
          coinFrom.tokenContractInfo.address,
          coinTo.tokenContractInfo.address
        )
        await tx.wait()
      } else if (swapType?.type === 'multi') {
        const path = await swapContract1.encoderPath(
          coinFrom.tokenContractInfo.address,
          swapType?.fee1,
          swapType?.tokenIntermediate,
          swapType?.fee2,
          coinTo.tokenContractInfo.address
        )
        const tx = await swapContract1.swapExactInputMultiHop(
          amountParsed,
          0,
          path,
          coinFrom.tokenContractInfo.address
        )
        await tx.wait()
        console.log('path :>> ', path)
      }

      toast.success('Successful Swap')
      handleGetListBalances()
      handleClose()
    } catch (error) {
      console.error('swap error', error)
      toast.error('Swap Failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setCoinFrom(listSwapCoin[0])
      setCoinTo(listSwapCoin[2])
      setAmountFrom('')
      setAmountTo('')
    }
  }, [open])

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

  return (
    <>
      <Modal
        className="mx-auto w-[90%] max-w-[360px] bg-[#FCFAFF] px-[18px] dark:bg-[#030303]"
        open={open}
        handleClose={handleClose}
        hideCloseIcon
      >
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
                              let newCoinTo = coinTo
                              if (coin?.symbol === coinTo?.symbol) {
                                newCoinTo = coinFrom
                                setCoinTo(coinFrom)
                              }
                              setCoinFrom(coin)
                              const convertRate =
                                Number(usdPrice[coin?.symbol]) /
                                Number(usdPrice[newCoinTo?.symbol] || 1)
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
                  Number(usdPrice[coinTo?.symbol]) /
                  Number(usdPrice[coinFrom?.symbol] || 1)
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
                      value2
                        ? new BigNumber(value2)
                          .dividedBy(convertRate || 1)
                          .toString()
                        : ''
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
                            } else {
                              const convertRate =
                                Number(usdPrice[coinFrom?.symbol]) /
                                Number(usdPrice[coin?.symbol] || 1)
                              setAmountTo(
                                amountFrom
                                  ? new BigNumber(amountFrom)
                                    .multipliedBy(convertRate)
                                    .toString()
                                  : ''
                              )
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
                  handleSwap()
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
