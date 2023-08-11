import NumberFormat from '@/components/common/NumberFormat'
import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'

const HomePageFilter = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="">
        <SkeletonDefault height={'50vh'} width={'100%'} />
      </div>
    )
  }

  return (
    <div className="dark:border-[#1A1A1A] relative flex h-[400px] w-full flex-wrap items-center justify-center rounded-[10px] border-[1px] from-[#25252566] dark:bg-gradient-to-br">
      <div className="gradient-border flex h-[50%] w-full items-center">
        <div className="w-[50%]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
            <div className="text-[15px] text-[#959595]">Total Supply</div>
            <div className="font-larken flex w-full items-center justify-center text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={0}
                decimalScale={2}
                fixedDecimalScale
                prefix={'$'}
              />
            </div>
          </div>
        </div>
        <div className="w-[50%]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
            <div className="text-[15px] text-[#959595]">Total Borrow</div>
            <div className="font-larken flex w-full items-center justify-center text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={0}
                decimalScale={2}
                fixedDecimalScale
                prefix={'$'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex h-[50%] w-full flex-wrap items-center">
        <div className="flex w-full items-center">
          <div className="w-[50%]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
              <div className="text-[15px] text-[#959595]">Your Supply</div>
              <div className="font-larken flex w-full items-center justify-center text-[32px]">
                <NumberFormat
                  displayType="text"
                  thousandSeparator
                  value={0}
                  decimalScale={2}
                  fixedDecimalScale
                  prefix={'$'}
                />
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
              <div className="text-[15px] text-[#959595]">Your Borrow</div>
              <div className="font-larken flex w-full items-center justify-center text-[32px]">
                <NumberFormat
                  displayType="text"
                  thousandSeparator
                  value={0}
                  decimalScale={2}
                  fixedDecimalScale
                  prefix={'$'}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute  bottom-[-16px] w-full ">
          <div className=" flex items-center justify-between">
            <span className=" text-xs font-semibold text-teal-600">
              <div className="flex flex-col items-center gap-[1px] pb-2  pl-2   text-[#404040]   dark:text-white">
                <div className="text-[12px] text-[#959595]">Net APY</div>
                <div className="font-larken flex w-full items-center justify-center text-[16px]">
                  <NumberFormat
                    displayType="text"
                    thousandSeparator
                    value={0}
                    decimalScale={2}
                    fixedDecimalScale
                    suffix={'%'}
                  />
                </div>
              </div>
            </span>
            <div className="text-right">
              <span className=" text-xs font-semibold text-teal-600">
                <div className="flex flex-col items-center gap-[1px] pb-2  pr-2   text-[#404040]   dark:text-white">
                  <div className="text-[12px] text-[#959595]">Borrow Max</div>
                  <div className="font-larken flex w-full items-center justify-center text-[16px]">
                    <NumberFormat
                      displayType="text"
                      thousandSeparator
                      value={82}
                      decimalScale={2}
                      fixedDecimalScale
                      suffix={'%'}
                    />
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div className="dark:bg-[#1A1A1A] bg-[#d7d7d7] mb-4 flex h-2 overflow-hidden rounded text-xs">
            <div
              style={{ width: '70%' }}
              className="dark:bg-[#1F1F1F] bg-[#929292] flex flex-col justify-center whitespace-nowrap rounded-full text-center text-white shadow-none"
            ></div>
          </div>
        </div>
      </div>
      <div className="z-100000 dark:bg-[#1A1A1A]  absolute h-[160px] w-[160px] rounded-full border-2 border-[#25252566] p-2">
        <div className="dark:bg-[#0D0D0D66] bg-[#0D0D0D11] h-full w-full rounded-full border-2 border-[#C38BFF]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#404040]   dark:text-white">
            <div className="dark:text-[#959595] text-[14px]">NET APY</div>
            <div className="font-larken flex w-full items-center justify-center text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={0}
                decimalScale={2}
                fixedDecimalScale
                suffix={'%'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePageFilter
