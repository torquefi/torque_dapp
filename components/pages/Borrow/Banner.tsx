import SkeletonDefault from '@/components/skeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Banner() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])
  if (isLoading)
    return (
      <div className="">
        <SkeletonDefault height={'50vh'} width={'100%'} />
      </div>
    )
  else
    return (
      <div className="relative">
        <img
          className="rounded-xl"
          src="/assets/banners/borrow.png"
          alt="Torque Borrow"
        />
        <Link href="/overview">
          <a className="absolute top-[24px] left-[24px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#030303]">
            <img className="w-[12px]" src="/icons/arrow-left.svg" alt="" />
          </a>
        </Link>
      </div>
    )
}
