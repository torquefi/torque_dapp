import SkeletonDefault from '@/components/skeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Product() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])
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
              <Link href={item.path} className="">
                <a className="block overflow-hidden rounded-xl border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d]/40 to-[#252525]/40 transition-opacity duration-300 hover:opacity-80">
                  <img
                    className="h-[170px] w-full object-cover"
                    src={item.cover}
                    alt=""
                  />
                  <div className="space-y-[18px] p-[24px] xs:p-[36px]">
                    <div className="flex items-center justify-start">
                      <div className="flex h-[65px] w-[65px] items-center justify-center rounded-full border border-[#1A1A1A] bg-gradient-to-b from-[#232323] to-[#232323]/0">
                        <img className="w-[30px]" src={item.icon} alt="" />
                      </div>
                      <p className="ml-[24px] font-larken text-[26px]">
                        {item.name}
                      </p>
                    </div>
                    <p className="max-w-[390px] text-[#959595]">
                      {item.description}
                    </p>
                  </div>
                </a>
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
    icon: '/assets/overview-page/boost.svg',
    description:
      'A savings product that provides compound yield to users and bolsters liquidity of leading bridges.',
  },
  {
    name: 'Borrow',
    path: '/borrow',
    cover: '/assets/banners/borrow-sm.png',
    icon: '/assets/overview-page/borrow.svg',
    description:
      'Collateralize your portfolio and borrow up to 80% of its value so that you never have to sell your assets.',
  },
]
