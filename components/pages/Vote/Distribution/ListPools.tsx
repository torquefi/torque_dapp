import React from 'react'

export const ListPools = () => {
  return (
    <div className="mt-[24px]">
      <div className="rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[38px] py-[15px]">
        <div className="flex items-center justify-between">
          <h2 className="font-larken">Pools</h2>
          <button>
            <img src="/assets/pages/vote/ic-info.svg" alt="" />
          </button>
        </div>
        <div className="gradient-border mt-[10px] hidden h-[1px] w-full md:block"></div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-[25%] whitespace-nowrap py-[16px] text-left text-[12px] md:text-[16px]">
                Name
              </th>
              <th className="w-[25%] whitespace-nowrap py-[16px] text-left text-[12px] md:text-[16px]">
                Ticker
              </th>
              <th className="w-[25%] whitespace-nowrap py-[16px] text-left text-[12px] md:text-[16px]">
                <div className="flex items-center gap-[4px] md:gap-[9px]">
                  <img
                    src="/assets/pages/vote/distribution/ic-torq.svg"
                    alt=""
                    className="h-[14px] md:h-[18px]"
                  />
                  <p>Daily Supply</p>
                </div>
              </th>
              <th className="w-[25%] whitespace-nowrap py-[16px] text-left text-[12px] md:text-[16px]">
                <div className="flex items-center gap-[4px] md:gap-[9px]">
                  <img
                    src="/assets/pages/vote/distribution/ic-torq.svg"
                    alt=""
                    className="h-[14px] md:h-[18px]"
                  />
                  <p>Daily Borrow</p>
                </div>
              </th>
            </tr>
          </thead>
          {menu.map((item, i) => (
            <tbody>
              <tr className="relative">
                <td className="py-[16px] text-left text-[12px] md:text-[16px]">
                  <div className="flex items-center justify-start gap-[8px] md:gap-[16px]">
                    <div className="relative">
                      <img src={item.imgMain} alt="" className="h-[30px]" />
                      <img
                        src={item.imgOld}
                        alt=""
                        className="absolute right-0 top-0 h-[15px] translate-x-[13%] translate-y-[95%]"
                      />
                    </div>
                    <p>{item.name}</p>
                  </div>
                </td>
                <td className="py-[16px] text-left text-[12px] md:text-[16px]">
                  {item.ticker}
                </td>
                <td className="py-[16px] text-left text-[12px] md:text-[16px]">
                  {item.dailySupply}
                </td>
                <td className="py-[16px] text-left text-[12px] md:text-[16px]">
                  {item.dailyBorrow}
                </td>
                <div className="gradient-border absolute left-0 mt-[10px] hidden h-[1px] w-full md:block"></div>
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
    imgMain: '/assets/pages/vote/distribution/eth.png',
    imgOld: '/assets/pages/vote/distribution/ic-torq.svg',
    name: 'Boost',
    ticker: 'tETH',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
  },
  {
    imgMain: '/assets/pages/vote/distribution/dollar.png',
    imgOld: '/assets/pages/vote/distribution/ic-torq.svg',
    name: 'Boost',
    ticker: 'tUSD',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
  },
  {
    imgMain: '/assets/pages/vote/distribution/btc.png',
    imgOld: '/assets/pages/vote/distribution/dollar.png',
    name: 'Borrow',
    ticker: 'btcUSD',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
  },
  {
    imgMain: '/assets/pages/vote/distribution/eth.png',
    imgOld: '/assets/pages/vote/distribution/dollar.png',
    name: 'Borrow',
    ticker: 'ethUSD',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
  },
]