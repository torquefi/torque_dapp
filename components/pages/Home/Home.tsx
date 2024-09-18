import NumberFormat from '@/components/common/NumberFormat'
import SkeletonDefault from '@/components/skeleton'
import { TokenApr } from '@/lib/api/TokenApr'
import { updateHomeInfo } from '@/lib/redux/slices/home'
import { AppStore } from '@/types/store'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import { arbitrum } from 'wagmi/chains'
import Web3 from 'web3'
import {
  boostCompContract,
  boostLinkContract,
  boostTorqContract,
  boostUniContract,
  boostWbtcContract,
  boostWethContract,
  compContract,
  linkContract,
  torqContract,
  uniContract,
} from '../Boost/constants/contracts'
import {
  borrowBtcContract,
  borrowEthContract,
  borrowOldBtcContract,
  simpleBorrowBtcContract,
  simpleBorrowEthContract,
  simpleBtcBorrowUsdtContract,
  simpleEthBorrowUsdtContract,
  tokenBtcContract,
  tokenEthContract,
  tokenTusdContract,
  tokenUsdcContract,
  tokenUsdtContract,
} from '../Borrow/constants/contract'

const RPC = arbitrum.rpcUrls.default.http[0]
const EXTRA_RPC = 'https://arbitrum-one.publicnode.com'

