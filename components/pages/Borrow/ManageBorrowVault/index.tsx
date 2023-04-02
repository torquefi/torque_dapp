import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import BorrowItem from './BorrowItem'

export default function ManageBorrowVault() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])
  return (
    <div className="space-y-[24px]">
      {isLoading ? (
        <div className="">
          <SkeletonDefault height={'5vh'} width={'20%'} />
        </div>
      ) : (
        <h3 className="font-larken text-[24px]">Manage Borrow Vault</h3>
      )}

      {DATA_BORROW.map((item, i) => (
        <BorrowItem key={i} item={item} />
      ))}
    </div>
  )
}

const DATA_BORROW = [
  {
    token: 'BTC',
    label: 'House',
    collateral: 12.1,
    borrow: '6',
    ltv: 59.36,
    apy: -1.16,
  },
  {
    token: 'ETH',
    label: 'Lambo',
    collateral: 220,
    borrow: '138',
    ltv: 66.57,
    apy: -1.16,
  },
]
