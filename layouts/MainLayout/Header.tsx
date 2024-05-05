import HoverIndicator from '@/components/common/HoverIndicator'
import NumberFormat from '@/components/common/NumberFormat'
import Popover from '@/components/common/Popover'
// import { torqContract } from '@/constants/contracts'
import { requestSwitchNetwork } from '@/lib/helpers/network'
import { shortenAddress } from '@/lib/helpers/utils'
import { AppStore } from '@/types/store'
import { useWeb3Modal } from '@web3modal/react'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import ClaimModal from './ClaimModal'
import ConnectWalletModal from './ConnectWalletModal'
import UniSwapModal from '@/components/common/Modal/UniswapModal'
import { DelegateModal } from '@/components/pages/Vote/Governance/DelegateModal'
import HoverIndicatorGrid from '@/components/common/HoverIndicator/Grid'
import Web3 from 'web3'
import { torqContract } from '@/constants/contracts'
import { ethers } from 'ethers'

BigNumber.config({ EXPONENTIAL_AT: 100 })

const arbitrumMainnetInfo = {
  name: 'Arbitrum',
  symbol: 'ETH',
  chainId: 42161,
  chainName: 'eth',
  coinName: 'ETH',
  coinSymbol: 'ETH',
  rpcUrls: ['https://arbitrum-mainnet.infura.io'],
  blockchainExplorer: 'https://explorer.arbitrum.io',
}

