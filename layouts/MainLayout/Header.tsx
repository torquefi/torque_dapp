import Popover from '@/components/common/Popover'
import { shortenAddress } from '@/lib/helpers/utils'
import useNetwork from '@/lib/hooks/useNetwork'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { useMoralis } from 'react-moralis'
import Web3 from 'web3'
import ConnectWalletModal from './ConnectWalletModal'

export const Header = () => {
  const { chainId, user, isAuthenticated, logout } = useMoralis()
  const { network } = useNetwork()
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const router = useRouter()
  const menuContainer = useRef<HTMLDivElement>(null)
  const menuIndicator = useRef<HTMLDivElement>(null)

  const { requestSwitchNetwork } = useNetwork()

  const chainIdNumber = new Web3().utils.hexToNumber(chainId)

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
  const isShowNetworkAlert =
    isAuthenticated && chainIdNumber !== goerliTestnetInfo.chainId

  const currentTabIndex = useMemo(
    () => menu.map((item) => item.path).indexOf(router.pathname),
    [router.pathname]
  )

  useEffect(() => {
    if (router.isReady) {
      setActiveTabIndex(currentTabIndex)
    }
  }, [router])

  useEffect(() => {
    const handleUpdateIndicatorPosition = () => {
      if (menuIndicator.current && menuContainer.current) {
        const menuRect = menuContainer.current.getBoundingClientRect()
        const left = (menuRect.width / menu.length) * activeTabIndex
        menuIndicator.current.style.left = `${left}px`
      }
    }
    handleUpdateIndicatorPosition()
    window.addEventListener('resize', handleUpdateIndicatorPosition)
    return () => {
      window.removeEventListener('resize', handleUpdateIndicatorPosition)
    }
  }, [activeTabIndex])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] bg-[#030303]">
        <div
          className={
            'flex cursor-pointer items-center justify-center bg-[#FF6969] text-center text-[14px] transition-all' +
            ` ${!isShowNetworkAlert ? 'h-0 overflow-hidden' : 'h-[44px]'}`
          }
          onClick={() => requestSwitchNetwork(goerliTestnetInfo)}
        >
          Torque is not supported on this network. Please switch to Goerli.
        </div>
        <div className="relative flex h-[72px] items-center justify-between px-4 sm:px-8">
          <Link href="#">
            <a className="flex items-center" target="_blank">
              <img
                className="h-[32px] sm:h-[32px]"
                src="/assets/t-logo.svg"
                alt=""
              />
              <h2 className="ml-[16px] font-larken text-[24px]">Torque</h2>
            </a>
          </Link>
          <div className="flex items-center">
            <Link href="#">
              <a
                className="mr-[12px] hidden items-center xs:flex lg:mr-[24px]"
                target={'_blank'}
              >
                <img
                  className="h-[24px] lg:h-[32px]"
                  src="/assets/t-logo-circle.svg"
                  alt=""
                />
                <p className="ml-[6px] font-larken text-[16px] lg:text-[18px]">
                  $0.00
                </p>
              </a>
            </Link>
            {isAuthenticated ? (
              <Popover
                placement="bottom-right"
                content={
                  <div
                    className={`relative mx-auto mt-[12px] w-[200px] rounded-[8px] border border-[#1D1D1D] bg-[#030303] leading-none transition-all`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`${network?.blockchainExplorer || 'https://bscscan.com'
                        }/address/${user.attributes.ethAddress}`}
                    >
                      <a
                        className="flex justify-between p-[16px]"
                        target="_blank"
                      >
                        Etherscan <HiOutlineExternalLink />
                      </a>
                    </Link>
                    <div className="bg-gradient-divider h-[1px]" />
                    <div
                      className="flex cursor-pointer justify-between p-[16px]"
                      onClick={() => logout()}
                    >
                      Disconnect <FiLogOut />
                    </div>
                  </div>
                }
              >
                <div className="cursor-pointer rounded-full border border-primary py-[6px] px-[18px] text-[14px] uppercase leading-none text-primary transition-all duration-200 ease-in hover:scale-x-[102%] xs:py-[4px] xs:px-[16px] lg:py-[6px] lg:px-[32px] lg:text-[16px]">
                  {shortenAddress(user.attributes.ethAddress)}
                </div>
              </Popover>
            ) : (
              <div
                className="cursor-pointer rounded-full border border-primary py-[6px] px-[18px] text-[14px] uppercase leading-none text-primary transition-all duration-200 ease-in hover:scale-x-[102%] xs:py-[4px] xs:px-[16px] lg:py-[6px] lg:px-[32px] lg:text-[16px]"
                onClick={() => setOpenConnectWalletModal(true)}
              >
                Connect
              </div>
            )}
          </div>
          <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div
              ref={menuContainer}
              className="relative flex w-[320px] lg:w-[400px] xl:w-[480px]"
            >
              <div
                className="absolute top-0 h-[35px] w-1/4 rounded-md bg-gradient-to-br from-[#1c1c1c] to-[#101010] transition-all duration-300"
                ref={menuIndicator}
              ></div>
              {menu.map((item, i) => (
                <Link href={item.path} key={i}>
                  <a
                    className={
                      'relative flex h-[35px] w-1/4 items-center justify-center pr-[4px]' +
                      ` ${activeTabIndex === i ? ' text-white' : 'text-[#959595]'
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
                  </a>
                </Link>
              ))}
            </div>
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
