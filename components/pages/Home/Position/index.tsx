import HoverIndicator from '@/components/common/HoverIndicator'
import SkeletonDefault from '@/components/skeleton'
import { cn } from '@/lib/helpers/utils'
import { AppStore } from '@/types/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import { BoostItem } from '../../Boost/ManageBoostVault/BoostItem'
import { useManageBoostData } from '../../Boost/ManageBoostVault/useManageBoostData'
import BorrowItem from '../../Borrow/ManageBorrowVault/BorrowItem'
import useManageBorrowData from '../../Borrow/ManageBorrowVault/useManageBorrowData'
import { EmptyPosition } from './EmptyPosition'
import TitleDecorator from './TitleDecorator'

export default function Position() {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const boost = useManageBoostData()
  const borrow = useManageBorrowData()
  const [rangePeriod, setRangePeriod] = useState('1Y')
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true)
  const { address, isConnected } = useAccount()

  // const boostDisplayed = boost?.data
  // const borrowDisplayed = borrow?.data
  const boostDisplayed = boost?.data?.filter(
    (item) => Number(item.depositedBalance) > 0 || Number(item?.deposited) > 0
  )
  const borrowDisplayed = borrow?.data?.filter((item) => item?.borrowed > 0)

  useEffect(() => {
    boost.refresh()
    borrow.refresh()
  }, [address, isConnected])

  useEffect(() => {
    setTimeout(() => setIsSkeletonLoading(false), 1000)
  }, [])

  const timePeriodButtons = (
    <div className="flex w-auto items-center justify-center rounded-[4px] border border-[#efefef] bg-transparent px-[3px] py-[4px] text-[#959595] dark:border-[#1a1a1a]">
      <HoverIndicator
        activeIndex={['1D', '1W', '1M', '1Y'].indexOf(rangePeriod || '1Y')}
        className="flex w-full justify-between"
      >
        {['1D', '1W', '1M', '1Y'].map((item) => (
          <button
            key={item}
            className={cn(
              'inline-flex h-auto w-[34px] cursor-pointer items-center justify-center focus:outline-none',
              rangePeriod === item && 'bg-transparent'
            )}
            onClick={() => setRangePeriod(item)}
          >
            {item}
          </button>
        ))}
      </HoverIndicator>
    </div>
  )

  if (isSkeletonLoading) {
    return (
      <div className="mb-4 mt-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <SkeletonDefault height={'34px'} width={'100px'} />
          </div>
          <div className="flex space-x-2">
            <SkeletonDefault height={'34px'} width={'120px'} />
          </div>
        </div>
        <div className="mt-[24px] space-y-[24px]">
          <SkeletonDefault height={'100px'} width={'100%'} className="block" />
          <SkeletonDefault height={'100px'} width={'100%'} className="block" />
          <SkeletonDefault height={'100px'} width={'100%'} className="block" />
        </div>
      </div>
    )
  }

  if (!boostDisplayed?.length && !borrowDisplayed?.length) {
    return (
      <div className="mt-[24px]">
        <div className="flex items-center justify-between">
          <h3 className="font-rogan text-[28px] text-[#030303] dark:text-white">
            Positions
          </h3>
          {timePeriodButtons}
        </div>
        <EmptyPosition />
      </div>
    )
  }

  return (
    <div className="mb-4 mt-[24px]">
      <div className="flex items-center justify-between">
        <h3 className="font-rogan text-[28px] text-black dark:text-white">
          Positions
        </h3>
        {timePeriodButtons}
      </div>

      {boostDisplayed?.length > 0 && (
        <div className="mt-[3px]">
          <TitleDecorator />
          <div className="rounded-[12px] border-x border-t border-[#E6E6E6] bg-[#F9F9F9] dark:border-[#1D1D1D] dark:bg-[#141414]">
            <h4 className="mt-[-12px] pb-[4px] text-center font-bold tracking-widest text-black dark:text-white">
              BOOST
            </h4>
            <div className="mx-[-1px] space-y-[20px] rounded-b-[12px] border-x border-[#E6E6E6] dark:border-[#1D1D1D]">
              {boostDisplayed.map((item, i) => (
                <BoostItem
                  key={i}
                  item={item}
                  onWithdrawSuccess={boost.refresh}
                  className="mx-[-1px] mt-0"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {borrowDisplayed?.length > 0 && (
        <div className="mt-[8px]">
          <TitleDecorator />
          <div className="rounded-[12px] border-x border-t border-[#E6E6E6] bg-[#F9F9F9] dark:border-[#1D1D1D] dark:bg-[#141414]">
            <h4 className="mt-[-12px] pb-[4px] text-center font-bold tracking-widest text-black dark:text-white">
              BORROW
            </h4>
            <div className="mx-[-1px] space-y-[20px] rounded-b-[12px] border-x border-[#E6E6E6] dark:border-[#1D1D1D]">
              {borrowDisplayed.map((item, i) => (
                <BorrowItem key={i} item={item} className="mx-[-1px] mt-0" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
