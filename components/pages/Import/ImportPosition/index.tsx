import SkeletonDefault from '@/components/skeleton'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { AppStore } from '@/types/store'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import {
  radianUiPoolDataProviderCI,
  tokenRwbtcCI,
  tokenRwethCI,
  tokenUsdcCI,
  tokenUsdceCI,
  tokenWbtcCI,
  tokenWethCI,
} from '../constants/contract'
import { marketOptions, providerAddress } from '../constants/provider'
import {
  Collateral,
  ICollateralInfo,
  IMarketInfo,
  Market,
} from '../constants/types'
import { SelectCollateral } from './SelectCollateral'
import { SelectMarket } from './SelectMarket'
import BigNumber from 'bignumber.js'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import Popover from '@/components/common/Popover'
import { TokenApr } from '@/lib/api/TokenApr'
import {
  simpleBorrowBtcContract,
  simpleBorrowEthContract,
  tokenBtcContract,
  tokenEthContract,
  tokenUsdcContract,
  userBorrowAddressBtcContract,
  userBorrowAddressEthContract,
} from '../../Borrow/constants/contract'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Web3 from 'web3'

const ImportPosition: React.FC = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { address, isConnected } = useAccount()
  const [progressToMarket, setProgressToMarket] = useState(0)
  const [progressFromMarket, setProgressFromMarket] = useState(0)
  const [progressTransaction, setSetProgressTransaction] = useState(0)
  const [completedTransaction, setCompletedTransaction] = useState(false)

  const [amountSelectedCollateral, setAmountSelectedCollateral] = useState('')
  const [isImported, setIsImported] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<IMarketInfo>()
  const [selectedCollateral, setSelectedCollateral] =
    useState<ICollateralInfo>()
  const [amount, setAmount] = useState('')
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isLoadingBorrow, setIsLoadingBorrow] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [customInputVisible, setCustomInputVisible] = useState(false)
  const [infoItems, setInfoItems] = useState([
    { title: 'Current APR', content: '0.00%' },
    { title: 'Torque APR', content: '0.00%' },
    { title: 'Annual Savings', content: '$0.00' },
    { title: 'Monthly Savings', content: '$0.00' },
  ])
  const [userReservesData, setUserReservesData] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState<number | null>(null)
  const [apr, setApr] = useState(0)
  const [slippage, setSlippage] = useState(0.5)
  const [customSlippage, setCustomSlippage] = useState(0.5)
  const [isAutoSlippage, setIsAutoSlippage] = useState(true)
  // const slippageOptions = [0.1, 0.5, 1]
  const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
    useState(false)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const amountMarketSelected = userReservesData?.find(
    ({ data }) =>
      data?.[0]?.toLowerCase() ===
      selectedMarket?.tokenCI?.address?.toLowerCase()
  )

  const amountMarket = amountMarketSelected?.amount4

  const amountCollateral =
    userReservesData?.find(
      ({ data }) =>
        data?.[0]?.toLowerCase() ===
        selectedCollateral?.tokenCI?.address?.toLowerCase()
    )?.amount1 || 0

  const loanToValue = selectedCollateral?.tokenCI?.name === 'WBTC' ? 75 : 83

  useEffect(() => {
    if (progressFromMarket > 0) {
      setTimeout(() => {
        setSetProgressTransaction(10000)
      }, 500)
    }
  }, [progressFromMarket])

  useEffect(() => {
    if (progressTransaction > 0) {
      setTimeout(() => {
        setProgressToMarket(500)
      }, 10000)
    }
  }, [progressTransaction])

  useEffect(() => {
    if (progressToMarket > 0) {
      setTimeout(() => {
        setCompletedTransaction(true)
      }, 500)
    }
  }, [progressToMarket])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const fetchInfoItems = async () => {
    try {
      // const aprRes = await TokenApr.getListApr({})
      // const aprs: any[] = aprRes?.data || []
      // const apr = +aprs?.find((apr) => apr?.name === 'TORQ')?.apr || 0

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)

      const userWethBorrowUsdcContract = new ethers.Contract(
        userBorrowAddressEthContract.address,
        userBorrowAddressEthContract.abi,
        signer
      )

      const torqAprRaw = await userWethBorrowUsdcContract.getApr()

      const torqApr =
        +ethers.utils.formatUnits(torqAprRaw.toString(), 'ether') || 0

      setApr(torqApr)

      setInfoItems([
        { title: 'Current APR', content: '0.00%' },
        {
          title: 'Torque APR',
          content: `${(-Number(torqApr) * 100).toFixed(2)}%`,
        },
        { title: 'Annual Savings', content: '$0.00' },
        { title: 'Monthly Savings', content: '$0.00' },
      ])
    } catch (error) {
      console.log('fetchInfoItems', error)
    }
  }

  const handleResetProgress = () => {
    setProgressToMarket(0)
    setProgressFromMarket(0)
    setSetProgressTransaction(0)
    setCompletedTransaction(false)
  }

  const handleGetUserReservesData = async () => {
    if (!address) {
      return
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)

      const poolProviderContract = new ethers.Contract(
        radianUiPoolDataProviderCI.address,
        radianUiPoolDataProviderCI.abi,
        signer
      )

      const userReservesData = await poolProviderContract.getUserReservesData(
        providerAddress,
        address
      )

      const tokens = [
        tokenRwbtcCI,
        tokenRwethCI,
        tokenWbtcCI,
        tokenWethCI,
        tokenUsdcCI,
        tokenUsdceCI,
      ]

      if (!Array.isArray(userReservesData[0])) {
        setUserReservesData([])
        return
      }
      const getDataPromise = userReservesData[0]?.map(async (data: any[]) => {
        try {
          let token = tokens?.find(
            (t) => t.address?.toLowerCase() === data[0]?.toLowerCase()
          )

          if (!token) {
            return {
              tokenName: data[0],
              data: [
                data[0]?.toString(),
                data[1]?.toString(),
                data[2],
                data[3]?.toString(),
                data[4]?.toString(),
                data[5]?.toString(),
                data[6]?.toString(),
              ],
            }
          }

          const tokenName = token?.name || data[0]

          const tokenContract = new ethers.Contract(
            token.address,
            token.abi,
            signer
          )

          const tokenDecimals = await tokenContract.decimals()

          const amount1 = new BigNumber(data[1]?.toString())
            .div(new BigNumber(10).exponentiatedBy(tokenDecimals))
            .toString()

          const amount4 = new BigNumber(data[4]?.toString())
            .div(new BigNumber(10).exponentiatedBy(tokenDecimals))
            .toString()

          return {
            tokenName,
            amount1,
            amount4,
            data: [
              data[0]?.toString(),
              data[1]?.toString(),
              data[2],
              data[3]?.toString(),
              data[4]?.toString(),
              data[5]?.toString(),
              data[6]?.toString(),
            ],
          }
        } catch (error) {
          console.log('handleGetUserReservesData convert', data, error)
          return {
            tokenName: data[0],
            data: [
              data[0]?.toString(),
              data[1]?.toString(),
              data[2],
              data[3]?.toString(),
              data[4]?.toString(),
              data[5]?.toString(),
              data[6]?.toString(),
            ],
          }
        }
      })

      const userData = await Promise.all(getDataPromise)

      console.log('userReservesData', userData)
      setUserReservesData(userData)
    } catch (error) {
      console.error('handleGetUserReservesData', error)
      setUserReservesData([])
    }
  }

  const handleImport = async () => {
    console.log('handleImport', selectedMarket, selectedCollateral)
    if (!address) {
      setOpenConnectWalletModal(true)
      return
    }

    if (!selectedMarket || !selectedCollateral) {
      return toast.error('Please fill full information')
    }

    if (!amount) {
      return toast.error('Please enter amount')
    }

    if (
      !selectedMarket.tokenCI ||
      !selectedCollateral.tokenCI ||
      !selectedCollateral.torqRefinanceCI
    ) {
      return toast.error('Lack Contract')
    }

    setLoadingSubmit(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)

      const marketTokenContract = new ethers.Contract(
        selectedMarket.tokenCI.address,
        selectedMarket.tokenCI.abi,
        signer
      )

      const collateralTokenRadianContract = new ethers.Contract(
        selectedCollateral.tokenRadianCI.address,
        selectedCollateral.tokenRadianCI.abi,
        signer
      )

      const torqRefinanceContractAddress =
        selectedCollateral.torqRefinanceCI.address
      const torqRefinanceContract = new ethers.Contract(
        selectedCollateral.torqRefinanceCI.address,
        selectedCollateral.torqRefinanceCI.abi,
        signer
      )

      const poolProviderContract = new ethers.Contract(
        radianUiPoolDataProviderCI.address,
        radianUiPoolDataProviderCI.abi,
        signer
      )

      const userReservesData = await poolProviderContract.getUserReservesData(
        providerAddress,
        address
      )
      const refinance = userReservesData[0]?.find?.(
        (data: any) =>
          data[0]?.toLowerCase() ===
          selectedMarket.tokenCI.address?.toLowerCase()
      )
      const totalAmountRefinance =
        selectedMarket?.tokenCI?.name === 'USDC'
          ? refinance?.[4]?.toString()
          : refinance?.[1]?.toString()

      const totalAmountCollateral = userReservesData[0]
        ?.find?.(
          (data: any) =>
            data[0]?.toLowerCase() ===
            selectedCollateral.tokenCI.address?.toLowerCase()
        )?.[1]
        ?.toString()

      console.log('userReservesData', userReservesData)
      console.log('totalAmountRefinance', totalAmountRefinance)
      console.log('totalAmountCollateral', totalAmountCollateral)

      const amountRefinance = new BigNumber(totalAmountRefinance)
        .multipliedBy(new BigNumber(amount))
        .dividedBy(new BigNumber(100))
        .integerValue()
        .toString()

      const amountCollateral = new BigNumber(totalAmountCollateral)
        .multipliedBy(new BigNumber(amount))
        .dividedBy(new BigNumber(100).decimalPlaces(0))
        .integerValue()
        .toString()

      const marketTokenAllowanceBN = await marketTokenContract.allowance(
        address,
        torqRefinanceContractAddress
      )
      const marketTokenAllowance = marketTokenAllowanceBN?.toString()

      const collateralTokenAllowanceBN =
        await collateralTokenRadianContract.allowance(
          address,
          torqRefinanceContractAddress
        )
      const collateralTokenAllowance = collateralTokenAllowanceBN?.toString()

      console.log('marketTokenAllowance :>> ', marketTokenAllowance)
      console.log('collateralTokenAllowance :>> ', collateralTokenAllowance)

      if (
        new BigNumber(marketTokenAllowance).lte(
          new BigNumber(amountRefinance || '0')
        )
      ) {
        const maxAmount = ethers.BigNumber.from('2').pow(256).sub(1)
        const tx = await marketTokenContract.approve(
          torqRefinanceContractAddress,
          maxAmount
        )
        await tx.wait()
      }
      if (
        new BigNumber(collateralTokenAllowance).lte(
          new BigNumber(amountRefinance || '0')
        )
      ) {
        const maxAmount = ethers.BigNumber.from('2').pow(256).sub(1)
        const tx = await collateralTokenRadianContract.approve(
          torqRefinanceContractAddress,
          maxAmount
        )
        await tx.wait()
      }

      console.log('params', amountRefinance, amountCollateral)

      if (selectedMarket.label === Market.RadiantUSDC) {
        if (selectedCollateral.label === Collateral.WBTC) {
          const tx = await torqRefinanceContract.torqRefinanceUSDC(
            amountRefinance,
            amountCollateral,
            { gasLimit: '30000000' }
          )
          await tx.wait()
        }

        if (selectedCollateral.label === Collateral.WETH) {
          const tx = await torqRefinanceContract.torqRefinanceUSDC(
            amountRefinance,
            amountCollateral,
            { gasLimit: '30000000' }
          )
          await tx.wait()
        }
      }

      if (selectedMarket.label === Market.RadiantUSDCe) {
        if (selectedCollateral.label === Collateral.WBTC) {
          const tx = await torqRefinanceContract.torqRefinanceUSDCe(
            amountRefinance,
            amountCollateral,
            { gasLimit: '30000000' }
          )
          await tx.wait()
        }

        if (selectedCollateral.label === Collateral.WETH) {
          const tx = await torqRefinanceContract.torqRefinanceUSDCe(
            amountRefinance,
            amountCollateral,
            { gasLimit: '30000000' }
          )
          await tx.wait()
        }
      }

      // if (selectedMarket.label === Market.AaveV3USDC) {
      //   if (selectedCollateral.label === Collateral.WBTC) {
      //     const tx = await torqRefinanceContract.torqRefinanceUSDC(
      //       amountRefinance,
      //       amountCollateral,
      //       { gasLimit: '40000000' }
      //     )
      //     await tx.wait()
      //   }

      //   if (selectedCollateral.label === Collateral.WETH) {
      //     const tx = await torqRefinanceContract.torqRefinanceUSDC(
      //       amountRefinance,
      //       amountCollateral,
      //       { gasLimit: '40000000' }
      //     )
      //     await tx.wait()
      //   }
      // }

      // if (selectedMarket.label === Market.AaveV3USDCe) {
      //   if (selectedCollateral.label === Collateral.WBTC) {
      //     const tx = await torqRefinanceContract.torqRefinanceUSDCe(
      //       amountRefinance,
      //       amountCollateral,
      //       { gasLimit: '40000000' }
      //     )
      //     await tx.wait()
      //   }

      //   if (selectedCollateral.label === Collateral.WETH) {
      //     const tx = await torqRefinanceContract.torqRefinanceUSDCe(
      //       amountRefinance,
      //       amountCollateral,
      //       { gasLimit: '40000000' }
      //     )
      //     await tx.wait()
      //   }
      // }

      setProgressFromMarket(500)
      console.log(
        `Refinancing ${amount} on ${selectedMarket.label} with ${selectedCollateral.label}`
      )
      fetchInfoItems()
      handleGetUserReservesData()
      setIsImported(true)
    } catch (error) {
      console.error('handleImport', error)
    }
    setLoadingSubmit(false)
  }

  const handleConfirmBorrow = async () => {
    if (!isConnected) {
      setOpenConnectWalletModal(true)
      return
    }
    setOpenConfirmDepositModal(true)
  }

  const onBorrow = async () => {
    const borrowAmount = new BigNumber(amountCollateral)
      .multipliedBy(amount)
      .dividedBy(100)
      .decimalPlaces(5)
      .toNumber()
    if (borrowAmount <= 0) {
      toast.error(
        `You must supply ${selectedCollateral.tokenCI.name} to borrow`
      )
      return
    }

    const web3 = new Web3(Web3.givenProvider)

    const userAddressContractInfo =
      selectedCollateral.tokenCI.name == 'WBTC'
        ? userBorrowAddressBtcContract
        : userBorrowAddressEthContract
    const userAddressContract = new web3.eth.Contract(
      JSON.parse(userAddressContractInfo?.abi),
      userAddressContractInfo?.address
    )

    const tokenBorrowContract = new web3.eth.Contract(
      JSON.parse(tokenUsdcContract?.abi),
      tokenUsdcContract?.address
    )

    const tokenContractInfo =
      selectedCollateral.tokenCI.name == 'WBTC'
        ? tokenBtcContract
        : tokenEthContract
    const tokenContract = new web3.eth.Contract(
      JSON.parse(tokenContractInfo?.abi),
      tokenContractInfo?.address
    )

    const borrowContractInfo =
      selectedCollateral.tokenCI.name == 'WBTC'
        ? simpleBorrowBtcContract
        : simpleBorrowEthContract
    const borrowContract = new web3.eth.Contract(
      JSON.parse(borrowContractInfo?.abi),
      borrowContractInfo?.address
    )

    try {
      setIsLoadingBorrow(true)

      if (selectedCollateral.tokenCI.name == 'WBTC') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(address)
        const tokenDepositDecimals = await tokenContract.methods
          .decimals()
          .call()
        const borrow = Number(
          new BigNumber(Number(borrowAmount).toFixed(tokenDepositDecimals))
            .multipliedBy(10 ** tokenDepositDecimals)
            .toString()
        )

        const tokenBorrowDecimal = await tokenBorrowContract.methods
          .decimals()
          .call()
        console.log('tokenDecimal :>> ', tokenBorrowDecimal)

        const amountReceive = new BigNumber(amountCollateral)
          .multipliedBy(amount)
          .dividedBy(100)
          .multipliedBy(
            usdPrice?.[selectedCollateral.tokenCI.name] * (loanToValue / 120)
          )
          .decimalPlaces(5)
          .toNumber()
        console.log('amountReceive :>> ', amountReceive)

        let usdtBorrowAmount = '0'
        if (amountReceive) {
          usdtBorrowAmount = ethers.utils
            .parseUnits(
              Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
              tokenBorrowDecimal
            )
            .toString()
        }

        const tokenContract1 = new ethers.Contract(
          tokenContractInfo?.address,
          tokenContractInfo?.abi,
          signer
        )

        const userAddressContract = await borrowContract.methods
          .userContract(address)
          .call()
        if (
          userAddressContract === '0x0000000000000000000000000000000000000000'
        ) {
          const allowance = await tokenContract.methods
            .allowance(address, borrowContractInfo.address)
            .call()
          console.log('allowance :>> ', allowance)

          if (
            new BigNumber(allowance).lte(new BigNumber('0')) ||
            new BigNumber(allowance).lte(new BigNumber(borrow?.toString()))
          ) {
            const tx = await tokenContract1.approve(
              borrowContractInfo?.address,
              borrow.toString()
            )
            await tx.wait()
          }
        } else {
          const allowanceUserContract = await tokenContract.methods
            .allowance(address, userAddressContract)
            .call()
          console.log('allowanceUserContract :>> ', allowanceUserContract)
          if (
            new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
            new BigNumber(allowanceUserContract).lte(
              new BigNumber(borrow?.toString())
            )
          ) {
            const tx = await tokenContract1.approve(
              userAddressContract,
              borrow.toString()
            )
            await tx.wait()
          }
        }

        const borrowContract2 = new ethers.Contract(
          borrowContractInfo?.address,
          borrowContractInfo?.abi,
          signer
        )

        console.log('params borrow:>> ', borrow.toString(), usdtBorrowAmount)

        const tx = await borrowContract2.callBorrow(
          borrow.toString(),
          usdtBorrowAmount,
          {
            gasLimit: '500000',
          }
        )
        await tx.wait()
        toast.success('Borrow Successful')
        setOpenConfirmDepositModal(false)
        setIsLoadingBorrow(false)
      }

      if (selectedCollateral.tokenCI.name == 'WETH') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(address)
        const tokenDepositDecimals = await tokenContract.methods
          .decimals()
          .call()
        const borrow = Number(
          new BigNumber(Number(borrowAmount).toFixed(tokenDepositDecimals))
            .multipliedBy(10 ** tokenDepositDecimals)
            .toString()
        )

        const tokenBorrowDecimal = await tokenBorrowContract.methods
          .decimals()
          .call()
        console.log('tokenDecimal :>> ', tokenBorrowDecimal)

        const amountReceive = new BigNumber(amountCollateral)
          .multipliedBy(amount)
          .dividedBy(100)
          .multipliedBy(
            usdPrice?.[selectedCollateral.tokenCI.name] * (loanToValue / 120)
          )
          .decimalPlaces(5)
          .toNumber()
        console.log('amountReceive :>> ', amountReceive)

        let usdtBorrowAmount = '0'
        console.log('amountReceive :>> ', amountReceive)
        if (amountReceive) {
          usdtBorrowAmount = ethers.utils
            .parseUnits(
              Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
              tokenBorrowDecimal
            )
            .toString()
        }
        console.log('usdtBorrowAmount :>> ', usdtBorrowAmount)

        const tokenContract1 = new ethers.Contract(
          tokenContractInfo?.address,
          tokenContractInfo?.abi,
          signer
        )

        const userAddressContract = await borrowContract.methods
          .userContract(address)
          .call()
        if (
          userAddressContract === '0x0000000000000000000000000000000000000000'
        ) {
          const allowance = await tokenContract.methods
            .allowance(address, borrowContractInfo.address)
            .call()
          console.log('allowance :>> ', allowance)
          console.log('usdtBorrowAmount :>> ', usdtBorrowAmount)
          console.log('userAddressContract :>> ', userAddressContract)

          if (
            new BigNumber(allowance).lte(new BigNumber('0')) ||
            new BigNumber(allowance).lte(new BigNumber(borrow.toString()))
          ) {
            const tx = await tokenContract1.approve(
              borrowContractInfo?.address,
              borrow.toString()
            )
            await tx.wait()
          }
        } else {
          const allowanceUserContract = await tokenContract.methods
            .allowance(address, userAddressContract)
            .call()
          console.log('allowanceUserContract :>> ', allowanceUserContract)
          if (
            new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
            new BigNumber(allowanceUserContract).lte(
              new BigNumber(borrow.toString())
            )
          ) {
            const tx = await tokenContract1.approve(
              userAddressContract,
              borrow.toString()
            )
            await tx.wait()
          }
        }

        const borrowContract2 = new ethers.Contract(
          borrowContractInfo?.address,
          borrowContractInfo?.abi,
          signer
        )

        console.log('params borrow:>> ', borrow.toString(), usdtBorrowAmount)

        const tx = await borrowContract2.callBorrow(
          borrow.toString(),
          usdtBorrowAmount
        )
        await tx.wait()
        toast.success('Borrow Successful')
        setOpenConfirmDepositModal(false)
        setIsLoadingBorrow(false)
      }
      setIsImported(false)
    } catch (e) {
      console.log('CreateBorrowItem.onBorrow', e)
      toast.error('Borrow Failed')
    } finally {
      setIsLoadingBorrow(false)
    }
  }

  const handleAmountTabClick = (percentage: number, index: number) => {
    setAmount((percentage * 100).toString())
    setCustomInputVisible(false)
    setSelectedTab(index)
  }

  const handleCustomClick = () => {
    setCustomInputVisible(true)
    setSelectedTab(null)
  }

  const handleCloseCustomInput = () => {
    setCustomInputVisible(false)
  }

  useEffect(() => {
    handleGetUserReservesData()
  }, [address])

  useEffect(() => {
    fetchInfoItems()
  }, [])

  if (isLoading) {
    return (
      <div className="m-auto w-full max-w-[360px] rounded-[12px]">
        <SkeletonDefault className="h-[280px] w-full" />
      </div>
    )
  }

  const gridVariants = {
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.2,
        staggerChildren: 0.1,
      },
    },
    hidden: { opacity: 0, height: 0 },
  }

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  }

  return (
    <>
      <div className="m-auto mb-4 w-full max-w-[360px] rounded-[12px] border border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-4 pt-3 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
        <div className="flex items-center justify-between">
          <p className="font-rogan mb-3 mt-2 text-[28px] text-[#030303] dark:text-white">
            Import
          </p>
          <div className="flex items-center justify-between">
            <Popover
              trigger="click"
              placement="bottom-right"
              className="mt-[8px] w-[200px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#161616]"
              content={
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[16px] font-semibold dark:text-white">
                      Slippage
                    </span>
                    <span className="text-[14px] font-medium dark:text-white">
                      {!isAutoSlippage ? `${slippage}%` : ''}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 rounded-lg px-3 py-2 text-[14px] font-medium ${
                        isAutoSlippage
                          ? 'bg-[#F8F9FA] text-[#333] dark:bg-[#555] dark:text-white'
                          : 'bg-[#f8f8f8] text-[#aaa] dark:bg-[#444] dark:text-[#bbb]'
                      }`}
                      onClick={() => {
                        setIsAutoSlippage(true)
                      }}
                    >
                      Auto
                    </button>
                    <button
                      className={`flex-1 rounded-lg px-3 py-2 text-[14px] font-medium ${
                        !isAutoSlippage
                          ? 'bg-[#F8F9FA] text-[#333] dark:bg-[#555] dark:text-white'
                          : 'bg-[#f8f8f8] text-[#aaa] dark:bg-[#444] dark:text-[#bbb]'
                      }`}
                      onClick={() => {
                        setIsAutoSlippage(false)
                        setSlippage(customSlippage || 0.5)
                      }}
                    >
                      Custom
                    </button>
                  </div>
                  {!isAutoSlippage && (
                    <div className="mt-3 flex items-center">
                      <NumericFormat
                        className="w-full rounded-lg border border-[#F8F9FA] bg-[#f8f8f8] p-2 text-[14px] text-[#333] dark:border-[#555] dark:bg-[#444] dark:text-white"
                        value={customSlippage}
                        onValueChange={(e) =>
                          setCustomSlippage(e.floatValue || 0.5)
                        }
                        suffix="%"
                        decimalScale={2}
                        placeholder="0.50"
                      />
                    </div>
                  )}
                </div>
              }
            >
              <div className="transition-ease cursor-pointer items-center rounded-full bg-transparent p-[6px] duration-100 hover:bg-[#f9f9f9] dark:hover:bg-[#141414] xs:flex">
                <img
                  src="/icons/slider.svg"
                  alt="slider icon"
                  className="w-[20px] cursor-pointer"
                />
              </div>
            </Popover>
          </div>
        </div>
        <div
          className={
            `mb-2 mt-[4px] h-[1px] w-full md:block ` +
            ` ${
              theme === 'light'
                ? 'bg-gradient-divider-light'
                : 'bg-gradient-divider'
            }`
          }
        ></div>
        <SelectMarket
          balance={amountMarket}
          wrapperClassName="mb-3"
          options={marketOptions}
          value={selectedMarket}
          onSelect={(market) => {
            setSelectedMarket(market)
            setSelectedCollateral(undefined)
            handleResetProgress()
            setIsImported(false)
          }}
        />
        <SelectCollateral
          balance={amountCollateral}
          wrapperClassName="mb-3"
          options={selectedMarket?.collaterals}
          value={selectedCollateral}
          onSelect={(collateral) => {
            setSelectedCollateral(collateral)
            handleResetProgress()
            setIsImported(false)
          }}
        />

        {selectedMarket && selectedCollateral && (
          <motion.div
            className="relative mb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <label className="mb-[4px] block text-[14px] font-medium text-[#959595]">
              Amount
            </label>
            {!customInputVisible ? (
              <motion.div
                className="flex space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[0.5, 0.75, 1].map((percentage, index) => (
                  <motion.button
                    key={percentage}
                    onClick={() => handleAmountTabClick(percentage, index)}
                    className={`flex-1 rounded-md py-[6px] text-[12px] xs:text-[14px] ${
                      selectedTab === index
                        ? 'border-1 border-[#AA5BFF] bg-[#AA5BFF] text-white'
                        : 'bg-[#AA5BFF] bg-opacity-20 text-[#AA5BFF]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {percentage * 100}%
                  </motion.button>
                ))}
                <motion.button
                  onClick={handleCustomClick}
                  className={`flex-1 rounded-md py-[6px] text-[12px] xs:text-[14px] ${
                    customInputVisible
                      ? 'border-1 border-[#AA5BFF] bg-[#AA5BFF] text-white'
                      : 'bg-[#AA5BFF] bg-opacity-20 text-[#AA5BFF]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Custom
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="relative flex"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.2 }}
              >
                <NumericFormat
                  className="transition-ease block w-full rounded-[8px] border border-[#efefef] bg-white pb-2 pl-[10px] pt-2 shadow-sm duration-100 ease-linear placeholder:text-[#959595] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e]"
                  value={amount}
                  thousandSeparator
                  onChange={(e) => {
                    setAmount(e.target.value)
                    handleResetProgress()
                  }}
                  placeholder="0.00"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 m-auto mr-2 max-h-[24px] rounded-[8px] bg-[#f8f8f8] px-2 text-[11px] uppercase text-[#aa5bff] focus:outline-none dark:bg-[#1E1E1E] dark:text-white"
                  onClick={handleCloseCustomInput}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
        <div className="flex justify-end">
          <button
            disabled={loadingSubmit}
            className={`font-rogan-regular mt-1 flex w-full items-center justify-center rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF] ${
              loadingSubmit
                ? 'cursor-not-allowed text-[#eee]'
                : 'cursor-pointer '
            }`}
            onClick={handleImport}
          >
            {loadingSubmit && <LoadingCircle />}
            {address ? 'Import Position' : 'Connect Wallet'}
          </button>
        </div>

        {isImported || 1 && (
          <button
            className={
              `font-rogan-regular mt-3 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-transparent to-transparent py-1 text-[14px] uppercase text-[#AA5BFF] transition-all hover:border hover:from-[#AA5BFF] hover:to-[#912BFF] hover:text-white` +
              ` ${isLoadingBorrow ? 'cursor-not-allowed opacity-70' : ''}`
            }
            onClick={handleConfirmBorrow}
          >
            {isLoadingBorrow && <LoadingCircle />}
            {address ? 'Supply & Borrow' : 'Connect Wallet'}
          </button>
        )}
        <ConfirmDepositModal
          open={isOpenConfirmDepositModal}
          handleClose={() => setOpenConfirmDepositModal(false)}
          confirmButtonText="Supply & Borrow"
          onConfirm={() => onBorrow()}
          loading={isLoadingBorrow}
          coinFrom={{
            amount: new BigNumber(amountCollateral)
              .multipliedBy(amount)
              .dividedBy(100)
              .decimalPlaces(5)
              .toNumber(),
            icon: `/icons/coin/${selectedCollateral?.tokenCI?.name?.toLowerCase()}.png`,
            symbol: selectedCollateral?.tokenCI?.name,
            isUsd: false,
          }}
          coinTo={{
            amount: new BigNumber(amountCollateral)
              .multipliedBy(amount)
              .dividedBy(100)
              .multipliedBy(
                usdPrice?.[selectedCollateral?.tokenCI?.name] *
                  (loanToValue / 120)
              )
              .decimalPlaces(5)
              .toNumber(),
            icon: `/icons/coin/usdc.svg`,
            symbol: 'USDC',
            isUsd: false,
          }}
          details={[
            {
              label: 'Loan-to-value',
              value: `<${loanToValue}%`,
            },
            {
              label: 'Variable APR',
              value: !apr ? '-0.00%' : -(Number(apr) * 100).toFixed(2) + '%',
            },
          ]}
        />
        {/* new */}
        {/* {amountSelectedCollateral && (
          <div className="flex justify-end">
            <button
              disabled={loadingSubmit}
              className={`font-rogan-regular mt-1 flex w-full items-center justify-center rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF] ${
                loadingSubmit
                  ? 'cursor-not-allowed text-[#eee]'
                  : 'cursor-pointer '
              }`}
              onClick={handleImport}
            >
              {loadingSubmit && <LoadingCircle />}
              {address ? 'Supply & Borrow' : 'Connect Wallet'}
            </button>
          </div>
        )} */}
      </div>

      {selectedMarket && selectedCollateral && (
        <motion.div
          className="mx-auto grid h-auto w-full max-w-[360px] grid-cols-2 gap-[14px]"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={gridVariants}
        >
          {infoItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex h-[98px] flex-col items-center justify-center rounded-[12px] border border-[#E6E6E6] bg-white dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b"
              variants={itemVariants}
            >
              <div className="font-rogan text-[24px] text-[#404040] dark:text-white">
                {item.content}
              </div>
              <div className="mt-1 text-[15px] text-[#959595]">
                {item.title}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
    </>
  )
}

export default ImportPosition
