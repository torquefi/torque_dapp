import { LabelApi } from '@/lib/api/LabelApi'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContract,
  borrowEthContract,
  compoundUsdcContract as compoundUsdcContractData,
  simpleBorrowBtcContract,
  simpleBorrowEthContract,
  tokenBtcContract,
  tokenEthContract,
  tokenTusdContract,
  tokenUsdcContract,
  tokenUsdtContract,
} from '../constants/contract'
import { IBorrowInfoManage } from '../types'
import BorrowItem from './BorrowItem'
import { EmptyBorrow } from './EmptyBorrow'

export default function ManageBorrowVault({ isFetchBorrowData }: any) {
  const web3 = new Web3(Web3.givenProvider)
  const { address, isConnected } = useAccount()
  const [dataBorrow, setDataBorrow] = useState(DATA_BORROW)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)

  const getBorrowData = async (item: IBorrowInfoManage) => {
    try {
      const web3 = new Web3(Web3.givenProvider)
      const contract = new web3.eth.Contract(
        JSON.parse(item?.borrowContractInfo.abi),
        item?.borrowContractInfo?.address
      )
      if (contract) {
        const data = await contract.methods.getUserDetails(address).call()
        item.supplied = Number(
          new BigNumber(data?.['0'])
            .div(10 ** item.depositTokenDecimal)
            .toString()
        )
        if (item.borrowTokenSymbol === 'TUSD') {
          item.borrowed = Number(
            new BigNumber(data?.['2'] || 0)
              .div(10 ** item.borrowTokenDecimal)
              .toString()
          )
        }
        if (item.borrowTokenSymbol === 'USDC') {
          item.borrowed = Number(
            new BigNumber(data?.['1'] || 0)
              .div(10 ** item.borrowTokenDecimal)
              .toString()
          )
        }
        if (item.borrowTokenSymbol === 'USDT') {
          item.borrowed = Number(
            new BigNumber(data?.['3'] || 0)
              .div(10 ** item.borrowTokenDecimal)
              .toString()
          )
        }
        console.log('item.borrowed :>> ', item.borrowed)
        console.log(
          '111',
          Number(
            new BigNumber(data?.['2'] || 0)
              .div(10 ** item.borrowTokenDecimal)
              .toString()
          )
        )
      }
    } catch (error) {
      console.log('ManageStaking.', error)
    }

    try {
      const compoundUsdcContract = new web3.eth.Contract(
        JSON.parse(compoundUsdcContractData?.abi),
        compoundUsdcContractData?.address
      )
      if (compoundUsdcContract) {
        let utilization = await compoundUsdcContract.methods
          .getUtilization()
          .call({
            from: address,
          })
        let borrowRate = await compoundUsdcContract.methods
          .getBorrowRate(utilization)
          .call({
            from: address,
          })
        item.borrowRate = borrowRate
      }
    } catch (error) {
      console.log(
        'CreateBorrowVault.getBorrowData.compoundUsdc',
        item?.depositTokenSymbol,
        error
      )
    }

    return item
  }

  const handleUpdateBorrowData = async () => {
    setSkeletonLoading(true)
    let dataBorrow: IBorrowInfoManage[] = []

    try {
      dataBorrow = await Promise.all(dataBorrow?.map(getBorrowData))
      const labelRes = await LabelApi.getListLabel({
        walletAddress: address,
        position: 'Borrow',
      })
      const labels: any[] = labelRes?.data || []
      dataBorrow = DATA_BORROW?.map((item) => ({
        ...item,
        label:
          labels?.find(
            (label) =>
              label?.tokenSymbol === item?.depositTokenSymbol &&
              label?.symbol === item?.borrowTokenSymbol
          )?.name || item?.label,
      }))
    } catch (error) {
      console.error('handleUpdateBorrowData1', error)
    }

    try {
      dataBorrow = await Promise.all(dataBorrow?.map(getBorrowData))
      console.log(dataBorrow)
    } catch (error) {
      console.error('handleUpdateBorrowData2', error)
    }

    setDataBorrow(dataBorrow)
    setSkeletonLoading(false)
  }

  useEffect(() => {
    handleUpdateBorrowData()
  }, [isConnected, address, isFetchBorrowData])

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

const DATA_BORROW: IBorrowInfoManage[] = [
  {
    depositTokenSymbol: 'WBTC',
    depositTokenDecimal: 8,
    borrowTokenSymbol: 'TUSD',
    borrowTokenDecimal: 18,
    label: 'Vault #1',
    labelKey: 'name_borrow_vault_2',
    collateral: 0.0,
    supplied: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    borrowRate: 1359200263,
    borrowContractInfo: borrowBtcContract,
    tokenContractInfo: tokenTusdContract,
    depositContractInfo: tokenBtcContract,
    borrowMax: 0.0,
    bonus: 0,
  },
  {
    depositTokenSymbol: 'WETH',
    depositTokenDecimal: 18,
    borrowTokenSymbol: 'TUSD',
    borrowTokenDecimal: 18,
    label: 'Vault #2',
    labelKey: 'name_borrow_vault_1',
    collateral: 0.0,
    supplied: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    borrowRate: 1359200263,
    borrowContractInfo: borrowEthContract,
    tokenContractInfo: tokenTusdContract,
    depositContractInfo: tokenEthContract,
    borrowMax: 0.0,
    bonus: 0,
  },
  {
    depositTokenSymbol: 'WBTC',
    depositTokenDecimal: 8,
    borrowTokenSymbol: 'USDC',
    borrowTokenDecimal: 6,
    label: 'Vault #3',
    labelKey: 'name_borrow_vault_3',
    collateral: 0.0,
    supplied: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    borrowRate: 1359200263,
    borrowContractInfo: simpleBorrowBtcContract,
    tokenContractInfo: tokenUsdcContract,
    depositContractInfo: tokenBtcContract,
    borrowMax: 0.0,
    bonus: 0,
  },
  {
    depositTokenSymbol: 'WETH',
    depositTokenDecimal: 18,
    borrowTokenSymbol: 'USDC',
    borrowTokenDecimal: 6,
    label: 'Vault #4',
    labelKey: 'name_borrow_vault_4',
    collateral: 0.0,
    supplied: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    borrowRate: 1359200263,
    borrowContractInfo: simpleBorrowEthContract,
    tokenContractInfo: tokenUsdcContract,
    depositContractInfo: tokenEthContract,
    borrowMax: 0.0,
    bonus: 0,
  },
  {
    depositTokenSymbol: 'WBTC',
    depositTokenDecimal: 8,
    borrowTokenSymbol: 'USDT',
    borrowTokenDecimal: 6,
    label: 'Vault #5',
    labelKey: 'name_borrow_vault_5',
    collateral: 0.0,
    supplied: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    borrowRate: 1359200263,
    borrowContractInfo: simpleBtcBorrowUsdt,
    tokenContractInfo: tokenUsdtContract,
    depositContractInfo: tokenBtcContract,
    borrowMax: 0.0,
    bonus: 0,
  },
  {
    depositTokenSymbol: 'WETH',
    depositTokenDecimal: 18,
    borrowTokenSymbol: 'USDT',
    borrowTokenDecimal: 6,
    label: 'Vault #6',
    labelKey: 'name_borrow_vault_6',
    collateral: 0.0,
    supplied: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    borrowRate: 1359200263,
    borrowContractInfo: simpleEthBorrowUsdt,
    tokenContractInfo: tokenUsdtContract,
    depositContractInfo: tokenEthContract,
    borrowMax: 0.0,
    bonus: 0,
  },
]
