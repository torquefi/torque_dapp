import { chainRpcUrl } from '@/constants/chain'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContractInfo,
  borrowEthContractInfo,
  compoundUsdcContractInfo,
  tokenBtcContractInfo,
  tokenEthContractInfo,
  tokenUsdContractInfo,
} from '../constants/contract'
import { IBorrowInfoManage } from '../types'
import BorrowItem from './BorrowItem'
import { EmptyBorrow } from './EmptyBorrow'
import BigNumber from 'bignumber.js'

export default function ManageBorrowVault() {
  const web3 = new Web3(Web3.givenProvider)
  const { address, isConnected } = useAccount()
  const [dataBorrow, setDataBorrow] = useState(DATA_BORROW)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)
  const getBorrowData = async (item: IBorrowInfoManage) => {
    try {
      if (!item.tokenContract) {
        item.tokenContract = new web3.eth.Contract(
          JSON.parse(item.tokenContractInfo?.abi),
          item.tokenContractInfo?.address
        )
      }

      if (!item.borrowContract) {
        item.borrowContract = new web3.eth.Contract(
          JSON.parse(item.borrowContractInfo?.abi),
          item.borrowContractInfo?.address
        )
      }
    } catch (error) {
      console.log(
        'CreateBorrowVault.getBorrowData',
        item?.depositTokenSymbol,
        error
      )
    }

    try {
      if (item.borrowContract) {
        let data = await item.borrowContract.methods
          .borrowInfoMap(address)
          .call({
            from: address,
          })
        item.supplied = +ethers.utils
          .formatUnits(data.supplied, item.borrowTokenDecimal)
          .toString()
        item.borrowed = +ethers.utils
          .formatUnits(data.borrowed, item.borrowTokenDecimal)
          .toString()
      }
      const web3 = new Web3(Web3.givenProvider)
      const contract = new web3.eth.Contract(
        JSON.parse(item?.borrowContractInfo.abi),
        item?.borrowContractInfo?.address
      )
      if (contract) {
        let data = await contract.methods.borrowInfoMap(address).call({
          from: address,
        })
        item.supplied = Number(
          new BigNumber(data.supplied)
            .div(10 ** item.depositTokenDecimal)
            .toString()
        )
        item.borrowed = Number(
          new BigNumber(data.borrowed)
            .div(10 ** item.depositTokenDecimal)
            .toString()
        )
      }
    } catch (error) {
      console.log('ManageStaking.handleGetStakeData', error)
    }

    try {
      const compoundUsdcContract = new web3.eth.Contract(
        JSON.parse(compoundUsdcContractInfo?.abi),
        compoundUsdcContractInfo?.address
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

  const handleUpdateStakeData = async () => {
    setSkeletonLoading(true)
    try {
      const dataBorrow = await Promise.all(DATA_BORROW?.map(getBorrowData))
      setDataBorrow(dataBorrow)
    } catch (error) {}
    setSkeletonLoading(false)
  }

  useEffect(() => {
    handleUpdateStakeData()
  }, [isConnected, address])

  // const borrowDisplayed = dataBorrow
  const borrowDisplayed = dataBorrow.filter((item) => item?.borrowed > 0)

  if (!borrowDisplayed?.length) {
    return (
      <div className="space-y-[24px]">
        <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
          Manage Borrow Vaults
        </h3>

        <EmptyBorrow />
      </div>
    )
  }

  return (
    <div className="space-y-[24px]">
      <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
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
    borrowTokenSymbol: 'USD',
    borrowTokenDecimal: 6,
    label: 'House',
    labelKey: 'name_borrow_vault_2',
    collateral: 0.0,
    supplied: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    borrowRate: 1359200263,
    borrowContractInfo: borrowBtcContractInfo,
    tokenContractInfo: tokenUsdContractInfo,
  },
  {
    depositTokenSymbol: 'AETH',
    depositTokenDecimal: 18,
    borrowTokenSymbol: 'USD',
    borrowTokenDecimal: 6,
    label: 'Lambo',
    labelKey: 'name_borrow_vault_1',
    collateral: 0.0,
    supplied: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    borrowRate: 1359200263,
    borrowContractInfo: borrowEthContractInfo,
    tokenContractInfo: tokenUsdContractInfo,
  },
]

// const DATA_BORROW = [
//   {
//     token: 'BTC',
//     label: 'House',
//     collateral: 0.0,
//     borrowed: 0.0,
//     ltv: 0.0,
//     apy: 0.0,
//     data_key: 'name_borrow_vault_1',
//     address_asset: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
//     name_ABI_asset: 'usdc_abi',
//     decimals_usdc: 6,
//     decimals_asset: 8,
//     name_ABI_borrow: 'borrow_wbtc_abi',
//   },
//   {
//     token: 'ETH',
//     label: 'Lambo',
//     collateral: 0.0,
//     borrowed: 0.0,
//     ltv: 0.0,
//     apy: 0.0,
//     data_key: 'name_borrow_vault_2',
//     address_asset: '0x2B9960680D91d7791e9a24aCFb03CE0d234cC708',
//     name_ABI_asset: 'usg_abi',
//     decimals_usdc: 6,
//     decimals_asset: 18,
//     name_ABI_borrow: 'borrow_eth_abi',
//   },
// ]
