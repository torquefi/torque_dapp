import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { CreateBoostItem } from './createBoostItem'
import {
  boostBtcContract,
  btcContract,
  boostEtherContract,
  ethContract,
  // boostTorqContract,
  // torqContract,
  // boostCompContract,
  // compContract,
} from '@/constants/contracts'

export function CreateBoostVault() {
  const [boostVault, setBoostVault] = useState(BOOST_VAULTS)
  const [isLoading, setIsLoading] = useState(true)

  const { Moralis, isInitialized } = useMoralis()

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

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  // useEffect(() => {
  //   getAPR()
  // }, [isInitialized])

  return (
    <div className="space-y-[24px] ">
      <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
        Create Boost Vehicle
      </h3>

      <div className="grid gap-[20px] md:grid-cols-2">
        {boostVault.map((item, i) => (
          <CreateBoostItem item={item}/>
        ))}
      </div>
    </div>
  )
}

const BOOST_VAULTS = [
  {
    token: 'WBTC',
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
    tokenContractInfo: btcContract,
    boostContractInfo: boostBtcContract,
  },
  {
    token: 'AETH',
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
    tokenContractInfo: ethContract,
    boostContractInfo: boostEtherContract,
  },
  // {
  //   token: 'TORQ',
  //   bonus_TORQ: 0,
  //   deposit: 0,
  //   threeYearValue: 0,
  //   APR: 0.0,
  //   rate: 1.14082698313,
  //   amount: 0,
  //   boost_contract: 'boost_abi', // boostTorq_abi
  //   name_ABI_asset: 'torq_abi',
  //   decimals_asset: 9,
  //   yield_provider2: '/icons/coin/uni.svg',
  //   link_yield2: 'https://uniswap.org/',
  //   yield_provider1: '/icons/coin/torq-yi.svg',
  //   link_yield1: '#',
  //   tokenContractInfo: torqContract,
  //   boostContractInfo: boostTorqContract,
  // },
  // {
  //   token: 'COMP',
  //   bonus_TORQ: 0,
  //   deposit: 0,
  //   threeYearValue: 0,
  //   APR: 0.0,
  //   rate: 1.14082698313,
  //   amount: 0,
  //   boost_contract: 'boost_abi', // boostComp_abi
  //   name_ABI_asset: 'comp_abi',
  //   decimals_asset: 9,
  //   yield_provider2: '/icons/coin/uni.svg',
  //   link_yield2: 'https://uniswap.org/',
  //   yield_provider1: '/icons/coin/sushi.svg',
  //   link_yield1: 'https://sushi.com/',
  //   tokenContractInfo: compContract,
  //   boostContractInfo: boostCompContract,
  // },
]
