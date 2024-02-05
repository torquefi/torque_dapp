import NumberFormat from '@/components/common/NumberFormat'
import SkeletonDefault from '@/components/skeleton'
import { AppStore } from '@/types/store'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContract,
  borrowEthContract,
  tokenBtcContract,
  tokenEthContract,
} from '../Borrow/constants/contract'
import { ethers } from 'ethers'
import { tokenTusdContract } from '../Borrow/constants/contract'
import {
  boostWbtcContract,
  boostWethContract,
} from '../Boost/constants/contracts'
import { arbitrum } from 'wagmi/chains'

const RPC = arbitrum.rpcUrls.default.http[0]
console.log('rpc :>> ', RPC)

const HomePageFilter = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [netAPY, setNetAPY] = useState('0')

  // new
  const [totalBorrow, setTotalBorrow] = useState('0')
  const [totalSupplied, setTotalSupplied] = useState('0')
  const [totalMySupplied, setTotalMySupplied] = useState('0')
  const [totalMyBorrowed, setTotalMyBorrowed] = useState('0')
  const [borrowedPercent, setBorrowedPercent] = useState('0')

  const [totalBoostSupply, setTotalBoostSupply] = useState('0')
  const [totalMyBoostSupply, setTotalMyBoostSupply] = useState('0')
  console.log('totalMyBoostSupply :>> ', totalMyBoostSupply);

  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)
  const wbtcPrice = usdPrice['WBTC'] || 0
  const wethPrice = usdPrice['WETH'] || 0
  const tusdPrice = usdPrice['TUSD'] || 0

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])
  // borrow
  const borrowWBTCContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(borrowBtcContract?.abi),
      borrowBtcContract?.address
    )
    return contract
  }, [Web3.givenProvider, borrowBtcContract])

  const borrowWETHContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(borrowEthContract?.abi),
      borrowEthContract?.address
    )
    return contract
  }, [Web3.givenProvider, borrowEthContract])

  // boost
  const boostWBTCContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(boostWbtcContract?.abi),
      boostWbtcContract?.address
    )
    return contract
  }, [Web3.givenProvider, boostWbtcContract])

  const boostWETHContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(boostWethContract?.abi),
      boostWethContract?.address
    )
    return contract
  }, [Web3.givenProvider, boostWethContract])

  // token
  const tokenWBTCContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenBtcContract?.abi),
      tokenBtcContract?.address
    )
    return contract
  }, [Web3.givenProvider, tokenBtcContract])

  const tokenWETHContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenEthContract?.abi),
      tokenEthContract?.address
    )
    return contract
  }, [Web3.givenProvider, tokenEthContract])

  const tokenTUSDContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenTusdContract?.abi),
      tokenTusdContract?.address
    )
    return contract
  }, [Web3.givenProvider, tokenEthContract])

  const handleGetMyBorrowInfo = async () => {
    try {
      if (
        !borrowWBTCContract ||
        !borrowWETHContract ||
        !tokenWBTCContract ||
        !tokenWETHContract ||
        !tokenTUSDContract ||
        !boostWBTCContract ||
        !boostWETHContract ||
        !address
      ) {
        return
      }
      const tusdDecimal = await tokenTUSDContract.methods.decimals().call()

      // WBTC
      const wbtcDecimal = await tokenWBTCContract.methods.decimals().call()
      const myDataWbtcBorrow = await borrowWBTCContract.methods
        .borrowInfoMap(address)
        .call()

      // my supplied wbtc
      const myWbtcSupply = myDataWbtcBorrow.supplied
      const myWbtcSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(myWbtcSupply, wbtcDecimal)
      )
        .multipliedBy(wbtcPrice)
        .toString()
      console.log('myDataWBTCBorrow :>> ', myDataWbtcBorrow)
      console.log('myWbtcSupply :>> ', myWbtcSupply)
      console.log('myWbtcSuppliedUsd :>> ', myWbtcSuppliedUsd)

      // my borrow wbtc
      const myWbtcBorrowed = myDataWbtcBorrow.baseBorrowed
      const myWbtcBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(myWbtcBorrowed, tusdDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()

      const wbtcCollateral = new BigNumber(
        ethers.utils.formatUnits(myDataWbtcBorrow.supplied, wbtcDecimal)
      ).toString()
      const wbtcCollateralUsd = new BigNumber(wbtcCollateral || '0')
        .multipliedBy(usdPrice['WBTC'] || 0)
        .toString()
      const wbtcLoanToValue = !wbtcCollateralUsd
        ? '0'
        : new BigNumber(myWbtcBorrowedUsd)
          .dividedBy(new BigNumber(wbtcCollateralUsd))
          .toString()
      console.log('wbtcLoanToValue :>> ', wbtcLoanToValue)
      console.log('wbtcCollateral :>> ', wbtcCollateral)
      console.log('myWbtcBorrowed :>> ', myWbtcBorrowed)
      console.log('myWbtcBorrowedUsd :>> ', myWbtcBorrowedUsd)

      // WETH
      const wethDecimal = await tokenWETHContract.methods.decimals().call()
      const myDataWethBorrow = await borrowWETHContract.methods
        .borrowInfoMap(address)
        .call()

      // my supplied weth
      const myWethSupply = myDataWethBorrow.supplied
      const myWethSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(myWethSupply, wethDecimal)
      )
        .multipliedBy(wethPrice)
        .toString()

      console.log('myDataWethBorrow :>> ', myDataWethBorrow)
      console.log('myWethSupply :>> ', myWethSupply)
      console.log('myWethSuppliedUsd :>> ', myWethSuppliedUsd)

      // my borrow weth
      const myWethBorrowed = myDataWethBorrow.baseBorrowed
      const myWethBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(myWethBorrowed, tusdDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()
      const wethCollateral = new BigNumber(
        ethers.utils.formatUnits(myDataWethBorrow.supplied, wethDecimal)
      ).toString()
      const wethCollateralUsd = new BigNumber(wethCollateral || '0')
        .multipliedBy(usdPrice['WETH'] || 0)
        .toString()
      const wethLoanToValue = !wethCollateralUsd
        ? '0'
        : new BigNumber(myWethBorrowedUsd)
          .dividedBy(new BigNumber(wethCollateralUsd))
          .toString()
      console.log('wethLoanToValue :>> ', wethLoanToValue)
      console.log('myWethBorrowed :>> ', myWethBorrowed)
      console.log('myWethBorrowedUsd :>> ', myWethBorrowedUsd)

      let borrowedPercent = 0
      if (Number(wethLoanToValue) > 0 && Number(wbtcLoanToValue) > 0) {
        borrowedPercent =
          100 -
          (70 - Number(wbtcLoanToValue) * 100) -
          (78 - Number(wethLoanToValue) * 100)
      } else if (Number(wethLoanToValue) > 0 && !Number(wbtcLoanToValue)) {
        borrowedPercent = 100 - (78 - Number(wethLoanToValue) * 100)
      } else if (!Number(wethLoanToValue) && Number(wbtcLoanToValue) > 0) {
        borrowedPercent = 100 - (70 - Number(wbtcLoanToValue) * 100)
      }
      setBorrowedPercent(borrowedPercent.toString())

      // boost

      // WBTC
      const tokenWbtcDecimal = await tokenWBTCContract.methods.decimals().call()
      const depositedWbtc = await boostWBTCContract.methods
        .balanceOf(address)
        .call()
      console.log('depositedWbtc 1111:>> ', depositedWbtc);
      const depositedWbtcUsd = new BigNumber(
        ethers.utils.formatUnits(depositedWbtc
          , tokenWbtcDecimal).toString()
      )
        .multipliedBy(new BigNumber(wbtcPrice || 0))
        .toString()

      // WETH
      const tokenWethDecimal = await tokenWETHContract.methods.decimals().call()
      const depositedWeth = await boostWETHContract.methods
        .balanceOf(address)
        .call()
      console.log('depositedWeth 1111:>> ', depositedWeth);
      const depositedWethUsd = new BigNumber(
        ethers.utils.formatUnits(depositedWeth
          , tokenWethDecimal).toString()
      )
        .multipliedBy(new BigNumber(wethPrice || 0))
        .toString()
      setTotalMyBoostSupply(new BigNumber(depositedWbtcUsd).plus(new BigNumber(depositedWethUsd)).toString())

      setTotalMySupplied(
        new BigNumber(myWbtcSuppliedUsd)
          .plus(new BigNumber(myWethSuppliedUsd))
          .plus(new BigNumber(depositedWethUsd))
          .plus(new BigNumber(depositedWbtcUsd))
          .toString()
      )

      setTotalMyBorrowed(
        new BigNumber(myWbtcBorrowedUsd)
          .plus(new BigNumber(myWethBorrowedUsd))
          .toString()
      )
    } catch (error) { }
  }

  useEffect(() => {
    handleGetMyBorrowInfo()
  }, [
    address,
    borrowWBTCContract,
    borrowWETHContract,
    tokenWBTCContract,
    tokenWETHContract,
    tokenTUSDContract,
    boostWBTCContract,
    boostWETHContract,
    wbtcPrice,
    wethPrice,
    tusdPrice,
  ])

  const handleGetBorrowGeneralInfo = async () => {
    try {
      if (
        !borrowWBTCContract ||
        !borrowWETHContract ||
        !tokenWBTCContract ||
        !tokenWETHContract ||
        !tokenTUSDContract ||
        !boostWBTCContract ||
        !boostWETHContract
      ) {
        return
      }
      const tusdDecimal = await tokenTUSDContract.methods.decimals().call()

      // WBTC
      const wbtcDecimal = await tokenWBTCContract.methods.decimals().call()

      // total supplied wbtc
      const totalWbtcSupply = await borrowWBTCContract.methods
        .totalSupplied()
        .call()

      const totalWbtcSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(totalWbtcSupply, wbtcDecimal).toString()
      )
        .multipliedBy(new BigNumber(wbtcPrice || 0))
        .toString()
      console.log('totalWbtcSupply :>> ', totalWbtcSupply)
      console.log('totalWbtcSuppliedUsd wbtc:>> ', totalWbtcSuppliedUsd)

      // total borrow wbtc
      const totalWbtcBorrowed = await borrowWBTCContract.methods
        .totalBorrow()
        .call()
      const totalWbtcBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(totalWbtcBorrowed, tusdDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()

      console.log('totalWbtcBorrowed :>> ', totalWbtcBorrowed)
      console.log('totalWbtcBorrowedUsd :>> ', totalWbtcBorrowedUsd)

      // WETH
      const wethDecimal = await tokenWETHContract.methods.decimals().call()

      // total supplied weth
      const totalWethSupply = await borrowWETHContract.methods
        .totalSupplied()
        .call()
      const totalWethSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(totalWethSupply, wethDecimal).toString()
      )
        .multipliedBy(new BigNumber(wethPrice || 0))
        .toString()
      console.log('totalWethSupply :>> ', totalWbtcSupply)
      console.log('totalWethSuppliedUsd weth:>> ', totalWethSuppliedUsd)

      // total borrowed weth
      const totalWethBorrowed = await borrowWETHContract.methods
        .totalBorrow()
        .call()
      const totalWethBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(totalWethBorrowed, tusdDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()
      console.log('totalWethBorrowed :>> ', totalWethBorrowed)
      console.log('totalWethBorrowedUsd :>> ', totalWethBorrowedUsd)

      // WBTC
      const tokenWbtcDecimal = await tokenWBTCContract.methods.decimals().call()
      const depositedWbtc = await boostWBTCContract.methods.totalSupply().call()
      const depositedWbtcUsd = new BigNumber(
        ethers.utils.formatUnits(depositedWbtc, tokenWbtcDecimal).toString()
      )
        .multipliedBy(new BigNumber(wbtcPrice || 0))
        .toString()

      // WETH
      const tokenWethDecimal = await tokenWETHContract.methods.decimals().call()
      const depositedWeth = await boostWETHContract.methods.totalSupply().call()
      const depositedWethUsd = new BigNumber(
        ethers.utils.formatUnits(depositedWeth, tokenWethDecimal).toString()
      )
        .multipliedBy(new BigNumber(wethPrice || 0))
        .toString()
      // setTotalMyBoostSupply(depositedWethUsd)

      // total supplied
      setTotalSupplied(
        new BigNumber(totalWbtcSuppliedUsd)
          .plus(new BigNumber(totalWethSuppliedUsd))
          .plus(new BigNumber(depositedWethUsd))
          .plus(new BigNumber(depositedWbtcUsd))
          .toString()
      )

      // total borrowed
      setTotalBorrow(
        new BigNumber(totalWbtcBorrowedUsd)
          .plus(new BigNumber(totalWethBorrowedUsd))
          .toString()
      )

      const netApy = await borrowWBTCContract.methods.getApr().call()
      console.log('netApy :>> ', netApy)
      console.log(
        'netAPY :>> ',
        new BigNumber(ethers.utils.formatUnits(netApy, 18)).toString()
      )
      setNetAPY(new BigNumber(ethers.utils.formatUnits(netApy, 18)).toString())
    } catch (error) {
      console.log('error general:>> ', error)
    }
  }

  useEffect(() => {
    handleGetBorrowGeneralInfo()
  }, [
    borrowWBTCContract,
    borrowWETHContract,
    tokenWBTCContract,
    tokenWETHContract,
    tokenTUSDContract,
    boostWBTCContract,
    boostWETHContract,
    address,
    wbtcPrice,
    wethPrice,
    tusdPrice,
  ])

  if (isLoading) {
    return (
      <div className="mt-[80px] md:mt-[0px]">
        <SkeletonDefault className="h-[500px] md:h-[330px]" width={'100%'} />
      </div>
    )
  }

  console.log('totalMyBoostSupply :>> ', totalMyBoostSupply)

  return (
    <div className="relative mt-[80px] flex w-full flex-wrap items-center justify-center rounded-t-[10px] border-[1px] bg-white from-[#25252566] pt-[80px] md:mt-0 md:pt-0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br">
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Total Supply</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            value={
              Number(totalSupplied) > 0
                ? new BigNumber(totalSupplied || 0).toString()
                : 0
            }
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Total Borrow</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            value={totalBorrow || 0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div
        className={
          `hidden h-[1px] w-full md:block ` +
          `${theme === 'light'
            ? `bg-gradient-divider-light`
            : `bg-gradient-divider`
          }`
        }
      ></div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Your Supply</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            value={
              address ? new BigNumber(totalMySupplied || '0').toString() : 0
            }
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Your Borrow</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            value={address ? totalMyBorrowed || '0' : 0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="bottom-[0px] flex w-full items-center justify-between p-[8px] md:absolute md:p-[12px] md:pt-0">
        <div className="space-y-1 leading-tight text-[#404040] dark:text-white">
          <div className="text-[12px] text-[#959595]">Borrow Used</div>
          <NumberFormat
            className="font-larken text-[16px]"
            displayType="text"
            thousandSeparator
            value={address ? borrowedPercent : '0'}
            decimalScale={2}
            fixedDecimalScale
            suffix={'%'}
          />
        </div>
        <div className="space-y-1 text-right leading-tight text-[#404040] dark:text-white">
          <div className="text-[12px] text-[#959595]">Capacity</div>
          <NumberFormat
            className="font-larken text-[16px]"
            displayType="text"
            thousandSeparator
            value={100}
            decimalScale={2}
            fixedDecimalScale
            suffix={'%'}
          />
        </div>
      </div>
      <div className="h-[6px] w-full overflow-hidden bg-[#F7F7F7] dark:bg-[#1F1F1F]">
        <div
          style={{
            width: `${address ? Number(borrowedPercent).toFixed(2) : 0}%`,
          }}
          className="h-full bg-gradient-to-r from-[#C38BFF] to-[#AA5BFF] text-center text-white shadow-none"
        ></div>
      </div>
      <div className="z-100000 absolute top-[-80px] h-[160px] w-[160px] rounded-full border-2 border-[#E6E6E6] bg-white p-2 md:top-auto dark:border-[#25252566] dark:bg-[#1A1A1A]">
        <div className="h-full w-full rounded-full border-4 border-[#C38BFF] dark:bg-[#0D0D0D66]">
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
            <div className="text-[14px] text-[#959595]">NET APY</div>
            <NumberFormat
              className="font-larken text-[28px] text-[#404040] dark:text-white"
              displayType="text"
              thousandSeparator
              value={
                address ? Number(totalMyBoostSupply) > 0 ? Number(netAPY || 0) * 100 :
                  Number(totalMyBorrowed) > 0 && Number(totalMyBoostSupply) <= 0
                    ? -Number(netAPY || 0) * 100
                    : 0 : 0
              }
              decimalScale={2}
              fixedDecimalScale
              suffix={'%'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePageFilter
