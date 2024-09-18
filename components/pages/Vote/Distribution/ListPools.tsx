import React from 'react'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import Popover from '@/components/common/Popover'

export const ListPools = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="mt-[20px]">
      <div className="max-w-[820px] mx-auto w-full rounded-[12px] border border-[1px] border-solid border-[#E6E6E6] dark:border-[#1a1a1a] bg-[#ffffff] dark:bg-transparent dark:bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 text-[#030303] dark:text-white text-center px-[24px] pt-[12px] pb-[6px]">
        <div className="flex items-center justify-between mt-1">
          <h2 className="font-rogan text-[24px]">Pools</h2>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`font-rogan-regular text-[#030303] dark:text-white mt-[8px] w-[200px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#0d0d0d]`}
            content="Earn Torque (TORQ) by providing liquidity across Torque pools."
          >
            <button>
              <img src="/assets/pages/vote/ic-info.svg" alt="info" className="w-4" />
            </button>
          </Popover>
        </div>
        <div className={`mt-4 hidden h-[1px] w-full md:block ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`}></div>
        {/* <div className="mx-auto w-full py-[58px]">
          <img
            src={
              theme === 'light'
                ? '/assets/pages/vote/genover/noproposal-white.png'
                : '/assets/pages/vote/genover/noproposal.png'
            }
            alt=""
            className="mx-auto w-full max-w-[84px]"
          />
          <h3 className="font-rogan mt-[12px] text-center text-[24px] font-[400] leading-[34px]">
            No pools yet
          </h3>
          <p className="mx-auto mt-[6px] w-full text-center text-[16px] font-[500] text-[#959595] max-w-[300px]">
            Official releases of Boost, Borrow, and Farm liquidity pools are coming soon.
          </p>
        </div> */}
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-rogan-regular w-[20%] pt-2 whitespace-nowrap text-left text-[12px] md:text-[16px] text-[#959595]">
                Name
              </th>
              <th className="font-rogan-regular w-[15%] pt-2 whitespace-nowrap text-left text-[12px] md:text-[16px] text-[#959595]">
                Ticker
              </th>
              <th className="w-[17%] whitespace-nowrap pt-2 text-left text-[12px] md:text-[16px] text-[#959595]">
                <div className="flex items-center gap-[4px] md:gap-[6px]">
                  <img
                    src="/assets/pages/vote/distribution/ic-torq.svg"
                    alt=""
                    className="h-[14px] md:h-[18px]"
                  />
                  <p>Daily Supply</p>
                </div>
              </th>
              <th className="w-[17%] whitespace-nowrap pt-2 text-left text-[12px] md:text-[16px] text-[#959595]">
                <div className="flex items-center gap-[4px] md:gap-[6px]">
                  <img
                    src="/assets/pages/vote/distribution/ic-torq.svg"
                    alt=""
                    className="h-[14px] md:h-[18px]"
                  />
                  <p>Daily Borrow</p>
                </div>
              </th>
              <th className="w-[17%] whitespace-nowrap pt-2 text-left text-[12px] md:text-[16px] text-[#959595]">
                <div className="flex items-center gap-[4px] md:gap-[6px]">
                  <img
                    src="/icons/coin/arb.png"
                    alt=""
                    className="h-[14px] md:h-[18px]"
                  />
                  <p>Daily Supply</p>
                </div>
              </th>
              <th className="w-[17%] whitespace-nowrap pt-2 text-left text-[12px] md:text-[16px] text-[#959595]">
                <div className="flex items-center gap-[4px] md:gap-[6px]">
                  <img
                    src="/icons/coin/arb.png"
                    alt=""
                    className="h-[14px] md:h-[18px]"
                  />
                  <p>Daily Borrow</p>
                </div>
              </th>
            </tr>
          </thead>
          {menu.map((item, i) => (
            <tbody key={i}>
              <tr className="relative ">
                <td className="text-left text-[12px] md:text-[16px]">
                  <div className="flex items-center justify-start gap-[8px] md:gap-[16px]">
                    <div className="relative mt-2">
                      <img src={item.imgMain} alt="" className="h-[36px]" />
                      <img
                        src={item.imgOld}
                        alt=""
                        className="absolute right-0 top-0 h-[16px] translate-x-[0%] translate-y-[95%]"
                      />
                    </div>
                    <p className="pt-2 ml-[-6px] text-[12px] md:text-[18px] font-rogan">{item.name}</p>
                  </div>
                </td>
                <td className="font-rogan text-left pt-2 text-[12px] md:text-[18px]">
                  {item.ticker}
                </td>
                <td className="font-rogan text-left pt-2 text-[12px] md:text-[18px]">
                  {item.dailySupply}
                </td>
                <td className="font-rogan text-left pt-2 text-[12px] md:text-[18px]">
                  {item.dailyBorrow}
                </td>
                <td className="font-rogan text-left pt-2 text-[12px] md:text-[18px]">
                  {item.dailySupplyArb}
                </td>
                <td className="font-rogan text-left pt-2 text-[12px] md:text-[18px]">
                  {item.dailyBorrowArb}
                </td>
                <div className={`absolute left-0 mt-[4px] hidden h-[1px] w-full md:block ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`}></div>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  )
}

const menu = [
  {
    imgMain: '/icons/coin/wbtc.png',
    imgOld: '/assets/pages/vote/distribution/ic-torq.svg',
    name: 'Boost',
    ticker: 'tBTC',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/aeth.png',
    imgOld: '/assets/pages/vote/distribution/ic-torq.svg',
    name: 'Boost',
    ticker: 'tETH',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/link.png',
    imgOld: '/assets/pages/vote/distribution/ic-torq.svg',
    name: 'Boost',
    ticker: 'tLINK',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/uni.png',
    imgOld: '/assets/pages/vote/distribution/ic-torq.svg',
    name: 'Boost',
    ticker: 'tUNI',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/comp.png',
    imgOld: '/assets/pages/vote/distribution/ic-torq.svg',
    name: 'Boost',
    ticker: 'tCOMP',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/torq.png',
    imgOld: '/assets/pages/vote/distribution/ic-torq.svg',
    name: 'Boost',
    ticker: 'tTORQ',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/wbtc.png',
    imgOld: '/icons/coin/usdc.png',
    name: 'Borrow',
    ticker: 'USDC',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/aeth.png',
    imgOld: '/icons/coin/usdc.png',
    name: 'Borrow',
    ticker: 'USDC',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/wbtc.png',
    imgOld: '/icons/coin/usdt.png',
    name: 'Borrow',
    ticker: 'USDT',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/aeth.png',
    imgOld: '/icons/coin/usdt.png',
    name: 'Borrow',
    ticker: 'USDT',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/wbtc.png',
    imgOld: '/icons/coin/tusd.svg',
    name: 'Borrow',
    ticker: 'TUSD',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
  {
    imgMain: '/icons/coin/aeth.png',
    imgOld: '/icons/coin/tusd.svg',
    name: 'Borrow',
    ticker: 'TUSD',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
    dailySupplyArb: '0.00',
    dailyBorrowArb: '0.00',
  },
]
