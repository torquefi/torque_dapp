import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import SkeletonDefault from '@/components/skeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Popover from '@/components/common/Popover'
import { BoostItem } from '../ManageBoostVault/BoostItem'
import { CreateBoostItem } from './createBoostItem'
import { useMoralis } from 'react-moralis'

export function CreateBoostVault() {
  const [boostVault, setBoostVault] = useState(BOOST_VAULTS)
  const [isLoading, setIsLoading] = useState(true)

  const { Moralis } = useMoralis()

  const getAPR = async () => {
    let data = await Moralis.Cloud.run('getAPR_Stargate')
    boostVault.forEach((item) => {
      for (var i = 0; i < data.length; i++) {
        if (item.token == data[i].token) {
          item.APR = Number(Number(data[i].apr * 100).toFixed(2))
          break
        }
      }
      setBoostVault([...boostVault])
    })
  }
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
    getAPR()
  }, [])

  return (
    <div className="mt-[36px] font-larken">
      {isLoading ? (
        <div className="mt-[24px]">
          <SkeletonDefault height={40} width={'200px'} />
        </div>
      ) : (
        <div className="text-[24px]">Create Boost Vault</div>
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
    token: 'ETH',
    bonus_TORQ: 24,
    deposit: 0,
    threeYearValue: 0,
    APR: 5.19,
    rate: 1.16391500742,
    amount: 0,
  },
  {
    token: 'USDC',
    bonus_TORQ: 36,
    deposit: 0,
    threeYearValue: 0,
    APR: 4.49,
    rate: 1.14082698313,
    amount: 0,
  },
]
