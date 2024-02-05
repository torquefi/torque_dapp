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

  // const getAPR = async () => {
  //   try {
  //     let data = await Moralis.Cloud.run('getAPR_Stargate')
  //     console.log('getAPR_Stargate', data)
  //     const newBoost = boostVault.map((item) => {
  //       for (var i = 0; i < data.length; i++) {
  //         if (item.token?.toLowerCase() == data[i].token?.toLowerCase()) {
  //           item.APR = Number(Number(data[i].apr * 100).toFixed(2))
  //           break
  //         }
  //       }
  //       return item
  //     })
  //     setBoostVault(newBoost)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

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
    let dataBoost: any[] = boostVault
    try {
      const aprRes = await TokenApr.getListApr({})
      const aprs: any[] = aprRes?.data || []
      dataBoost = dataBoost?.map((item) => ({
        ...item,
        APR:
          ((aprs?.find(
            (apr) =>
              apr?.name === (item?.tokenSymbol === 'WBTC' ? 'BTC' : 'ETH')
          )?.apr || 0) +
            5) /
          2,
      }))
      dataBoost = await Promise.all(dataBoost?.map(getBoostData))
    } catch (error) {}
    setBoostVault(dataBoost)
  }

  useEffect(() => {
    handleUpdateBoostData(true)
  }, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  // useEffect(() => {
  //   getAPR()
  // }, [isInitialized])

  return (
    <div className="space-y-[18px] ">
      <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
        Create Boost Vehicle
      </h3>

      <div className="grid gap-[20px] md:grid-cols-2">
        {boostVault.map((item, i) => {
          return (
            <CreateBoostItem
              item={item}
              setIsFetchBoostLoading={setIsFetchBoostLoading}
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
