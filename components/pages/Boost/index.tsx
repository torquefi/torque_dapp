import { useEffect, useState } from 'react'
import SkeletonDefault from '@/components/skeleton'
import { ManageBoostVault } from './ManageBoostVault'
import Banner from './Banner'
import { CreateBoostVault } from './CreateBoostVault'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export const BoostPage = () => {
  const [isLoading, setLoading] = useState(true)
  const [isFetchBoostData, setIsFetchBoostLoading] = useState(false)
  const layoutBoost = useSelector(
    (store: AppStore) => store.layout.layoutBorrow
  )

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
        {layoutBoost === 'grid' && (
          <div className="mt-[36px]">
            <SkeletonDefault height={40} className="w-full max-w-[200px]" />
            <SkeletonDefault height={160} className="mt-[24px]" />
            <SkeletonDefault height={160} className="mt-[24px]" />
          </div>
        )}
        {layoutBoost === 'row' && (
          <div className="mt-[36px]">
            <SkeletonDefault height={40} className="w-full max-w-[200px]" />
            <div className="mt-[24px]">
              <SkeletonDefault height={120} width={'100%'} />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-[36px]">
      <Banner />
      <CreateBoostVault setIsFetchBoostLoading={setIsFetchBoostLoading} />
      <ManageBoostVault
        isFetchBoostData={isFetchBoostData}
        setIsFetchBoostLoading={setIsFetchBoostLoading}
      />
    </div>
  )
}
