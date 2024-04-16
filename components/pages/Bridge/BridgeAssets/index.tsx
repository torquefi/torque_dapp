import React, { useEffect, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import Popover from '@/components/common/Popover'
import HoverIndicator from '@/components/common/HoverIndicator'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import SkeletonDefault from '@/components/skeleton'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { useAccount } from 'wagmi'

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

  const [fromToken, setFromToken] = useState<Token>()
  const [toToken, setToToken] = useState<Token>()
  const [fromNetwork, setFromNetwork] = useState<Network>()
  const [toNetwork, setToNetwork] = useState<Network>()
  const [amount, setAmount] = useState<number>(0)
  const [btnLoading, setBtnLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [openPopover, setOpenPopover] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)

  const handleSwap = () => {
    if (!address) {
      setOpenConnectWalletModal(true)
      return
    }
    // Logic to initiate the swap transaction
    console.log(
      `Swapping ${amount} of ${fromToken.symbol} on ${fromNetwork.name} to ${toToken.symbol} on ${toNetwork.name}`
    )
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="m-auto w-full max-w-[360px] rounded-[12px]">
        <SkeletonDefault className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <>
      <div className="m-auto w-full max-w-[360px] rounded-[12px] border border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-4 pt-3 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
        <div className="mb-3">
          <label className="mb-2 block text-[14px] font-medium text-[#959595]">
            From
          </label>
          <div className="flex items-center">
            <div className="w-[60%] rounded-[10px] rounded-r-none border-[1px] border-solid border-[#ececec] dark:border-[#181818]">
              <p className="p-[8px] text-[12px] text-[#959595]">Token</p>
              <Popover
                placement="bottom-left"
                trigger="click"
                wrapperClassName="w-full"
                className={`z-[10] mt-[12px] w-full bg-[#fcfaff] leading-none`}
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
              <p className="p-[8px] text-[12px] text-[#959595]">Network</p>
              <Popover
                placement="bottom-right"
                trigger="click"
                className={`z-[10] mt-[12px] w-full bg-[#fcfaff] leading-none`}
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
        {/* <div className="flex items-center justify-center">
          <button
            onClick={() => {
              setToNetwork(fromNetwork)
              setFromNetwork(toNetwork)
              setFromToken(toToken)
              setToToken(fromToken)
            }}
            className="w-[26px] cursor-pointer rounded-md border-[1px] border-solid border-[#ececec] bg-[#fff] px-[5px] py-[4px] shadow-xl dark:border-[#181818] dark:bg-[linear-gradient(180deg,#0d0d0d_0%,#0e0e0e_100%)]"
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
        </div> */}
        <div className="mb-3">
          <label className="mb-2 block text-[14px] font-medium text-[#959595]">
            To
          </label>
          <div className="flex">
            <div className="w-[60%] rounded-[10px] rounded-r-none border-[1px] border-solid border-[#ececec] dark:border-[#181818]">
              <p className="p-[8px] text-[12px] text-[#959595]">Token</p>
              <Popover
                placement="bottom-left"
                trigger="click"
                wrapperClassName="w-full"
                className={`z-[10] mt-[12px] w-full bg-[#fcfaff] leading-none`}
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
              <p className="text-ellipsis p-[8px] text-[12px] text-[#959595]">
                Network
              </p>
              <Popover
                placement="bottom-right"
                trigger="click"
                className={`z-[10] mt-[12px] w-full bg-[#fcfaff] leading-none`}
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
          <label className="mb-[6px] block text-[14px] font-medium text-[#959595]">
            Total Amount
          </label>
          <div className="relative flex">
            <input
              type="number"
              className="transition-ease block w-full rounded-[8px] border border-[#efefef] bg-white pb-2 pl-[10px] pt-2 shadow-sm duration-200 ease-linear hover:ring-2 hover:ring-purple-500 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e]"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="0.00"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 m-auto mr-2 max-h-[24px] rounded-[8px] bg-[#f8f8f8] px-2 text-[11px] uppercase text-[#aa5bff] focus:outline-none dark:bg-[#1E1E1E] dark:text-white"
              // onClick={() => setAmount( /* Logic to set max amount */ )}
            >
              MAX
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className={`font-mona mt-1 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
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
