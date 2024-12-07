import { useEffect, useState } from 'react'
import SkeletonDefault from '@/components/skeleton'
import CreateBorrowVault from './CreateBorrowVault'
import ManageBorrowVault from './ManageBorrowVault'
import Banner from './Banner'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export const BorrowPage = () => {
  const [isLoading, setLoading] = useState(true)
  const [isFetchBorrowData, setIsFetchBorrowLoading] = useState(false)
  const layoutBorrow = useSelector(
    (store: AppStore) => store.layout.layoutBorrow
  )
  const visibilityBorrowBanner = useSelector(
    (store: AppStore) => store.layout.visibilityBorrowBanner
  )

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="mt-[-20px]">
        {visibilityBorrowBanner && (
          <>
            <div className="hidden lg:block">
              <SkeletonDefault height={'48vh'} />
            </div>
            <div className="lg:hidden">
              <SkeletonDefault height={'15vh'} />
            </div>
          </>
        )}
        {layoutBorrow === 'grid' && (
          <div className="mt-[36px]">
            <SkeletonDefault height={40} className="w-full max-w-[200px]" />
            <div className="mt-[24px] grid gap-4 md:grid-cols-2">
              <SkeletonDefault height={'50vh'} width={'100%'} />
              <SkeletonDefault height={'50vh'} width={'100%'} />
            </div>
          </div>
        )}
        {layoutBorrow === 'row' && (
          <div className="mt-[36px]">
            <SkeletonDefault height={40} className="w-full max-w-[200px]" />
            <div className="mt-[24px]">
              <SkeletonDefault height={120} width={'100%'} />
            </div>
          </div>
        )}
        <div className="mt-[32px]">
          <SkeletonDefault height={40} className="w-full max-w-[200px]" />
          <SkeletonDefault height={160} className="mt-[24px]" />
          <SkeletonDefault height={160} className="mt-[24px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-[36px] mt-[-16px]">
      {visibilityBorrowBanner && <Banner />}
      <CreateBorrowVault setIsFetchBorrowLoading={setIsFetchBorrowLoading} />
      <ManageBorrowVault isFetchBorrowData={isFetchBorrowData} />
    </div>
  )
}