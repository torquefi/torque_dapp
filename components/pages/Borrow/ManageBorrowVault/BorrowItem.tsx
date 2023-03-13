import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'

enum Action {
  Repay = 'Repay',
  Withdraw = 'Withdraw',
}

export default function BorrowItem() {
  const [isExpand, setExpand] = useState(false)
  const [action, setAction] = useState(Action.Repay)

  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const summaryInfo = (
    <div className="flex w-full text-center md:w-[400px] lg:w-[500px]">
      <div className="w-1/4 space-y-1">
        <p className="whitespace-nowrap font-larken text-[22px]">
          {(12.1).toFixed(1)} BTC
        </p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">
          Collateral
        </p>
      </div>
      <div className="w-1/4 space-y-1">
        <p className="whitespace-nowrap font-larken text-[22px]">
          ${(168.4).toFixed(1)}k
        </p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">Borrowed</p>
      </div>
      <div className="w-1/4 space-y-1">
        <p className="whitespace-nowrap font-larken text-[22px]">
          {(59.36).toFixed(2)}%
        </p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">
          Loan-to-value
        </p>
      </div>
      <div className="w-1/4 space-y-1">
        <p className="whitespace-nowrap font-larken text-[22px]">
          {(-1.16).toFixed(2)}%
        </p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">Net APY</p>
      </div>
    </div>
  )
  if (isLoading)
    return (
      <div className="">
        <SkeletonDefault height={'10vh'} width={'100%'} />
      </div>
    )
  else
    return (
      <div className="rounded-xl border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0">
        <div className="flex items-center px-[24px] py-[16px]">
          <div className="flex w-[calc(100%-64px)] items-center space-x-2 md:w-[calc(100%-400px-64px)] lg:w-[calc(100%-500px-64px)]">
            <img className="w-[54px]" src="/icons/coin/btc.png" alt="" />
            <p className="font-larken text-[22px]">Lambo</p>
            <AiOutlineEdit className="text-[22px]" />
          </div>
          <div className="hidden md:block">{summaryInfo}</div>
          <div
            className="flex h-[64px] w-[64px] cursor-pointer select-none items-center justify-center rounded-full"
            onClick={() => setExpand(!isExpand)}
          >
            <img
              className={
                'w-[18px] transition-all' + ` ${isExpand ? 'rotate-180' : ''}`
              }
              src="/icons/arrow-down.svg"
              alt=""
            />
          </div>
        </div>
        <div
          className={
            'flex flex-wrap overflow-hidden px-[16px] transition-all duration-300 sm:px-[24px]' +
            ` ${
              isExpand
                ? 'max-h-[1000px] py-[16px] ease-in'
                : 'max-h-0 py-0 ease-out'
            }`
          }
        >
          <div className="w-full md:hidden">{summaryInfo}</div>
          <div className="h-[250px] w-full md:w-[40%] lg:w-[50%] xl:w-[55%]">
            <img
              src="/assets/pages/boost/chart.svg"
              alt=""
              className="w-full"
            />
          </div>
          <div className="w-full space-y-6 md:w-[60%] md:pl-[36px] lg:w-[50%] xl:w-[45%]">
            <div className="flex items-center justify-between">
              <p className="font-larken text-[24px]">{action} USDC</p>
              <div className="rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] via-[#161616]/40 to-[#0e0e0e]">
                {[Action.Repay, Action.Withdraw].map((item, i) => (
                  <button
                    className={
                      'w-[52px] py-[8px] text-[10px] leading-none xs:w-[80px] xs:text-[12px]' +
                      ` ${
                        action === item
                          ? 'rounded-md bg-[#171717]'
                          : 'text-[#959595]'
                      }`
                    }
                    onClick={() => setAction(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between rounded-xl border border-[#1A1A1A] bg-gradient-to-b from-[#161616] via-[#161616]/40 to-[#0e0e0e] p-[12px]">
              <NumericFormat
                className="w-[120px] bg-transparent"
                placeholder="Select amount"
              />
              <div className="flex select-none justify-between space-x-1 text-[12px] text-[#959595] sm:text-[14px]">
                {[25, 50, 100].map((percent, i) => (
                  <div
                    className="cursor-pointer rounded-md bg-[#171717] py-[2px] px-[6px] transition active:scale-95 xs:py-[4px] xs:px-[8px]"
                    key={i}
                  >
                    {percent}%
                  </div>
                ))}
              </div>
            </div>
            <button
              className="bg-gradient-primary w-full rounded-full py-[4px] uppercase"
              onClick={() => toast.message('Coming soon')}
            >
              {action}
            </button>
          </div>
        </div>
      </div>
    )
}
