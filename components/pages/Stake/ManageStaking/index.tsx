import SkeletonDefault from '@/components/skeleton'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { STAKING_DATA } from '../constant'
import { IStakingInfo } from '../types'
import { EmptyStake } from './EmptyStake'
import StakingInfo from './StakingInfo'

export default function ManageStaking({ isRefresh }: { isRefresh?: boolean }) {
  const { address, isConnected } = useAccount()
  const [dataStake, setDataStake] = useState(STAKING_DATA)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)

  const getStakeData = async (item: IStakingInfo) => {
    if (!isConnected || !address) {
      return item
    }
    const web3 = new Web3(Web3.givenProvider)
    try {
      const tokenContract = new web3.eth.Contract(
        JSON.parse(item?.tokenContractInfo.abi),
        item?.tokenContractInfo.address
      )
      const tokenStakeContract = new web3.eth.Contract(
        JSON.parse(item?.tokenStakeContractInfo.abi),
        item?.tokenStakeContractInfo?.address
      )
      const stakingContract = new web3.eth.Contract(
        JSON.parse(item?.stakeContractInfo.abi),
        item?.stakeContractInfo.address
      )

      const decimals = await tokenContract.methods.decimals().call()
      const response = await stakingContract.methods.stakers(address).call()
      const principal = response?.principal
      const totalStaked = ethers.utils
        .formatUnits(principal, decimals)
        .toString()
      item.deposited = +totalStaked
      return item
    } catch (error) {
      console.log('ManageStaking.handleGetStakeData', error)
      return item
    }
  }

  const handleUpdateStakeData = async () => {
    setSkeletonLoading(true)
    try {
      const dataStake = await Promise.all(STAKING_DATA?.map(getStakeData))
      setDataStake(dataStake)
    } catch (error) {}
    setSkeletonLoading(false)
  }

  useEffect(() => {
    handleUpdateStakeData()
  }, [isConnected, address])

  const stakeDisplayed = dataStake.filter((item) => item?.deposited > 0)

  if (isSkeletonLoading) {
    return (
      <div>
        <div className="mt-[36px]">
          <SkeletonDefault height={'5vh'} width={'18%'} />
        </div>
        <div className="mt-[24px]">
          <SkeletonDefault height={'20vh'} width={'100%'} />
        </div>
      </div>
    )
  }

  if (!stakeDisplayed?.length) {
    return (
      <div className="font-larken mt-[36px]">
        <div className="text-[24px] text-[#404040] dark:text-white">
          Manage Staking
        </div>

        <EmptyStake />
      </div>
    )
  }

  return (
    <div className="font-larken mt-[36px]">
      <div className="text-[24px] text-[#404040] dark:text-white">
        Manage Staking
      </div>

      {stakeDisplayed.map((item, index) => (
        <StakingInfo stakeInfo={item} isRefresh={isRefresh} key={index} />
      ))}
    </div>
  )
}
