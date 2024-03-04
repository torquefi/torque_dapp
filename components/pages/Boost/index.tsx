import { useEffect, useState } from 'react'
import SkeletonDefault from '@/components/skeleton'
import { ManageBoostVault } from './ManageBoostVault'
import Banner from './Banner'
import { CreateBoostVault } from './CreateBoostVault'

export const BoostPage = () => {
  const [isLoading, setLoading] = useState(true)
  const [isFetchBoostData, setIsFetchBoostLoading] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="mt-2">
        <div className="hidden lg:block">
          <SkeletonDefault height={'48vh'} />
        </div>
        <div className=" lg:hidden">
          <SkeletonDefault height={'15vh'} />
        </div>
        <div className="mt-[36px]">
          <SkeletonDefault height={40} className="w-full max-w-[200px]" />
          <div className="mt-[24px] grid gap-4 md:grid-cols-2">
            <SkeletonDefault height={'50vh'} width={'100%'} />
            <SkeletonDefault height={'50vh'} width={'100%'} />
          </div>
        </div>
        <div className="mt-[36px]">
          <SkeletonDefault height={40} className="w-full max-w-[200px]" />
          <SkeletonDefault height={160} className="mt-[24px]" />
          <SkeletonDefault height={160} className="mt-[24px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-[36px] mt-2">
      <Banner />
      <CreateBoostVault setIsFetchBoostLoading={setIsFetchBoostLoading} />
      <ManageBoostVault isFetchBoostData={isFetchBoostData} setIsFetchBoostLoading={setIsFetchBoostLoading} />
    </div>
  )
}
