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
    (store: AppStore) => store.layout.layoutBoost
  )
  const visibilityBoostBanner = useSelector(
    (store: AppStore) => store.layout.visibilityBoostBanner
  )

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="mt-[32px] md:mt-[16px]">
        {visibilityBoostBanner && (
          <>
            <div className="hidden lg:block">
              <SkeletonDefault height={'48vh'} />
            </div>
            <div className="lg:hidden">
              <SkeletonDefault height={'15vh'} />
            </div>
          </>
        )}

        {layoutBoost === 'grid' && (
          <div className="mt-[36px]">
            <SkeletonDefault height={40} className="w-full max-w-[200px]" />
            <div className="mt-[24px] grid gap-4 md:grid-cols-2">
              <SkeletonDefault height={'50vh'} width={'100%'} />
              <SkeletonDefault height={'50vh'} width={'100%'} />
            </div>
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

        <div className="mt-[32px]">
          <SkeletonDefault height={40} className="w-full max-w-[200px]" />
          <div className="mt-[24px]">
            <SkeletonDefault height={120} width={'100%'} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-[36px] mt-[32px] md:mt-[20px]">
      {visibilityBoostBanner && <Banner />}
      <CreateBoostVault setIsFetchBoostLoading={setIsFetchBoostLoading} />
      <ManageBoostVault
        isFetchBoostData={isFetchBoostData}
        setIsFetchBoostLoading={setIsFetchBoostLoading}
      />
    </div>
  )
}
