import SkeletonDefault from '@/components/skeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CreateBoostVault } from './CreateBoostVault'
import { ManageBoostVault } from './ManageBoostVault'

export const BoostPage = () => {
  const [theme, setTheme] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  useEffect(() => {
    setTheme(
      typeof window !== 'undefined'
        ? window.localStorage.getItem('theme')
        : null
    )
  }, [typeof window !== 'undefined'])

  return (
    <div className="px-2">
      <div className="relative">
        {isLoading ? (
          <div>
            <div className="hidden lg:block">
              <SkeletonDefault height={'48vh'} width={'100%'} />
            </div>
            <div className="lg:hidden">
              <SkeletonDefault height={'15vh'} width={'100%'} />
            </div>
          </div>
        ) : (
          <img
            src={
              theme == 'light'
                ? '/assets/banners/boost-light-large.png'
                : '/assets/banners/boost-compressed.png'
            }
            alt="Torque Boost"
            className="w-full rounded-xl"
          />
        )}
        <Link
          href="/home"
          className="absolute left-[24px] top-[18px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#FCFAFF] dark:bg-[#030303] lg:top-[24px] lg:h-[48px] lg:w-[48px]"
        >
          <img
            className="w-[8px] lg:w-[12px]"
            src={
              theme === 'light'
                ? '/icons/arrow-left-dark.png'
                : '/icons/arrow-left.svg'
            }
            alt=""
          />
        </Link>
      </div>
      <CreateBoostVault />

      <ManageBoostVault />
    </div>
  )
}
