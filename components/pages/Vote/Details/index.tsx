import React, { useEffect, useState } from 'react'
import { InforVotes } from './Infor'
import { MainContent } from './MainContent'
import SkeletonDefault from '@/components/skeleton'
import { useRouter } from 'next/router'
import Markdown from 'react-markdown'
import { useAppSelector } from '@/lib/redux/store'

export const DetailsVotes = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { id } = router?.query
  const { tipData } = useAppSelector(state => state.tips)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="">
        <div className="mx-auto h-[84px] max-w-[400px] rounded-full">
          <SkeletonDefault className="h-[84px]" />
        </div>

        <div className="mt-[41px] justify-between md:flex">
          <div className="md:w-[49%] rounded-[48px] w-full">
            <SkeletonDefault className="h-[350px]" />
          </div>
          <div className="md:w-[49%] rounded-[48px] w-full md:mt-[0px] mt-[20px]">
            <SkeletonDefault className="h-[350px]" />
          </div>
        </div>
        <div className="mt-[26px] justify-between md:flex">
          <div className="w-full md:w-[55%] rounded-[48px]">
            <SkeletonDefault className="h-[610px]" />
          </div>
          <div className="w-full md:w-[43%] md:mt-[0px] mt-[20px]">
            <div className='w-full rounded-[48px]'>
              <SkeletonDefault className="h-[300px]" />
            </div>
            <div className='mt-[10px] w-full rounded-[48px]'>
              <SkeletonDefault className="h-[300px]" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full mx-auto text-center">
      <h1 className="mt-4 font-larken text-[#030303] dark:text-white mx-auto w-full text-[20px] font-[400] leading-[23px] md:text-[36px] md:leading-[44px]">
        TIP-{id}: Incentivize Uniswap Liquidity
      </h1>
      <div className="mt-[14px]">
        <div className="mx-auto flex items-center justify-center gap-[8px]">
          <div className="rounded-[6px] bg-[#1eb26b55] px-[12px] py-[2px] text-[12px] font-[500] uppercase text-[#1EB26B]">
            Active
          </div>
          <p className="font-[500] text-[#959595]">TIP-{id}</p>
          <div className="h-[5px] w-[5px] rounded-full bg-[#959595]"></div>
          <p className="font-[500] text-[#959595]">4 days, 12 hours left</p>
        </div>
      </div>
      <div className='w-full max-w-[815px] m-auto'>
        <InforVotes />
        <MainContent />
      </div>
      <div>
        {/* <Markdown>{markdown}</Markdown> */}
      </div>
    </div>
  )
}
