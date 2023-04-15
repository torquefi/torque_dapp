import CurrencySwitch from '@/components/common/CurrencySwitch'
import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
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
        <div className="flex flex-col items-center justify-center space-y-10 rounded-xl border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 py-[24px]">
          <div className="flex h-[65px] w-[65px] items-center justify-center rounded-full border border-[#1A1A1A] bg-gradient-to-b from-[#232323] to-[#232323]/0">
            <img
              className="w-[40px]"
              src="/assets/overview-page/apy.svg"
              alt=""
            />
          </div>
          <div className="space-y-2">
            <p className="font-larken text-[28px]">
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
            className="bg-gradient-primary w-[140px] rounded-full py-[6px] font-mona uppercase transition-all duration-200 ease-linear hover:w-[154px]"
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
        <div className="flex flex-col items-center justify-center space-y-10 rounded-xl border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 py-[24px]">
          <div className="flex h-[65px] w-[65px] items-center justify-center rounded-full border border-[#1A1A1A] bg-gradient-to-b from-[#232323] to-[#232323]/0">
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
              className="w-full space-y-2 text-center font-larken text-[28px]"
              render={(value) => (
                <>
                  <p>{value}</p>
                  <p className="font-mona text-16 text-[#959595]">Rewards</p>
                </>
              )}
            />
          )}
          <button
            className="bg-gradient-primary w-[140px] rounded-full py-[6px] font-mona uppercase transition-all duration-200 ease-linear hover:w-[154px]"
            onClick={() => toast.message('Coming soon')}
          >
            Claim
          </button>
        </div>
      )}
    </div>
  )
}
