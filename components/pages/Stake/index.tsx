import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { FaAngleUp } from 'react-icons/fa'

export const StakePage = () => {
  const [dataStake, setDataStake] = useState(DATA_STAKE)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const summaryInfor = (item: any) => {
    return (
      <>
        <div className="flex min-w-[100px] flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{Number(item.deposited).toFixed(2)}</div>
          <div className="text-[14px] text-[#959595]">Deposited</div>
        </div>
        <div className="flex min-w-[100px] flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{Number(item.earnings).toFixed(2)}</div>
          <div className="text-[14px] text-[#959595]">Earnings</div>
        </div>
        <div className="flex min-w-[100px] flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{item.APY}%</div>
          <div className="text-[14px] text-[#959595]">Net APY</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="flex w-full items-center justify-center font-larken text-[32px]">
              165.4m
            </div>
            <div className="text-[#959595]">TORQ Staked</div>
          </div>
        )}

        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">16.54%</div>
            <div className="text-[#959595]">Supply Staked</div>
          </div>
        )}

        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">28.6k</div>
            <div className="text-[#959595]">TORQ LP Staked</div>
          </div>
        )}
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">11.8m</div>
            <div className="text-[#959595]">TORQ Distributed</div>
          </div>
        )}
      </div>

      <div className="mt-[36px] font-larken">
        <div className="font-larken text-[32px]">
          {isLoading ? (
            <div className="">
              <SkeletonDefault height={'5vh'} width={'16%'} />
            </div>
          ) : (
            <div className="text-[24px]">Staking Pools</div>
          )}
        </div>

        <div className="mt-[24px] grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {STAKING_POOLS.map((item: any) => {
            if (isLoading)
              return (
                <div className="">
                  <SkeletonDefault height={'40vh'} width={'100%'} />
                </div>
              )
            else
              return (
                <div className="rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] px-8 py-6">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={`/assets/t-logo-circle.svg`}
                        alt=""
                        className="mr-2 w-[52px]"
                      />
                      <div className="text-[18px] leading-[1.1] lg:text-[24px]">
                        Deposit {item.label},
                        <br className="" /> Earn TORQ
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#AA5BFF] bg-opacity-20 p-2">
                      <img
                        src="/assets/t-logo-circle.svg"
                        alt=""
                        className="h-[32px] w-[32px]"
                      />
                      <div className="uppercase text-[#AA5BFF]">
                        get {item.label}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex w-full items-center justify-center gap-4 ">
                    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0 py-6 lg:py-8 ">
                      <div className="text-[32px]">
                        ${Number(item.deposit).toFixed(2)}
                      </div>
                      <div className="text-[#959595]">Your Stake</div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0 py-6 lg:py-8 ">
                      <div className="text-[32px]">
                        ${Number(item.deposit).toFixed(2)}
                      </div>
                      <div className="text-[#959595]">3-Year Value</div>
                    </div>
                  </div>
                  <div className="mt-2 flex w-full items-center justify-between text-[#959595]">
                    <div className="">Variable APY</div>
                    <div className="">{item.APY}%</div>
                  </div>
                  <button className="mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 font-mona uppercase hover:bg-gradient-to-t">
                    Deposit TORQ
                  </button>
                </div>
              )
          })}
        </div>
      </div>

      <div className="mt-[36px] font-larken">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'5vh'} width={'18%'} />
          </div>
        ) : (
          <div className="text-[24px]">Manage Staking</div>
        )}

        {dataStake.map((item) => {
          if (isLoading)
            return (
              <div className="mt-[24px]">
                <SkeletonDefault height={'20vh'} width={'100%'} />
              </div>
            )
          else
            return (
              <div className="mt-[24px] grid w-full rounded-[12px] border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 px-[24px] py-[20px]">
                <div className="grid w-full grid-cols-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={`assets/t-logo-circle.svg`}
                      alt=""
                      className="h-[54px] w-[54px] object-cover"
                    />
                    <div className="flex items-center gap-1 text-[22px]">
                      {item.name}
                      <button className="ml-2">
                        <img
                          src="/assets/pages/boost/edit.svg"
                          alt=""
                          className=""
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-14">
                    <div className="hidden items-center justify-between gap-14 lg:flex">
                      {summaryInfor(item)}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <button
                        className=""
                        onClick={() => {
                          item.isOpen = !item.isOpen
                          setDataStake([...dataStake])
                        }}
                      >
                        <img
                          className={
                            'w-[18px] transition-all' +
                            ` ${item.isOpen ? 'rotate-180' : ''}`
                          }
                          src="/icons/arrow-down.svg"
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={`grid grid-cols-1 gap-8 overflow-hidden transition-all duration-300 lg:grid-cols-2 ${
                    item.isOpen
                      ? 'max-h-[1000px] py-[16px] ease-in'
                      : 'max-h-0 py-0 opacity-0 ease-out'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 lg:hidden">
                    {summaryInfor(item)}
                  </div>
                  <div className="">
                    <img
                      src="/assets/pages/boost/chart.svg"
                      alt=""
                      className=""
                    />
                  </div>
                  <div className="mt-10">
                    <div className="text-[28px]">Withdraw TORQ</div>
                    <div className="mt-2 flex w-full items-center justify-between rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#0d0d0d] to-[#0d0d0d]/0 px-2 py-4">
                      <input
                        type="number"
                        className="w-full bg-none px-2 focus:outline-none"
                        style={{ backgroundColor: 'transparent' }}
                        placeholder="Select amount"
                      />
                      <div className="flex items-center gap-2">
                        {[25, 50, 100].map((item: any) => (
                          <button className="rounded bg-[#1A1A1A] px-2 py-1 text-sm">
                            {item}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[16px] uppercase transition-all duration-300 ease-linear hover:bg-gradient-to-t">
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            )
        })}
      </div>
    </>
  )
}

const DATA_STAKE = [
  {
    name: 'TORQ',
    deposited: 0.0,
    earnings: 0.0,
    APY: 24,
    isOpen: false,
  },
  {
    name: 'LP',
    deposited: 0.0,
    earnings: 0.0,
    APY: 56,
    isOpen: false,
  },
]

const STAKING_POOLS = [
  {
    label: 'TORQ',
    token: 'ETH',
    bonus_TORQ: 24,
    deposit: 100.8,
    threeYearValue: 195.3,
    APY: 5.19,
  },
  {
    label: 'LP',
    token: 'USDC',
    bonus_TORQ: 24,
    deposit: 0,
    threeYearValue: 0,
    APY: 4.49,
  },
]
