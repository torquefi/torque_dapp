import axiosInstance from '@/configs/axios.config'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'

export const OptionToken = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [holderAddress, setHolderAddress] = useState(0)

  const getTopHolders = async () => {
    try {
      const response = await axiosInstance.get('/api/vote/top-torq-holder')
      console.log('response :>> ', response)
      setHolderAddress(response?.data?.total || 0)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
    getTopHolders()
  }, [])

  return (
    <div className="mt-[42px] items-center justify-between md:flex">
      <div className="flex w-full items-center justify-between rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-white px-[12px] py-[10px] dark:border-[#1a1a1a] dark:bg-transparent dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:to-[#0d0d0d]/0 md:mt-0 md:w-[32.5%] xl:px-[24px] xl:py-[12px]">
        <div className="w-[50%]">
          <h4 className="font-rogan text-[24px] font-[400] leading-[40px] text-[#030303] dark:text-white">
            9,290,981,733
          </h4>
          <p className="whitespace-nowrap text-[16px] font-[500] leading-[24px] text-[#959595]">
            TORQ Remaining
          </p>
        </div>
        <div className="w-[50%]">
          <Link
            href="/vote/distribution"
            className="mb-[20px] flex cursor-pointer items-center justify-end gap-[4px]"
          >
            <p className="text-[16px] font-[500] uppercase text-[#AA5BFF]">
              learn
            </p>
            <img
              src="/assets/pages/vote/genover/next.svg"
              alt=""
              className="w-3"
            />
          </Link>
          <div className="relative h-[4px] w-full bg-[#aa5bff33]">
            <div className="absolute h-[4px] w-[54%] bg-[#AA5BFF]"></div>
          </div>
        </div>
      </div>
      <div className="mt-[20px] flex w-full items-center justify-between rounded-[12px] border-[1px] border-solid  border-[#E6E6E6] bg-white  px-[12px] py-[10px] dark:border-[#1a1a1a] dark:bg-transparent dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:to-[#0d0d0d]/0 md:mt-0 md:w-[32.5%] xl:px-[24px] xl:py-[12px]">
        <div className="w-[50%]">
          <h4 className="font-rogan text-[24px] font-[400] leading-[40px] text-[#030303] dark:text-white">
            25,357,574,051
          </h4>
          <p className="whitespace-nowrap text-[16px] font-[500] leading-[24px] text-[#959595]">
            Circulating Supply
          </p>
        </div>
        <div className="w-[50%]">
          <Link
            href="https://arbiscan.io/token/0xb56c29413af8778977093b9b4947efeea7136c36"
            className="flex cursor-pointer items-center justify-end gap-[4px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-[16px] font-[500] uppercase leading-[40px] text-[#AA5BFF]">
              Explorer
            </p>
            <img
              src="/assets/pages/vote/genover/next.svg"
              alt=""
              className="w-3"
            />
          </Link>
          <div className="flex items-center justify-end gap-[4px]">
            <img src="/assets/pages/vote/genover/up-green.svg" alt="" />
            <p className="font-[500] leading-[24px] text-[#1EB26B]">25.3%</p>
          </div>
        </div>
      </div>
      <div className="mt-[20px] flex w-full items-center justify-between rounded-[12px] border-[1px] border-solid  border-[#E6E6E6] bg-white  px-[12px] py-[10px] dark:border-[#1a1a1a] dark:bg-transparent dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:to-[#0d0d0d]/0 md:mt-0 md:w-[32.5%] xl:px-[24px] xl:py-[12px]">
        <div className="w-[50%]">
          <h4 className="font-rogan text-[24px] font-[400] leading-[40px] text-[#030303] dark:text-white">
            <NumericFormat
              displayType="text"
              value={holderAddress}
              thousandSeparator
            />
          </h4>
          <p className="text-[16px] font-[500] leading-[24px] text-[#959595]">
            Global Holders
          </p>
        </div>
        <div className="w-[50%]">
          <Link
            href="/vote/leaderboard"
            className="flex cursor-pointer items-center justify-end gap-[4px]"
          >
            <p className="mb-0 text-[16px] font-[500] uppercase leading-[40px]  text-[#AA5BFF] md:mb-[2px]">
              view
            </p>
            <img
              src="/assets/pages/vote/genover/next.svg"
              alt=""
              className="w-3"
            />
          </Link>
          <div className="flex items-center justify-end gap-[4px]">
            <img src="/assets/pages/vote/genover/up-green.svg" alt="" />
            <p className="font-[500] leading-[24px] text-[#1EB26B]">0.00%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
