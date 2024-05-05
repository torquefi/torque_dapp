import React, { useEffect, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import Popover from '@/components/common/Popover'
import HoverIndicator from '@/components/common/HoverIndicator'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import SkeletonDefault from '@/components/skeleton'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { useAccount } from 'wagmi'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion } from 'framer-motion';

interface Token {
  symbol: string
  name: string
  icon?: string
}

interface Network {
  name: string
  chainId: number
}

const tokens: Token[] = [
  //   { symbol: 'TORQ', name: 'Torque' },
  //   { symbol: 'TUSD', name: 'Torque USD' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'USDT', name: 'Tether' },
]

const networks: Network[] = [
  { name: 'Ethereum', chainId: 1 },
  { name: 'Arbitrum', chainId: 42161 },
  // { name: 'Optimism', chainId: 10 },
  // { name: 'Polygon', chainId: 137 },
  // { name: 'Base', chainId: 8453 },
]

const BridgeAssets: React.FC = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { address } = useAccount()
  const [progressToNetwork, setProgressToNetwork] = useState(0)
  const [progressFromNetwork, setProgressFromNetwork] = useState(0)
  const [progressTransaction, setSetProgressTransaction] = useState(0)
  const [completedTransaction, setCompletedTransaction] = useState(false)

  const [fromToken, setFromToken] = useState<Token>()
  const [toToken, setToToken] = useState<Token>()
  const [fromNetwork, setFromNetwork] = useState<Network>()
  const [toNetwork, setToNetwork] = useState<Network>()
  const [amount, setAmount] = useState('')
  const [btnLoading, setBtnLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [openPopover, setOpenPopover] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [showDestinationAddress, setShowDestinationAddress] = useState(false);

  useEffect(() => {
    if (progressFromNetwork > 0) {
      setTimeout(() => {
        setSetProgressTransaction(10000)
      }, 500)
    }
  }, [progressFromNetwork])

  useEffect(() => {
    if (progressTransaction > 0) {
      setTimeout(() => {
        setProgressToNetwork(500)
      }, 10000)
    }
  }, [progressTransaction])

  useEffect(() => {
    if (progressToNetwork > 0) {
      setTimeout(() => {
        setCompletedTransaction(true)
      }, 500)
    }
  }, [progressToNetwork])

  const handleResetProgress = () => {
    setProgressToNetwork(0)
    setProgressFromNetwork(0)
    setSetProgressTransaction(0)
    setCompletedTransaction(false)
  }

  const handleSwap = () => {
    if (!address) {
      setOpenConnectWalletModal(true)
      return
    }
    if (!amount) {
      return toast.error('Please enter amount')
    }
    if (!toNetwork || !fromNetwork || !toToken || !fromToken) {
      return toast.error('Please fill full information')
    }

    if (fromNetwork && toNetwork && fromNetwork.chainId === toNetwork.chainId) {
      return toast.error('Please select different network')
    }
    setProgressFromNetwork(500)
    // Logic to initiate the swap transaction
    console.log(
      `Swapping ${amount} of ${fromToken.symbol} on ${fromNetwork.name} to ${toToken.symbol} on ${toNetwork.name}`
    )
  }

    // Motion variants for the animation
    const variants = {
      open: { opacity: 1, height: "auto" },
      collapsed: { opacity: 0, height: 0 }
    };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="m-auto w-full max-w-[360px] rounded-[12px]">
        {/* <SkeletonDefault className="mb-[40px] h-[60px] w-full" /> */}
        <SkeletonDefault className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <>
      {/* progress */}
      {/* <div className="font-inter m-auto mb-[24px] flex w-full max-w-[360px] items-center justify-between">
        <div
          className={`${
            progressFromNetwork > 0
              ? 'box !duration-[500ms]'
              : 'h-[32px] w-[32px] rounded-[8px] border-[2px] border-solid border-[#DEDEDE]'
          } inline-flex items-center justify-center`}
        >
          {fromNetwork ? (
            <img
              src={`/icons/coin/${fromNetwork.name.toLocaleLowerCase()}.png`}
              className="h-[24px] w-[24px] rounded-[6px]"
            />
          ) : (
            <div className="h-[24px] w-[24px] rounded-[8px] bg-[#DEDEDE]" />
          )}
        </div>
        <div className="inline-flex flex-1 flex-col items-center justify-center text-[#959595]">
          <div className="inline-flex w-full items-center px-2">
            <p className="min-w-[20%] text-[12px] font-[500] leading-[21px]">
              From
            </p>
            <p className="flex-1 text-center text-[12px] font-[500] leading-[21px] text-[#AA5BFF]">
              {progressFromNetwork > 0 &&
                (!completedTransaction ? '10 seconds' : 'Completed')}
            </p>
            <p className="min-w-[20%] text-right text-[12px] font-[500] leading-[21px]">
              To
            </p>
          </div>
          <div className="relative h-[4px] w-full bg-[#D9D9D9]">
            <div
              className={`${
                progressTransaction > 0 ? 'box-1 !duration-[10000ms]' : ''
              } h-[4px] w-full`}
            />
          </div>
          <div className="inline-flex w-full items-center justify-between px-2">
            {progressFromNetwork > 0 ? (
              <Link href="/" target="blank">
                <div className="inline-flex min-w-[20%] cursor-pointer items-center justify-start text-[12px] font-[500] leading-[21px]">
                  <span>View</span>
                  <img
                    src="/icons/redirect.svg"
                    className="h-[18px] w-[18px]"
                  />
                </div>
              </Link>
            ) : (
              <div className="inline-flex min-w-[20%]  items-center justify-start text-[12px] font-[500] leading-[21px]">
                <span>View</span>
                <img src="/icons/redirect.svg" className="h-[18px] w-[18px]" />
              </div>
            )}

            {amount && fromToken && (
              <p className="flex-1 text-center text-[12px] font-[500] leading-[21px] text-[#959595]">
                <NumericFormat
                  value={amount}
                  thousandSeparator
                  displayType="text"
                  decimalScale={2}
                />{' '}
                {fromToken.symbol}
              </p>
            )}
            {completedTransaction ? (
              <Link target="_blank" href="/">
                <div className="inline-flex min-w-[20%] cursor-pointer items-center justify-end text-[12px] font-[500] leading-[21px]">
                  <span>View</span>
                  <img
                    src="/icons/redirect.svg"
                    className="h-[18px] w-[18px]"
                  />
                </div>
              </Link>
            ) : (
              <div className="inline-flex min-w-[20%] items-center justify-end text-[12px] font-[500] leading-[21px] opacity-80">
                <span>View</span>
                <img src="/icons/redirect.svg" className="h-[18px] w-[18px]" />
              </div>
            )}
          </div>
        </div>
        <div
          className={`${
            progressToNetwork > 0
              ? 'box !duration-[500ms]'
              : 'h-[32px] w-[32px] rounded-[8px] border-[2px] border-solid border-[#DEDEDE]'
          } inline-flex items-center justify-center`}
        >
          {toNetwork ? (
            <img
              src={`/icons/coin/${toNetwork.name.toLocaleLowerCase()}.png`}
              className="h-[24px] w-[24px] rounded-[6px]"
            />
          ) : (
            <div className="h-[24px] w-[24px] rounded-[8px] bg-[#DEDEDE]" />
          )}
        </div>
      </div> */}

      {/* bridge */}
      <div className="m-auto w-full max-w-[360px] rounded-[12px] border border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-4 pt-3 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
        <div className="flex items-center justify-between">
          <p className="font-rogan mb-3 mt-2 text-[28px] text-[#030303] dark:text-white">
            Bridge
          </p>
          <div className="flex items-center justify-between">
            <button 
            className="mt-[0px]"
            onClick={() => setShowDestinationAddress(!showDestinationAddress)}>
              <img
                src="/icons/wallet.svg"
                alt="wallet icon"
                className="mr-[14px] w-[15px]"
              />
            </button>
            <button className="mt-[0px]">
              <img
                src="/icons/slider.svg"
                alt="slider icon"
                className="w-[20px]"
              />
            </button>
          </div>
        </div>
        <div
          className={
            `mb-2 mt-[4px] h-[1px] w-full md:block` +
            `
      ${
        theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
      }`
          }
        ></div>
        <div className="mb-3">
          <label className="mb-1 block text-[14px] font-medium text-[#959595]">
            From
          </label>
          <div className="flex items-center">
            <div className="transition-ease w-[60%] rounded-[10px] rounded-r-none border-[1px] border-solid border-[#ececec] duration-100 ease-linear dark:border-[#181818]">
              <p className="ml-2 pb-[2px] pt-[2px] text-[12px] text-[#959595]">
                Token
              </p>
              <Popover
                placement="bottom-left"
                trigger="click"
                wrapperClassName="w-full"
                className={`z-[10] mt-[12px] w-full bg-white leading-none dark:bg-[#030303]`}
                externalOpen={openPopover}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px] w-full"
                    className="w-full "
                  >
                    {tokens?.map((token, index) => (
                      <div
                        key={token?.symbol}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === tokens.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setOpenPopover((openPopover) => !openPopover)
                          setFromToken(token)
                          handleResetProgress()
                        }}
                      >
                        <img
                          src={`/icons/coin/${token.symbol.toLocaleLowerCase()}.png`}
                          alt="torque usd"
                          className="h-[18px] w-[18px] rounded-full"
                        />
                        <p className="pt-[1px]">{token?.symbol}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex items-center gap-[4px]">
                    {fromToken ? (
                      <>
                        <img
                          src={`/icons/coin/${fromToken.symbol.toLocaleLowerCase()}.png`}
                          alt=""
                          className="h-[18px] w-[18px] rounded-full"
                        />
                        <p className="cursor-pointer">{fromToken?.symbol}</p>
                      </>
                    ) : (
                      <>
                        <div className="h-[18px] w-[18px] rounded-full bg-[#E0E0E0] dark:bg-[#282828]" />
                        <p className="cursor-pointer text-[#959595]">Select</p>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon className="pointer-events-none h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
            <div className="w-[40%] rounded-[10px] rounded-l-none border-[1px] border-l-0 border-solid border-[#ececec] dark:border-[#181818]">
              <p className="ml-2 pb-[2px] pt-[2px] text-[12px] text-[#959595]">
                Network
              </p>
              <Popover
                placement="bottom-right"
                trigger="click"
                className={`z-[10] mt-[12px] w-full bg-white leading-none dark:bg-[#030303]`}
                wrapperClassName="w-full"
                externalOpen={openPopover}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px]"
                  >
                    {networks?.map((network, index) => (
                      <div
                        key={network.chainId}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === networks.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setFromNetwork(network)
                          setOpenPopover((openPopover) => !openPopover)
                          handleResetProgress()
                        }}
                      >
                        <img
                          src={`/icons/coin/${network.name.toLocaleLowerCase()}.png`}
                          alt="torque usd"
                          className="h-[18px] w-[18px] rounded-[6px]"
                        />
                        <p>{network?.name}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex flex-1 items-center gap-[4px]">
                    {fromNetwork ? (
                      <>
                        <img
                          src={`/icons/coin/${fromNetwork.name.toLocaleLowerCase()}.png`}
                          alt=""
                          className="h-[18px] w-[18px] rounded-[6px]"
                        />
                        <p className="w-[60%] cursor-pointer text-ellipsis">
                          {fromNetwork?.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="h-[18px] w-[18px] rounded-[6px] bg-[#E0E0E0] dark:bg-[#282828]" />
                        <p className="cursor-pointer text-[#959595]">Select</p>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="mb-1 block text-[14px] font-medium text-[#959595]">
            To
          </label>
          <div className="flex">
            <div className="w-[60%] rounded-[10px] rounded-r-none border-[1px] border-solid border-[#ececec] dark:border-[#181818]">
              <p className="ml-2 pb-[2px] pt-[2px] text-[12px] text-[#959595]">
                Token
              </p>
              <Popover
                placement="bottom-left"
                trigger="click"
                wrapperClassName="w-full"
                className={`z-[10] mt-[12px] w-full bg-white leading-none dark:bg-[#030303]`}
                externalOpen={openPopover}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px] w-full"
                    className="w-full"
                  >
                    {tokens?.map((token, index) => (
                      <div
                        key={token?.symbol}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === tokens.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setToToken(token)
                          setOpenPopover((openPopover) => !openPopover)
                          handleResetProgress()
                        }}
                      >
                        <img
                          src={`/icons/coin/${token.symbol.toLocaleLowerCase()}.png`}
                          alt="torque usd"
                          className="h-[18px] w-[18px]"
                        />
                        <p className="pt-[1px]">{token?.symbol}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex flex-1 items-center gap-[4px]">
                    {toToken ? (
                      <>
                        <img
                          src={`/icons/coin/${toToken.symbol.toLocaleLowerCase()}.png`}
                          alt=""
                          className="h-[18px] w-[18px] rounded-full"
                        />
                        <p className="cursor-pointer">{toToken?.symbol}</p>
                      </>
                    ) : (
                      <>
                        <div className="h-[18px] w-[18px] rounded-full bg-[#E0E0E0] dark:bg-[#282828]" />
                        <p className="cursor-pointer text-[#959595]">Select</p>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon className="pointer-events-none h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
            <div className="w-[40%] rounded-[10px] rounded-l-none border-[1px] border-l-0 border-solid border-[#ececec] dark:border-[#181818]">
              <p className="ml-2 text-ellipsis pb-[2px] pt-[2px] text-[12px] text-[#959595]">
                Network
              </p>
              <Popover
                placement="bottom-right"
                trigger="click"
                className={`z-[10] mt-[12px] w-full bg-white leading-none dark:bg-[#030303]`}
                wrapperClassName="w-full"
                externalOpen={openPopover}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px]"
                  >
                    {networks?.map((network, index) => (
                      <div
                        key={network.chainId}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === networks.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setToNetwork(network)
                          setOpenPopover((openPopover) => !openPopover)
                          handleResetProgress()
                        }}
                      >
                        <img
                          src={`/icons/coin/${network.name.toLocaleLowerCase()}.png`}
                          alt="torque usd"
                          className="h-[18px] w-[18px] rounded-[6px]"
                        />
                        <p>{network?.name}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex items-center gap-[4px]">
                    {toNetwork ? (
                      <>
                        <img
                          src={`/icons/coin/${toNetwork.name.toLocaleLowerCase()}.png`}
                          alt=""
                          className="h-[18px] w-[18px] rounded-[6px]"
                        />
                        <p className="w-[60%] cursor-pointer text-ellipsis">
                          {toNetwork?.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="h-[18px] w-[18px] rounded-[6px] bg-[#E0E0E0] dark:bg-[#282828]" />
                        <p className="cursor-pointer text-[#959595]">Select</p>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
          </div>
        </div>
        <div className="relative mb-4">
          <label className="mb-[4px] block text-[14px] font-medium text-[#959595]">
            Amount
          </label>
          <div className="relative flex">
            <NumericFormat
              className="transition-ease placeholder:text-[#959595] block w-full rounded-[8px] border border-[#efefef] bg-white pb-2 pl-[10px] pt-2 shadow-sm duration-100 ease-linear hover:ring-2 hover:ring-purple-500 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e]"
              value={amount}
              thousandSeparator
              onChange={(e) => {
                setAmount(e.target.value)
                handleResetProgress()
              }}
              placeholder="0.00"
            />
            {/* <input
              type="number"
              className="transition-ease block w-full rounded-[8px] border border-[#efefef] bg-white pb-2 pl-[10px] pt-2 shadow-sm duration-100 ease-linear hover:ring-2 hover:ring-purple-500 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e]"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="0.00"
            /> */}
            <button
              type="button"
              className="absolute inset-y-0 right-0 m-auto mr-2 max-h-[24px] rounded-[8px] bg-[#f8f8f8] px-2 text-[11px] uppercase text-[#aa5bff] focus:outline-none dark:bg-[#1E1E1E] dark:text-white"
              // onClick={() => setAmount( /* Logic to set max amount */ )}
            >
              MAX
            </button>
          </div>
        </div>
        {showDestinationAddress && (
          <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={variants}
          transition={{ duration: 0.2 }}
          className="mb-4"
        >
            <label className="mb-[4px] block text-[14px] font-medium text-[#959595]">
              Destination
            </label>
            <input
              type="text"
              className="block w-full truncate placeholder:text-[#959595] rounded-[8px] border border-[#efefef] bg-white pb-2 pl-[10px] pt-2 shadow-sm duration-100 ease-linear hover:ring-2 hover:ring-purple-500 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e]"
              placeholder="0x123.."
            />
          </motion.div>
        )}
        <div className="flex justify-end">
          <button
            className={`font-rogan-regular mt-1 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
            ${btnLoading ? 'cursor-not-allowed text-[#eee]' : 'cursor-pointer '}
          `}
            onClick={handleSwap}
          >
            {address ? 'Bridge' : 'Connect Wallet'}
          </button>
        </div>
      </div>
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
    </>
  )
}

export default BridgeAssets
