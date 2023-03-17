import CurrencySwitch from '@/components/common/CurrencySwitch'
import Popover from '@/components/common/Popover'
import SkeletonDefault from '@/components/skeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const BoostPage = () => {
  const [dataBoostVault, setDataBoostVault] = useState(DATA_BOOST_VAULT)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  const summaryInfor = (item: any) => {
    return (
      <>
        <div className="flex min-w-[100px] flex-col items-center justify-center gap-2">
          <CurrencySwitch
            tokenSymbol={item?.token}
            tokenValue={item.deposited}
            className="text-[22px]"
            decimalScale={1}
          />
          <div className="font-mona text-[14px] text-[#959595]">Deposited</div>
        </div>
        <div className="flex min-w-[100px] flex-col items-center justify-center gap-2">
          <CurrencySwitch
            tokenSymbol={item?.token}
            tokenValue={item.earnings}
            usdDefault
            className="text-[22px]"
            decimalScale={1}
          />
          <div className="font-mona text-[14px] text-[#959595]">Earnings</div>
        </div>
        <div className="flex min-w-[100px] flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{item.APY}</div>
          <div className="font-mona text-[14px] text-[#959595]">
            Variable APY
          </div>
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
          <img src="/assets/banners/boost.png" alt="Torque Boost" className="rounded-xl" />
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
            <SkeletonDefault height={'5vh'} width={'20%'} />
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
                <div className="rounded-[12px] border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 px-3 py-6 lg:px-8">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <img
                        src={`/icons/coin/${item.token.toLocaleLowerCase()}.svg`}
                        alt=""
                        className="w-16 xs:w-20 lg:w-24"
                      />
                      <div className="grow pb-2 font-larken text-[16px] leading-tight xs:text-[18px] lg:text-[26px]">
                        Deposit {item.token},<br className="" /> Earn{' '}
                        {item.token}
                      </div>
                    </div>
                    <Popover
                      trigger="hover"
                      placement="bottom-right"
                      className={`mt-[8px] w-[230px] bg-[#0d0d0d] text-center font-mona text-sm leading-tight`}
                      content="The projected TORQ rewards after 1 year of $1,000 supplied"
                    >
                      <Link href="#">
                        <a href="#" className="" target={'_blank'}>
                          <div className="flex items-center gap-2 rounded-full bg-[#AA5BFF] bg-opacity-20 p-1  text-[12px] xs:text-[14px]">
                            <img
                              src="/assets/t-logo-circle.svg"
                              alt=""
                              className="w-[24px] xs:w-[28px]"
                            />

                            <div className="mx-1 font-mona uppercase text-[#AA5BFF] xs:mx-2">
                              +{item.bonus_TORQ} TORQ
                            </div>
                          </div>
                        </a>
                      </Link>
                    </Popover>
                  </div>
                  <div className="flex items-center justify-center w-full gap-4 mt-4 ">
                    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0 py-6 lg:py-8">
                      <CurrencySwitch
                        tokenSymbol={item?.token}
                        tokenValue={item.deposit}
                        usdDefault
                        className="text-[32px]"
                        decimalScale={2}
                      />
                      <div className="font-mona text-[16px] text-[#959595] lg:text-[20px]">
                        Deposit
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0 py-6 lg:py-8">
                      <CurrencySwitch
                        tokenSymbol={item?.token}
                        tokenValue={item.deposit}
                        usdDefault
                        className="text-[32px]"
                        decimalScale={2}
                      />
                      <div className="font-mona text-[16px] text-[#959595] lg:text-[20px]">
                        3-Year Value
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between py-2 font-mona text-[16px] text-[#959595]">
                    <div className="font-mona">Yield provider</div>
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
                  <div className="flex w-full items-center justify-between font-mona text-[16px] text-[#959595]">
                    <div className="font-mona">Variable APY</div>
                    <div className="">{item.APY}%</div>
                  </div>
                  <button
                    className="mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 font-mona uppercase transition-all duration-300 ease-linear hover:bg-gradient-to-t"
                    onClick={() => toast.message('Coming soon')}
                  >
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
            <SkeletonDefault height={'5vh'} width={'20%'} />
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
              <div className="mt-[24px] grid w-full rounded-[12px] border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 px-[24px] py-[20px]">
                <div className="grid w-full grid-cols-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={`/icons/coin/${item?.token?.toLocaleLowerCase()}.svg`}
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
                    <div className="items-center justify-between hidden gap-14 lg:flex">
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
                    <div className="text-[28px]">Withdraw ETH</div>
                    <div className="mt-2 flex w-full items-center justify-between rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#0d0d0d] to-[#0d0d0d]/0 px-2 py-4">
                      <input
                        type="number"
                        className="w-full px-2 bg-none font-mona focus:outline-none"
                        style={{ backgroundColor: 'transparent' }}
                        placeholder="Select amount"
                      />
                      <div className="flex items-center gap-2">
                        {[25, 50, 100].map((item: any) => (
                          <button className="rounded bg-[#1A1A1A] px-2 py-1 font-mona text-sm text-[#959595]">
                            {item}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      className="mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 font-mona text-[16px] uppercase transition-all duration-300 ease-linear hover:bg-gradient-to-t"
                      onClick={() => toast.message('Coming soon')}
                    >
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
    deposited: 10.6,
    earnings: 0.24,
    APY: '5.19%',
    isOpen: false,
  },
  {
    token: 'USDC',
    name: 'Vault #2',
    deposited: 158130,
    earnings: 142271,
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
