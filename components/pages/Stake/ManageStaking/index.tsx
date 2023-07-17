import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { STAKING_DATA } from '../constant'
import StakingInfo from './StakingInfo'

export default function ManageStaking({ isRefresh }: { isRefresh?: boolean }) {
  const [dataStake, setDataStake] = useState(STAKING_DATA)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setSkeletonLoading(false), 1000)
  }, [])

  if (isSkeletonLoading) {
    return (
      <>
        <div className="mt-[36px]">
          <SkeletonDefault height={'5vh'} width={'18%'} />
        </div>
        <div className="mt-[24px]">
          <SkeletonDefault height={'20vh'} width={'100%'} />
        </div>
      </>
    )
  }

  return (
    <div className="font-larken mt-[36px]">
      <div className="text-[24px] text-[#404040] dark:text-white">
        Manage Staking
      </div>

      {dataStake.map((item, index) => (
        <StakingInfo stakeInfo={item} isRefresh={isRefresh} key={index} />
      ))}
    </div>
  )
}
