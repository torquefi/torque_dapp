import HoverIndicator from '@/components/common/HoverIndicator'
import Popover from '@/components/common/Popover'
import { shortenAddress } from '@/lib/helpers/utils'
import { useNetwork } from 'wagmi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { useMoralis } from 'react-moralis'
import ConnectWalletModal from './ConnectWalletModal'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi'
import { useAuthRequestChallengeEvm } from '@moralisweb3/next'
import { useDispatch, useSelector } from 'react-redux'
import { switchNetwork } from '@wagmi/core'
import Moralis from 'moralis-v1'

export const Header = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, logout, enableWeb3, authenticate } =
    useMoralis()
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { chain, chains } = useNetwork()
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()

  const [isShowNetworkAlert, setIsShowNetworkAlert] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [addressOld, setAddressOld] = useState(address)
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const router = useRouter()

  const goerliTestnetInfo = {
    name: 'Goerli',
    symbol: 'ETH',
    chainId: 5,
    chainName: 'eth',
    coinName: 'ETH',
    coinSymbol: 'ETH',
    rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockchainExplorer: 'https://goerli.etherscan.io',
  }

  const currentTabIndex = useMemo(
    () => menu.map((item) => item.path).indexOf(router.pathname),
    [router.pathname]
  )

  const getAccount = async () => {
    if (isConnected) {
      await connectAsync({
        connector: new MetaMaskConnector(),
      })
    }
  }

  const changeWalletAddress = async () => {
    if (address != addressOld) {
      setAddressOld(address)
      const { message } = await Moralis.Cloud.run('requestMessage', {
        address: address,
        chain: parseInt(chain.id as any, 16),
        networkType: 'evm',
      })
      await authenticate({
        signingMessage: message,
        throwOnError: true,
      })
    }
  }
  useEffect(() => {
    if (router.isReady) {
      setActiveTabIndex(currentTabIndex)
    }
    getAccount()
  }, [router])

  useEffect(() => {
    if (isConnected && chain.id != -1) {
      setIsShowNetworkAlert(chain.id !== goerliTestnetInfo.chainId)
    }
  }, [chain])

  // useEffect(() => {
  //   if (isConnected) changeWalletAddress()
  // }, [address])

  useEffect(() => {
    setAddressOld(address)
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] bg-white dark:bg-[#030303] ">
        <div
          className={
            'flex cursor-pointer items-center justify-center bg-[#FF6969] text-center text-[14px] transition-all' +
            ` ${!isShowNetworkAlert ? 'h-0 overflow-hidden' : 'h-[44px]'}`
          }
          onClick={() => switchNetwork({ chainId: goerliTestnetInfo?.chainId })}
        >
          Torque is not supported on this network. Please switch to Goerli.
        </div>
        <div className="relative flex h-[72px] items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center">
            <img
              className="h-[32px] sm:h-[32px]"
              src="/assets/t-logo.svg"
              alt=""
            />
            <h2 className="ml-[16px] font-larken text-[24px] text-[#404040] dark:text-white">
              Torque
            </h2>
          </Link>
          <div className="flex items-center">
            <Link
              href="#"
              className="mr-[12px] hidden items-center xs:flex lg:mr-[24px]"
              target={'_blank'}
            >
              <img
                className="mr-1 h-[24px] lg:h-[26px]"
                src="/assets/t-logo-circle.svg"
                alt=""
              />
              <p className="ml-[6px] font-larken text-[16px] text-[#404040] dark:text-white lg:text-[18px]">
                $0.00
              </p>
            </Link>
            {isConnected ? (
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
                      href={`https://goerli.etherscan.io/address/${address}`}
                      className="flex justify-between p-[12px]"
                      target="_blank"
                    >
                      Etherscan <HiOutlineExternalLink />
                    </Link>
                    <div
                      className="flex cursor-pointer justify-between p-[12px]"
                      onClick={() => disconnectAsync()}
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
            ) : (
              <div
                className="cursor-pointer rounded-full border border-primary px-[18px] py-[6px] font-mona text-[14px] uppercase leading-none text-primary transition-all duration-200 ease-in hover:scale-x-[102%] xs:px-[16px] xs:py-[4px] lg:px-[32px] lg:py-[6px] lg:text-[16px]"
                onClick={() => setOpenConnectWalletModal(true)}
              >
                Connect
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
                    'relative flex h-[35px] items-center justify-center pr-[4px] font-mona transition-all duration-200 ease-in' +
                    ` ${
                      activeTabIndex === i ? ' text-white' : 'text-[#959595]'
                    }`
                  }
                  onMouseEnter={() => setActiveTabIndex(i)}
                  onMouseLeave={() => setActiveTabIndex(currentTabIndex)}
                >
                  <img
                    className="mr-[4px] w-[16px] lg:w-[20px] xl:w-[24px]"
                    src={activeTabIndex === i ? item.iconActive : item.icon}
                    alt=""
                  />
                  <p className="text-[12px] lg:text-[14px] xl:text-[16px]">
                    {item.label}
                  </p>
                </Link>
              ))}
            </HoverIndicator>
          </div>
          <div className="bg-gradient-divider absolute bottom-0 left-0 h-[1px] w-full" />
        </div>
      </header>
      <ConnectWalletModal
        open={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
      <div className="h-[92px]"></div>
      {isShowNetworkAlert && <div className="h-[44px]"></div>}
    </>
  )
}

const menu = [
  {
    label: 'Overview',
    path: '/overview',
    icon: '/assets/main-layout/distributed.svg',
    iconActive: '/assets/main-layout/distributed-active.svg',
  },
  {
    label: 'Boost',
    path: '/boost',
    icon: '/assets/main-layout/mining.svg',
    iconActive: '/assets/main-layout/mining-active.svg',
  },
  {
    label: 'Borrow',
    path: '/borrow',
    icon: '/assets/main-layout/link.svg',
    iconActive: '/assets/main-layout/link-active.svg',
  },
  {
    label: 'Stake',
    path: '/stake',
    icon: '/assets/main-layout/network.svg',
    iconActive: '/assets/main-layout/network-active.svg',
  },
]
