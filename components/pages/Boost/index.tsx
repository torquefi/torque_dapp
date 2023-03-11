import Popover from '@/components/common/Popover'
import SkeletonDefault from '@/components/skeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaAngleLeft, FaAngleUp } from 'react-icons/fa'

export const BoostPage = () => {
  const [dataBoostVault, setDataBoostVault] = useState(DATA_BOOST_VAULT)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const summaryInfor = (item: any) => {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{item.deposited}</div>
          <div className="font-sans text-[#959595]">Deposited</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{item.earnings}</div>
          <div className="font-sans text-[#959595]">Earnings</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{item.APY}</div>
          <div className="font-sans text-[#959595]">Variable APY</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="relative">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'50vh'} width={'100%'} />
          </div>
        ) : (
          <img src="/assets/pages/boost/banner.svg" alt="" className="" />
        )}
        <Link href="/overview">
          <a className="absolute top-[24px] left-[24px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#030303]">
            <img className="w-[12px]" src="/icons/arrow-left.svg" alt="" />
          </a>
        </Link>
      </div>
      <div className="mt-[36px] font-larken">
        {isLoading ? (
          <div className="mt-[24px]">
            <SkeletonDefault height={'5vh'} width={'30%'} />
          </div>
        ) : (
          <div className="text-[24px]">Create Boost Vault</div>
        )}

        <div className="mt-[24px] grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {BOOST_VAULTS.map((item: any) => {
            if (isLoading) {
              return (
                <div className="">
                  <SkeletonDefault height={'40vh'} width={'100%'} />
                </div>
              )
            } else
              return (
                <div className="rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] px-3 py-6 xl:px-8">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={`/icons/coin/${item.token.toLocaleLowerCase()}.svg`}
                        alt=""
                        className="w-20"
                      />
                      <div className="text-[24px] leading-[1.1]">
                        Deposit {item.token},<br className="" /> Earn{' '}
                        {item.token}
                      </div>
                    </div>
                    <Popover
                      trigger="hover"
                      placement="bottom-right"
                      className={`mt-[8px] w-[230px] bg-[#161616] text-center font-mona text-sm leading-tight`}
                      content="The projected TORQ rewards after 1 year of $1,000 supplied"
                    >
                      <Link href="#">
                        <a href="#" className="" target={'_blank'}>
                          <div className="flex items-center gap-2 rounded-full bg-[#AA5BFF] bg-opacity-20 p-1">
                            <img
                              src="/assets/t-logo-circle.svg"
                              alt=""
                              className="h-[32px] w-[32px]"
                            />

                            <div className="font-sans text-[#AA5BFF]">
                              +{item.bonus_TORQ} TORQ
                            </div>
                          </div>
                        </a>
                      </Link>
                    </Popover>
                  </div>
                  <div className="flex w-full items-center justify-center gap-4 ">
                    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-10">
                      <div className="text-[32px]">
                        ${Number(item.deposit).toFixed(2)}
                      </div>
                      <div className="font-sans text-[20px] text-[#959595]">
                        Deposit
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-10">
                      <div className="text-[32px]">
                        ${Number(item.deposit).toFixed(2)}
                      </div>
                      <div className="font-sans text-[20px] text-[#959595]">
                        3-Year Value
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between py-2 font-sans text-[16px] text-[#959595]">
                    <div className="">Yield provider</div>
                    <Link href="https://stargate.finance/">
                      <a
                        href="https://stargate.finance/"
                        className=""
                        target={'_blank'}
                      >
                        <img
                          src="/icons/coin/stargate.png"
                          alt="Stargate"
                          className=""
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="flex w-full items-center justify-between font-sans text-[16px] text-[#959595]">
                    <div className="">Variable APY</div>
                    <div className="">{item.APY}%</div>
                  </div>
                  <button className="mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 font-sans uppercase transition-all duration-300 ease-linear hover:bg-gradient-to-t">
                    Deposit and Earn
                  </button>
                </div>
              )
          })}
        </div>
      </div>

      <div className="mt-[36px] font-larken">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'5vh'} width={'30%'} />
          </div>
        ) : (
          <div className="text-[24px]">Manage Boost Vaults</div>
        )}

        {dataBoostVault.map((item) => {
          if (isLoading)
            return (
              <div className="mt-[24px]">
                <SkeletonDefault height={'20vh'} width={'100%'} />
              </div>
            )
          else
            return (
              <div className="mt-[24px] grid w-full rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-4 xl:p-8">
                <div className="grid w-full grid-cols-2">
                  <div className="flex items-center gap-8">
                    <img
                      src={`/icons/coin/${item?.token?.toLocaleLowerCase()}.svg`}
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
                  <div className="flex items-center justify-end">
                    <div className="hidden items-center justify-between gap-4 xl:flex">
                      {summaryInfor(item)}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <button
                        className=""
                        onClick={() => {
                          item.isOpen = !item.isOpen
                          setDataBoostVault([...dataBoostVault])
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
                  <div className="flex items-center justify-between gap-4 xl:hidden">
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
                    <div className="text-[28px]">Withdraw ETH</div>
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

const DATA_BOOST_VAULT = [
  {
    token: 'ETH',
    name: 'Vault #1',
    deposited: '10.6 ETH',
    earnings: '0.24 ETH',
    APY: '5.19%',
    isOpen: false,
  },
  {
    token: 'USDC',
    name: 'Vault #2',
    deposited: '$158.4k',
    earnings: '$14.2k',
    APY: '4.49%',
    isOpen: false,
  },
]

const BOOST_VAULTS = [
  {
    token: 'ETH',
    bonus_TORQ: 24,
    deposit: 0,
    threeYearValue: 0,
    APY: 5.19,
  },
  {
    token: 'USDC',
    bonus_TORQ: 36,
    deposit: 0,
    threeYearValue: 0,
    APY: 4.49,
  },
]
