import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { BoostItem } from './BoostItem'
import { EmptyBoost } from './EmptyBoost'
import { useManageBoostData } from './useManageBoostData'

export function ManageBoostVault({
  isFetchBoostData,
  setIsFetchBoostLoading,
}: any) {
  const { address, isConnected } = useAccount()
  const { data: dataBoost, isLoading, refresh } = useManageBoostData()

  useEffect(() => {
    refresh(true)
  }, [isConnected, address, isFetchBoostData])

  // const boostDisplayed = dataBoost
  const boostDisplayed = dataBoost.filter(
    (item) => Number(item.depositedBalance) > 0 || Number(item?.deposited) > 0
  )

  console.log('boostDisplayed :>> ', boostDisplayed)

  // if (isSkeletonLoading) {
  //   return (
  //     <div className="font-rogan dark-text-white mt-[36px] text-[#464646]">
  //       <div className="">
  //         <SkeletonDefault height={'5vh'} width={'20%'} />
  //       </div>
  //       {DATA_BOOST_VAULT.map((item) => (
  //         <div className="mt-[24px]">
  //           <SkeletonDefault height={'20vh'} width={'100%'} />
  //         </div>
  //       ))}
  //     </div>
  //   )
  // }

  if (!boostDisplayed?.length) {
    return (
      <div className="font-rogan dark-text-white mt-[36px] text-[#404040]">
        <div className="text-[24px] dark:text-white">Manage Boost Vehicles</div>
        <EmptyBoost />
      </div>
    )
  }

  return (
    <div className="font-rogan dark-text-white mt-[36px] text-[#464646]">
      <div className="text-[24px] dark:text-white">Manage Boost Vehicles</div>
      {boostDisplayed.map((item) => (
        <div className="">
          <BoostItem
            item={item}
            onWithdrawSuccess={refresh}
            setIsFetchBoostLoading={setIsFetchBoostLoading}
          />
        </div>
      ))}
    </div>
  )
}
