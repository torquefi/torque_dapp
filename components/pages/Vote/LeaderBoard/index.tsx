import SkeletonDefault from '@/components/skeleton'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import Popover from '@/components/common/Popover'
import axiosInstance from '@/configs/axios.config'
import { NumericFormat } from 'react-number-format'
import { shortenAddress } from '@/lib/helpers/utils'
import Link from 'next/link'
import axios from 'axios'
import { toMetricUnits } from '@/lib/helpers/number'

export const LeaderBoard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [topHolders, setTopHolders] = useState([])
  const [topHoldersX, setTopHoldersX] = useState([])
  const theme = useSelector((store: AppStore) => store.theme.theme)

  const handleGetTopHolders = async () => {
    try {
      const response = await axiosInstance.get('/api/vote/top-torq-holder')
      console.log('response :>> ', response)
      setTopHolders(response?.data?.data || [])

      const network_id = '42161'
      const token_addr = '0xb56c29413af8778977093b9b4947efeea7136c36'

      // const options = {
      //   url: `https://api.chainbase.online/v1/token/top-holders?chain_id=${network_id}&contract_address=${token_addr}&page=1&limit=13`,
      //   method: 'GET',
      //   headers: {
      //     'x-api-key': '2cwhwJRIxoua8s4vfXCYr8lCYYi',
      //     'accept': 'application/json'
      //   }
      // };
      // axios(options)
      //   .then((response: any) => setTopHoldersX((response?.data?.data || [])?.slice(3, 13)))
      //   .catch((error: any) => console.log(error));
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  useEffect(() => {
    handleGetTopHolders()
  }, [])

  console.log('topHolders :>> ', topHolders)
  console.log('topHoldersX :>> ', topHoldersX)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="m-auto w-full max-w-[800px] pt-[20px]">
        <SkeletonDefault className="h-[430px] w-full rounded-xl" />
      </div>
    )
  }
  return (
    <div className="m-auto w-full max-w-[800px] pt-[20px]">
      <div className="w-full rounded-[12px] border border-[1px] border-solid border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 px-[24px] pb-[12px] pt-[16px] text-center text-[#030303] dark:border-[#1a1a1a] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
        <div className="flex items-center justify-between">
          <h2 className="font-rogan text-[24px] font-[400]">Leaderboard</h2>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`font-rogan-regular mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
            content="Torque is governed by a global community of TORQ holders."
          >
            <button>
              <img
                src="/assets/pages/vote/ic-info.svg"
                alt="info"
                className="w-4"
              />
            </button>
          </Popover>
        </div>
        <div
          className={
            `mt-4 hidden h-[1px] w-full md:block` +
            `
      ${
        theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
      }`
          }
        ></div>
        <table className="w-full max-w-[800px]">
          <thead>
            <tr>
              <th className="whitespace-nowrap py-[12px] text-left text-[12px] font-[500] text-[#959595] md:w-[25%] md:text-[16px]">
                Position
              </th>
              <th className="whitespace-nowrap py-[12px] text-left text-[12px] font-[500] text-[#959595] md:w-[30%] md:text-[16px]">
                Holder
              </th>
              <th className="whitespace-nowrap py-[12px] text-left text-[12px] font-[500] text-[#959595] md:w-[30%] md:text-[16px]">
                Size
              </th>
              <th className="whitespace-nowrap py-[12px] text-left text-[12px] font-[500] text-[#959595] md:w-[25%] md:text-[16px]">
                Value
              </th>
            </tr>
          </thead>
          {(topHolders || [])?.slice(4, 14).map((item, i) => (
            <tbody key={i}>
              <tr className="relative">
                <td className="py-[12px] text-left text-[12px] md:text-[16px]">
                  #{i + 1}
                </td>
                <td className="py-[12px] text-left text-[12px] md:text-[16px]">
                  <div className="flex items-center justify-start gap-[16px]">
                    {/* <img
                      src={item.imgMain}
                      alt=""
                      className="h-[18px] md:h-[30px]"
                    /> */}
                    <p>{shortenAddress(item?.walletAddress)}</p>
                  </div>
                </td>
                <td className="py-[12px] text-left text-[12px] md:text-[16px]">
                  {/* <NumericFormat
                    displayType='text'
                    value={item?.amount || 0}
                    decimalScale={2}
                    thousandSeparator
                  /> */}
                  {toMetricUnits(item?.amount || 0)}
                </td>
                <td className="py-[12px] text-left text-[12px] md:text-[16px]">
                  {/* <NumericFormat
                    displayType='text'
                    value={item?.amountUsd || 0}
                    decimalScale={2}
                    prefix='$'
                    thousandSeparator
                  /> */}
                  ${toMetricUnits(item?.amountUsd || 0)}
                </td>
                <div
                  className={
                    `absolute left-0 h-[1px] w-full ` +
                    `
      ${
        theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
      }`
                  }
                ></div>
                {/* <div className="gradient-border absolute left-0 h-[1px] w-full"></div> */}
              </tr>
            </tbody>
          ))}
        </table>
        <div
          className={
            `mt-1 hidden h-[1px] w-full md:block` +
            `
      ${
        theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
      }`
          }
        ></div>
        <Link
          href="https://arbiscan.io/token/0xb56c29413af8778977093b9b4947efeea7136c36#balances"
          legacyBehavior
        >
          <a target="_blank">
            <div className="mt-[12px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595]">
              view all
            </div>
          </a>
        </Link>
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
