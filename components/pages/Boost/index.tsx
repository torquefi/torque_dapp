import CurrencySwitch from '@/components/common/CurrencySwitch'
import Popover from '@/components/common/Popover'
import SkeletonDefault from '@/components/skeleton'
import NumberFormat from '@/components/common/NumberFormat'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import classNames from 'classnames'
import { floorFraction } from '@/lib/helpers/number'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import { Chart } from '@/components/common/Chart'
import { ManageBoostVault } from './ManageBoostVault'

export const BoostPage = () => {
  const [dataBoostVault, setDataBoostVault] = useState(DATA_BOOST_VAULT)
  const [boostVault, setBoostVault] = useState(BOOST_VAULTS)
  const [amount, setAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  return (
    <>
      <div className="relative">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'50vh'} width={'100%'} />
          </div>
        ) : (
          <img
            src="/assets/banners/boost-compressed.png"
            alt="Torque Boost"
            className="rounded-xl"
          />
        )}
        <Link
          href="/overview"
          className="absolute left-[24px] top-[24px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#030303]"
        >
          <img className="w-[12px]" src="/icons/arrow-left.svg" alt="" />
        </Link>
      </div>
      <div className="mt-[36px] font-larken">
        {isLoading ? (
          <div className="mt-[24px]">
            <SkeletonDefault height={40} width={'200px'} />
          </div>
        ) : (
          <div className="text-[24px]">Create Boost Vault</div>
        )}

        <div className="mt-[24px] grid gap-4 md:grid-cols-2">
          {boostVault.map((item: any) => {
            if (isLoading) {
              return (
                <div className="">
                  <SkeletonDefault height={'40vh'} width={'100%'} />
                </div>
              )
            } else
              return (
                <div className="rounded-[12px] border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 px-3 py-6 lg:px-8">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={`/icons/coin/${item.token.toLocaleLowerCase()}.png`}
                        alt=""
                        className="w-16 xs:w-20 lg:w-24"
                      />
                      <div className="grow pb-2 font-larken text-[22px] leading-tight xs:text-[18px] sm:text-[22px] lg:text-[26px]">
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
                      <Link href="#" className="" target={'_blank'}>
                        <div className="flex items-center rounded-full bg-[#AA5BFF] bg-opacity-20 p-1  text-[12px] xs:text-[14px]">
                          <img
                            src="/assets/t-logo-circle.svg"
                            alt=""
                            className="w-[24px] xs:w-[28px]"
                          />

                          <div className="mx-1 font-mona uppercase text-[#AA5BFF] xs:mx-2">
                            +{item.bonus_TORQ} TORQ
                          </div>
                        </div>
                      </Link>
                    </Popover>
                  </div>
                  <div className="mt-4 flex w-full items-center justify-center gap-4 ">
                    <div className="flex h-[140px] w-1/2 flex-col items-center justify-center gap-3 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0">
                      <InputCurrencySwitch
                        tokenSymbol={item?.token}
                        tokenValue={Number(item.amount)}
                        usdDefault
                        className="w-full py-4 lg:py-6"
                        decimalScale={2}
                        subtitle="Deposit"
                        onChange={(e) => {
                          item.amount = e
                          setBoostVault([...boostVault])
                        }}
                      />
                    </div>
                    <div className="flex h-[140px] w-[50%] flex-col items-center justify-center rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0">
                      <CurrencySwitch
                        tokenSymbol={item?.token}
                        tokenValue={Number(item.amount || 0) * (item.rate || 0)}
                        usdDefault
                        className="w-full space-y-2 py-6 py-[23px] lg:py-[31px]"
                        decimalScale={2}
                        render={(value) => (
                          <>
                            <p className="text-[32px] leading-none">{value}</p>
                            <div className="font-mona text-[16px] text-[#959595]">
                              3-Year Value
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between py-2 font-mona text-[16px] text-[#959595]">
                    <div className="font-mona">Yield provider</div>
                    <Link
                      href="https://stargate.finance/"
                      className=""
                      target={'_blank'}
                    >
                      <img
                        src="/icons/coin/stargate.png"
                        alt="Stargate"
                        className=""
                      />
                    </Link>
                  </div>
                  <div className="flex w-full items-center justify-between font-mona text-[16px] text-[#959595]">
                    <div className="font-mona">Variable APR</div>
                    <div className="">{item.APR}%</div>
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

      <ManageBoostVault />
    </>
  )
}

const DATA_BOOST_VAULT = [
  {
    token: 'ETH',
    name: 'Vault #1',
    deposited: 10.6,
    earnings: 0.24,
    APR: '5.19%',
    isOpen: false,
    amount: 0,
    data_key: 'name_boost_vault_1',
  },
  {
    token: 'USDC',
    name: 'Vault #2',
    deposited: 158130,
    earnings: 142271,
    APR: '4.49%',
    isOpen: false,
    amount: 0,
    data_key: 'name_boost_vault_2',
  },
]

const BOOST_VAULTS = [
  {
    token: 'ETH',
    bonus_TORQ: 24,
    deposit: 0,
    threeYearValue: 0,
    APR: 5.19,
    rate: 1.16391500742,
    amount: 0,
  },
  {
    token: 'USDC',
    bonus_TORQ: 36,
    deposit: 0,
    threeYearValue: 0,
    APR: 4.49,
    rate: 1.14082698313,
    amount: 0,
  },
]
