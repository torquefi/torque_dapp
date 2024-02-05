import SkeletonDefault from '@/components/skeleton'
import { LabelApi } from '@/lib/api/LabelApi'
import { TokenApr } from '@/lib/api/TokenApr'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  boostWbtcContract,
  boostWethContract,
  gmxWbtcContract,
  gmxWethContract,
  wbtcContract,
  wethContract,
} from '../constants/contracts'
import { IBoostInfo } from '../types'
import { BoostItem } from './BoostItem'
import { EmptyBoost } from './EmptyBoost'

export function ManageBoostVault({ isFetchBoostData }: any) {
  const { address, isConnected } = useAccount()
  const [dataBoost, setDataBoost] = useState<IBoostInfo[]>(DATA_BOOST_VAULT)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)

  const getBoostData = async (item: (typeof DATA_BOOST_VAULT)[0]) => {
    if (!isConnected || !address) {
      return item
    }
    const web3 = new Web3(Web3.givenProvider)

    try {
      const tokenContract = new web3.eth.Contract(
        JSON.parse(item?.tokenContractInfo.abi),
        item?.tokenContractInfo.address
      )

      const boostContract = new web3.eth.Contract(
        JSON.parse(item?.boostContractInfo.abi),
        item?.boostContractInfo.address
      )
      const tokenDecimal = await tokenContract.methods.decimals().call()
      item.tokenDecimals = Number(tokenDecimal)

      if (item.tokenSymbol === 'WBTC') {
        const deposit = await boostContract.methods.balanceOf(address).call()
        item.deposited = Number(
          ethers.utils.formatUnits(deposit, tokenDecimal).toString()
        )
      } else {
        const deposit = await boostContract.methods.balanceOf(address).call()
        item.deposited = Number(
          ethers.utils.formatUnits(deposit, tokenDecimal).toString()
        )
      }
      console.log('=>>>', item)
      return item
    } catch (error) {
      console.log('ManageBoostVault.getBoostData', item?.tokenSymbol, error)
      return item
    }
  }

  const handleUpdateBoostData = async (loading = false) => {
    if (loading) {
      setSkeletonLoading(true)
    }
    let dataBoost: IBoostInfo[] = []
    try {
      const aprRes = await TokenApr.getListApr({})
      const labelRes = await LabelApi.getListLabel({
        walletAddress: address,
        position: 'Boost',
      })
      const aprs: any[] = aprRes?.data || []
      const labels: any[] = labelRes?.data || []
      dataBoost = DATA_BOOST_VAULT?.map((item) => ({
        ...item,
        label:
          labels?.find((label) => label?.tokenSymbol === item?.tokenSymbol)
            ?.name || item?.defaultLabel,
        APR:
          ((aprs?.find(
            (apr) =>
              apr?.name === (item?.tokenSymbol === 'WBTC' ? 'BTC' : 'ETH')
          )?.apr || 0) +
            5) /
          2,
      }))
    } catch (error) {
      console.error('ManageBoostVault.handleUpdateBoostData.1', error)
    }
    try {
      dataBoost = await Promise.all(dataBoost?.map(getBoostData))
    } catch (error) {
      console.error('ManageBoostVault.handleUpdateBoostData.2', error)
    }
    setDataBoost(dataBoost)
    if (loading) {
      setSkeletonLoading(false)
    }
  }

  useEffect(() => {
    handleUpdateBoostData(true)
  }, [isConnected, address, isFetchBoostData])

  // const boostDisplayed = dataBoost
  const boostDisplayed = dataBoost.filter((item) => Number(item?.deposited) > 0)

  console.log('boostDisplayed :>> ', boostDisplayed)

  if (isSkeletonLoading) {
    return (
      <div className="font-larken dark-text-white mt-[36px] text-[#464646]">
        <div className="">
          <SkeletonDefault height={'5vh'} width={'20%'} />
        </div>
        {DATA_BOOST_VAULT.map((item) => (
          <div className="mt-[24px]">
            <SkeletonDefault height={'20vh'} width={'100%'} />
          </div>
        ))}
      </div>
    )
  }

  if (!boostDisplayed?.length) {
    return (
      <div className="font-larken dark-text-white mt-[36px] text-[#404040]">
        <div className="text-[24px] dark:text-white">Manage Boost Vehicles</div>
        <EmptyBoost />
      </div>
    )
  }

  return (
    <div className="font-larken dark-text-white mt-[36px] text-[#464646]">
      <div className="text-[24px] dark:text-white">Manage Boost Vehicles</div>
      {boostDisplayed.map((item) => (
        <div className="">
          <BoostItem item={item} onWithdrawSuccess={handleUpdateBoostData} />
        </div>
      ))}
    </div>
  )
}

const DATA_BOOST_VAULT: IBoostInfo[] = [
  {
    tokenSymbol: 'WBTC',
    tokenDecimals: 18,
    defaultLabel: 'Vehicle #1',
    deposited: 0.0,
    earnings: 0.0,
    APR: 0.0,
    tokenContractInfo: wbtcContract,
    boostContractInfo: boostWbtcContract,
    gmxContractInfo: gmxWbtcContract,
  },
  {
    tokenSymbol: 'WETH',
    tokenDecimals: 18,
    defaultLabel: 'Vehicle #2',
    deposited: 0.0,
    earnings: 0.0,
    APR: 0.0,
    tokenContractInfo: wethContract,
    boostContractInfo: boostWethContract,
    gmxContractInfo: gmxWethContract,
  },
]
