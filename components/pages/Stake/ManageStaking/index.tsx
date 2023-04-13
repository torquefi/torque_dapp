import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { STAKING_DATA } from '../constant'
import StakingInfo from './StakingInfo'

export default function ManageStaking() {
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
    <div className="mt-[36px] font-larken">
      <div className="text-[24px]">Manage Staking</div>

      {dataStake.map((item) => (
        <StakingInfo stakeInfo={item} />
      ))}
    </div>
  )
}