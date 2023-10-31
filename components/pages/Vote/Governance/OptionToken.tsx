import Skeleton from '@/components/skeleton/Skeleton'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export const OptionToken = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  // if (isLoading) {
  //   return (

  //   )
  // }
  return (
    <div className="mt-[42px] items-center justify-between md:flex">
      <div className="flex w-full items-center justify-between rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[36px] py-[20px] md:w-[32%]">
        <div className="w-[50%]">
          <h4 className="text-[24px] font-[400] leading-[40px]">240,000,000</h4>
          <p className="font-[500] leading-[24px] text-[#959595]">
            TORQ Remaining
          </p>
        </div>
        <div className="w-[50%]">
          <Link
            href="/vote/distribution"
            className="mb-[20px] flex cursor-pointer items-center justify-end gap-[5px]"
          >
            <p className="text-[14px] font-[500] uppercase  text-[#AA5BFF]">
              learn
            </p>
            <img src="/assets/pages/vote/genover/next.svg" alt="" />
          </Link>
          <div className="relative h-[4px] w-full bg-[#aa5bff33]">
            <div className="absolute h-[4px] w-[70%] bg-[#AA5BFF]"></div>
          </div>
        </div>
      </div>
      <div className="mt-[24px] flex w-full items-center justify-between rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[36px] py-[20px] md:mt-0 md:w-[32%]">
        <div className="w-[50%]">
          <h4 className="text-[24px] font-[400] leading-[40px]">240,000,000</h4>
          <p className="font-[500] leading-[24px] text-[#959595]">
            Circulating Supply
          </p>
        </div>
        <div className="w-[50%]">
          <Link
            href="/vote/ID"
            className="flex cursor-pointer items-center justify-end gap-[5px]"
          >
            <p className="text-[14px] font-[500] uppercase  leading-[40px] text-[#AA5BFF]">
              Verify
            </p>
            <img src="/assets/pages/vote/genover/next.svg" alt="" />
          </Link>
          <div className="flex items-center justify-end gap-[4px]">
            <img src="/assets/pages/vote/genover/up-green.svg" alt="" />
            <p className="font-[500] leading-[24px] text-[#1EB26B]">0.00%</p>
          </div>
        </div>
      </div>
      <div className="mt-[24px] flex w-full items-center justify-between rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[36px] py-[20px] md:mt-0 md:w-[32%]">
        <div className="w-[50%]">
          <h4 className="text-[24px] font-[400] leading-[40px]">240,000,000</h4>
          <p className="font-[500] leading-[24px] text-[#959595]">
            Global Delegates
          </p>
        </div>
        <div className="w-[50%]">
          <Link
            href="/vote/leaderboard"
            className="flex cursor-pointer items-center justify-end gap-[5px]"
          >
            <p className="text-[14px] font-[500] uppercase  leading-[40px] text-[#AA5BFF]">
              leaders
            </p>
            <img src="/assets/pages/vote/genover/next.svg" alt="" />
          </Link>
          <div className="flex items-center justify-end gap-[4px]">
            <img src="/assets/pages/vote/genover/up-green.svg" alt="" />
            <p className="font-[500] leading-[24px] text-[#1EB26B]">0.00%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
