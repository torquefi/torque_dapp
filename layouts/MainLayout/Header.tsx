import HoverIndicator from '@/components/common/HoverIndicator'
import NumberFormat from '@/components/common/NumberFormat'
import Popover from '@/components/common/Popover'
import { stakeLpContract, tokenTorqContract } from '@/constants/contracts'
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

const goerliTestnetInfo = {
  name: 'Arbitrum',
  symbol: 'ETH',
  chainId: 421613,
  chainName: 'eth',
  coinName: 'ETH',
  coinSymbol: 'ETH',
  rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
  blockchainExplorer: 'https://goerli.arbiscan.io/',
}

export const Header = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { chain, chains } = useNetwork()

  const [isShowNetworkAlert, setIsShowNetworkAlert] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [tokenPrice, setTokenPrice] = useState<any>(0)
  const [isOpenClaim, setIsOpenClaim] = useState(false)
  const router = useRouter()

  // const goerliTestnetInfo = {
  //   name: 'Goerli',
  //   symbol: 'ETH',
  //   chainId: 5,
  //   chainName: 'eth',
  //   coinName: 'ETH',
  //   coinSymbol: 'ETH',
  //   rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
  //   blockchainExplorer: 'https://goerli.etherscan.io',
  // }

  const currentTabIndex = useMemo(
    () => menu.map((item) => item.path).indexOf(router.pathname),
    [router.pathname]
  )

  const handleChangeNetwork = async () => {
    await requestSwitchNetwork(goerliTestnetInfo)
  }

  useEffect(() => {
    if (router.isReady) {
      setActiveTabIndex(currentTabIndex)
    }
  }, [router])

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenTorqContract.abi),
      tokenTorqContract.address
    )
    return contract
  }, [Web3.givenProvider, tokenTorqContract])

  const lpContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(stakeLpContract.abi),
      stakeLpContract.address
    )
    return contract
  }, [Web3.givenProvider, stakeLpContract])

  useEffect(() => {
    const handleGetTorqPrice = async () => {
      try {
        const decimals = await tokenContract.methods.decimals().call()
        const amount = ethers.utils.parseUnits('1', decimals).toString()
        const response = await lpContract.methods
          .getUSDPrice(tokenTorqContract.address, amount)
          .call()
        const tokenPrice = ethers.utils.formatUnits(response, 6).toString()
        setTokenPrice(tokenPrice)
      } catch (error) {
        console.log('handleGetTorqPrice 123:>> ', error)
      }
    }
  }, [tokenContract, isConnected])

  useEffect(() => {
    if (chain?.id) {
      const network = chains?.find((item) => item?.id === chain?.id)
      setIsShowNetworkAlert(!network)
    }
  }, [chain, chains])

  const handleDisconnect = async () => {
    disconnect()
  }

  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-[100] bg-[#FCFAFF] dark:bg-[#030303] ">
        <div
          className={
            'flex cursor-pointer items-center justify-center bg-[#FF6969] text-center text-[14px] transition-all' +
            ` ${!isShowNetworkAlert ? 'h-0 overflow-hidden' : 'h-[44px]'}`
          }
          onClick={handleChangeNetwork}
        >
          Torque is not supported on this network. Please switch to Arbitrum
          Goerli.
        </div>
        <div className="container relative mx-auto flex h-[72px] max-w-screen-xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center">
            <img
              className="h-[32px] sm:h-[32px]"
              src="/assets/t-logo.svg"
              alt=""
            />
            <h2
              style={{ fontFamily: 'Larken-Bold' }}
              className="font-larken ml-[16px] text-[24px] font-bold text-[#404040] dark:text-white"
            >
              Torque
            </h2>
          </Link>
          <div className="flex items-center">
            <div
              onClick={() => setIsOpenClaim(true)}
              className="mr-[12px] hidden items-center xs:flex lg:mr-[24px] cursor-pointer"
            >
              <img
                className="mr-1 h-[24px] lg:h-[26px]"
                src="/assets/t-logo-circle.svg"
                alt=""
              />
              <p className="font-larken ml-[6px] text-[16px] text-[#404040] dark:text-white lg:text-[18px]">
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
            {isConnected && address ? (
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
                      href={`https://goerli.arbiscan.io/address/${address}`}
                      className="flex justify-between p-[12px]"
                      target="_blank"
                    >
                      Arbitrum Goerli <HiOutlineExternalLink />
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
            ) : (
              <div
                className="font-mona cursor-pointer rounded-full border border-[#AA5BFF] px-[18px] py-[6px] text-[14px] uppercase leading-none text-[#AA5BFF] transition-all duration-200 ease-in hover:scale-x-[102%] xs:px-[16px] xs:py-[4px] lg:px-[32px] lg:py-[6px] lg:text-[16px]"
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
                    'font-mona relative flex h-[35px]  items-center justify-center pr-[4px] transition-all duration-200 ease-in' +
                    ` ${activeTabIndex === i
                      ? 'text-[#404040] dark:text-white '
                      : 'text-[#959595]'
                    }`
                  }
                  onMouseEnter={() => setActiveTabIndex(i)}
                  onMouseLeave={() => setActiveTabIndex(currentTabIndex)}
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
    label: 'Stake',
    path: '/stake',
    icon: '/assets/main-layout/network.svg',
    iconActive: '/assets/main-layout/network-active.svg',
    iconLight: '/assets/main-layout/network-active.png',
  },
]