export const Header = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { address } = useAccount()
  const { chain, chains } = useNetwork()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()

  const [isShowNetworkAlert, setIsShowNetworkAlert] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [tokenPrice, setTokenPrice] = useState<any>(0)
  const [isOpenClaim, setIsOpenClaim] = useState(false)
  const [openDelegateModal, setOpenDelegateModal] = useState(false)
  const router = useRouter()

  const [openUniSwapModal, setOpenUniSwapModal] = useState(false)

  const [torqueBalance, setTorqueBalance] = useState('0')

  const currentTabIndex = useMemo(
    () =>
      menu
        .map((item) => item.path)
        .findIndex((item) => router.pathname.includes(item)),
    [router.pathname]
  )

  const handleChangeNetwork = async () => {
    await requestSwitchNetwork(arbitrumMainnetInfo)
  }

  useEffect(() => {
    if (router.isReady) {
      setActiveTabIndex(currentTabIndex)
    }
  }, [router])

  useEffect(() => {
    if (chain?.id) {
      const network = chains?.find((item: any) => item?.id === chain?.id)
      setIsShowNetworkAlert(!network)
    }
  }, [chain, chains])

  const handleDisconnect = () => {
    disconnect()
  }

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(torqContract.abi),
      torqContract.address
    )
    return contract
  }, [Web3.givenProvider, torqContract])

  const handleGetTorqueBalance = async () => {
    if (!tokenContract || !address) {
      return
    }
    try {
      const balance = await tokenContract.methods.balanceOf(address).call()
      const decimals = await tokenContract.methods.decimals().call()
      setTorqueBalance(ethers.utils.formatUnits(balance, decimals).toString())
    } catch (error) {
      console.log('error get usdc balance:>> ', error)
    }
  }


  console.log('balance 1111:>> ', torqueBalance);
  useEffect(() => {
    handleGetTorqueBalance()
  }, [address, tokenContract])

  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-[100] bg-[#FCFAFF] dark:bg-[#030303] ">
        <div
          className={
            'flex cursor-pointer items-center justify-center bg-[#FF6969] text-center text-[9px] uppercase transition-all' +
            ` ${!isShowNetworkAlert ? 'h-0 overflow-hidden' : 'h-[24px]'}`
          }
          onClick={handleChangeNetwork}
        >
          Please switch to {arbitrumMainnetInfo.name} network.
        </div>
        {/* <div className="flex h-[24px] items-center justify-center bg-[#aa5bff] text-center text-[9px] font-bold uppercase text-white transition-all">
          Protocol has released. Enjoy!
        </div> */}
        <div className="container relative mx-auto flex h-[66px] max-w-[1244px] items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center">
            <img className="h-[28px]" src="/assets/logo.png" alt="" />
            <h2
              // style={{ fontFamily: 'Larken-Bold' }}
              className="font-rogan ml-[8px] text-[25px] text-[#404040] dark:text-white"
            >
              Torque
            </h2>
          </Link>
          <div className="flex items-center">
            <UniSwapModal
              open={openUniSwapModal}
              handleClose={() => setOpenUniSwapModal(false)}
            />
            <DelegateModal
              openModal={openDelegateModal}
              handleClose={() => setOpenDelegateModal(false)}
              balance={torqueBalance}
            />
            <Popover
              trigger="hover"
              placement="bottom-right"
              className={`font-rogan-regular z-100 mt-[8px] h-auto w-[210px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
              content={
                <HoverIndicatorGrid rows={2} cols={2}>
                  <div className="grid grid-cols-2 gap-4 p-3">
                    <div className="flex cursor-pointer flex-col items-center justify-center">
                      <a
                        href="#"
                        className="text-[#959595] hover:text-[#030303] dark:hover:text-white"
                      >
                        <img src="/icons/pools.svg" className="h-10 w-10" />
                        {/* <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-[#1E1E1E]"></div> */}
                        Pools
                      </a>
                    </div>
                    <div className="flex cursor-pointer flex-col items-center">
                      <a
                        className="text-[#959595] hover:text-[#030303] dark:hover:text-white"
                        onClick={() => setOpenUniSwapModal(true)}
                      >
                        <img src="/icons/swap.svg" className="h-10 w-10" />
                        {/* <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-[#1E1E1E]"></div> */}
                        Swap
                      </a>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        onClick={() => setOpenDelegateModal(true)}
                        className="flex cursor-pointer flex-col items-center text-[#959595] hover:text-[#030303] dark:hover:text-white"
                      >
                        <img src="/icons/delegate.svg" className="h-10 w-10" />
                        {/* <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-[#1E1E1E]"></div> */}
                        Delegate
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        onClick={() => setIsOpenClaim(true)}
                        className="flex cursor-pointer flex-col items-center text-[#959595] hover:text-[#030303] dark:hover:text-white"
                      >
                        <img src="/icons/rewards.svg" className="h-10 w-10" />
                        {/* <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-[#1E1E1E]"></div> */}
                        Rewards
                      </div>
                    </div>
                  </div>
                </HoverIndicatorGrid>
              }
            >
              <div
                // onClick={() => setIsOpenClaim(true)}
                className="mr-[12px] hidden cursor-pointer items-center xs:flex"
              >
                <img className="h-[25px]" src="/assets/dots.svg" alt="" />
                {/* <p className="font-rogan ml-[6px] text-[16px] text-[#404040] dark:text-white">
                $
                <NumberFormat
                  displayType="text"
                  thousandSeparator
                  value={tokenPrice}
                  decimalScale={2}
                  fixedDecimalScale
                />
              </p> */}
              </div>
            </Popover>
            {address ? (
              <Popover
                placement="bottom-right"
                className={`mt-[12px] w-[180px] px-[4px] py-[4px] leading-none`}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px]"
                  >
                    <Link
                      href={`https://arbiscan.io/address/${address}`}
                      className="flex justify-between p-[10px] text-[14px]"
                      target="_blank"
                    >
                      Explorer <HiOutlineExternalLink />
                    </Link>
                    <div
                      className="flex cursor-pointer justify-between p-[10px] text-[14px]"
                      onClick={handleDisconnect}
                    >
                      Disconnect <FiLogOut />
                    </div>
                  </HoverIndicator>
                }
              >
                <div className="font-rogan-regular cursor-pointer rounded-full border border-[#AA5BFF] px-[18px] py-[6px] pt-[8px] text-[13px] uppercase leading-none text-[#AA5BFF] transition-all duration-200 ease-in xs:px-[16px] xs:py-[4px] lg:px-[22px] lg:pb-[6px] lg:pt-[8px]">
                  {shortenAddress(address)}
                </div>
              </Popover>
            ) : (
              <div
                className="font-rogan-regular cursor-pointer rounded-full border border-[#AA5BFF] px-[18px] py-[6px] pt-[8px] text-[13px] uppercase leading-none text-[#AA5BFF] transition-all duration-200 ease-in xs:px-[16px] xs:py-[4px] lg:px-[22px] lg:pb-[6px] lg:pt-[6px]"
                onClick={() =>
                  !address ? setOpenConnectWalletModal(true) : open()
                }
              >
                {address ? shortenAddress(address) : 'Connect'}
              </div>
            )}
          </div>
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <HoverIndicator
              activeIndex={activeTabIndex}
              className="w-[320px] lg:w-[400px] xl:w-[480px]"
            >
              {menu.map((item, i) => (
                <Link
                  href={item.path}
                  key={i}
                  className={
                    'font-rogan-regular relative flex h-[35px]  items-center justify-center pr-[4px] transition-all duration-200 ease-in' +
                    ` ${
                      activeTabIndex === i
                        ? 'text-[#404040] dark:text-white '
                        : 'text-[#959595]'
                    }`
                  }
                  onMouseEnter={() => {
                    setActiveTabIndex(i)
                  }}
                  onMouseLeave={() => setActiveTabIndex(currentTabIndex)}
                  // target={item.isExternal ? '_blank' : '_self'}
                >
                  {theme === 'light' ? (
                    <img
                      className="mr-[4px] w-[16px] text-[#000] lg:w-[20px] xl:w-[24px]"
                      src={activeTabIndex === i ? item.iconLight : item.icon}
                      alt=""
                    />
                  ) : (
                    <img
                      className="mr-[4px] w-[16px] text-[#000] lg:w-[20px] xl:w-[24px]"
                      src={activeTabIndex === i ? item.iconActive : item.icon}
                      alt=""
                    />
                  )}
                  <p className="text-[12px] lg:text-[14px] xl:text-[16px]">
                    {item.label}
                  </p>
                </Link>
              ))}
            </HoverIndicator>
          </div>
          <div
            className={
              ` absolute bottom-0 left-0 h-[1px] w-full` +
              `
              ${
                theme === 'light'
                  ? 'bg-gradient-divider-light'
                  : 'bg-gradient-divider'
              }
               `
            }
          />
        </div>
      </header>
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
      <ClaimModal
        openModal={isOpenClaim}
        handleClose={() => setIsOpenClaim(false)}
      />
      <div className="h-[92px]" />
      {isShowNetworkAlert && <div className="h-[44px]" />}
    </div>
  )
}

const menu = [
  {
    label: 'Home',
    path: '/home',
    icon: '/assets/main-layout/distributed.svg',
    iconActive: '/assets/main-layout/distributed-active.svg',
    iconLight: '/assets/main-layout/distributed.png',
  },
  {
    label: 'Boost',
    path: '/boost',
    icon: '/assets/main-layout/mining.svg',
    iconActive: '/assets/main-layout/mining-active.svg',
    iconLight: '/assets/main-layout/mining-active.png',
  },
  {
    label: 'Borrow',
    path: '/borrow',
    icon: '/assets/main-layout/link.svg',
    iconActive: '/assets/main-layout/link-active.svg',
    iconLight: '/assets/main-layout/link-active.png',
  },
  {
    label: 'Bridge',
    path: '/bridge',
    icon: '/assets/main-layout/network.svg',
    iconActive: '/assets/main-layout/network-active.svg',
    iconLight: '/assets/main-layout/network-active.png',
    // isExternal: true,
  },
]
