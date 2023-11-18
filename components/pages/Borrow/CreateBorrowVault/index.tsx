import { updateBorrowInfo } from '@/lib/redux/slices/borrow'
import { AppState } from '@/lib/redux/store'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContractInfo,
  borrowEthContractInfo,
  compoundUsdcContractInfo,
  tokenBtcContractInfo,
  tokenEthContractInfo,
  tokenUsdcContractInfo,
} from '../constants/contract'
import { IBorrowInfo } from '../types'
import CreateBorrowItem from './createBorrowItem'

export default function CreateBorrowVault() {
  const { address, isConnected } = useAccount()
  const { borrowInfoByDepositSymbol } = useSelector(
    (store: AppState) => store?.borrow
  )
  const dispatch = useDispatch()
  const [dataBorrow, setDataBorrow] = useState(
    BORROW_INFOS?.map((item) => {
      const borrowInfo = borrowInfoByDepositSymbol?.[item?.depositTokenSymbol]
      return {
        ...item,
        liquidity: borrowInfo?.liquidity || item?.liquidity,
        loanToValue: borrowInfo?.loanToValue || item?.loanToValue,
        borrowRate: borrowInfo?.borrowRate || item?.borrowRate,
      }
    })
  )

  const getBorrowData = async (item: IBorrowInfo) => {
    const web3 = new Web3(Web3.givenProvider)

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
        let addressBaseAsset = await item.borrowContract.methods
          .baseAsset()
          .call()
      }
    } catch (error) {
      console.log(
        'CreateBorrowVault.getBorrowData',
        item?.depositTokenSymbol,
        error
      )
    }

    try {
      const usdcContract = new web3.eth.Contract(
        JSON.parse(tokenUsdcContractInfo?.abi),
        tokenUsdcContractInfo?.address
      )
      if (usdcContract) {
        let decimals = await usdcContract.methods
          .decimals()
          .call({ from: address })
        let balance = await usdcContract.methods
          .balanceOf('0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf')
          .call({ from: address })
        item.liquidity = +ethers.utils.formatUnits(balance, decimals).toString()
        dispatch(
          updateBorrowInfo({
            depositTokenSymbol: item?.depositTokenSymbol,
            liquidity: item.liquidity,
          })
        )
      }
    } catch (error) {
      console.log(
        'CreateBorrowVault.getBorrowData.usdc',
        item?.depositTokenSymbol,
        error
      )
    }
    try {
      const compoundUsdcContract = new web3.eth.Contract(
        JSON.parse(compoundUsdcContractInfo?.abi),
        compoundUsdcContractInfo?.address
      )
      if (compoundUsdcContract) {
        const tokenAddress =
          item?.depositTokenSymbol === 'BTC'
            ? tokenBtcContractInfo.address
            : tokenEthContractInfo.address
        let assets = await compoundUsdcContract.methods
          .getAssetInfoByAddress(tokenAddress)
          .call({ from: address })
        item.loanToValue =
          100 *
          +ethers.utils
            .formatUnits(assets?.borrowCollateralFactor, 18)
            .toString()

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

        dispatch(
          updateBorrowInfo({
            depositTokenSymbol: item?.depositTokenSymbol,
            loanToValue: item.loanToValue,
            borrowRate: item.borrowRate,
          })
        )
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
    try {
      const newDataBorrow = await Promise.all(dataBorrow?.map(getBorrowData))
      setDataBorrow(newDataBorrow)
    } catch (error) {}
  }

  useEffect(() => {
    handleUpdateBorrowData()
  }, [isConnected, address])

  return (
    <div className="space-y-[24px] ">
      <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
        Create Borrow Vault
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {dataBorrow.map((item, i) => (
          <CreateBorrowItem item={item} key={i} />
        ))}
      </div>
    </div>
  )
}

const BORROW_INFOS: IBorrowInfo[] = [
  {
    depositTokenIcon: '/icons/coin/btc.png',
    depositTokenSymbol: 'BTC',
    depositTokenDecimal: 8,
    borrowTokenSymbol: 'USDC',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 70,
    getTORQ: 28,
    borrowRate: 0,
    borrowContractInfo: borrowBtcContractInfo,
    tokenContractInfo: tokenBtcContractInfo,
  },
  {
    depositTokenIcon: '/icons/coin/eth.png',
    depositTokenSymbol: 'ETH',
    depositTokenDecimal: 18,
    borrowTokenSymbol: 'USDC',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 78,
    getTORQ: 32,
    borrowRate: 0,
    borrowContractInfo: borrowEthContractInfo,
    tokenContractInfo: tokenEthContractInfo,
  },
]
