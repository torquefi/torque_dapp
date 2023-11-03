import { useState } from 'react'
import { STAKING_POOLS } from '../constant'
import StakingPoolItem from './StakingPoolItem'

export default function StakingPool({
  setIsRefresh,
}: {
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [stakingPool, setStakingPool] = useState(STAKING_POOLS)

  return (
    <div className="mt-[24px] grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      {stakingPool.map((item: any, i) => (
        <StakingPoolItem stakeInfo={item} key={i} setIsRefresh={setIsRefresh} />
      ))}
    </div>
  )
}
