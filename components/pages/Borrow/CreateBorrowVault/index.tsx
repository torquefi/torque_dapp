import { updateBorrowInfo } from '@/lib/redux/slices/borrow'
import { AppState } from '@/lib/redux/store'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContract,
  borrowEthContract,
  tokenBtcContract,
  tokenEthContract,
  tokenTusdContract,
  tokenUsdcContract,
} from '../constants/contract'
import { compoundUsdcContract as compoundUsdcContractData } from '../constants/contract'
import { IBorrowInfo } from '../types'
import CreateBorrowItem from './createBorrowItem'
import HoverIndicator from '@/components/common/HoverIndicator'
import CreateRowBorrowItem from './createRowBorrowItem'
import RcTooltip from '@/components/common/RcTooltip'
import { AppStore } from '@/types/store'
import { updateLayoutBorrow, updateVisibilityBorrowBanner } from '@/lib/redux/slices/layout'

export default function CreateBorrowVault({ setIsFetchBorrowLoading }: any) {
  const { address, isConnected } = useAccount()
  const { borrowInfoByDepositSymbol } = useSelector(
    (store: AppState) => store?.borrow
  )
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const layoutBorrow = useSelector(
    (store: AppStore) => store.layout.layoutBorrow
  )
  const visibilityBorrowBanner = useSelector(
    (store: AppStore) => store.layout.visibilityBorrowBanner
  )

  const dispatch = useDispatch()
  const [dataBorrow, setDataBorrow] = useState(
    BORROW_INFOS?.map((item) => {
      const borrowInfo = borrowInfoByDepositSymbol?.[item?.depositTokenSymbol]
      return {
        ...item,
        liquidity: borrowInfo?.liquidity || item?.liquidity,
        loanToValue: item?.loanToValue, // hardcoded loanToValue
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
        JSON.parse(tokenUsdcContract?.abi),
        tokenUsdcContract?.address
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
        JSON.parse(compoundUsdcContractData?.abi),
        compoundUsdcContractData?.address
      )
      if (compoundUsdcContract) {
        const tokenAddress =
          item?.depositTokenSymbol === 'WBTC'
            ? tokenBtcContract.address
            : tokenEthContract.address
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
    } catch (error) { }
  }

  useEffect(() => {
    handleUpdateBorrowData()
  }, [isConnected, address])

  return (
    <div className="space-y-[18px]">
      <div className="flex items-center justify-between">
        <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
          Create Borrow Vault
        </h3>
        <div className="flex items-center justify-center space-x-3">
          <button
            className='focus:outline-none h-[34px] w-[34px] rounded-[4px] border-[1px] border-[solid] border-[#E6E6E6] dark:border-[#1a1a1a] inline-flex items-center justify-center cursor-pointer'>
            <img
              src={visibilityBorrowBanner ? "/icons/visibility-off.svg" : "/icons/visibility-off.svg"}
              alt="visibility icon"
              className='w-[22px] text-[#959595]'
              onClick={() => dispatch(updateVisibilityBorrowBanner(!visibilityBorrowBanner as any))}
            />
          </button>
          <div className="flex h-[36px] w-auto items-center justify-center rounded-[4px] border border-[#efefef] bg-transparent px-[3px] py-[4px] dark:border-[#1a1a1a]">
            <HoverIndicator
              activeIndex={layoutBorrow === 'row' ? 0 : 1}
              className="flex w-full justify-between"
            >
              <button
                id="rowViewButton"
                className="focus:outline-none"
                onClick={() => {
                  dispatch(updateLayoutBorrow('row' as any))
                }}
              >
                <img
                  src="../icons/rows.svg"
                  alt="Row View"
                  className={`ml-[6px] mr-[6px] h-6 w-6 ${layoutBorrow === 'row' ? 'text-[#030303]' : 'text-[#959595]'
                    } dark:text-white`}
                />
              </button>
              <button
                id="gridViewButton"
                className="focus:outline-none"
                onClick={() => {
                  dispatch(updateLayoutBorrow('grid' as any))
                }}
              >
                <img
                  src="../icons/grid.svg"
                  alt="Grid View"
                  className={`ml-[6px] mr-[6px] h-6 w-6 ${layoutBorrow === 'grid' ? 'text-[#030303]' : 'text-[#959595]'
                    } dark:text-white`}
                />
              </button>
            </HoverIndicator>
          </div>
        </div>
      </div>
      {layoutBorrow === 'grid' && (
        <div className="grid gap-[20px] md:grid-cols-2">
          {dataBorrow.map((item, i) => (
            <CreateBorrowItem
              item={item}
              key={i}
              setIsFetchBorrowLoading={setIsFetchBorrowLoading}
            />
          ))}
        </div>
      )}

      {layoutBorrow === 'row' && (
        <div className="overflow-x-auto">
          <div
            className={
              `h-[1px] w-full` +
              `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
              }`
            }
          ></div>
          <table className="min-w-[1000px] md:min-w-full">
            <thead>
              <tr className="">
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Collateral
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-mona flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Supply collateral assets to receive a TUSD loan."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Borrowing
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-mona flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Borrow Torque USD (TUSD) by supplying collateral assets."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      LTV
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-mona flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Max value of the loan you can take out against your collateral."
                    >
                      <button className="mt-[ ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      APR
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-mona flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="An interest rate determined by supply and demand of the asset."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Liquidity
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-mona flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Available amount of borrowing power in the market at this time."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Rewards
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topLeft"
                      className={`font-mona flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Projected TORQ rewards after 1 year of $1,000 supplied."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
                <th className="py-[6px] text-left">
                  <div className="inline-flex items-center">
                    <span className="text-[16px] font-[500] text-[#959595]">
                      Supplied
                    </span>
                    <RcTooltip
                      trigger="hover"
                      placement="topRight"
                      className={`font-mona flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="The total value of currently supplied tokenized assets."
                    >
                      <button className="ml-[5px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="info icon"
                          className="w-[13px]"
                        />
                      </button>
                    </RcTooltip>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataBorrow.map((item, i) => (
                <CreateRowBorrowItem
                  item={item}
                  key={i}
                  setIsFetchBorrowLoading={setIsFetchBorrowLoading}
                />
              ))}
            </tbody>
          </table>
          <div
            className={
              `h-[1px] w-full` +
              `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
              }`
            }
          ></div>
        </div>
      )}
    </div>
  )
}

const BORROW_INFOS: IBorrowInfo[] = [
  {
    depositTokenIcon: '/icons/coin/wbtc.png',
    depositTokenSymbol: 'WBTC',
    depositTokenDecimal: 8,
    borrowTokenSymbol: 'TUSD',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 70,
    getTORQ: 28,
    borrowRate: 0,
    borrowContractInfo: borrowBtcContract,
    tokenContractInfo: tokenBtcContract,
    tokenBorrowContractInfo: tokenTusdContract,
    name: 'Bitcoin',
  },
  {
    depositTokenIcon: '/icons/coin/aeth.png',
    depositTokenSymbol: 'WETH',
    depositTokenDecimal: 18,
    borrowTokenSymbol: 'TUSD',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 78,
    getTORQ: 32,
    borrowRate: 0,
    borrowContractInfo: borrowEthContract,
    tokenContractInfo: tokenEthContract,
    tokenBorrowContractInfo: tokenTusdContract,
    name: 'Ether',
  },
]
