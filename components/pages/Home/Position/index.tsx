import { AppStore } from '@/types/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import { BoostItem } from '../../Boost/ManageBoostVault/BoostItem'
import { useManageBoostData } from '../../Boost/ManageBoostVault/useManageBoostData'
import BorrowItem from '../../Borrow/ManageBorrowVault/BorrowItem'
import useManageBorrowData from '../../Borrow/ManageBorrowVault/useManageBorrowData'
import { EmptyPosition } from './EmptyPosition'
import { cn } from '@/lib/helpers/utils'

export default function Position() {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const boost = useManageBoostData()
  const borrow = useManageBorrowData()
  const [rangePeriod, setRangePeriod] = useState('1D')
  const { address, isConnected } = useAccount()

  const boostDisplayed = boost?.data?.filter(
    (item) => Number(item.depositedBalance) > 0 || Number(item?.deposited) > 0
  )
  const borrowDisplayed = borrow?.data?.filter((item) => item?.borrowed > 0)
  // const boostDisplayed = boost?.data
  // const borrowDisplayed = borrow?.data

  useEffect(() => {
    boost.refresh()
    borrow.refresh()
  }, [address, isConnected])

  if (!boostDisplayed?.length && !borrowDisplayed?.length) {
    return (
      <div className="mt-[40px] space-y-[18px]">
        <h3 className="font-rogan text-[12px] text-[#404040] dark:text-white">
          Position
        </h3>

        <EmptyPosition />
      </div>
    )
  }

  return (
    <div className="mt-[40px] space-y-[32px]">
      <div className="flex items-center justify-between">
        <h3 className="font-rogan text-[28px] text-black dark:text-white">
          Positions
        </h3>
        <div className="flex space-x-[8px] rounded-[4px] border border-[#E6E6E6] p-[4px]">
          {['1D', '1W', '1M', '1Y']?.map((item) => (
            <button
              className={cn(
                'flex h-[32px] w-[32px] items-center justify-center rounded-[4px] text-[18px] text-[#959595]',
                item === rangePeriod && 'bg-[#F5F5F5]'
              )}
              onClick={() => setRangePeriod(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex bg-[#F9F9F9] dark:bg-[#141414]">
          <div className="w-[calc(50%-100px)] bg-white dark:bg-[#030303]"></div>
          <img
            className="w-[200px]"
            src={
              theme == 'light'
                ? '/assets/pages/home/position-header-wrap.png'
                : '/assets/pages/home/position-header-wrap-dark.png'
            }
            alt=""
          />
          <div className="w-[calc(50%-100px)] bg-white dark:bg-[#030303]"></div>
        </div>
        <div className="overflow-hidden rounded-[12px] border-x border-[#E6E6E6] bg-[#F9F9F9] dark:border-[#1D1D1D] dark:bg-[#141414]">
          <h4 className="text-center font-bold text-black dark:text-white">
            BOOST
          </h4>
          <div className="mx-[-1px] mt-[12px] space-y-[20px] rounded-b-[12px] border-x border-[#E6E6E6] dark:border-[#1D1D1D]">
            {boostDisplayed.map((item, i) => (
              <BoostItem
                item={item}
                onWithdrawSuccess={boost.refresh}
                className="mx-[-1px] mt-0"
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex bg-[#F9F9F9] dark:bg-[#141414]">
          <div className="w-[calc(50%-100px)] bg-white dark:bg-[#030303]"></div>
          <img
            className="w-[200px]"
            src={
              theme == 'light'
                ? '/assets/pages/home/position-header-wrap.png'
                : '/assets/pages/home/position-header-wrap-dark.png'
            }
            alt=""
          />
          <div className="w-[calc(50%-100px)] bg-white dark:bg-[#030303]"></div>
        </div>
        <div className="rounded-[12px] border-x border-[#E6E6E6] bg-[#F9F9F9] dark:border-[#1D1D1D] dark:bg-[#141414]">
          <h4 className="text-center font-bold text-black dark:text-white">
            BORROW
          </h4>
          <div className="mx-[-1px] mt-[12px] space-y-[20px] rounded-b-[12px] border-x border-[#E6E6E6] dark:border-[#1D1D1D]">
            {borrowDisplayed.map((item, i) => (
              <BorrowItem key={i} item={item} className="mx-[-1px] mt-0" />
            ))}
            {/* {[1, 2]?.map((item, i) => (
            <ItemSkeleton key={i} />
          ))} */}
          </div>
        </div>
      </div>
    </div>
  )
}
