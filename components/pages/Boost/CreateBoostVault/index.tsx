import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { CreateBoostItem } from './createBoostItem'
import {
  boostContract,
  ethContract,
  usgContract,
} from '@/constants/boostContract'

export function CreateBoostVault() {
  const [boostVault, setBoostVault] = useState(BOOST_VAULTS)
  const [isLoading, setIsLoading] = useState(true)

  const { Moralis, isInitialized } = useMoralis()

  const getAPR = async () => {
    try {
      let data = await Moralis.Cloud.run('getAPR_Stargate')
      console.log('getAPR_Stargate', data)
      const newBoost = boostVault.map((item) => {
        for (var i = 0; i < data.length; i++) {
          if (item.depositTokenSymbol?.toLowerCase() == data[i].depositTokenSymbol?.toLowerCase()) {
            item.APR = Number(Number(data[i].apr * 100).toFixed(2))
            break
          }
        }
        return item
      })
      setBoostVault(newBoost)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  useEffect(() => {
    getAPR()
  }, [isInitialized])

  return (
    <div className=" mt-[36px]">
      {isLoading ? (
        <div className="mt-[24px]">
          <SkeletonDefault height={40} width={'200px'} />
        </div>
      ) : (
        <div className="font-larken text-[24px] text-[#000] dark:text-[#ffff]">
          Create Boost Vehicle
        </div>
      )}

      <div className="mt-[24px] grid gap-4 md:grid-cols-2">
        {boostVault.map((item: any) => {
          if (isLoading) {
            return (
              <div className="">
                <SkeletonDefault height={'40vh'} width={'100%'} />
              </div>
            )
          } else return <CreateBoostItem item={item} />
        })}
      </div>
    </div>
  )
}

const BOOST_VAULTS = [
  {
    depositTokenSymbol: 'AETH',
    depositTokenIcon: '/icons/coin/aeth.png',
    earnTokenSymbol: 'tETH',
    // earnTokenIcon: '/icons/coin/eth.png',
    bonus_TORQ: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.16391500742,
    amount: 0,
    boost_contract: 'boost_abi',
    name_ABI_asset: 'weth_abi',
    decimals_asset: 18,
    yield_provider1: '/icons/coin/gmx.png',
    link_yield1: 'https://gmx.io/',
    yield_provider2: '/icons/coin/stg.png',
    link_yield2: 'https://stargate.finance/',
    tokenContractInfo: ethContract,
    boostContractInfo: boostContract,
  },
  {
    depositTokenSymbol: 'TUSD',
    depositTokenIcon: '/icons/coin/tusd.png',
    earnTokenSymbol: 'tETH',
    bonus_TORQ: 0,
    deposit: 0,
    threeYearValue: 0,
    APR: 0.0,
    rate: 1.14082698313,
    amount: 0,
    boost_contract: 'boost_abi',
    name_ABI_asset: 'usg_abi',
    decimals_asset: 9,
    yield_provider2: '/icons/coin/compound.svg',
    link_yield2: 'https://compound.finance/',
    yield_provider1: '/icons/coin/uni.svg',
    link_yield1: 'https://uniswap.org/',
    tokenContractInfo: usgContract,
    boostContractInfo: boostContract,
  },
]
