import { Chart } from '@/components/common/Chart'
import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'

export default function PortfolioChart() {
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
      <div className="relative rounded-xl border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 pt-[100px]">
        <div className="absolute left-[24px] top-[24px] space-y-2">
          <p className="text-[14px] text-[#959595]">Portfolio</p>
          <p className="font-larken text-[28px]">
            {isLoading ? (
              <div className="">
                <SkeletonDefault height={'4vh'} width={'10vw'} />
              </div>
            ) : (
              `$${(0).toFixed(2)}`
            )}
          </p>
        </div>
        <Chart />
      </div>
    )
}
