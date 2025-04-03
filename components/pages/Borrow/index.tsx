import { useEffect, useState } from 'react'
import SkeletonDefault from '@/components/skeleton'
import CreateBorrowVault from './CreateBorrowVault'
import ManageBorrowVault from './ManageBorrowVault'
import Banner from './Banner'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export const BorrowPage = () => {
  const [isLoading, setLoading] = useState(true)
  const layoutBorrow = useSelector((store: AppStore) => store.layout.layoutBorrow)
  const visibilityBorrowBanner = useSelector((store: AppStore) => store.layout.visibilityBorrowBanner)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="mt-[-20px]">
        {visibilityBorrowBanner && (
          <>
            <div className="hidden lg:block">
              <SkeletonDefault height={'40vh'} />
            </div>
            <div className="lg:hidden">
              <SkeletonDefault height={'15vh'} />
            </div>
          </>
        )}
        <div className="mt-[36px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <SkeletonDefault height={'34px'} width={'160px'} />
            </div>
            <div className="flex space-x-2">
              <SkeletonDefault height={'34px'} width={'34px'} />
              <SkeletonDefault height={'34px'} width={'76px'} />
            </div>
          </div>
          {layoutBorrow === 'grid' && (
            <div className="grid gap-4 md:grid-cols-2">
              <SkeletonDefault height={'50vh'} width={'100%'} />
              <SkeletonDefault height={'50vh'} width={'100%'} />
            </div>
          )}
        </div>
        {layoutBorrow === 'row' && (
          <div className="mt-[24px]">
            <SkeletonDefault height={120} width={'100%'} />
          </div>
        )}
        <div className="mt-[32px]">
          <SkeletonDefault height={40} className="w-full max-w-[180px]" />
          <div className="mt-[24px] grid gap-4 md:grid-cols-2">
            <SkeletonDefault height={160} width={'100%'} />
            <SkeletonDefault height={160} width={'100%'} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-[36px] mt-[-16px]">
      {visibilityBorrowBanner && <Banner />}
      <CreateBorrowVault />
      <ManageBorrowVault />
    </div>
  )
}
