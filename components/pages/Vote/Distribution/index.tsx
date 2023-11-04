import React, { useEffect, useState } from 'react'
import { InforTORQ } from './InforTORQ'
import { ListPools } from './ListPools'
import Skeleton from '@/components/skeleton/Skeleton'

export const Distribution = () => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="md:px-[15%]">
        <Skeleton className="mx-auto h-[120px] w-[450px] rounded-full" />
        <div className="mt-[42px] flex items-center justify-between">
          <Skeleton className="h-[120px] w-[32%] rounded-[32px]" />
          <Skeleton className="h-[120px] w-[32%] rounded-[32px]" />
          <Skeleton className="h-[120px] w-[32%] rounded-[32px]" />
        </div>
        <div className="mt-[24px]">
          <Skeleton className="h-[400px] w-full rounded-full" />
        </div>
      </div>
    )
  }
  return (
    <div className="md:px-[15%]">
      <div className="w-full mx-auto text-center">
        <h1 className="font-larken text-[38px] font-[400] leading-[60px] md:text-[52px]">
          Distribution
        </h1>
        <p className="mx-auto w-full max-w-[300px] font-[500] leading-[24px] text-[#959595]">
          Earn TORQ, the governance token of Torque & USD, by providing
          liquidity.
        </p>
      </div>
      <InforTORQ />
      <ListPools />
    </div>
  )
}
