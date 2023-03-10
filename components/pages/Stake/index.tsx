import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { FaAngleUp } from 'react-icons/fa'

export const StakePage = () => {
  const [dataStake, setDataStake] = useState(DATA_STAKE)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

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

      <div className="mt-10 font-larken">
        <div className="font-larken text-[32px]">
          {isLoading ? (
            <div className="">
              <SkeletonDefault height={'5vh'} width={'20%'} />
            </div>
          ) : (
            <div className="text-[24px]">Staking Pools</div>
          )}
        </div>

        <div className="mt-4 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
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
                      <div className="text-[24px] leading-[1.1]">
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
                      <div className="font-sans uppercase text-[#AA5BFF]">
                        get {item.label}
                      </div>
                    </div>
                  </div>
                  <div className="my-4 flex w-full items-center justify-center gap-4 ">
                    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-10">
                      <div className="text-[32px]">
                        {isLoading ? (
                          <div className="">
                            <SkeletonDefault height={'4vh'} width={'10vw'} />
                          </div>
                        ) : (
                          `$${Number(item.deposit).toFixed(2)}`
                        )}
                      </div>
                      <div className="font-sans text-[#959595]">Your Stake</div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-10">
                      <div className="text-[32px]">
                        {isLoading ? (
                          <div className="">
                            <SkeletonDefault height={'4vh'} width={'10vw'} />
                          </div>
                        ) : (
                          `$${Number(item.deposit).toFixed(2)}`
                        )}
                      </div>
                      <div className="font-sans text-[#959595]">
                        3-Year Value
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex w-full items-center justify-between font-sans text-[#959595]">
                    <div className="">Variable APY</div>
                    <div className="">{item.APY}%</div>
                  </div>
                  <button className="mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 font-sans uppercase hover:bg-gradient-to-t">
                    Deposit TORQ
                  </button>
                </div>
              )
          })}
        </div>
      </div>

      <div className="mt-10 font-larken">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'5vh'} width={'30%'} />
          </div>
        ) : (
          <div className="text-[24px]">Manage Staking</div>
        )}

        {dataStake.map((item) => {
          if (isLoading)
            return (
              <div className="">
                <SkeletonDefault height={'20vh'} width={'100%'} />
              </div>
            )
          else
            return (
              <div className="mt-4 grid w-full rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-4 xl:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="flex items-center gap-8">
                    <img
                      src={'/assets/t-logo-circle.svg'}
                      alt=""
                      className="w-[54px]"
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
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-[22px]">${item.deposited}</div>
                      <div className="font-sans text-[#959595]">Deposited</div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-[22px]">${item.earnings}</div>
                      <div className="font-sans text-[#959595]">Earnings</div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-[22px]">{item.APY}%</div>
                      <div className="font-sans text-[#959595]">
                        Variable APY
                      </div>
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
                  <div className="">
                    <img
                      src="/assets/pages/boost/chart.svg"
                      alt=""
                      className=""
                    />
                  </div>
                  <div className="mt-10">
                    <div className="text-[28px]">Withdraw TORQ</div>
                    <div className="mt-2 flex w-full items-center justify-between rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] px-2 py-4">
                      <input
                        type="number"
                        className="w-full bg-none px-2 font-sans focus:outline-none"
                        style={{ backgroundColor: 'transparent' }}
                        placeholder="Select amount"
                      />
                      <div className="flex items-center gap-2">
                        {[25, 50, 100].map((item: any) => (
                          <button className="rounded bg-[#1A1A1A] px-2 py-1 font-sans text-sm">
                            {item}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 font-sans text-[16px] uppercase transition-all duration-300 ease-linear hover:bg-gradient-to-t">
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
    name: 'Lampo',
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
