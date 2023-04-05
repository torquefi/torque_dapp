import { useState } from 'react'
import { STAKING_POOLS } from '../constant'
import StakingPoolItem from './StakingPoolItem'

export default function StakingPool() {
  const [stakingPool, setStakingPool] = useState(STAKING_POOLS)

  return (
    <div className="mt-[24px] grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      {stakingPool.map((item: any, i) => (
        <StakingPoolItem coin={item} key={i} />
      ))}
    </div>
  )
}
