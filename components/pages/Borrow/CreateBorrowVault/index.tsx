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
  borrowOldBtcContract,
  borrowOldEthContract,
  simpleBorrowBtcContract,
  simpleBorrowEthContract,
  simpleBtcBorrowUsdtContract,
  simpleEthBorrowUsdtContract,
  tokenBtcContract,
  tokenEthContract,
  tokenTusdContract,
  tokenUsdtContract,
  tokenUsdcContract,
  userBorrowAddressBtcContract,
  userBorrowAddressEthContract,
} from '../constants/contract'
import { 
  compoundUsdcContract as compoundUsdcContractData, 
  compoundUsdtContract as compoundUsdtContractData 
} from '../constants/contract'
import { IBorrowInfo } from '../types'
import CreateBorrowItem from './createBorrowItem'
import HoverIndicator from '@/components/common/HoverIndicator'
import CreateRowBorrowItem from './createRowBorrowItem'
import RcTooltip from '@/components/common/RcTooltip'
import { AppStore } from '@/types/store'
import {
  updateLayoutBorrow,
  updateVisibilityBorrowBanner,
} from '@/lib/redux/slices/layout'
import UniSwapModal from '@/components/common/Modal/UniswapModal'

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

  const [openUniSwapModal, setOpenUniSwapModal] = useState(false)

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
      }
    } catch (error) {
      console.log(
        'CreateBorrowVault.getBorrowData',
        item?.depositTokenSymbol,
        error
      )
    }
  
    try {
      const tokenContract = 
        item.borrowTokenSymbol === 'USDC' || item.borrowTokenSymbol === 'TUSD'
        ? tokenUsdcContract
        : tokenUsdtContract
  
      const balanceAddress = 
        item.borrowTokenSymbol === 'USDT' 
        ? '0xd98Be00b5D27fc98112BdE293e487f8D4cA57d07' 
        : '0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf'
  
      const tokenContractInstance = new web3.eth.Contract(
        JSON.parse(tokenContract?.abi),
        tokenContract?.address
      )
  
      if (tokenContractInstance) {
        let decimals = await tokenContractInstance.methods
          .decimals()
          .call({ from: address })
        let balance = await tokenContractInstance.methods
          .balanceOf(balanceAddress)
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
        'CreateBorrowVault.getBorrowData.tokenContract',
        item?.depositTokenSymbol,
        error
      )
    }
  
    try {
      const compoundContract = 
        item.borrowTokenSymbol === 'USDC' || item.borrowTokenSymbol === 'TUSD'
        ? compoundUsdcContractData 
        : compoundUsdtContractData
  
      const compoundContractInstance = new web3.eth.Contract(
        JSON.parse(compoundContract?.abi),
        compoundContract?.address
      )
  
      if (compoundContractInstance) {
        let utilization = await compoundContractInstance.methods
          .getUtilization()
          .call({ from: address })
        let borrowRate = await compoundContractInstance.methods
          .getBorrowRate(utilization)
          .call({ from: address })
        item.borrowRate = +ethers.utils.formatUnits(borrowRate, 18).toString()
  
        dispatch(
          updateBorrowInfo({
            depositTokenSymbol: item?.depositTokenSymbol,
            borrowRate: item.borrowRate,
          })
        )
      }
    } catch (error) {
      console.log(
        'CreateBorrowVault.getBorrowData.compoundContract',
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
      <UniSwapModal
        open={openUniSwapModal}
        handleClose={() => setOpenUniSwapModal(false)}
      />

      <div className="flex items-center justify-between">
        <h3 className="font-rogan text-[24px] text-[#030303] dark:text-white">
          Create Borrow Vault
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setOpenUniSwapModal(true)}
            className="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[4px] border-[1px] border-[#E6E6E6] border-[solid] focus:outline-none dark:border-[#1a1a1a]"
          >
            <img
              src="/icons/swap-gray.svg"
              alt="swap icon"
              className="w-[22px] text-[#959595]"
            />
          </button>

          <button
            onClick={() =>
              dispatch(
                updateVisibilityBorrowBanner(!visibilityBorrowBanner as any)
              )
            }
            className="hidden md:inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[4px] border-[1px] border-[#E6E6E6] border-[solid] focus:outline-none dark:border-[#1a1a1a]"
          >
            <img
              src={
                visibilityBorrowBanner
                  ? '/icons/visibility-off.svg'
                  : '/icons/visibility-off.svg'
              }
              alt="visibility icon"
              className="w-[22px] text-[#959595]"
            />
          </button>
          <div className="flex h-[36px] w-auto items-center justify-center rounded-[4px] border border-[#efefef] bg-transparent px-[3px] py-[4px] dark:border-[#1a1a1a]">
            <HoverIndicator
              activeIndex={layoutBorrow === 'row' ? 0 : 1}
              className="flex justify-between w-full"
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
                  className={`ml-[6px] mr-[6px] h-6 w-6 ${layoutBorrow === 'grid'
                    ? 'text-[#030303]'
                    : 'text-[#959595]'
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
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
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
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
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
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
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
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
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
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
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
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
                      content="The projected TORQ rewards after 1 year of $1,000 supplied and 70% borrowed."
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
                      className={`font-rogan-regular flex w-[220px] items-center border border-[#e5e7eb] bg-[#fff] py-1 text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
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
    borrowTokenSymbol: 'USDC',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 70,
    getTORQ: 28,
    borrowRate: 0,
    borrowContractInfo: simpleBorrowBtcContract,
    tokenContractInfo: tokenBtcContract,
    tokenBorrowContractInfo: tokenUsdcContract,
    userAddressContractInfo: userBorrowAddressBtcContract,
    name: 'Bitcoin',
    bonus: 529.63,
    arbBonus: 1564.30,
    borrowRowTokenIcon: '/icons/coin/usdc.png',
  },
  {
    depositTokenIcon: '/icons/coin/aeth.png',
    depositTokenSymbol: 'WETH',
    depositTokenDecimal: 18,
    borrowTokenSymbol: 'USDC',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 78,
    getTORQ: 32,
    borrowRate: 0,
    borrowContractInfo: simpleBorrowEthContract,
    tokenContractInfo: tokenEthContract,
    tokenBorrowContractInfo: tokenUsdcContract,
    userAddressContractInfo: userBorrowAddressEthContract,
    name: 'Ether',
    bonus: 529.63,
    arbBonus: 1564.30,
    borrowRowTokenIcon: '/icons/coin/usdc.png',
  },
  {
    depositTokenIcon: '/icons/coin/wbtc.png',
    depositTokenSymbol: 'WBTC',
    depositTokenDecimal: 8,
    borrowTokenSymbol: 'USDT',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 70,
    getTORQ: 28,
    borrowRate: 0,
    borrowContractInfo: simpleBtcBorrowUsdtContract,
    tokenContractInfo: tokenBtcContract,
    tokenBorrowContractInfo: tokenUsdtContract,
    userAddressContractInfo: userBorrowAddressBtcContract,
    name: 'Bitcoin',
    bonus: 529.63,
    arbBonus: 0,
    borrowRowTokenIcon: '/icons/coin/usdt.png',
  },
  {
    depositTokenIcon: '/icons/coin/aeth.png',
    depositTokenSymbol: 'WETH',
    depositTokenDecimal: 18,
    borrowTokenSymbol: 'USDT',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 85,
    getTORQ: 32,
    borrowRate: 0,
    borrowContractInfo: simpleEthBorrowUsdtContract,
    tokenContractInfo: tokenEthContract,
    tokenBorrowContractInfo: tokenUsdtContract,
    userAddressContractInfo: userBorrowAddressEthContract,
    name: 'Ether',
    bonus: 529.63,
    arbBonus: 0,
    borrowRowTokenIcon: '/icons/coin/usdt.png',
  },
  {
    depositTokenIcon: '/icons/coin/wbtc.png',
    borrowTokenIcon: '/icons/coin/tusd.svg',
    depositTokenSymbol: 'WBTC',
    depositTokenDecimal: 8,
    borrowTokenSymbol: 'TUSD',
    borrowRowTokenIcon: '/icons/coin/tusd.svg',
    borrowTokenDecimal: 6,
    liquidity: 0,
    loanToValue: 70,
    getTORQ: 28,
    borrowRate: 0,
    borrowContractInfo: borrowBtcContract,
    tokenContractInfo: tokenBtcContract,
    tokenBorrowContractInfo: tokenTusdContract,
    userAddressContractInfo: userBorrowAddressBtcContract,
    oldBorrowContractInfo: borrowOldBtcContract,
    name: 'Bitcoin',
    bonus: 529.63,
    arbBonus: 0,
    multiLoan: true,
  },
  {
    depositTokenIcon: '/icons/coin/aeth.png',
    borrowTokenIcon: '/icons/coin/tusd.svg',
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
    userAddressContractInfo: userBorrowAddressEthContract,
    oldBorrowContractInfo: borrowOldEthContract,
    name: 'Ether',
    bonus: 529.63,
    arbBonus: 0,
    multiLoan: true,
    borrowRowTokenIcon: '/icons/coin/tusd.svg',
  },
]