import SkeletonDefault from '@/components/skeleton'
import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
export default function Product() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])
  const theme = useSelector((store: AppStore) => store.theme.theme)
  return (
    <div className="mt-[36px] space-y-[24px]">
      {isLoading ? (
        <div className="">
          <SkeletonDefault height={'5vh'} width={'10%'} />
        </div>
      ) : (
        <h3 className="font-larken text-[27px]">Products</h3>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((item, i) => {
          if (isLoading)
            return (
              <div className="">
                <SkeletonDefault height={'50vh'} width={'100%'} />
              </div>
            )
          else
            return (
              <Link
                href={item.path}
                className="block overflow-hidden rounded-xl border bg-[#FCFAFF] text-[#404040] transition-opacity duration-300  hover:opacity-80 dark:border-[#1A1A1A] dark:bg-[#1A1A1A] dark:text-white"
              >
                <img
                  className="h-[170px] w-full object-cover"
                  src={theme === 'light' ? item.coverLight : item.cover}
                  alt=""
                />
                <div className="space-y-[18px] p-[24px] xs:p-[36px]">
                  <div className="flex items-center justify-start">
                    <div className="flex h-[65px] w-[65px] items-center justify-center rounded-full border from-[#232323]  to-[#232323]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b">
                      <img className="w-[30px]" src={item.icon} alt="" />
                    </div>
                    <p className="font-larken ml-[24px] text-[26px]">
                      {item.name}
                    </p>
                  </div>
                  <p className="max-w-[390px] text-[#959595]">
                    {item.description}
                  </p>
                </div>
              </Link>
            )
        })}
      </div>
    </div>
  )
}

const products = [
  {
    name: 'Boost',
    path: '/boost',
    cover: '/assets/banners/boost-sm.png',
    coverLight: '/assets/banners/boost-light-small.png',
    icon: '/assets/overview-page/boost.svg',
    description:
      'A savings product that provides compound yield to users and bolsters liquidity of leading bridges.',
  },
  {
    name: 'Borrow',
    path: '/borrow',
    cover: '/assets/banners/borrow-sm.png',
    coverLight: '/assets/banners/borrow-light-small.png',
    icon: '/assets/overview-page/borrow.svg',
    description:
      'Collateralize your portfolio and borrow up to 80% of its value so that you never have to sell your assets.',
  },
]
