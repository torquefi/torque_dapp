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

export function CreateBoostVault({ setIsFetchBoostLoading }: any) {
  const [boostVault, setBoostVault] = useState(BOOST_VAULTS)
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="space-y-[18px] ">
      <div className="flex justify-between items-center">
        <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
          Create Boost Vehicle
        </h3>
        {/* <div className="flex justify-center items-center space-x-[8px] bg-transparent">
          <button id="rowViewButton" className="focus:outline-none" onclick="toggleView('row')">
            <img src="../icons/rows.svg" alt="Row View" className="w-6 h-6"/>
          </button>
          <button id="gridViewButton" className="focus:outline-none" onclick="toggleView('grid')">
            <img src="../icons/grid.svg" alt="Grid View" className="w-6 h-6"/>
          </button>
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
