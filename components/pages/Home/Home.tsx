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
    <div className="dark:border-[#1A1A1A] relative flex w-full flex-wrap items-center justify-center rounded-[10px] border-[1px] from-[#25252566] dark:bg-gradient-to-br pt-[80px] md:pt-0 mt-[80px] md:mt-0">
      <div className="h-[100px] md:h-[160px] w-full md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Total Supply</div>
          <NumberFormat
            className='font-larken text-[32px] text-[#404040] dark:text-white'
            displayType="text"
            thousandSeparator
            value={0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] md:h-[160px] w-full md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Total Borrow</div>
          <NumberFormat
            className='font-larken text-[32px] text-[#404040] dark:text-white'
            displayType="text"
            thousandSeparator
            value={0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="hidden md:block gradient-border h-[1px] w-full"></div>
      <div className="h-[100px] md:h-[160px] w-full md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Your Supply</div>
          <NumberFormat
            className='font-larken text-[32px] text-[#404040] dark:text-white'
            displayType="text"
            thousandSeparator
            value={0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] md:h-[160px] w-full md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Your Borrow</div>
          <NumberFormat
            className='font-larken text-[32px] text-[#404040] dark:text-white'
            displayType="text"
            thousandSeparator
            value={0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="bottom-[12px] md:absolute w-full p-2 pt-[32px] md:pt-0 flex items-center justify-between">
        <div className="text-[#404040] dark:text-white space-y-1 leading-tight">
          <div className="text-[12px] text-[#959595]">Borrow Used</div>
          <NumberFormat
            className='font-larken text-[16px]'
            displayType="text"
            thousandSeparator
            value={0}
            decimalScale={2}
            fixedDecimalScale
            suffix={'%'}
          />
        </div>
        <div className="text-[#404040] dark:text-white space-y-1 text-right leading-tight">
          <div className="text-[12px] text-[#959595]">Borrow Max</div>
          <NumberFormat
            className='font-larken text-[16px]'
            displayType="text"
            thousandSeparator
            value={82}
            decimalScale={2}
            fixedDecimalScale
            suffix={'%'}
          />
        </div>
      </div>
      <div className="dark:bg-[#1F1F1F] bg-[#d7d7d7] h-2 w-full overflow-hidden rounded">
        <div
          style={{ width: '0%' }}
          className="from-[#C38BFF] to-[#AA5BFF] rounded-full bg-gradient-to-r h-full text-center text-white shadow-none"
        ></div>
      </div>
      <div className="z-100000 dark:bg-[#1A1A1A] top-[-80px] md:top-auto absolute h-[160px] w-[160px] rounded-full border-2 border-[#25252566] bg-white p-2">
        <div className="dark:bg-[#0D0D0D66] h-full w-full rounded-full border-4 border-[#C38BFF]">
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
            <div className="text-[#959595] text-[14px]">NET APY</div>
            <NumberFormat
              className='font-larken text-[32px] text-[#404040] dark:text-white'
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
  )
}
export default HomePageFilter
