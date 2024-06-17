import React, { useEffect, useState } from 'react'
import { InforTORQ } from './InforTORQ'
import { ListPools } from './ListPools'
import SkeletonDefault from '@/components/skeleton'


export const Distribution = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="md:px-[15%]">
        <div className='w-[340px] rounded-full mx-auto mb-4'>
          <SkeletonDefault className="h-[48px] " />
        </div>
        <div className='mx-auto w-[300px] rounded-full'>
          <SkeletonDefault className="h-[40px]" />
        </div>
        {/* <div className="mt-[42px] flex items-center justify-between flex-col md:flex-row">
          <div className='md:w-[32%] rounded-[32px] w-full mb-[20px] md:mb-[0px]'>
            <SkeletonDefault className="h-[110px]" />
          </div>
          <div className='md:w-[32%] rounded-[32px] w-full mb-[20px] md:mb-[0px]'>
            <SkeletonDefault className="h-[110px]" />
          </div>
          <div className='md:w-[32%] rounded-[32px] w-full md:mb-[0px]'>
            <SkeletonDefault className="h-[110px]" />
          </div>
        </div> */}
        <div className="mt-[24px] mx-auto max-w-[700px] w-full rounded-[48px]">
          <SkeletonDefault className="h-[300px]" />
        </div>
      </div>
    )
  }
  return (
    <div className="md:px-[15%]">
      <div className="w-full mx-auto text-center">
        <h1 className="font-rogan text-[#030303] dark:text-white text-[38px] font-[400] leading-[60px] md:text-[52px]">
          Distribution
        </h1>
        <p className="mx-auto w-full max-w-[360px] font-[500] leading-[24px] text-[#959595]">
          Earn TORQ, the deflationary governance token of Torque & TUSD, by providing
          liquidity.
        </p>
      </div>
      {/* <InforTORQ /> */}
      <ListPools />
    </div>
  )
}
