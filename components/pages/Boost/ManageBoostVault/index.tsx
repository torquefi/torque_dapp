import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { BoostItem } from './BoostItem'
import { EmptyBoost } from './EmptyBoost'

export function ManageBoostVault() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const isEmpty = false

  if (isLoading) {
    return (
      <div className="font-larken dark-text-white mt-[36px] text-[#464646]">
        <div className="">
          <SkeletonDefault height={'5vh'} width={'20%'} />
        </div>
        {DATA_BOOST_VAULT.map((item) => (
          <div className="mt-[24px]">
            <SkeletonDefault height={'20vh'} width={'100%'} />
          </div>
        ))}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="font-larken dark-text-white mt-[36px] text-[#464646]">
        <div className="text-[24px] dark:text-white">Manage Boost Vaults</div>
        <EmptyBoost />
      </div>
    )
  }

  return (
    <div className="font-larken dark-text-white mt-[36px] text-[#464646]">
      <div className="text-[24px] dark:text-white">Manage Boost Vaults</div>
      {DATA_BOOST_VAULT.map((item) => (
        <div className="">
          <BoostItem item={item} />
        </div>
      ))}
    </div>
  )
}
const DATA_BOOST_VAULT = [
  {
    token: 'ETH',
    label: 'Vault #1',
    deposited: 0.0,
    earnings: 0.0,
    APR: '0.00%',
    isOpen: false,
    amount: 0,
    data_key: 'name_boost_vault_1',
    boost_contract: 'boost_abi',
    name_ABI_asset: 'weth_abi',
    decimals_asset: 18,
  },
  {
    token: 'USG',
    label: 'Vault #2',
    deposited: 158130,
    earnings: 142271,
    APR: '0.00%',
    isOpen: false,
    amount: 0,
    data_key: 'name_boost_vault_2',
    boost_contract: 'boost_abi',
    name_ABI_asset: 'USGt_abi',
    decimals_asset: 9,
  },
]
