import { LabelApi } from '@/lib/api/LabelApi'
import { TokenApr } from '@/lib/api/TokenApr'
import { ethers } from 'ethers'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  boostLinkContract,
  boostUniContract,
  boostWbtcContract,
  boostWethContract,
  gmxLinkContract,
  gmxUniContract,
  gmxWbtcContract,
  gmxWethContract,
  linkContract,
  uniContract,
  wbtcContract,
  wethContract,
} from '../constants/contracts'
import { IBoostInfo } from '../types'

export function useManageBoostData() {
  const { address, isConnected } = useAccount()
  const [dataBoost, setDataBoost] = useState<IBoostInfo[]>(DATA_BOOST_VAULT)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)
  // const address = '0xc67Ba1769fA080261A9E88a9548c3D09431c84D0'
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

      const gmxContract = new web3.eth.Contract(
        JSON.parse(item?.gmxContractInfo.abi),
        item?.gmxContractInfo.address
      )

      const tokenDecimal = await tokenContract.methods.decimals().call()
      item.tokenDecimals = Number(tokenDecimal)

      if (item.tokenSymbol === 'WBTC') {
        const deposit = await gmxContract.methods.wbtcAmount(address).call()
        const depositBalance = await boostContract.methods
          .balanceOf(address)
          .call()
        item.deposited = Number(
          ethers.utils.formatUnits(deposit, tokenDecimal).toString()
        )
        item.depositedBalance = Number(
          ethers.utils.formatUnits(depositBalance, tokenDecimal).toString()
        )
      }
      if (item.tokenSymbol === 'WETH') {
        const deposit = await gmxContract.methods.wethAmount(address).call()
        const depositBalance = await boostContract.methods
          .balanceOf(address)
          .call()
        item.depositedBalance = Number(
          ethers.utils.formatUnits(depositBalance, tokenDecimal).toString()
        )
        item.deposited = Number(
          ethers.utils.formatUnits(deposit, tokenDecimal).toString()
        )
      }

      if (item.tokenSymbol === 'UNI') {
        const deposit = await gmxContract.methods.uniAmount(address).call()
        const depositBalance = await boostContract.methods
          .balanceOf(address)
          .call()
        item.deposited = Number(
          ethers.utils.formatUnits(deposit, tokenDecimal).toString()
        )
        item.depositedBalance = Number(
          ethers.utils.formatUnits(depositBalance, tokenDecimal).toString()
        )
      }
      if (item.tokenSymbol === 'LINK') {
        const deposit = await gmxContract.methods.linkAmount(address).call()
        const depositBalance = await boostContract.methods
          .balanceOf(address)
          .call()
        item.deposited = Number(
          ethers.utils.formatUnits(deposit, tokenDecimal).toString()
        )
        item.depositedBalance = Number(
          ethers.utils.formatUnits(depositBalance, tokenDecimal).toString()
        )
      }
      console.log('=>>>', item)
      return item
    } catch (error) {
      console.log('useManageBoostData.getBoostData', item?.tokenSymbol, error)
      return item
    }
  }

  const handleUpdateBoostData = async (loading = false) => {
    if (loading) {
      setSkeletonLoading(true)
    }
    let dataBoost: IBoostInfo[] = DATA_BOOST_VAULT
    try {
      const aprRes = await TokenApr.getListApr({})
      const labelRes = await LabelApi.getListLabel({
        walletAddress: address,
        position: 'Boost',
      })
      const aprs: any[] = aprRes?.data || []
      const labels: any[] = labelRes?.data || []
      dataBoost = dataBoost?.map((item) => ({
        ...item,
        label:
          labels?.find((label) => label?.tokenSymbol === item?.tokenSymbol)
            ?.name || item?.defaultLabel,
        APR: aprs?.find((apr) => apr?.name === item?.tokenSymbol)?.apr || 0,
      }))
    } catch (error) {
      console.error('useManageBoostData.handleUpdateBoostData.1', error)
    }
    try {
      dataBoost = await Promise.all(dataBoost?.map(getBoostData))
    } catch (error) {
      console.error('useManageBoostData.handleUpdateBoostData.2', error)
    }
    setDataBoost(dataBoost)
    if (loading) {
      setSkeletonLoading(false)
    }
  }

  return {
    data: dataBoost,
    isLoading: isSkeletonLoading,
    refresh: handleUpdateBoostData,
  }
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
    depositedBalance: 0.0,
    bonus: 0,
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
    depositedBalance: 0.0,
    bonus: 0,
  },
  {
    tokenSymbol: 'LINK',
    tokenDecimals: 18,
    defaultLabel: 'Vehicle #3',
    deposited: 0.0,
    earnings: 0.0,
    APR: 0.0,
    tokenContractInfo: linkContract,
    boostContractInfo: boostLinkContract,
    gmxContractInfo: gmxLinkContract,
    depositedBalance: 0.0,
    bonus: 0,
  },
  {
    tokenSymbol: 'UNI',
    tokenDecimals: 18,
    defaultLabel: 'Vehicle #4',
    deposited: 0.0,
    earnings: 0.0,
    APR: 0.0,
    tokenContractInfo: uniContract,
    boostContractInfo: boostUniContract,
    gmxContractInfo: gmxUniContract,
    depositedBalance: 0.0,
    bonus: 0,
  },
]
