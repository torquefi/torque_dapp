import React, { useEffect, useState } from 'react'
import { OptionToken } from './OptionToken'
import { Proposals } from './Proposals'
import { VotingPower } from './VotingPower'
import Skeleton from '@/components/skeleton/Skeleton'

export const Governance = () => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <>
        <Skeleton className="mx-auto h-[48px] w-[340px] rounded-full mb-4" />
        <Skeleton className="mx-auto h-[40px] w-[300px] rounded-full" />
        <div className="mt-[32px] items-center justify-between rounded-full md:flex">
          <Skeleton className="h-[110px] w-[32%] rounded-[32px]" />
          <Skeleton className="h-[110px] w-[32%] rounded-[32px]" />
          <Skeleton className="h-[110px] w-[32%] rounded-[32px]" />
        </div>
        <div className="mt-[32px] items-start justify-between md:flex">
          <Skeleton className="h-[669px] w-[59%] rounded-[32px]" />
          <Skeleton className="h-[339px] w-[39%] rounded-[32px]" />
        </div>
      </>
    )
  }
  return (
    <>
      <div className="w-full mx-auto text-center">
        <h1 className="font-larken text-[38px] font-[400] leading-[60px] md:text-[52px]">
          Governance
        </h1>
        <p className="mx-auto w-full max-w-[332px] font-[500] leading-[24px] text-[#959595]">
          Shape the future of Torque by delegating vote power to yourself or a
          trusted entity.
        </p>
      </div>
      <OptionToken />
      <div className="mt-[24px] items-start justify-between md:flex">
        <Proposals />
        <VotingPower />
      </div>
    </>
  )
}
