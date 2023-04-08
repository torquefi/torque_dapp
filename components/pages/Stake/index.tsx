import NumberFormat from '@/components/common/NumberFormat'
import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import SkeletonDefault from '@/components/skeleton'
import { floorFraction } from '@/lib/helpers/number'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Chart } from '@/components/common/Chart'
import Link from 'next/link'
import StakeDepositModal from './DepositModal'
import { STAKING_POOLS } from './constant'
import StakingPool from './StakingPool'
import ManageStaking from './ManageStaking'

export const StakePage = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="flex w-full items-center justify-center font-larken text-[32px]">
              0.00
            </div>
            <div className="text-[#959595]">TORQ Staked</div>
          </div>
        )}

        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">0.00%</div>
            <div className="text-[#959595]">Supply Staked</div>
          </div>
        )}

        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">0.00</div>
            <div className="text-[#959595]">TORQ LP Staked</div>
          </div>
        )}
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">0.00</div>
            <div className="text-[#959595]">TORQ Distributed</div>
          </div>
        )}
      </div>

      <div className="mt-[36px] font-larken">
        <div className="font-larken text-[32px]">
          {isLoading ? (
            <div className="">
              <SkeletonDefault height={'5vh'} width={'16%'} />
            </div>
          ) : (
            <div className="text-[24px]">Staking Pools</div>
          )}
        </div>

        <StakingPool />
      </div>
      <ManageStaking />
    </>
  )
}
