import CurrencySwitch from '@/components/common/CurrencySwitch'
import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { BoostItem } from './BoostItem'

export function ManageBoostVault() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  return (
    <div className="font-larken dark-text-[#fff] mt-[36px] text-[#464646]">
      {isLoading ? (
        <div className="">
          <SkeletonDefault height={'5vh'} width={'20%'} />
        </div>
      ) : (
        <div className="text-[24px] dark:text-white">Manage Boost Vaults</div>
      )}

      {DATA_BOOST_VAULT.map((item) => {
        if (isLoading)
          return (
            <div className="mt-[24px]">
              <SkeletonDefault height={'20vh'} width={'100%'} />
            </div>
          )
        else
          return (
            <div className="">
              <BoostItem item={item} />
            </div>
          )
      })}
    </div>
  )
}
const DATA_BOOST_VAULT = [
  {
    token: 'ETH',
    label: 'Vault #1',
    deposited: 10.6,
    earnings: 0.24,
    APR: '5.19%',
    isOpen: false,
    amount: 0,
    data_key: 'name_boost_vault_1',
  },
  {
    token: 'USDC',
    label: 'Vault #2',
    deposited: 158130,
    earnings: 142271,
    APR: '4.49%',
    isOpen: false,
    amount: 0,
    data_key: 'name_boost_vault_2',
  },
]
