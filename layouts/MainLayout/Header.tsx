import HoverIndicator from '@/components/common/HoverIndicator'
import NumberFormat from '@/components/common/NumberFormat'
import Popover from '@/components/common/Popover'
// import { torqContract } from '@/constants/contracts'
import { requestSwitchNetwork } from '@/lib/helpers/network'
import { shortenAddress } from '@/lib/helpers/utils'
import { AppStore } from '@/types/store'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import Web3 from 'web3'
import ConnectWalletModal from './ConnectWalletModal'
import ClaimModal from './ClaimModal'
import { useWeb3Modal } from '@web3modal/react'
import { rewardsContract } from '@/constants/contracts'
import {
  borrowBtcContract,
  borrowEthContract,
  tokenTusdContract,
} from '@/components/pages/Borrow/constants/contract'
import {
  boostWbtcContract,
  boostWethContract,
} from '@/components/pages/Boost/constants/contracts'
import BigNumber from 'bignumber.js'

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

  const [isShowNetworkAlert, setIsShowNetworkAlert] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [tokenPrice, setTokenPrice] = useState<any>(0)
  const [isOpenClaim, setIsOpenClaim] = useState(false)
  const router = useRouter()

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

  console.log('address :>> ', address)

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
          Please switch to{' '}
          {arbitrumMainnetInfo.name} network.
        </div>
        {/* <div className="flex h-[24px] items-center justify-center bg-[#aa5bff] text-center text-[9px] font-bold uppercase text-white transition-all">
          Protocol has released. Enjoy!
        </div> */}
        <div className="container relative mx-auto flex h-[66px] max-w-[1244px] items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center">
            <img className="mb-1 h-[32px]" src="/assets/logo.png" alt="" />
            <h2
              // style={{ fontFamily: 'Larken-Bold' }}
              className="font-larken ml-[10px] text-[24px] text-[#404040] dark:text-white"
            >
              Torque
            </h2>
          </Link>
          <div className="flex items-center">
            <div
              onClick={() => setIsOpenClaim(true)}
              className="mr-[12px] hidden cursor-pointer items-center xs:flex"
            >
              <img
                className="h-[20px]"
                src="/assets/t-logo-circle.svg"
                alt=""
              />
              <p className="font-larken ml-[6px] text-[16px] text-[#404040] dark:text-white">
                $
                <NumberFormat
                  displayType="text"
                  thousandSeparator
                  value={tokenPrice}
                  decimalScale={2}
                  fixedDecimalScale
                />
              </p>
            </div>
            {/* {isConnected && address ? (
              <Popover
                placement="bottom-right"
                className={`mt-[12px] w-[200px] leading-none`}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px]"
                  >
                    <Link
                      href={`https://arbiscan.io/address/${address}`}
                      className="flex justify-between p-[12px]"
                      target="_blank"
                    >
                      Explorer <HiOutlineExternalLink />
                    </Link>
                    <div
                      className="flex cursor-pointer justify-between p-[12px]"
                      onClick={handleDisconnect}
                    >
                      Disconnect <FiLogOut />
                    </div>
                  </HoverIndicator>
                }
              >
                <div className="cursor-pointer rounded-full border border-primary px-[18px] py-[6px] text-[14px] uppercase leading-none text-primary transition-all duration-200 ease-in hover:scale-x-[102%] xs:px-[16px] xs:py-[4px] lg:px-[32px] lg:py-[6px] lg:text-[16px]">
                  {shortenAddress(address)}
                </div>
              </Popover>
            ) : ( */}
            <div
              className="font-mona cursor-pointer rounded-full border border-[#AA5BFF] px-[18px] py-[6px] text-[13px] uppercase leading-none text-[#AA5BFF] transition-all duration-200 ease-in xs:px-[16px] xs:py-[4px] lg:px-[22px] lg:pb-[6px] lg:pt-[8px]"
              onClick={() =>
                !address ? setOpenConnectWalletModal(true) : open()
              }
            >
              {address ? shortenAddress(address) : 'Connect'}
            </div>
            {/* )} */}
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
                    'font-mona relative flex h-[35px]  items-center justify-center pr-[4px] transition-all duration-200 ease-in' +
                    ` ${activeTabIndex === i
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
              ${theme === 'light'
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
    label: 'Vote',
    path: '/vote',
    icon: '/assets/main-layout/network.svg',
    iconActive: '/assets/main-layout/network-active.svg',
    iconLight: '/assets/main-layout/network-active.png',
    // isExternal: true,
  },
]
