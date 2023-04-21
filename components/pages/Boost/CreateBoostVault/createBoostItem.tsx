import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import Popover from '@/components/common/Popover'
import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

export function CreateBoostItem({ item }: any) {
  const [boostVault, setBoostVault] = useState(item)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  return (
    <div
      className={
        `rounded-[12px] border border-[#E6E6E6]  px-3 py-6 text-[#000] dark:border-[#1A1A1A]  dark:text-[#fff] lg:px-8` +
        `  ${theme === 'light' ? ' bg-[#FCFAFF]' : 'bg-overview'}`
      }
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <img
            src={`/icons/coin/${item.token.toLocaleLowerCase()}.png`}
            alt=""
            className="w-16 xs:w-20 lg:w-24"
          />
          <div className="font-larken  grow pb-2 text-[22px] leading-tight xs:text-[18px] sm:text-[22px] lg:text-[26px]">
            Deposit {item.token},<br className="" /> Earn {item.token}
          </div>
        </div>
        <Popover
          trigger="hover"
          placement="bottom-right"
          className={`font-mona mt-[8px]  w-[230px] bg-[#fff] text-center text-sm leading-tight dark:bg-[#0d0d0d]`}
          content="The projected TORQ rewards after 1 year of $1,000 supplied"
        >
          <Link href="#" className="" target={'_blank'}>
            <div className="flex items-center rounded-full bg-[#AA5BFF] bg-opacity-20 p-1  text-[12px] xs:text-[14px]">
              <img
                src="/assets/t-logo-circle.svg"
                alt=""
                className="w-[24px] xs:w-[28px]"
              />

              <div className="font-mona mx-1 uppercase text-[#AA5BFF] xs:mx-2">
                +{item.bonus_TORQ} TORQ
              </div>
            </div>
          </Link>
        </Popover>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 ">
        <div className="flex h-[140px] w-full flex-col items-center justify-center gap-3 rounded-md border  from-[#161616]  to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b">
          <InputCurrencySwitch
            tokenSymbol={item?.token}
            tokenValue={Number(item.amount)}
            usdDefault
            className="w-full py-4 text-[#000] dark:text-[#fff] lg:py-6 "
            decimalScale={2}
            subtitle="Deposit"
            onChange={(e) => {
              item.amount = e
              setBoostVault({ ...boostVault })
            }}
          />
        </div>
        <div className="flex h-[140px] w-full flex-col items-center justify-center gap-3 rounded-md border  from-[#161616]  to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b">
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
      <div className="font-mona flex w-full items-center justify-between py-2 text-[16px] text-[#959595]">
        <div className="font-mona">Yield provider</div>
        <Link href="https://stargate.finance/" className="" target={'_blank'}>
          <img src="/icons/coin/stargate.png" alt="Stargate" className="" />
        </Link>
      </div>
      <div className="font-mona flex w-full items-center justify-between text-[16px] text-[#959595]">
        <div className="font-mona">Variable APR</div>
        <div className="">{item.APR}%</div>
      </div>
      <button
        className="font-mona mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-[#fff] transition-all duration-300 ease-linear hover:bg-gradient-to-t "
        onClick={() => toast.message('Coming soon')}
      >
        Deposit and Earn
      </button>
    </div>
  )
}
