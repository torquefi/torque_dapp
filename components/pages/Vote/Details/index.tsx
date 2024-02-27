import React, { useEffect, useMemo, useState } from 'react'
import { InforVotes } from './Infor'
import { MainContent } from './MainContent'
import SkeletonDefault from '@/components/skeleton'
import { useRouter } from 'next/router'
import { useAppSelector } from '@/lib/redux/store'

export const DetailsVotes = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [tipDetails, setTipDetails] = useState(null)
  const router = useRouter()
  const { id } = router?.query
  const { tipData } = useAppSelector((state) => state.tips)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  useEffect(() => {
    try {
      const data = tipData.find((tip) => tip?.id.toString() === id)
      if (data) {
        setTipDetails(data)
      } else {
      }
    } catch (error) { }
  }, [id, tipData])

  if (isLoading) {
    return (
      <div className="">
        <div className="mx-auto w-full rounded-full max-w-[400px]">
          <SkeletonDefault className="h-[56px]" />
        </div>

        <div className="mx-auto w-full rounded-full max-w-[400px] mt-[14px]">
          <SkeletonDefault className="h-[56px]" />
        </div>

        <div className="m-auto w-full max-w-[815px]">
          <div className="mt-[32px] justify-between md:flex">
            <div className="w-full rounded-[48px] md:w-[49%]">
              <SkeletonDefault className="h-[350px]" />
            </div>
            <div className="mt-[20px] w-full rounded-[48px] md:mt-[0px] md:w-[49%]">
              <SkeletonDefault className="h-[350px]" />
            </div>
          </div>

          <div className="mt-[26px] w-full rounded-[48px]">
            <SkeletonDefault className="h-[400px]" />
          </div>
        </div>

        {/* <div className="mt-[26px] justify-between md:flex">
          <div className="w-full rounded-[48px] md:w-[55%]">
            <SkeletonDefault className="h-[610px]" />
          </div>
          <div className="mt-[20px] w-full md:mt-[0px] md:w-[43%]">
            <div className="w-full rounded-[48px]">
              <SkeletonDefault className="h-[300px]" />
            </div>
            <div className="mt-[10px] w-full rounded-[48px]">
              <SkeletonDefault className="h-[300px]" />
            </div>
          </div>
        </div> */}
      </div >
    )
  }

  console.log('tipDetails :>> ', tipDetails);

  return (
    <div className="mx-auto w-full text-center max-w-[815px]">
      <h1 className="font-larken mx-auto mt-4 w-full text-[20px] font-[400] leading-[23px] text-[#030303] dark:text-white md:text-[36px] md:leading-[44px]">
        {tipDetails?.title}
      </h1>
      <div className="mt-[14px]">
        <div className="mx-auto flex items-center justify-center gap-[8px]">
          {tipDetails?.stage === 'Active' && (
            <div className="rounded-[6px] bg-[#1eb26b55] px-[12px] py-[2px] text-[12px] font-[500] uppercase text-[#1EB26B]">
              Active
            </div>
          )}
          {tipDetails?.stage === 'Pending' && (
            <div className="rounded-[6px] bg-[#FF9C414D] px-[12px] py-[2px] text-[12px] font-[500] uppercase text-[#FF9C41]">
              Pending
            </div>
          )}
          <p className="font-[500] text-[#959595]">TIP-{id}</p>
          <div className="h-[5px] w-[5px] rounded-full bg-[#959595]"></div>
          <p className="font-[500] text-[#959595]">Vote hasn't started yet</p>
        </div>
      </div>
      <div className="m-auto w-full max-w-[815px]">
        <InforVotes />
        <MainContent />
      </div>
      <div>{/* <Markdown>{markdown}</Markdown> */}</div>
    </div>
  )
}
