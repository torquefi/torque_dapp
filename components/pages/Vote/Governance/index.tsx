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
        <Skeleton className="mx-auto h-[150px] w-[500px] rounded-full" />
        <div className="mt-[24px] items-center justify-between rounded-full md:flex">
          <Skeleton className="h-[110px] w-[32%]" />
          <Skeleton className="h-[110px] w-[32%]" />
          <Skeleton className="h-[110px] w-[32%]" />
        </div>
        <div className="mt-[24px] items-start justify-between md:flex">
          <Skeleton className="h-[669px] w-[59%] rounded-full" />
          <Skeleton className="h-[339px] w-[39%] rounded-full" />
        </div>
      </>
    )
  }
  return (
<<<<<<< HEAD
    <>
      <div className="mx-auto w-full text-center">
        <h1 className="font-larken text-[38px] font-[400] leading-[60px] md:text-[52px]">
          Governance
        </h1>
=======
    <div>
      <div className="w-full mx-auto text-center">
        <h1 className="font-larken text-[52px] font-[400] leading-[60px]">Governance</h1>
>>>>>>> 965e1c5159ee462e48816b0c80b7b03476a43a74
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
