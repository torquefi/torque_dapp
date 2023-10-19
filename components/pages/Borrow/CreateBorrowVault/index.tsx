import {
  compoundUsdcContractInfo,
  tokenUsdcContractInfo,
} from '@/constants/borrowContract'
import { chainRpcUrl } from '@/constants/chain'
import { updateBorrowInfo } from '@/lib/redux/slices/borrow'
import { AppState } from '@/lib/redux/store'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
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
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)
  const { Moralis } = useMoralis()

  const getBorrowData = async (item: IBorrowInfo) => {
    const web3 = new Web3(chainRpcUrl)
    const web3Mainnet = new Web3(
      'https://endpoints.omniatech.io/v1/arbitrum/one/public'
    )

    try {
      if (!item.tokenContract) {
        const tokenContractInfo = await Moralis.Cloud.run('getAbi', {
          name: item?.tokenContractName,
        })
        item.tokenContractInfo = tokenContractInfo
        item.tokenContract = new web3.eth.Contract(
          JSON.parse(tokenContractInfo?.abi),
          tokenContractInfo?.address
        )
      }

      if (!item.borrowContract) {
        const borrowContractInfo = await Moralis.Cloud.run('getAbi', {
          name: item?.borrowContractName,
        })
        item.borrowContractInfo = borrowContractInfo
        item.borrowContract = new web3.eth.Contract(
          JSON.parse(borrowContractInfo?.abi),
          borrowContractInfo?.address
        )
        let addressBaseAsset = await item.borrowContract.methods
          .baseAsset()
          .call()
      }

      // try {
      //   const compoundContractInfo = await Moralis.Cloud.run('getAbi', {
      //     name: 'compound_abi',
      //   })
      //   if (compoundContractInfo?.abi) {
      //     const web3 = new Web3('https://arbitrum-goerli.publicnode.com')
      //     const contract = new web3.eth.Contract(
      //       JSON.parse(compoundContractInfo?.abi),
      //       compoundContractInfo?.address
      //     )
      //     if (contract) {
      //       console.log(contract)
      //       let utilization = await contract.methods.getUtilization().call({
      //         from: address,
      //       })
      //       console.log(utilization)
      //       let borrowRate = await contract.methods
      //         .getBorrowRate(utilization)
      //         .call({
      //           from: address,
      //         })
      //       console.log(borrowRate)
      //       item.borrowRate = borrowRate
      //     }
      //   }
      // } catch (error) {
      //   console.log(
      //     'CreateBorrowVault.getBorrowData.compoundContractInfo',
      //     item?.depositTokenSymbol,
      //     error
      //   )
      // }
    } catch (error) {
      console.log(
        'CreateBorrowVault.getBorrowData',
        item?.depositTokenSymbol,
        error
      )
    }

    try {
      const usdcContract = new web3Mainnet.eth.Contract(
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
      const compoundUsdcContract = new web3Mainnet.eth.Contract(
        JSON.parse(compoundUsdcContractInfo?.abi),
        compoundUsdcContractInfo?.address
      )
      if (compoundUsdcContract) {
        const Wbtc = '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f'
        const Weth = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
        const tokenAddress = item?.depositTokenSymbol === 'BTC' ? Wbtc : Weth
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
    setSkeletonLoading(true)
    try {
      const newDataBorrow = await Promise.all(dataBorrow?.map(getBorrowData))
      setDataBorrow(newDataBorrow)
    } catch (error) {}
    setSkeletonLoading(false)
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
    // borrowTokenSymbol: 'USG',
    borrowTokenSymbol: 'USD',
    borrowTokenDecimal: 18,
    liquidity: 0,
    loanToValue: 70,
    getTORQ: 28,
    borrowRate: 0,

    borrowContractName: 'borrow_wbtc_abi',
    tokenContractName: 'wbtc_abi',
  },
  {
    depositTokenIcon: '/icons/coin/eth.png',
    depositTokenSymbol: 'ETH',
    depositTokenDecimal: 18,
    // borrowTokenSymbol: 'USG',
    borrowTokenSymbol: 'USD',
    borrowTokenDecimal: 18,
    liquidity: 0,
    loanToValue: 78,
    getTORQ: 32,
    borrowRate: 0,

    borrowContractName: 'borrow_eth_abi',
    tokenContractName: 'eth_abi',
  },
]

const fakeBorrow = [
  {
    coinIcon: '/icons/coin/btc.png',
    depositCoin: 'BTC',
    borrowCoin: 'USG',
    loanToValue: 70,
    getTORQ: 0,
    amount: 0,
    amountRecieve: 0,
    address_asset: '0xAAD4992D949f9214458594dF92B44165Fb84dC19',
    name_ABI_asset: 'wbtc_abi',
    decimals_asset: 8,
    name_ABI_borrow: 'borrow_wbtc_abi',
    decimals_USG: 18,
    loan_provider: '/icons/coin/torq.svg',
    link_loan: '',
  },
  {
    coinIcon: '/icons/coin/eth.png',
    depositCoin: 'ETH',
    borrowCoin: 'USG',
    loanToValue: 78,
    getTORQ: 0,
    amount: 0,
    amountRecieve: 0,
    address_asset: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
    name_ABI_asset: 'eth_abi',
    decimals_asset: 18,
    name_ABI_borrow: 'borrow_eth_abi',
    decimals_USG: 18,
    loan_provider: '/icons/coin/torq.svg',
    link_loan: '',
  },
]
