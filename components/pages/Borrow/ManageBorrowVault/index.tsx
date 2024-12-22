import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import BorrowItem from './BorrowItem'
import { EmptyBorrow } from './EmptyBorrow'
import useManageBorrowData from './useManageBorrowData'

export default function ManageBorrowVault({ isFetchBorrowData }: any) {
  const { address, isConnected } = useAccount()
  const { data: dataBorrow, isLoading, refresh } = useManageBorrowData()

  useEffect(() => {
    refresh()
  }, [address, isConnected, isFetchBorrowData])

  // const borrowDisplayed = dataBorrow
  const borrowDisplayed = dataBorrow.filter((item) => item?.borrowed > 0)

  if (!borrowDisplayed?.length) {
    return (
      <div className="space-y-[18px]">
        <h3 className="font-rogan text-[24px] text-[#404040] dark:text-white">
          Manage Borrow Vaults
        </h3>

        <EmptyBorrow />
      </div>
    )
  }

  return (
    <div className="space-y-[18px]">
      <h3 className="font-rogan text-[24px] text-[#404040] dark:text-white">
        Manage Borrow Vaults
      </h3>

      {borrowDisplayed.map((item, i) => (
        <BorrowItem key={i} item={item} />
      ))}
    </div>
  )
}
