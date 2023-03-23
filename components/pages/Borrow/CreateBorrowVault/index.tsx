import NumberFormat from '@/components/common/NumberFormat'
import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import Popover from '@/components/common/Popover'
import SkeletonDefault from '@/components/skeleton'
import { floorFraction } from '@/lib/helpers/number'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function CreateBorrowVault() {
  const [isLoading, setIsLoading] = useState(true)
  const [dataBorrow, setDataBorrow] = useState(fakeBorrow)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const price: any = {
    eth: 1780,
    btc: 28000,
    usdc: 1,
  }
  return (
    <div className="space-y-[24px]">
      {isLoading ? (
        <div className="">
          <SkeletonDefault height={'5vh'} width={'20%'} />
        </div>
      ) : (
        <h3 className="font-larken text-[24px]">Create Borrow Vault</h3>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {fakeBorrow.map((item, i) => {
          if (isLoading)
            return (
              <div className="">
                <SkeletonDefault height={'50vh'} width={'100%'} />
              </div>
            )
          else
            return (
              <div
                className="space-y-4 rounded-xl border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 px-[16px] py-[24px] xl:px-[32px]"
                key={i}
              >
                <div className="flex items-center">
                  <img
                    className="w-16 xs:w-20 lg:w-24"
                    src={item.coinIcon}
                    alt=""
                  />
                  <div className="grow pb-2 font-larken text-[16px] leading-tight xs:text-[18px] lg:text-[26px]">
                    Deposit {item.depositCoin},<br /> Borrow {item.borrowCoin}
                  </div>
                  <Popover
                    trigger="hover"
                    placement="bottom-right"
                    className={`mt-[8px] w-[230px] bg-[#161616] text-center text-sm leading-tight`}
                    content="The projected TORQ rewards after 1 year of $1,000 borrowed"
                  >
                    <Link href="#">
                      <a href="#" className="" target={'_blank'}>
                        <div className="flex items-center rounded-full bg-[#AA5BFF] bg-opacity-20 p-1 text-[12px] xs:text-[14px]">
                          <img
                            src="/assets/t-logo-circle.svg"
                            alt=""
                            className="w-[24px] xs:w-[28px]"
                          />
                          <p className="mx-1 text-[#AA5BFF] xs:mx-2">
                            +{item.getTORQ} TORQ
                          </p>
                        </div>
                      </a>
                    </Link>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex h-[140px] flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#161616] to-[#161616]/40 font-larken">
                    <InputCurrencySwitch
                      tokenSymbol={item?.depositCoin}
                      tokenValue={Number(item.amount)}
                      usdDefault
                      className="w-full space-y-3 py-4 font-larken lg:py-7"
                      decimalScale={2}
                      subtitle="Collateral"
                      onChange={(e) => {
                        item.amount = e
                        setDataBorrow([...dataBorrow])
                      }}
                    />
                  </div>
                  <div className="rounded-xl bg-gradient-to-b from-[#161616] to-[#161616]/40">
                    <CurrencySwitch
                      tokenSymbol={item?.borrowCoin}
                      tokenValue={
                        (item.amount *
                          price[item?.depositCoin.toLocaleLowerCase()]) /
                        2
                      }
                      usdDefault
                      className="flex h-[140px] w-full flex-col items-center justify-center font-larken text-[28px]"
                      render={(value) => (
                        <>
                          <p>{value}</p>
                          <p className="mt-[12px] font-mona text-16 text-[#959595]">
                            Borrowing
                          </p>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[#959595]">
                  <p>Loan provider</p>
                  <Link href="https://compound.finance/">
                    <a
                      href="https://compound.finance/"
                      className=""
                      target={'_blank'}
                    >
                      <img
                        className="my-[-6px] w-[32px]"
                        src="/icons/coin/comp.png"
                        alt=""
                      />
                    </a>
                  </Link>
                </div>
                <div className="flex justify-between text-[#959595]">
                  <p>Loan-to-value</p>
                  <p>
                    {'<'}
                    {item.loanToValue}%
                  </p>
                </div>
                <div className="flex justify-between text-[#959595]">
                  <p>Variable APY</p>
                  <p>-1.16%</p>
                </div>
                <div className="flex justify-between text-[#959595]">
                  <p>Liquidity</p>
                  <p>$187.2m</p>
                </div>
                <button
                  className="bg-gradient-primary w-full rounded-full py-[4px] font-mona uppercase"
                  onClick={() => toast.message('Coming soon')}
                >
                  Deposit and Borrow
                </button>
              </div>
            )
        })}
      </div>
    </div>
  )
}

const fakeBorrow = [
  {
    coinIcon: '/icons/coin/btc.png',
    depositCoin: 'BTC',
    borrowCoin: 'USDC',
    loanToValue: 70,
    getTORQ: 28,
    amount: 0,
  },
  {
    coinIcon: '/icons/coin/eth.png',
    depositCoin: 'ETH',
    borrowCoin: 'USDC',
    loanToValue: 83,
    getTORQ: 32,
    amount: 0,
  },
]
