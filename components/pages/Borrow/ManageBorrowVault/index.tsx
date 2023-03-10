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
          <SkeletonDefault height={'5vh'} width={'30%'} />
        </div>
      ) : (
        <h3 className="font-larken text-[24px]">Manage Borrow Vault</h3>
      )}

      {[...new Array(3)].map((item, i) => (
        <BorrowItem key={i} />
      ))}
    </div>
  )
}
