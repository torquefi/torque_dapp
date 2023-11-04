import React, { useEffect, useState } from 'react'
import { InforVotes } from './Infor'
import { MainContent } from './MainContent'
import Skeleton from '@/components/skeleton/Skeleton'

export const DetailsVotes = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="">
        <Skeleton className="mx-auto h-[126px] max-w-[600px] rounded-full" />
        <div className="mt-[41px] justify-between md:flex">
          <Skeleton className="h-[350px] w-[49%] rounded-full" />
          <Skeleton className="h-[350px] w-[49%] rounded-full" />
        </div>
        <div className="mt-[26px] justify-between md:flex">
          <Skeleton className="h-[610px] w-[55%] rounded-full" />
          <div className="w-[43%]">
            <Skeleton className="h-[300px] w-full rounded-full" />
            <Skeleton className="mt-[10px] h-[300px] w-full rounded-full" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full mx-auto text-center">
      <h1 className="mx-auto w-full font-larken max-w-[588px] text-[20px] font-[400] leading-[23px] md:text-[36px] md:leading-[44px]">
        Increase rate of distribution across tBoost pools to 1m TORQ per day
      </h1>
      <div className="mt-[14px]">
        <div className="mx-auto flex items-center justify-center gap-[13px]">
          <div className="rounded-[6px] bg-[#1eb26b55] px-[12px] py-[2px] text-[12px] font-[500] uppercase text-[#1EB26B]">
            Active
          </div>
          <p className="font-[500] text-[#959595]">TIP-15</p>
          <div className="h-[5px] w-[5px] rounded-full bg-[#959595]"></div>
          <p className="font-[500] text-[#959595]">4 days, 12 hours left</p>
        </div>
      </div>
      <InforVotes />
      <MainContent />
    </div>
  )
}
