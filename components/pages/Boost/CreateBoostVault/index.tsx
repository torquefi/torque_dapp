import { TokenApr } from '@/lib/api/TokenApr'
import { useEffect, useState } from 'react'
import {
  boostWbtcContract,
  boostWethContract,
  boostUniContract,
  boostLinkContract,
  boostCompContract,
  boostTorqContract,
  gmxWbtcContract,
  gmxWethContract,
  gmxUniContract,
  gmxLinkContract,
  wbtcContract,
  wethContract,
  uniContract,
  linkContract,
  compContract,
  torqContract,
} from '../constants/contracts'
import { CreateBoostItem } from './createBoostItem'
import HoverIndicator from '@/components/common/HoverIndicator'
import RcTooltip from '@/components/common/RcTooltip'
import { CreateRowBoostItem } from './createRowBoostItem'
import { useDispatch, useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import {
  updateLayoutBoost,
  updateVisibilityBoostBanner,
} from '@/lib/redux/slices/layout'
import UniSwapModal from '@/components/common/Modal/UniswapModal'

export function CreateBoostVault({ setIsFetchBoostLoading }: any) {
  const [boostVault, setBoostVault] = useState(BOOST_VAULTS)
  const [isLoading, setIsLoading] = useState(true)
  const [activeViewIndex, setActiveViewIndex] = useState(1)
  const [view, setView] = useState('grid')
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const layoutBoost = useSelector((store: AppStore) => store.layout.layoutBoost)
  const visibilityBoostBanner = useSelector(
    (store: AppStore) => store.layout.visibilityBoostBanner
  )
  const [openUniSwapModal, setOpenUniSwapModal] = useState(false)
  const dispatch = useDispatch()

  const handleUpdateBoostData = async (loading = false) => {
    let dataBoost: any[] = [...boostVault]
    try {
      const aprRes = await TokenApr.getListApr({})
      const aprs: any[] = aprRes?.data || []
      dataBoost = dataBoost?.map((item) => ({
        ...item,
        APR: aprs?.find((apr) => apr?.name === item?.token)?.apr || 0,
      }))
      // dataBoost = await Promise.all(dataBoost?.map(getBoostData))
      setBoostVault(dataBoost)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  useEffect(() => {
    handleUpdateBoostData(true)
  }, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  return (
    <div className="space-y-[18px]">
      <UniSwapModal
        open={openUniSwapModal}
        handleClose={() => setOpenUniSwapModal(false)}
      />

      <div className="flex items-center justify-between">
        <h3 className="font-rogan text-[24px] text-[#030303] dark:text-white">
          Create Boost Vehicle
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setOpenUniSwapModal(true)}
            className="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[4px] border-[1px] border-[#E6E6E6] border-[solid] focus:outline-none dark:border-[#1a1a1a]"
          >
            <img
              src="/icons/swap-gray.svg"
              alt="swap icon"
              className="w-[22px] text-[#959595]"
            />
          </button>

          {/* <button
            className='hidden focus:outline-none h-[34px] w-[34px] rounded-[4px] border-[1px] border-[solid] border-[#E6E6E6] dark:border-[#1a1a1a] md:inline-flex items-center justify-center cursor-pointer'>
            <img
              src={visibilityBoostBanner ? "/icons/visibility-off.svg" : "/icons/visibility-off.svg"}
              alt="visibility icon"
              className='w-[22px] text-[#959595]'
              onClick={() => dispatch(updateVisibilityBoostBanner(!visibilityBoostBanner as any))}
            />
          </button> */}

          <div className="flex h-[36px] w-auto items-center justify-center rounded-[4px] border border-[#efefef] bg-transparent px-[3px] py-[4px] dark:border-[#1a1a1a]">
            <HoverIndicator
              activeIndex={layoutBoost === 'row' ? 0 : 1}
              className="flex w-full justify-between"
            >
              <button
                id="rowViewButton"
                className="cursor-not-allowed focus:outline-none"
                // onClick={() => {
                //   dispatch(updateLayoutBoost('row' as any))
                // }}
              >
                <img
                  src="../icons/rows.svg"
                  alt="Row View"
                  className={`ml-[6px] mr-[6px] h-6 w-6 ${
                    layoutBoost === 'row' ? 'text-[#030303]' : 'text-[#959595]'
                  } dark:text-white`}
                />
              </button>
              <button
                id="gridViewButton"
                className="focus:outline-none"
                onClick={() => {
                  dispatch(updateLayoutBoost('grid' as any))
                }}
              >
                <img
                  src="../icons/grid.svg"
                  alt="Grid View"
                  className={`ml-[6px] mr-[6px] h-6 w-6 ${
                    layoutBoost === 'grid' ? 'text-[#030303]' : 'text-[#959595]'
                  } dark:text-white`}
                />
              </button>
            </HoverIndicator>
          </div>
        </div>
      </div>

      {layoutBoost === 'grid' && (
        <div className="grid gap-[20px] md:grid-cols-2">
          {boostVault.map((item, i) => {
            return (
              <CreateBoostItem
                item={item}
                setIsFetchBoostLoading={setIsFetchBoostLoading}
                earnToken={item.earnToken}
                firstAllocation={item.firstAllocation}
                secondAllocation={item.secondAllocation}
                firstRoute={item.firstRoute}
                secondRoute={item.secondRoute}
              />
            )
          })}
        </div>
      )}

      {layoutBoost === 'row' && (
        <div className="overflow-x-auto">
          <div
            className={
              `h-[1px] w-full` +
              `
      ${
        theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
      }`
            }
          ></div>
          <table className="min-w-[1000px] md:min-w-full">
            <thead>
              <tr className="">
                <th className="py-[6px] text-left" colSpan={1}>
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Asset
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-rogan-regular flex w-[200px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Select your preferred tokenized asset to be supplied."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left" colSpan={1}>
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Routes
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-rogan-regular flex w-[210px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Capture diversified yield within a single, seamless transaction."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Allocation
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-rogan-regular flex w-[210px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Supplied assets are automatically routed across yield providers."
                    >
                      <button className="mt-[ ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      APY
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-rogan-regular flex w-[200px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="On-chain estimate based on prevailing market conditions."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Rewards
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="The projected TORQ rewards after 1 year of $1,000 supplied."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Supplied
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="The total value of currently supplied tokenized assets."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {boostVault.map((item, i) => (
                <CreateRowBoostItem
                  item={item}
                  setIsFetchBoostLoading={setIsFetchBoostLoading}
                  earnToken={item.earnToken}
                  firstAllocation={item.firstAllocation}
                  secondAllocation={item.secondAllocation}
                  firstRoute={item.firstRoute}
                  secondRoute={item.secondRoute}
                />
              ))}
            </tbody>
          </table>
          <div
            className={
              `h-[1px] w-full` +
              `${
                theme === 'light'
                  ? 'bg-gradient-divider-light'
                  : 'bg-gradient-divider'
              }`
            }
          ></div>
        </div>
      )}
    </div>
  )
}

const BOOST_VAULTS = [
  {
    token: 'WBTC',
    earnToken: 'tBTC',
    bonus: 0,
    arbBonus: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.16391500742,
    amount: 0,
    boost_contract: 'boostBtcAbi',
    name_ABI_asset: 'btcAbi',
    decimals_asset: 18,
    yield_provider1: '/icons/coin/gmx.png',
    link_yield1: 'https://gmx.io/',
    yield_provider2: '/icons/coin/uni.svg',
    link_yield2: 'https://uniswap.org/',
    tokenContractInfo: wbtcContract,
    boostContractInfo: boostWbtcContract,
    gmxContractInfo: gmxWbtcContract,
    routed: 'GMX/UNI',
    firstAllocation: 50,
    secondAllocation: 50,
    firstRoute: 'GMX',
    secondRoute: 'Uniswap',
    firstVersionAllocation: 'V2 GM',
    secondVersionAllocation: 'V3 0.05',
  },
  {
    token: 'WETH',
    earnToken: 'tETH',
    bonus: 0,
    arbBonus: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.16391500742,
    amount: 0,
    boost_contract: 'boostEthAbi',
    name_ABI_asset: 'wethAbi',
    decimals_asset: 18,
    yield_provider1: '/icons/coin/gmx.png',
    link_yield1: 'https://gmx.io/',
    yield_provider2: '/icons/coin/stg.png',
    link_yield2: 'https://stargate.finance/',
    tokenContractInfo: wethContract,
    boostContractInfo: boostWethContract,
    gmxContractInfo: gmxWethContract,
    routed: 'GMX/STG',
    firstAllocation: 50,
    secondAllocation: 50,
    firstRoute: 'GMX',
    secondRoute: 'Stargate',
    firstVersionAllocation: 'V2 GM',
    secondVersionAllocation: 'V2 ETH',
  },
  {
    token: 'LINK',
    earnToken: 'tLINK',
    bonus: 0,
    arbBonus: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.16391500742,
    amount: 0,
    boost_contract: 'boostLinkAbi',
    name_ABI_asset: 'linkAbi',
    decimals_asset: 18,
    yield_provider1: '/icons/coin/gmx.png',
    link_yield1: 'https://gmx.io/',
    yield_provider2: '/icons/coin/uni.svg',
    link_yield2: 'https://uniswap.org/',
    tokenContractInfo: linkContract,
    boostContractInfo: boostLinkContract,
    gmxContractInfo: gmxLinkContract,
    routed: 'GMX/UNI',
    firstAllocation: 50,
    secondAllocation: 50,
    firstRoute: 'GMX',
    secondRoute: 'Uniswap',
    firstVersionAllocation: 'V2 GM',
    secondVersionAllocation: 'V3 0.05',
  },
  {
    token: 'UNI',
    earnToken: 'tUNI',
    bonus: 0,
    arbBonus: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.16391500742,
    amount: 0,
    boost_contract: 'boostUniAbi',
    name_ABI_asset: 'uniAbi',
    decimals_asset: 18,
    yield_provider1: '/icons/coin/gmx.png',
    link_yield1: 'https://gmx.io/',
    yield_provider2: '/icons/coin/uni.svg',
    link_yield2: 'https://uniswap.org/',
    tokenContractInfo: uniContract,
    boostContractInfo: boostUniContract,
    gmxContractInfo: gmxUniContract,
    routed: 'GMX/UNI',
    firstAllocation: 50,
    secondAllocation: 50,
    firstRoute: 'GMX',
    secondRoute: 'Uniswap',
    firstVersionAllocation: 'V2 GM',
    secondVersionAllocation: 'V3 0.05',
  },
  {
    token: 'COMP',
    earnToken: 'tCOMP',
    bonus: 0,
    arbBonus: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.16391500742,
    amount: 0,
    boost_contract: 'boostCompAbi',
    name_ABI_asset: 'compAbi',
    decimals_asset: 18,
    yield_provider1: '/icons/coin/uni.svg',
    link_yield1: 'https://uniswap.org/',
    yield_provider2: '/icons/coin/sushi.svg',
    link_yield2: 'https://sushi.com/',
    tokenContractInfo: compContract,
    boostContractInfo: boostCompContract,
    gmxContractInfo: gmxUniContract,
    routed: 'UNI/SUSHI',
    firstAllocation: 100,
    secondAllocation: 0,
    firstRoute: 'Uniswap',
    secondRoute: 'Sushi',
    firstVersionAllocation: 'V2 ETH',
    secondVersionAllocation: 'V3 0.05',
  },
  {
    token: 'TORQ',
    earnToken: 'tTORQ',
    bonus: 0,
    arbBonus: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.16391500742,
    amount: 0,
    boost_contract: 'boostTorqAbi',
    name_ABI_asset: 'torqAbi',
    decimals_asset: 18,
    yield_provider1: '/icons/coin/uni.svg',
    link_yield1: 'https://uniswap.org/',
    yield_provider2: '/icons/coin/sushi.svg',
    link_yield2: 'https://sushi.com/',
    tokenContractInfo: torqContract,
    boostContractInfo: boostTorqContract,
    gmxContractInfo: gmxUniContract,
    routed: 'UNI/SUSHI',
    firstAllocation: 100,
    secondAllocation: 0,
    firstRoute: 'Uniswap',
    secondRoute: 'Sushi',
    firstVersionAllocation: 'V2 ETH',
    secondVersionAllocation: 'V3 0.05',
  },
]
