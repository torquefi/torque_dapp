import CurrencySwitch from '@/components/common/CurrencySwitch'
import Popover from '@/components/common/Popover'
import SkeletonDefault from '@/components/skeleton'
import NumberFormat from '@/components/common/NumberFormat'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import classNames from 'classnames'
import { floorFraction } from '@/lib/helpers/number'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import { Chart } from '@/components/common/Chart'
import { ManageBoostVault } from './ManageBoostVault'
import { CreateBoostVault } from './CreateBoostVault'

export const BoostPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  return (
    <>
      <div className="relative">
        {isLoading ? (
          <>
            <div className="hidden lg:block">
              <SkeletonDefault height={'50vh'} width={'100%'} />
            </div>
            <div className="lg:hidden">
              <SkeletonDefault height={'15vh'} width={'100%'} />
            </div>
          </>
        ) : (
          <img
            src="/assets/banners/boost-compressed.png"
            alt="Torque Boost"
            className="w-full rounded-xl"
          />
        )}
        <Link
          href="/overview"
          className="absolute left-[24px] top-[24px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#030303]"
        >
          <img className="w-[12px]" src="/icons/arrow-left.svg" alt="" />
        </Link>
      </div>
      <CreateBoostVault />

      <ManageBoostVault />
    </>
  )
}
