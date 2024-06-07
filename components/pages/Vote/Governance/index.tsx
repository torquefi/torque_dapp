import React, { useEffect, useState } from 'react'
import { OptionToken } from './OptionToken'
import { Proposals } from './Proposals'
import { VotingPower } from './VotingPower'
import SkeletonDefault from '@/components/skeleton'

export const Governance = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <>
        <div className="mx-auto mb-4 w-[340px] rounded-full text-center">
          <SkeletonDefault className="h-[48px]" />
        </div>
        <div className="mx-auto mb-4 w-[340px] rounded-full text-center">
          <SkeletonDefault className="h-[48px]" />
        </div>

        <div className="mt-[32px] items-center justify-between rounded-full md:flex">
          <div className="md:w-[32%] w-full">
            <SkeletonDefault className="h-[110px] rounded-[32px]" />
          </div>
          <div className="md:w-[32%] w-full">
            <SkeletonDefault className="h-[110px] rounded-[32px]" />
          </div>
          <div className="md:w-[32%] w-full">
            <SkeletonDefault className="h-[110px] rounded-[32px]" />
          </div>
        </div>
        <div className="mt-[32px] items-start justify-between md:flex">
          <div className="md:w-[59%] w-full">
            <SkeletonDefault className="h-[470px] rounded-[48px]" />
          </div>
          <div className="md:w-[39%] w-full">
            <SkeletonDefault className="h-[339px] rounded-[48px]" />
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <div className="w-full mx-auto text-center mt-[-16px]">
        <h1 className="font-rogan text-[38px] font-[400] leading-[60px] text-[#030303] md:text-[52px] dark:text-white">
          Governance
        </h1>
        <p className="mx-auto w-full max-w-[332px] font-[500] leading-[24px] text-[#959595]">
          Shape the future of Torque by delegating vote power to yourself or a
          trusted entity.
        </p>
      </div>
      <OptionToken />
      <div className="mt-[16px] items-start justify-between md:flex">
        <Proposals />
        <VotingPower />
      </div>
    </>
  )
}
