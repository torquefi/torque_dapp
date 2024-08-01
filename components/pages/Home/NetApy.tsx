import CurrencySwitch from '@/components/common/CurrencySwitch'
import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function NetApy() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])
  return (
    <div className="grid gap-4 text-center leading-none xs:grid-cols-2">
      {isLoading ? (
        <div className="mt-1">
          <SkeletonDefault height={'50vh'} width={'100%'} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-10 rounded-xl border bg-white py-[24px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:to-[#0d0d0d]/0">
          <div className="flex h-[65px] w-[65px] items-center justify-center rounded-full border from-[#232323] to-[#232323]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b">
            <img
              className="w-[40px]"
              src="/assets/overview-page/apy.svg"
              alt=""
            />
          </div>
          <div className="space-y-2">
            <p className="font-rogan text-[32px] text-[#030303] dark:text-white">
              {isLoading ? (
                <div className="">
                  <SkeletonDefault height={'4vh'} width={'10vw'} />
                </div>
              ) : (
                `${(0).toFixed(2)}%`
              )}
            </p>
            <p className="text-[#959595]">Net APR</p>
          </div>
          <button
            className="bg-gradient-primary font-rogan-regular w-[140px] rounded-full py-[6px] uppercase transition-all duration-200 ease-linear hover:w-[154px]"
            onClick={() => toast.message('Coming soon')}
          >
            Manage
          </button>
        </div>
      )}
      {isLoading ? (
        <div className="mt-1">
          <SkeletonDefault height={'50vh'} width={'100%'} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-10 rounded-xl border bg-white py-[24px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:to-[#0d0d0d]/0">
          <div className="flex h-[65px] w-[65px] items-center justify-center rounded-full border from-[#232323] to-[#232323]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b">
            <img
              className="w-[40px]"
              src="/assets/overview-page/earnings.svg"
              alt=""
            />
          </div>
          {isLoading ? (
            <div className="">
              <SkeletonDefault height={'4vh'} width={'10vw'} />
            </div>
          ) : (
            <CurrencySwitch
              tokenSymbol="TORQ"
              tokenValue={0}
              usdDefault
              className="font-rogan w-full space-y-2 text-center text-[32px] text-[#030303] dark:text-white"
              render={(value) => (
                <div className="space-y-2">
                  <p>{value}</p>
                  <p className="font-rogan-regular text-16 text-[#959595]">Rewards</p>
                </div>
              )}
            />
          )}
          <button
            className="bg-gradient-primary font-rogan-regular w-[140px] rounded-full py-[6px] uppercase transition-all duration-200 ease-linear hover:w-[154px]"
            onClick={() => toast.message('Coming soon')}
          >
            Claim
          </button>
        </div>
      )}
    </div>
  )
}
