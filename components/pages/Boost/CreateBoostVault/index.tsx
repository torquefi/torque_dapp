import { TokenApr } from '@/lib/api/TokenApr'
import { useEffect, useState } from 'react'
import {
  boostWbtcContract,
  boostWethContract,
  gmxWbtcContract,
  gmxWethContract,
  wbtcContract,
  wethContract,
} from '../constants/contracts'
import { CreateBoostItem } from './createBoostItem'
import HoverIndicator from '@/components/common/HoverIndicator'

export function CreateBoostVault({ setIsFetchBoostLoading }: any) {
  const [boostVault, setBoostVault] = useState(BOOST_VAULTS)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeViewIndex, setActiveViewIndex] = useState(1);

  console.log('boostVault', boostVault)

  const getBoostData = async ({ ...item }: (typeof BOOST_VAULTS)[0]) => {
    try {
      // console.log('=>>>', item)
      return item
    } catch (error) {
      console.log('ManageBoostVault.getBoostData', error)
      return item
    }
  }

  const handleUpdateBoostData = async (loading = false) => {
    let dataBoost: any[] = [...boostVault]
    try {
      const aprRes = await TokenApr.getListApr({})
      const aprs: any[] = aprRes?.data || []
      console.log('aprs :>> ', aprs);
      dataBoost = dataBoost?.map((item) => ({
        ...item,
        APR:
          ((aprs?.find(
            (apr) =>
              apr?.name === (item?.token === 'WBTC' ? 'BTC' : 'ETH')
          )?.apr || 0) +
            5) /
          2,
      }))
      console.log('dataBoost :>> ', dataBoost);
      // dataBoost = await Promise.all(dataBoost?.map(getBoostData))
      setBoostVault(dataBoost)

    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  useEffect(() => {
    handleUpdateBoostData(true)
  }, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  // const tabs = [
  //   { id: 0, name: 'Native', content: 'Content for Native' },
  //   { id: 1, name: 'Stable', content: 'Content for Stable' },
  // ];

  return (
    <div className="space-y-[18px] ">
      <div className="flex justify-between items-center">
        <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
          Create Boost Vehicle
        </h3>
        {/* <div className="flex space-x-3 items-center justify-center">
        <div className="flex h-[36px] max-w-[140px] border border-[#efefef] dark:border-[#1a1a1a] rounded-[4px]">
          <div className="flex px-[3px] py-[3px]">
            <HoverIndicator activeIndex={activeTabIndex} className="flex w-full justify-between">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabIndex(index)}
                  className={`flex justify-center items-center px-[10px] py-[6px] text-sm ${activeTabIndex === index ? 'text-[#030303]' : 'text-[#959595]'} dark:text-white focus:outline-none ${index === 0 ? 'rounded-tl-[4px]' : ''} ${index === tabs.length - 1 ? 'rounded-tr-[4px]' : ''}`}
                >
                  {tab.name}
                </button>
              ))}
            </HoverIndicator>
          </div>
          <div className="p-4">
            {tabs[activeTabIndex].content}
          </div>
        </div>
        <div className="flex h-[36px] w-auto justify-center items-center rounded-[4px] bg-transparent border border-[#efefef] dark:border-[#1a1a1a] px-[3px] py-[4px]">
          <HoverIndicator activeIndex={activeViewIndex} className="flex w-full justify-between">
            <button
              id="rowViewButton"
              className="focus:outline-none"
              onClick={() => { setActiveViewIndex(0); toggleView('row'); }}
            >
              <img src="../icons/rows.svg" alt="Row View" className={`w-6 h-6 ml-[6px] mr-[6px] ${activeViewIndex === 0 ? 'text-[#030303]' : 'text-[#959595]'} dark:text-white`}/>
            </button>
            <button
              id="gridViewButton"
              className="focus:outline-none"
              onClick={() => { setActiveViewIndex(1); toggleView('grid'); }}
            >
              <img src="../icons/grid.svg" alt="Grid View" className={`w-6 h-6 ml-[6px] mr-[6px] ${activeViewIndex === 1 ? 'text-[#030303]' : 'text-[#959595]'} dark:text-white`}/>
            </button>
          </HoverIndicator>
        </div>
      </div> */}
      </div>
      <div className="grid gap-[20px] md:grid-cols-2">
        {boostVault.map((item, i) => {
          return (
            <CreateBoostItem
              item={item}
              setIsFetchBoostLoading={setIsFetchBoostLoading}
              earnToken={item.earnToken}
            />
          )
        })}
      </div>
    </div>
  )
}

const BOOST_VAULTS = [
  {
    token: 'WBTC',
    earnToken: 'tBTC',
    bonus_TORQ: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.16391500742,
    amount: 0,
    boost_contract: 'boostBtcAbi', // boostWbtc_abi
    name_ABI_asset: 'btcAbi',
    decimals_asset: 18,
    yield_provider1: '/icons/coin/gmx.png',
    link_yield1: 'https://gmx.io/',
    yield_provider2: '/icons/coin/uni.svg',
    link_yield2: 'https://uniswap.org/',
    tokenContractInfo: wbtcContract,
    boostContractInfo: boostWbtcContract,
    gmxContractInfo: gmxWbtcContract,
  },
  {
    token: 'WETH',
    earnToken: 'tETH',
    bonus_TORQ: 0,
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
  },
]
