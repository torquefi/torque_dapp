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
import Popover from '@/components/common/Popover'

export default function CreateBorrowVault({ setIsFetchBorrowLoading }: any) {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [activeViewIndex, setActiveViewIndex] = useState(1)
  const { address, isConnected } = useAccount()
  const { borrowInfoByDepositSymbol } = useSelector(
    (store: AppState) => store?.borrow
  )
  const [view, setView] = useState('row')

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

  // const tabs = [
  //   { id: 0, name: 'Native', content: 'Content for Native' },
  //   { id: 1, name: 'Stable', content: 'Content for Stable' },
  // ];

  console.log('dataBorrow :>> ', dataBorrow)

  return (
    <div className="space-y-[18px]">
      <div className="flex items-center justify-between">
        <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
          Create Borrow Vault
        </h3>
        <div className="flex items-center justify-center space-x-3">
          {/* <div className="flex h-[36px] max-w-[140px] border border-[#efefef] dark:border-[#1a1a1a] rounded-[4px]">
            <div className="flex px-[3px] py-[3px]">
              <HoverIndicator activeIndex={activeTabIndex} className="flex w-full justify-between">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabIndex(index)}
                    className={`flex justify-center items-center px-[10px] py-[6px] text-sm ${activeTabIndex === index ? 'text-[#030303]' : 'text-[#959595]'} dark:text-white focus:outline-none ${index === 0 ? 'rounded-tl-[4px]' : ''} ${index === tabs.length - 1 ? 'rounded-tr-[4px]' : ''}`}
                  >
                    {tab.name}
                  </button>
                ))}
              </HoverIndicator>
            </div>
            <div className="p-4">
              {tabs[activeTabIndex].content}
            </div>
          </div> */}
          <div className="flex h-[36px] w-auto items-center justify-center rounded-[4px] border border-[#efefef] bg-transparent px-[3px] py-[4px] dark:border-[#1a1a1a]">
            <HoverIndicator
              activeIndex={activeViewIndex}
              className="flex w-full justify-between"
            >
              <button
                id="rowViewButton"
                className="focus:outline-none"
                onClick={() => {
                  setActiveViewIndex(0)
                  setView('row')
                }}
              >
                <img
                  src="../icons/rows.svg"
                  alt="Row View"
                  className={`ml-[6px] mr-[6px] h-6 w-6 ${activeViewIndex === 0 ? 'text-[#030303]' : 'text-[#959595]'
                    } dark:text-white`}
                />
              </button>
              <button
                id="gridViewButton"
                className="focus:outline-none"
                onClick={() => {
                  setActiveViewIndex(1)
                  setView('grid')
                }}
              >
                <img
                  src="../icons/grid.svg"
                  alt="Grid View"
                  className={`ml-[6px] mr-[6px] h-6 w-6 ${activeViewIndex === 1 ? 'text-[#030303]' : 'text-[#959595]'
                    } dark:text-white`}
                />
              </button>
            </HoverIndicator>
          </div>
        </div>
      </div>
      {view === 'grid' && (
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

      {view === 'row' && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className='text-left'>
                  <div className="inline-flex items-center">
                    <span className='text-[#959595] text-[20px] font-[500]'>Collateral</span>
                    <Popover
                      trigger="hover"
                      placement="top-left"
                      className={`font-mona z-100 mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content=""
                    >
                      <button className="ml-[5px] mt-[7px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="risk score system"
                          className="w-[13px]"
                        />
                      </button>
                    </Popover>
                  </div>
                </th>
                <th className='text-left'>
                  <div className="inline-flex items-center">
                    <span className='text-[#959595] text-[20px] font-[500]'>Borrowing</span>
                    <Popover
                      trigger="hover"
                      placement="top-left"
                      className={`font-mona z-100 mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content=""
                    >
                      <button className="ml-[5px] mt-[7px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="risk score system"
                          className="w-[13px]"
                        />
                      </button>
                    </Popover>
                  </div>
                </th>
                <th className='text-left'>
                  <div className="inline-flex items-center">
                    <span className='text-[#959595] text-[20px] font-[500]'>LTV</span>
                    <Popover
                      trigger="hover"
                      placement="top-left"
                      className={`font-mona z-100 mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Max value of the loan you can take out against your collateral."
                    >
                      <button className="ml-[5px] mt-[7px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="risk score system"
                          className="w-[13px]"
                        />
                      </button>
                    </Popover>
                  </div>
                </th>
                <th className='text-left'>
                  <div className="inline-flex items-center">
                    <span className='text-[#959595] text-[20px] font-[500]'>APR</span>
                    <Popover
                      trigger="hover"
                      placement="top-left"
                      className={`font-mona z-100 mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="An interest rate determined by supply and demand of the asset."
                    >
                      <button className="ml-[5px] mt-[7px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="risk score system"
                          className="w-[13px]"
                        />
                      </button>
                    </Popover>
                  </div>
                </th>
                <th className='text-left'>
                  <div className="inline-flex items-center">
                    <span className='text-[#959595] text-[20px] font-[500]'>Liquidity</span>
                    <Popover
                      trigger="hover"
                      placement="top-left"
                      className={`font-mona z-100 mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="Available amount of borrowing power in the market at this time."
                    >
                      <button className="ml-[5px] mt-[7px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="risk score system"
                          className="w-[13px]"
                        />
                      </button>
                    </Popover>
                  </div>
                </th>
                <th className='text-left'>
                  <div className="inline-flex items-center">
                    <span className='text-[#959595] text-[20px] font-[500]'>Rewards</span>
                    <Popover
                      trigger="hover"
                      placement="top-left"
                      className={`font-mona z-100 mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="The projected TORQ rewards after 1 year of $1,000 borrowed"
                    >
                      <button className="ml-[5px] mt-[7px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="risk score system"
                          className="w-[13px]"
                        />
                      </button>
                    </Popover>
                  </div>
                </th>
                <th className='text-left'>
                  <div className="inline-flex items-center">
                    <span className='text-[#959595] text-[20px] font-[500]'>Supplied</span>
                    <Popover
                      trigger="hover"
                      placement="top-left"
                      className={`font-mona z-100 mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content=""
                    >
                      <button className="ml-[5px] mt-[7px]">
                        <img
                          src="/assets/pages/vote/ic-info.svg"
                          alt="risk score system"
                          className="w-[13px]"
                        />
                      </button>
                    </Popover>
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
