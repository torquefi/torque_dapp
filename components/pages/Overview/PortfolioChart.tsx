import { Chart } from '@/components/common/Chart'
import SkeletonDefault from '@/components/skeleton'
import { AppStore } from '@/types/store'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'

export default function PortfolioChart() {
  const [isLoading, setIsLoading] = useState(true)
  const theme = useSelector((store: AppStore) => store.theme.theme)
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
      <div className="relative rounded-xl border from-[#0d0d0d] to-[#0d0d0d]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-br ">
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
        <img
          src={
            theme === 'light'
              ? '/assets/overview-page/chart-light.png'
              : '/assets/overview-page/chart.png'
          }
          alt=""
        />
        <div className="">{/* <Chart /> */}</div>
      </div>
    )
}