const HomePageFilter = () => {
  const { address } = useAccount()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [netAPY, setNetAPY] = useState('0')
  const home = useSelector((store: AppStore) => store.home)

  const [borrowedPercent, setBorrowedPercent] = useState('0')

  const [totalMyBoostSupply, setTotalMyBoostSupply] = useState('0')
  const [aprWbtcBoost, setAprWbtcBoost] = useState(0)
  const [aprWethBoost, setAprWethBoost] = useState(0)
  const [depositedWethUsd, setDepositedWethUsd] = useState('0')
  const [depositedWbtcUsd, setDepositedWbtcUsd] = useState('0')

  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)
  const wbtcPrice = usdPrice['WBTC'] || 0
  const wethPrice = usdPrice['WETH'] || 0
  const tusdPrice = usdPrice['TUSD'] || 0
  const usdtPrice = usdPrice['USDT'] || 0
  const linkPrice = usdPrice['LINK'] || 0
  const uniPrice = usdPrice['UNI'] || 0
  const compPrice = usdPrice['COMP'] || 0
  const torqPrice = usdPrice['TORQ'] || 0

  const handleGetDepositApr = async () => {
    try {
      const aprRes = await TokenApr.getListApr({})
      const aprs: any[] = aprRes?.data || []
      const aprWbtcBoost = aprs?.find((apr) => apr?.name === 'WBTC')?.apr || 0
      setAprWbtcBoost(aprWbtcBoost)
      const aprWethBoost = aprs?.find((apr) => apr?.name === 'WETH')?.apr || 0
      setAprWethBoost(aprWethBoost)
      console.log('aprs :>> ', aprs)
    } catch (error) {
      console.log('error 1111:>> ', error)
    }
  }

  const aprBoost = useMemo(() => {
    if (Number(depositedWethUsd) && Number(depositedWbtcUsd)) {
      return (aprWbtcBoost + aprWethBoost) / 2
    } else if (!Number(depositedWethUsd) && !Number(depositedWbtcUsd)) {
      return 0
    } else if (!Number(depositedWethUsd) && Number(depositedWbtcUsd)) {
      return aprWbtcBoost
    } else if (Number(depositedWethUsd) && !Number(depositedWbtcUsd)) {
      return aprWethBoost
    }
    return 0
  }, [aprWbtcBoost, aprWethBoost, depositedWethUsd, depositedWbtcUsd])

  useEffect(() => {
    handleGetDepositApr()
  }, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  // borrow
  const oldBorrowContract = useMemo(() => {
    const web3 = new Web3(EXTRA_RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(borrowOldBtcContract?.abi),
      borrowOldBtcContract?.address
    )
    return contract
  }, [Web3.givenProvider, borrowOldBtcContract])

  const borrowWBTCContract = useMemo(() => {
    const web3 = new Web3(EXTRA_RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(borrowBtcContract?.abi),
      borrowBtcContract?.address
    )
    return contract
  }, [Web3.givenProvider, borrowBtcContract])

  const borrowWETHContract = useMemo(() => {
    const web3 = new Web3(EXTRA_RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(borrowEthContract?.abi),
      borrowEthContract?.address
    )
    return contract
  }, [Web3.givenProvider, borrowEthContract])

  const borrowSimpleWETHContract = useMemo(() => {
    const web3 = new Web3(EXTRA_RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(simpleBorrowEthContract?.abi),
      simpleBorrowEthContract?.address
    )
    return contract
  }, [Web3.givenProvider, simpleBorrowEthContract])

  const borrowSimpleWBTCContract = useMemo(() => {
    const web3 = new Web3(EXTRA_RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(simpleBorrowBtcContract?.abi),
      simpleBorrowBtcContract?.address
    )
    return contract
  }, [Web3.givenProvider, simpleBorrowBtcContract])

  const borrowSimpleUSDTContract = useMemo(() => {
    const web3 = new Web3(EXTRA_RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(simpleBtcBorrowUsdtContract?.abi),
      simpleBtcBorrowUsdtContract?.address
    )
    return contract
  }, [Web3.givenProvider, simpleBtcBorrowUsdtContract])

  const borrowSimpleEthUSDTContract = useMemo(() => {
    const web3 = new Web3(EXTRA_RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(simpleEthBorrowUsdtContract?.abi),
      simpleEthBorrowUsdtContract?.address
    )
    return contract
  }, [Web3.givenProvider, simpleEthBorrowUsdtContract])

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

  const boostLINKContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(boostLinkContract?.abi),
      boostLinkContract?.address
    )
    return contract
  }, [Web3.givenProvider, boostLinkContract])

  const boostUNIContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(boostUniContract?.abi),
      boostUniContract?.address
    )
    return contract
  }, [Web3.givenProvider, boostUniContract])

  const boostCOMPContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(boostCompContract?.abi),
      boostCompContract?.address
    )
    return contract
  }, [Web3.givenProvider, boostCompContract])

  const boostTORQContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(boostTorqContract?.abi),
      boostTorqContract?.address
    )
    return contract
  }, [Web3.givenProvider, boostTorqContract])

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
  }, [Web3.givenProvider, tokenTusdContract])

  const tokenUSDCContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenUsdcContract?.abi),
      tokenUsdcContract?.address
    )
    return contract
  }, [Web3.givenProvider, tokenUsdcContract])

  const tokenUSDTContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenUsdtContract?.abi),
      tokenUsdtContract?.address
    )
    return contract
  }, [Web3.givenProvider, tokenUsdtContract])

  const tokenUNIContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(uniContract?.abi),
      uniContract?.address
    )
    return contract
  }, [Web3.givenProvider, uniContract])

  const tokenLINKContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(linkContract?.abi),
      linkContract?.address
    )
    return contract
  }, [Web3.givenProvider, linkContract])

  const tokenCOMPContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(compContract?.abi),
      linkContract?.address
    )
    return contract
  }, [Web3.givenProvider, linkContract])

  const tokenTORQContract = useMemo(() => {
    const web3 = new Web3(RPC)
    const contract = new web3.eth.Contract(
      JSON.parse(torqContract?.abi),
      linkContract?.address
    )
    return contract
  }, [Web3.givenProvider, linkContract])

  const handleGetMyBorrowInfo = async () => {
    try {
      if (
        !borrowWBTCContract ||
        !borrowWETHContract ||
        !tokenWBTCContract ||
        !tokenWETHContract ||
        !tokenTUSDContract ||
        !tokenUSDTContract ||
        !boostWBTCContract ||
        !boostWETHContract ||
        !boostLINKContract ||
        !boostUNIContract ||
        !boostCOMPContract ||
        !address ||
        !simpleBtcBorrowUsdtContract ||
        !simpleEthBorrowUsdtContract ||
        !borrowSimpleWBTCContract ||
        !borrowSimpleWETHContract
      ) {
        return
      }
      const tusdDecimal = await tokenTUSDContract.methods.decimals().call()
      const usdcDecimal = await tokenUSDCContract.methods.decimals().call()
      const usdtDecimal = await tokenUSDTContract.methods.decimals().call()

      // WBTC
      const wbtcDecimal = await tokenWBTCContract.methods.decimals().call()
      const userBorrowAddressContract = await borrowWBTCContract.methods
        .userContract(address)
        .call()
      let myWbtcSupply = '0'
      let myWbtcBorrowed = '0'
      if (
        userBorrowAddressContract !==
        '0x0000000000000000000000000000000000000000'
      ) {
        const myDataWbtcBorrow = await borrowWBTCContract.methods
          .getUserDetails(address)
          .call()
        myWbtcBorrowed = myDataWbtcBorrow?.['2']
        myWbtcSupply = myDataWbtcBorrow?.['0']
      }

      // user simple address borrow wbtc
      const userSimpleBorrowAddressContract =
        await borrowSimpleWBTCContract.methods.userContract(address).call()
      let mySimpleWbtcSupply = '0'
      let mySimpleWbtcBorrowed = '0'
      if (
        userSimpleBorrowAddressContract !==
        '0x0000000000000000000000000000000000000000'
      ) {
        const myDataSimpleWbtcBorrow = await borrowSimpleWBTCContract.methods
          .getUserDetails(address)
          .call()
        console.log('myDataSimpleWbtcBorrow :>> ', myDataSimpleWbtcBorrow)
        mySimpleWbtcSupply = myDataSimpleWbtcBorrow?.['0']
        mySimpleWbtcBorrowed = myDataSimpleWbtcBorrow?.['1']
      }

      // my supplied wbtc
      const myWbtcSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(myWbtcSupply, wbtcDecimal)
      )
        .multipliedBy(wbtcPrice)
        .toString()

      const mySimpleWbtcSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(mySimpleWbtcSupply || '0', wbtcDecimal)
      )
        .multipliedBy(wbtcPrice)
        .toString()

      console.log('myWbtcSupply :>> ', myWbtcSupply)
      console.log('myWbtcSuppliedUsd :>> ', myWbtcSuppliedUsd)
      console.log('mySimpleWbtcSupply :>> ', mySimpleWbtcSupply)
      console.log('mySimpleWbtcSuppliedUsd :>> ', mySimpleWbtcSuppliedUsd)

      // my borrow wbtc
      const myWbtcBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(myWbtcBorrowed, tusdDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()
      const mySimpleWbtcBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(mySimpleWbtcBorrowed, usdcDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()

      const wbtcCollateral = new BigNumber(
        ethers.utils.formatUnits(myWbtcSupply, wbtcDecimal)
      )
        .plus(
          new BigNumber(
            ethers.utils.formatUnits(mySimpleWbtcSupply, wbtcDecimal)
          )
        )
        .toString()
      const wbtcCollateralUsd = new BigNumber(wbtcCollateral || '0')
        .multipliedBy(usdPrice['WBTC'] || 0)
        .toString()
      const wbtcLoanToValue = !Number(wbtcCollateralUsd)
        ? '0'
        : new BigNumber(
            new BigNumber(myWbtcBorrowedUsd).plus(
              new BigNumber(mySimpleWbtcBorrowedUsd)
            )
          )
            .dividedBy(new BigNumber(wbtcCollateralUsd))
            .toString()
      console.log('wbtcLoanToValue :>> ', wbtcLoanToValue)
      console.log('myWbtcBorrowedUsd :>> ', myWbtcBorrowedUsd)
      console.log('mySimpleWbtcBorrowedUsd :>> ', mySimpleWbtcBorrowedUsd)

      // WETH
      const wethDecimal = await tokenWETHContract.methods.decimals().call()
      const userBorrowWethAddressContract = await borrowWETHContract.methods
        .userContract(address)
        .call()
      let myWethSupply = '0'
      let myWethBorrowed = '0'
      if (
        userBorrowWethAddressContract !==
        '0x0000000000000000000000000000000000000000'
      ) {
        const myDataWethBorrow = await borrowWETHContract.methods
          .getUserDetails(address)
          .call()
        myWethBorrowed = myDataWethBorrow?.['2']
        myWethSupply = myDataWethBorrow?.['0']
      }

      const userSimpleBorrowWethAddressContract =
        await borrowSimpleWETHContract.methods.userContract(address).call()
      let mySimpleWethSupply = '0'
      let mySimpleWethBorrowed = '0'
      if (
        userSimpleBorrowWethAddressContract !==
        '0x0000000000000000000000000000000000000000'
      ) {
        const myDataSimpleWethBorrow = await borrowSimpleWETHContract.methods
          .getUserDetails(address)
          .call()
        console.log('myDataSimpleWethBorrow :>> ', myDataSimpleWethBorrow)
        mySimpleWethBorrowed = myDataSimpleWethBorrow?.['1']
        mySimpleWethSupply = myDataSimpleWethBorrow?.['0']
      }

      // my supplied weth
      const myWethSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(myWethSupply, wethDecimal)
      )
        .multipliedBy(wethPrice)
        .toString()
      const mySimpleWethSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(mySimpleWethSupply, wethDecimal)
      )
        .multipliedBy(wethPrice)
        .toString()

      console.log('myWethSupply :>> ', myWethSupply)
      console.log('myWethSuppliedUsd :>> ', myWethSuppliedUsd)
      console.log('mySimpleWethSupply :>> ', mySimpleWethSupply)
      console.log('mySimpleWethSuppliedUsd :>> ', mySimpleWethSuppliedUsd)

      // my borrow weth
      const myWethBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(myWethBorrowed, tusdDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()
      const mySimpleWethBorrowedUsd = new BigNumber(
        ethers.utils
          .formatUnits(mySimpleWethBorrowed || '0', usdcDecimal)
          .toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()

      const wethCollateral = new BigNumber(
        ethers.utils.formatUnits(myWethSupply, wethDecimal)
      )
        .plus(
          new BigNumber(
            ethers.utils.formatUnits(mySimpleWethSupply, wethDecimal)
          )
        )
        .toString()
      const wethCollateralUsd = new BigNumber(wethCollateral || '0')
        .multipliedBy(usdPrice['WETH'] || 0)
        .toString()
      const wethLoanToValue = !Number(wethCollateralUsd)
        ? '0'
        : new BigNumber(
            new BigNumber(myWethBorrowedUsd).plus(
              new BigNumber(mySimpleWethBorrowedUsd)
            )
          )
            .dividedBy(new BigNumber(wethCollateralUsd))
            .toString()
      console.log('wethLoanToValue :>> ', wethLoanToValue)
      console.log('myWethBorrowed :>> ', myWethBorrowed)
      console.log('myWethBorrowedUsd :>> ', myWethBorrowedUsd)
      console.log('wbtcLoanToValue :>> ', wbtcLoanToValue)

      // USDT Borrowing
      // WBTC
      const userSimpleUsdtBorrowWbtcAddressContract =
        await borrowSimpleUSDTContract.methods.userContract(address).call()
      let mySimpleUsdtWbtcSupply = '0'
      let mySimpleUsdtWbtcBorrowed = '0'
      if (
        userSimpleUsdtBorrowWbtcAddressContract !==
        '0x0000000000000000000000000000000000000000'
      ) {
        const myDataSimpleUsdtWbtcBorrow =
          await borrowSimpleUSDTContract.methods.getUserDetails(address).call()
        console.log(
          'myDataSimpleUsdtWbtcBorrow :>> ',
          myDataSimpleUsdtWbtcBorrow
        )
        mySimpleUsdtWbtcSupply = myDataSimpleUsdtWbtcBorrow?.['0']
        mySimpleUsdtWbtcBorrowed = myDataSimpleUsdtWbtcBorrow?.['1']
      }

      // WETH
      const userSimpleUsdtBorrowWethAddressContract =
        await borrowSimpleEthUSDTContract.methods.userContract(address).call()
      let mySimpleUsdtWethSupply = '0'
      let mySimpleUsdtWethBorrowed = '0'
      if (
        userSimpleUsdtBorrowWethAddressContract !==
        '0x0000000000000000000000000000000000000000'
      ) {
        const myDataSimpleUsdtWethBorrow =
          await borrowSimpleEthUSDTContract.methods
            .getUserDetails(address)
            .call()
        console.log(
          'myDataSimpleUsdtWethBorrow :>> ',
          myDataSimpleUsdtWethBorrow
        )
        mySimpleUsdtWethSupply = myDataSimpleUsdtWethBorrow?.['0']
        mySimpleUsdtWethBorrowed = myDataSimpleUsdtWethBorrow?.['1']
      }

      // my supplied usdt
      const mySimpleUsdtWbtcSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(mySimpleUsdtWbtcSupply || '0', wbtcDecimal)
      )
        .multipliedBy(wbtcPrice)
        .toString()
      const mySimpleUsdtWethSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(mySimpleUsdtWethSupply, wethDecimal)
      )
        .multipliedBy(wethPrice)
        .toString()

      // my borrow usdt
      const mySimpleUsdtWbtcBorrowedUsd = new BigNumber(
        ethers.utils
          .formatUnits(mySimpleUsdtWbtcBorrowed, usdtDecimal)
          .toString()
      )
        .multipliedBy(new BigNumber(usdtPrice || 0))
        .toString()
      const mySimpleUsdtWethBorrowedUsd = new BigNumber(
        ethers.utils
          .formatUnits(mySimpleUsdtWethBorrowed || '0', usdtDecimal)
          .toString()
      )
        .multipliedBy(new BigNumber(usdtPrice || 0))
        .toString()

      // Total supplied and borrowed including USDT
      const wbtcCollateralIncludingUsdt = new BigNumber(wbtcCollateral)
        .plus(
          new BigNumber(
            ethers.utils.formatUnits(mySimpleUsdtWbtcSupply, wbtcDecimal)
          )
        )
        .toString()

      const wbtcCollateralUsdIncludingUsdt = new BigNumber(
        wbtcCollateralIncludingUsdt || '0'
      )
        .multipliedBy(usdPrice['WBTC'] || 0)
        .toString()

      const wethCollateralIncludingUsdt = new BigNumber(wethCollateral)
        .plus(
          new BigNumber(
            ethers.utils.formatUnits(mySimpleUsdtWethSupply, wethDecimal)
          )
        )
        .toString()

      const wethCollateralUsdIncludingUsdt = new BigNumber(
        wethCollateralIncludingUsdt || '0'
      )
        .multipliedBy(usdPrice['WETH'] || 0)
        .toString()

      const wbtcLoanToValueIncludingUsdt = !Number(
        wbtcCollateralUsdIncludingUsdt
      )
        ? '0'
        : new BigNumber(
            new BigNumber(myWbtcBorrowedUsd)
              .plus(new BigNumber(mySimpleWbtcBorrowedUsd))
              .plus(new BigNumber(mySimpleUsdtWbtcBorrowedUsd))
          )
            .dividedBy(new BigNumber(wbtcCollateralUsdIncludingUsdt))
            .toString()

      const wethLoanToValueIncludingUsdt = !Number(
        wethCollateralUsdIncludingUsdt
      )
        ? '0'
        : new BigNumber(
            new BigNumber(myWethBorrowedUsd)
              .plus(new BigNumber(mySimpleWethBorrowedUsd))
              .plus(new BigNumber(mySimpleUsdtWethBorrowedUsd))
          )
            .dividedBy(new BigNumber(wethCollateralUsdIncludingUsdt))
            .toString()

      console.log(
        'wbtcLoanToValueIncludingUsdt :>> ',
        wbtcLoanToValueIncludingUsdt
      )
      console.log(
        'wethLoanToValueIncludingUsdt :>> ',
        wethLoanToValueIncludingUsdt
      )

      let borrowedPercent = 0
      if (
        Number(wethLoanToValueIncludingUsdt) > 0 &&
        Number(wbtcLoanToValueIncludingUsdt) > 0
      ) {
        borrowedPercent =
          100 -
          (70 - Number(wbtcLoanToValueIncludingUsdt) * 100) -
          (78 - Number(wethLoanToValueIncludingUsdt) * 100)
      } else if (
        Number(wethLoanToValueIncludingUsdt) > 0 &&
        !Number(wbtcLoanToValueIncludingUsdt)
      ) {
        borrowedPercent =
          100 - (78 - Number(wethLoanToValueIncludingUsdt) * 100)
      } else if (
        !Number(wethLoanToValueIncludingUsdt) &&
        Number(wbtcLoanToValueIncludingUsdt) > 0
      ) {
        borrowedPercent =
          100 - (70 - Number(wbtcLoanToValueIncludingUsdt) * 100)
      }
      setBorrowedPercent(borrowedPercent.toString())

      // boost

      // LINK
      const tokenLinkDecimal = await tokenLINKContract.methods.decimals().call()
      const depositedLink = await boostLINKContract.methods
        .balanceOf(address)
        .call()
      console.log('depositedLink link:>> ', depositedLink)
      const depositedLinkUsd = new BigNumber(
        ethers.utils.formatUnits(depositedLink, tokenLinkDecimal).toString()
      )
        .multipliedBy(new BigNumber(linkPrice || 0))
        .toString()
      // setDepositedWbtcUsd(depositedWbtcUsd)

      // UNI
      const tokenUniDecimal = await tokenUNIContract.methods.decimals().call()
      const depositedUni = await boostUNIContract.methods
        .balanceOf(address)
        .call()
      console.log('depositedUni uni:>> ', depositedUni)
      const depositedUniUsd = new BigNumber(
        ethers.utils.formatUnits(depositedUni, tokenUniDecimal).toString()
      )
        .multipliedBy(new BigNumber(uniPrice || 0))
        .toString()

      // COMP
      const tokenCompDecimal = await tokenCOMPContract.methods.decimals().call()
      const depositedComp = await boostCOMPContract.methods
        .balanceOf(address)
        .call()
      console.log('depositedComp comp:>> ', depositedComp)
      const depositedCompUsd = new BigNumber(
        ethers.utils.formatUnits(depositedComp, tokenCompDecimal).toString()
      )
        .multipliedBy(new BigNumber(compPrice || 0))
        .toString()

      // TORQ
      const tokenTorqDecimal = await tokenTORQContract.methods.decimals().call()
      const depositedTorq = await boostTORQContract.methods
        .balanceOf(address)
        .call()
      console.log('depositedTorq torq:>> ', depositedTorq)
      const depositedTorqUsd = new BigNumber(
        ethers.utils.formatUnits(depositedTorq, tokenTorqDecimal).toString()
      )
        .multipliedBy(new BigNumber(torqPrice || 0))
        .toString()

      // WBTC
      const tokenWbtcDecimal = await tokenWBTCContract.methods.decimals().call()
      const depositedWbtc = await boostWBTCContract.methods
        .balanceOf(address)
        .call()
      const depositedWbtcUsd = new BigNumber(
        ethers.utils.formatUnits(depositedWbtc, tokenWbtcDecimal).toString()
      )
        .multipliedBy(new BigNumber(wbtcPrice || 0))
        .toString()
      setDepositedWbtcUsd(depositedWbtcUsd)

      // WETH
      const tokenWethDecimal = await tokenWETHContract.methods.decimals().call()
      const depositedWeth = await boostWETHContract.methods
        .balanceOf(address)
        .call()
      console.log('depositedWeth 1111:>> ', depositedWeth)
      const depositedWethUsd = new BigNumber(
        ethers.utils.formatUnits(depositedWeth, tokenWethDecimal).toString()
      )
        .multipliedBy(new BigNumber(wethPrice || 0))
        .toString()
      setDepositedWethUsd(depositedWethUsd)

      setTotalMyBoostSupply(
        new BigNumber(depositedWbtcUsd)
          .plus(new BigNumber(depositedWethUsd))
          .toString()
      )

      const yourSupply = new BigNumber(myWbtcSuppliedUsd)
        .plus(new BigNumber(mySimpleWbtcSuppliedUsd))
        .plus(new BigNumber(myWethSuppliedUsd))
        .plus(new BigNumber(mySimpleWethSuppliedUsd))
        .plus(new BigNumber(depositedWethUsd))
        .plus(new BigNumber(depositedWbtcUsd))
        .plus(new BigNumber(depositedLinkUsd))
        .plus(new BigNumber(depositedUniUsd))
        .plus(new BigNumber(depositedCompUsd))
        .plus(new BigNumber(depositedTorqUsd))
        .plus(new BigNumber(mySimpleUsdtWbtcSuppliedUsd))
        .plus(new BigNumber(mySimpleUsdtWethSuppliedUsd))
        .toString()
      // setTotalMySupplied(yourSupply)

      const yourBorrow = new BigNumber(myWbtcBorrowedUsd)
        .plus(new BigNumber(mySimpleWbtcBorrowedUsd))
        .plus(new BigNumber(myWethBorrowedUsd))
        .plus(new BigNumber(mySimpleWethBorrowedUsd))
        .plus(new BigNumber(mySimpleUsdtWbtcBorrowedUsd))
        .plus(new BigNumber(mySimpleUsdtWethBorrowedUsd))
        .toString()
      // setTotalMyBorrowed(yourBorrow)
      console.log('yourBorrow :>> ', yourBorrow)

      dispatch(
        updateHomeInfo({
          yourSupply: yourSupply,
          yourBorrow: yourBorrow,
        })
      )
    } catch (error) {
      console.log('error :>> ', error)
    }
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
        !boostWETHContract ||
        !borrowSimpleWBTCContract ||
        !borrowSimpleWETHContract ||
        !tokenUNIContract ||
        !tokenLINKContract ||
        !boostLINKContract ||
        !boostUNIContract ||
        !borrowSimpleUSDTContract ||
        !borrowSimpleEthUSDTContract
      ) {
        return
      }
      const tusdDecimal = await tokenTUSDContract.methods.decimals().call()
      const usdcDecimal = await tokenUSDCContract.methods.decimals().call()
      const usdtDecimal = await tokenUSDTContract.methods.decimals().call()
      const uniDecimal = await tokenUNIContract.methods.decimals().call()
      const linkDecimal = await tokenLINKContract.methods.decimals().call()
      const compDecimal = await tokenCOMPContract.methods.decimals().call()
      const torqDecimal = await tokenTORQContract.methods.decimals().call()
      // WBTC
      const wbtcDecimal = await tokenWBTCContract.methods.decimals().call()

      // total supplied wbtc
      const totalWbtcSupply = await borrowWBTCContract.methods
        .totalSupplied()
        .call()
      const totalSimpleWbtcSupply = await borrowSimpleWBTCContract.methods
        .totalSupplied()
        .call()
      const totalSimpleUsdtWbtcSupply = await borrowSimpleUSDTContract.methods
        .totalSupplied()
        .call()

      const totalWbtcSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(totalWbtcSupply, wbtcDecimal).toString()
      )
        .multipliedBy(new BigNumber(wbtcPrice || 0))
        .toString()
      const totalSimpleWbtcSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(totalSimpleWbtcSupply, wbtcDecimal).toString()
      )
        .multipliedBy(new BigNumber(wbtcPrice || 0))
        .toString()
      const totalSimpleUsdtWbtcSuppliedUsd = new BigNumber(
        ethers.utils.formatUnits(totalSimpleUsdtWbtcSupply, wbtcDecimal)
      )
        .multipliedBy(wbtcPrice)
        .toString()

      console.log('totalWbtcSupply :>> ', totalWbtcSupply)
      console.log('totalSimpleWbtcSupply :>> ', totalSimpleWbtcSupply)
      console.log('totalWbtcSuppliedUsd wbtc:>> ', totalWbtcSuppliedUsd)
      console.log(
        'totalSimpleWbtcSuppliedUsd wbtc:>> ',
        totalSimpleWbtcSuppliedUsd
      )
      console.log(
        'totalSimpleUsdtWbtcSuppliedUsd wbtc:>> ',
        totalSimpleUsdtWbtcSuppliedUsd
      )

      // total borrow wbtc
      const totalWbtcBorrowed = await borrowWBTCContract.methods
        .totalBorrow()
        .call()
      const totalSimpleWbtcBorrowed = await borrowSimpleWBTCContract.methods
        .totalBorrow()
        .call()
      const totalSimpleUsdtWbtcBorrowed = await borrowSimpleUSDTContract.methods
        .totalBorrow()
        .call()

      const totalWbtcBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(totalWbtcBorrowed, tusdDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()
      const totalSimpleWbtcBorrowedUsd = new BigNumber(
        ethers.utils
          .formatUnits(totalSimpleWbtcBorrowed, usdcDecimal)
          .toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()
      const totalSimpleUsdtWbtcBorrowedUsd = new BigNumber(
        ethers.utils
          .formatUnits(totalSimpleUsdtWbtcBorrowed, usdtDecimal)
          .toString()
      )
        .multipliedBy(new BigNumber(usdtPrice || 0))
        .toString()

      console.log('totalWbtcBorrowed :>> ', totalWbtcBorrowed)
      console.log('totalWbtcBorrowedUsd :>> ', totalWbtcBorrowedUsd)

      console.log('totalSimpleWbtcBorrowed :>> ', totalSimpleWbtcBorrowed)
      console.log('totalSimpleWbtcBorrowedUsd :>> ', totalSimpleWbtcBorrowedUsd)
      console.log(
        'totalSimpleUsdtWbtcBorrowedUsd :>> ',
        totalSimpleUsdtWbtcBorrowedUsd
      )

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
      const totalSimpleWethSupply = await borrowSimpleWETHContract.methods
        .totalSupplied()
        .call()
      const totalSimpleWethSupplyUsd = new BigNumber(
        ethers.utils.formatUnits(totalSimpleWethSupply, wethDecimal).toString()
      )
        .multipliedBy(new BigNumber(wethPrice || 0))
        .toString()
      const totalSimpleUsdtWethSupply =
        await borrowSimpleEthUSDTContract.methods.totalSupplied().call()
      const totalSimpleUsdtWethSupplyUsd = new BigNumber(
        ethers.utils.formatUnits(totalSimpleUsdtWethSupply, wethDecimal)
      )
        .multipliedBy(wethPrice)
        .toString()

      console.log('totalWethSupply :>> ', totalWbtcSupply)
      console.log('totalWethSuppliedUsd weth:>> ', totalWethSuppliedUsd)

      console.log('totalSimpleWethSupply :>> ', totalSimpleWethSupply)
      console.log('totalSimpleWethSupplyUsd weth:>> ', totalSimpleWethSupplyUsd)
      console.log(
        'totalSimpleUsdtWethSupplyUsd weth:>> ',
        totalSimpleUsdtWethSupplyUsd
      )

      // total borrowed weth
      const totalWethBorrowed = await borrowWETHContract.methods
        .totalBorrow()
        .call()
      const totalWethBorrowedUsd = new BigNumber(
        ethers.utils.formatUnits(totalWethBorrowed, tusdDecimal).toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()
      const totalSimpleWethBorrowed = await borrowSimpleWETHContract.methods
        .totalBorrow()
        .call()
      const totalSimpleWethBorrowedUsd = new BigNumber(
        ethers.utils
          .formatUnits(totalSimpleWethBorrowed, usdcDecimal)
          .toString()
      )
        .multipliedBy(new BigNumber(tusdPrice || 0))
        .toString()
      const totalSimpleUsdtWethBorrowed =
        await borrowSimpleEthUSDTContract.methods.totalBorrow().call()
      const totalSimpleUsdtWethBorrowedUsd = new BigNumber(
        ethers.utils
          .formatUnits(totalSimpleUsdtWethBorrowed, usdtDecimal)
          .toString()
      )
        .multipliedBy(new BigNumber(usdtPrice || 0))
        .toString()

      console.log('totalWethBorrowed :>> ', totalWethBorrowed)
      console.log('totalWethBorrowedUsd :>> ', totalWethBorrowedUsd)

      console.log('totalSimpleWethBorrowed :>> ', totalSimpleWethBorrowed)
      console.log('totalSimpleWethBorrowedUsd :>> ', totalSimpleWethBorrowedUsd)
      console.log(
        'totalSimpleUsdtWethBorrowedUsd :>> ',
        totalSimpleUsdtWethBorrowedUsd
      )

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

      // LINK
      const depositedLink = await boostLINKContract.methods.totalSupply().call()
      const depositedLinkUsd = new BigNumber(
        ethers.utils.formatUnits(depositedLink, linkDecimal).toString()
      )
        .multipliedBy(new BigNumber(linkPrice || 0))
        .toString()

      // UNI
      const depositedUni = await boostUNIContract.methods.totalSupply().call()
      const depositedUniUsd = new BigNumber(
        ethers.utils.formatUnits(depositedUni, uniDecimal).toString()
      )
        .multipliedBy(new BigNumber(uniPrice || 0))
        .toString()

      // COMP
      const depositedComp = await boostCOMPContract.methods.totalSupply().call()
      const depositedCompUsd = new BigNumber(
        ethers.utils.formatUnits(depositedComp, compDecimal).toString()
      )
        .multipliedBy(new BigNumber(compPrice || 0))
        .toString()

      // TORQ
      const depositedTorq = await boostTORQContract.methods.totalSupply().call()
      const depositedTorqUsd = new BigNumber(
        ethers.utils.formatUnits(depositedTorq, torqDecimal).toString()
      )
        .multipliedBy(new BigNumber(torqPrice || 0))
        .toString()

      // total supplied
      const totalSupply = new BigNumber(totalWbtcSuppliedUsd)
        .plus(new BigNumber(totalSimpleWbtcSuppliedUsd))
        .plus(new BigNumber(totalWethSuppliedUsd))
        .plus(new BigNumber(totalSimpleWethSupplyUsd))
        .plus(new BigNumber(depositedWethUsd))
        .plus(new BigNumber(depositedWbtcUsd))
        .plus(new BigNumber(depositedLinkUsd))
        .plus(new BigNumber(depositedUniUsd))
        .plus(new BigNumber(depositedCompUsd))
        .plus(new BigNumber(depositedTorqUsd))
        .plus(new BigNumber(totalSimpleUsdtWbtcSuppliedUsd))
        .plus(new BigNumber(totalSimpleUsdtWethSupplyUsd))
        .toString()
      // setTotalSupplied(totalSupply)

      // total borrowed
      const totalBorrow = new BigNumber(totalWbtcBorrowedUsd)
        .plus(new BigNumber(totalSimpleWbtcBorrowedUsd))
        .plus(new BigNumber(totalWethBorrowedUsd))
        .plus(new BigNumber(totalSimpleWethBorrowedUsd))
        .plus(new BigNumber(totalSimpleUsdtWbtcBorrowedUsd))
        .plus(new BigNumber(totalSimpleUsdtWethBorrowedUsd))
        .toString()
      // setTotalBorrow(totalBorrow)

      dispatch(
        updateHomeInfo({
          totalSupply: totalSupply,
          totalBorrow: totalBorrow,
        })
      )

      const netApy = await oldBorrowContract.methods.getApr().call()
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
      <div className="mt-[32px]">
        <div className="z-10 m-auto block h-[160px] w-[160px] rounded-full md:hidden">
          <SkeletonDefault
            className="z-10 h-full w-full !rounded-full"
            width={'100%'}
          />
        </div>
        <div className="mt-0 mt-[-80px] md:mt-[-16px]">
          <SkeletonDefault className="h-[500px] md:h-[330px]" width={'100%'} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative mt-[110px] flex w-full flex-wrap items-center justify-center rounded-t-[10px] border-[1px] bg-white from-[#25252566] pt-[80px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br md:mt-[20px] md:pt-0">
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="text-[16px] text-[#959595]">Total Supply</div>
          <NumberFormat
            className="font-rogan text-[32px] text-[#030303] dark:text-white"
            displayType="text"
            thousandSeparator
            value={
              Number(home?.totalSupply) > 0
                ? new BigNumber(home?.totalSupply || 0).toString()
                : 0
            }
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="text-[16px] text-[#959595]">Total Borrow</div>
          <NumberFormat
            className="font-rogan text-[32px] text-[#030303] dark:text-white"
            displayType="text"
            thousandSeparator
            value={home?.totalBorrow || 0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div
        className={
          `hidden h-[1px] w-full md:block ` +
          `${
            theme === 'light'
              ? `bg-gradient-divider-light`
              : `bg-gradient-divider`
          }`
        }
      ></div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="text-[16px] text-[#959595]">Your Supply</div>
          <NumberFormat
            className="font-rogan text-[32px] text-[#030303] dark:text-white"
            displayType="text"
            thousandSeparator
            value={
              address ? new BigNumber(home?.yourSupply || '0').toString() : 0
            }
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="text-[16px] text-[#959595]">Your Borrow</div>
          <NumberFormat
            className="font-rogan text-[32px] text-[#030303] dark:text-white"
            displayType="text"
            thousandSeparator
            value={address ? home?.yourBorrow || '0' : 0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="bottom-[0px] flex w-full items-center justify-between p-[8px] md:absolute md:p-[12px] md:pt-0">
        <div className="space-y-1 leading-tight text-[#030303] dark:text-white">
          <div className="text-[12px] text-[#959595]">Borrow Used</div>
          <NumberFormat
            className="font-rogan text-[16px]"
            displayType="text"
            thousandSeparator
            value={address ? borrowedPercent : '0'}
            decimalScale={2}
            fixedDecimalScale
            suffix={'%'}
          />
        </div>
        <div className="space-y-1 text-right leading-tight text-[#030303] dark:text-white">
          <div className="text-[12px] text-[#959595]">Capacity</div>
          <NumberFormat
            className="font-rogan text-[16px]"
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
      <div className="z-100000 absolute top-[-80px] h-[160px] w-[160px] rounded-full border-2 border-[#E6E6E6] bg-white p-2 dark:border-[#25252566] dark:bg-[#1A1A1A] md:top-auto">
        <div className="h-full w-full rounded-full border-4 border-[#C38BFF] dark:bg-[#0D0D0D66]">
          <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
            <div className="text-[16px] text-[#959595]">NET APY</div>
            <NumberFormat
              className="font-rogan text-[32px] text-[#030303] dark:text-white"
              displayType="text"
              thousandSeparator
              value={
                address
                  ? Number(totalMyBoostSupply) > 0
                    ? Number(aprBoost || 0) - Number(netAPY || 0) * 100
                    : Number(home?.yourBorrow) > 0 &&
                      Number(totalMyBoostSupply) <= 0
                    ? -Number(netAPY || 0) * 100
                    : 0
                  : 0
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
