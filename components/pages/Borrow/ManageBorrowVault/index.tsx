import { compoundUsdcContractInfo } from '@/constants/borrowContract'
import { chainRpcUrl } from '@/constants/chain'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcManageContractInfo,
  borrowEthManageContractInfo,
  tokenBtcManageContractInfo,
  tokenEthManageContractInfo,
} from '../constants/contract'
import { IBorrowInfoManage } from '../types'
import BorrowItem from './BorrowItem'

export default function ManageBorrowVault() {
  const { address, isConnected } = useAccount()
  const [dataBorrow, setDataBorrow] = useState(DATA_BORROW)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)

  const getBorrowData = async (item: IBorrowInfoManage) => {
    const web3 = new Web3(chainRpcUrl)
    const web3Mainnet = new Web3(
      'https://endpoints.omniatech.io/v1/arbitrum/one/public'
    )

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

      // const dataABIBorrow = await Moralis.Cloud.run('getAbi', {
      //   name: item?.name_ABI_borrow,
      // })
      // if (dataABIBorrow?.abi) {
      //   const web3 = new Web3(Web3.givenProvider)
      //   const contract = new web3.eth.Contract(
      //     JSON.parse(dataABIBorrow?.abi),
      //     dataABIBorrow?.address
      //   )
      //   if (contract) {
      //     let data = await contract.methods.borrowInfoMap(address).call({
      //       from: address,
      //     })
      //     // item.supplied = +Moralis.Units.FromWei(data.supplied, item.decimals_asset)
      //     item.borrowed = +Moralis.Units.FromWei(
      //       data.borrowed,
      //       item.decimals_usdc
      //     )
      //   }
      // }
    } catch (error) {
      console.log('ManageStaking.handleGetStakeData', error)
    }

    try {
      const compoundUsdcContract = new web3Mainnet.eth.Contract(
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

  const borrowDisplayed = dataBorrow.filter((item) => item?.borrowed > 0)

  // if (!borrowDisplayed?.length) {
  //   return (
  //     <div className="space-y-[24px]">
  //       <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
  //         Manage Borrow Vaults
  //       </h3>

  //       <EmptyBorrow />
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-[24px]">
      <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
        Manage Borrow Vaults
      </h3>

      {dataBorrow.map((item, i) => (
        <BorrowItem key={i} item={item} />
      ))}
    </div>
  )
}

const DATA_BORROW: IBorrowInfoManage[] = [
  {
    depositTokenSymbol: 'BTC',
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

    borrowContractInfo: borrowBtcManageContractInfo,
    tokenContractInfo: tokenBtcManageContractInfo,
  },
  {
    depositTokenSymbol: 'ETH',
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

    borrowContractInfo: borrowEthManageContractInfo,
    tokenContractInfo: tokenEthManageContractInfo,
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
