import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import Banner from './Banner'
import CreateBorrowVault from './CreateBorrowVault'
import ManageBorrowVault from './ManageBorrowVault'

export const BorrowPage = () => {
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="">
        <div className=" hidden lg:block">
          <SkeletonDefault height={'50vh'} />
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
    <div className="space-y-[36px] px-2">
      <Banner />
      <CreateBorrowVault />
      <ManageBorrowVault />
    </div>
  )
}
