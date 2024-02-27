import SkeletonDefault from '@/components/skeleton'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import Popover from '@/components/common/Popover'
import axios from 'axios'

export const LeaderBoard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [topHolders, setTopHolders] = useState([])
  const theme = useSelector((store: AppStore) => store.theme.theme)

  const handleGetTopHolders = async () => {
    const network_id = '42161';
    const token_addr = '0xb56c29413af8778977093b9b4947efeea7136c36';

    const options = {
      url: `https://api.chainbase.online/v1/token/top-holders?chain_id=${network_id}&contract_address=${token_addr}&page=1&limit=10`,
      method: 'GET',
      headers: {
        'x-api-key': '2cwhwJRIxoua8s4vfXCYr8lCYYi',
        'accept': 'application/json'
      }
    };
    axios(options)
      .then((response: any) => setTopHolders(response?.data?.data || []))
      .catch((error: any) => console.log(error));
  }

  useEffect(() => {
    handleGetTopHolders()
  }, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="md:px-[24%]">
        <SkeletonDefault className="h-[430px] w-full rounded-xl" />
      </div>
    )
  }
  return (
    <div className="md:px-[24%]">
      <div className="w-full rounded-[12px] border border-[1px] border-solid border-[#E6E6E6] dark:border-[#1a1a1a] bg-[#ffffff] dark:bg-transparent dark:bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 text-[#030303] dark:text-white text-center px-[24px] py-[24px]">
        <div className="flex items-center justify-between">
          <h2 className="font-larken text-[24px] font-[400]">
            Leaderboard
          </h2>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`font-mona text-[#030303] dark:text-white mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#0d0d0d]`}
            content="Torque is governed by a global community of TORQ holders."
          >
            <button>
              <img src="/assets/pages/vote/ic-info.svg" alt="" />
            </button>
          </Popover>
        </div>
        <div className={`mt-4 hidden h-[1px] w-full md:block` + `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
        <div className="mx-auto w-full py-[58px]">
          <img
            src={
              theme === 'light'
                ? '/assets/pages/vote/genover/noproposal-white.png'
                : '/assets/pages/vote/genover/noproposal.png'
            }
            alt=""
            className="mx-auto w-full max-w-[84px]"
          />
          <h3 className="font-larken mt-[12px] text-center text-[24px] font-[400] leading-[34px]">
            Delegates not listed yet
          </h3>
          <p className="mx-auto mt-[6px] w-full text-center text-[16px] font-[500] max-w-[320px] text-[#959595]">
            The official release of Torque is coming soon. Follow our socials for updates.
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="whitespace-nowrap py-[16px] text-left text-[12px] font-[500] text-[#959595] md:w-[25%] md:text-[16px]">
                Position
              </th>
              <th className="whitespace-nowrap py-[16px] text-left text-[12px] font-[500] text-[#959595] md:w-[30%] md:text-[16px]">
                Delegate
              </th>
              <th className="whitespace-nowrap py-[16px] text-left text-[12px] font-[500] text-[#959595] md:w-[30%] md:text-[16px]">
                Vote Power
              </th>
              <th className="whitespace-nowrap py-[16px] text-left text-[12px] font-[500] text-[#959595] md:w-[25%] md:text-[16px]">
                Last Active
              </th>
            </tr>
          </thead>
          {menu.map((item, i) => (
            <tbody>
              <tr className="relative">
                <td className="py-[16px] text-left text-[12px] md:text-[16px]">
                  {item.position}
                </td>
                <td className="py-[16px] text-left text-[12px] md:text-[16px]">
                  <div className="flex items-center justify-start gap-[16px]">
                    <img
                      src={item.imgMain}
                      alt=""
                      className="h-[18px] md:h-[30px]"
                    />
                    <p>{item.name}</p>
                  </div>
                </td>
                <td className="py-[16px] text-left text-[12px] md:text-[16px]">
                  {item.dailySupply}
                </td>
                <td className="py-[16px] text-left text-[12px] md:text-[16px]">
                  {item.dailyBorrow}
                </td>
                <div className="gradient-border absolute left-0 h-[1px] w-full"></div>
              </tr>
            </tbody>
          ))}
        </table>
        <div className="mt-[18px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595]">
          view all
        </div>
      </div>
    </div>
  )
}

const menu = [
  {
    position: '#1',
    imgMain: '/assets/pages/vote/distribution/eth.png',
    name: '0x123..4567',
    ticker: 'tETH',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
  },
  {
    position: '#2',
    imgMain: '/assets/pages/vote/distribution/dollar.png',
    name: '0x123..4567',
    ticker: 'tUSD',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
  },
  {
    position: '#3',
    imgMain: '/assets/pages/vote/distribution/btc.png',
    name: '0x123..4567',
    ticker: 'btcUSD',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
  },
  {
    position: '#4',
    imgMain: '/assets/pages/vote/distribution/eth.png',
    name: '0x123..4567',
    ticker: 'ethUSD',
    dailySupply: '0.00',
    dailyBorrow: '0.00',
  },
]
