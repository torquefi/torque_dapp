import SkeletonDefault from '@/components/skeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import UniSwapModal from '@/components/common/Modal/UniswapModal'
import HoverIndicator from '@/components/common/HoverIndicator'

export default function Product() {
  const [isLoading, setIsLoading] = useState(true)
  const [openUniSwapModal, setOpenUniSwapModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  return (
    <div className="mt-[24px]">
      <UniSwapModal
        open={openUniSwapModal}
        handleClose={() => setOpenUniSwapModal(false)}
      />
      {isLoading ? (
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <SkeletonDefault height={'34px'} width={'100px'} />
          </div>
          <div className="flex space-x-2">
            <SkeletonDefault height={'34px'} width={'34px'} />
            <SkeletonDefault height={'36px'} width={'76px'} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-rogan text-[28px] text-[#030303] dark:text-white">
            Products
          </h3>
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setOpenUniSwapModal(true)}
              className="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[4px] border-[1px] border-[#E6E6E6] focus:outline-none dark:border-[#1a1a1a]"
            >
              <img
                src="/icons/swap-gray.svg"
                alt="Swap Icon"
                className="w-[22px] text-[#959595]"
              />
            </button>
            <div className="flex h-[36px] w-auto items-center justify-center rounded-[4px] border border-[#efefef] bg-transparent px-[3px] py-[4px] dark:border-[#1a1a1a]">
              <HoverIndicator
                activeIndex={viewMode === 'row' ? 0 : 1}
                className="flex justify-between w-full"
              >
                <button
                  id="rowViewButton"
                  className="focus:outline-none"
                  onClick={() => setViewMode('row')}
                >
                  <img
                    src="/icons/rows.svg"
                    alt="Row View"
                    className={`ml-[6px] mr-[6px] h-6 w-6 ${viewMode === 'row' ? 'text-[#030303]' : 'text-[#959595]'
                      } dark:text-white`}
                  />
                </button>
                <button
                  id="gridViewButton"
                  className="focus:outline-none"
                  onClick={() => setViewMode('grid')}
                >
                  <img
                    src="/icons/grid.svg"
                    alt="Grid View"
                    className={`ml-[6px] mr-[6px] h-6 w-6 ${viewMode === 'grid' ? 'text-[#030303]' : 'text-[#959595]'
                      } dark:text-white`}
                  />
                </button>
              </HoverIndicator>
            </div>
          </div>
        </div>
      )}
      <div
        className={`transition-all duration-200 ease-in-out ${viewMode === 'grid' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'
          }`}
      >
        <div className="grid gap-4 md:grid-cols-4">
          {products.map((item, i) =>
            isLoading ? (
              <div key={i}>
                <SkeletonDefault height={'12vh'} width={'100%'} />
              </div>
            ) : (
              <Link
                href={item.path}
                key={i}
                className={`relative block overflow-hidden rounded-xl border text-[#030303] 
                dark:border-[#1A1A1A] dark:text-white transition-transform duration-200 group hover:scale-105`}
              >
                <div
                  className={`absolute inset-0 pointer-events-none`}
                  aria-hidden="true"
                >
                  <span
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 h-[4px] w-[100%] bg-gradient-to-r from-[#C38BFF] to-[#AA5BFF] scale-x-0 
                  transition-transform duration-200 group-hover:scale-x-100 origin-center"
                  ></span>
                  <span
                    className="absolute top-[4px] left-1/2 transform -translate-x-1/2 h-[8px] w-[100%] bg-gradient-to-r from-[#C38BFF] to-[#AA5BFF] blur-lg opacity-0 
                  transition-opacity duration-200 group-hover:opacity-40"
                  ></span>
                </div>
                <div className="pl-[18px] pt-[15px] pb-[15px] pr-[16px]">
                  <div className="flex items-center justify-start">
                    <div
                      className={`flex w-[56px] h-[56px] py-3 px-3 items-center justify-center rounded-full border 
                        from-[#232323] to-[#232323]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b`}
                    >
                      <img
                        className={`${
                          item.name === 'Bridge' || item.name === 'Import'
                            ? 'w-[30px] h-[30px]' // Adjusted size for Bridge and Import
                            : 'w-[26px] h-[26px]' // Default size for others
                        }`}
                        src={item.icon}
                        alt={`${item.name} Icon`}
                      />
                    </div>
                    <p className="font-rogan ml-[10px] text-[26px]">{item.name}</p>
                  </div>
                  {/* <p className="text-[#959595] text-[17px] line-clamp-1 md:line-clamp-none">{item.description}</p> */}
                </div>
              </Link>
            )
          )}
        </div>
      </div>
      <div
        className={`transition-all duration-200 ease-in-out ${viewMode === 'row' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'
          }`}
      >
        <div className="flex flex-col">
          {products.map((item, i) =>
            isLoading ? (
              <div key={i}>
                <SkeletonDefault height={'50vh'} width={'100%'} />
              </div>
            ) : (
              <Link
                href={item.path}
                key={i}
                className="relative flex items-center overflow-hidden p-4 border mb-4 rounded-xl dark:border-[#1A1A1A] group transition-transform duration-200 hover:scale-[103%]"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                >
                  <span
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 h-[4px] w-[100%] bg-gradient-to-r from-[#C38BFF] to-[#AA5BFF] scale-x-0 
                  transition-transform duration-200 group-hover:scale-x-100 origin-center"
                  ></span>
                  <span
                    className="absolute top-[4px] left-1/2 transform -translate-x-1/2 h-[8px] w-[100%] bg-gradient-to-r from-[#C38BFF] to-[#AA5BFF] blur-lg opacity-0 
                  transition-opacity duration-200 group-hover:opacity-40"
                  ></span>
                </div>
                <div className="flex w-auto h-auto py-3 px-3 mr-4 items-center justify-center rounded-full border 
                    from-[#232323] to-[#232323]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b">
                  <img
                    className={`${
                      item.name === 'Bridge' || item.name === 'Import'
                        ? 'w-[30px] h-[30px]'
                        : 'w-[26px] h-[26px]'
                    }`}
                    src={item.icon}
                    alt={`${item.name} Icon`}
                  />
                </div>
                <div>
                  <p className="font-rogan text-[26px] text-[#030303] dark:text-white">
                    {item.name}
                  </p>
                  {/* <p className="text-[#959595] text-[17px] line-clamp-1 md:line-clamp-none">{item.description}</p> */}
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const products = [
  {
    name: 'Boost',
    path: '/boost',
    icon: '/assets/overview-page/boost.svg',
    description:
      'Earn daily compound yield by providing onchain liquidity.',
  },
  {
    name: 'Borrow',
    path: '/borrow',
    icon: '/assets/overview-page/borrow.svg',
    description:
      'Unlock stored energy in your portfolio through leverage.',
  },
  {
    name: 'Bridge',
    path: '/bridge',
    icon: '/assets/overview-page/earnings.svg',
    description:
      'Transport OFT assets across blockchains in an instant.',
  },
  {
    name: 'Import',
    path: '/import',
    icon: '/icons/import.svg',
    description:
      'Migrate loan positions from major money markets.',
  },
]
