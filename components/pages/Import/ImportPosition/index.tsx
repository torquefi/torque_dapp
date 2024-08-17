import SkeletonDefault from '@/components/skeleton'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { AppStore } from '@/types/store'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { radianUiPoolDataProviderCI } from '../constants/contract'
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

const ImportPosition: React.FC = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { address } = useAccount()
  const [progressToMarket, setProgressToMarket] = useState(0)
  const [progressFromMarket, setProgressFromMarket] = useState(0)
  const [progressTransaction, setSetProgressTransaction] = useState(0)
  const [completedTransaction, setCompletedTransaction] = useState(false)

  const [selectedMarket, setSelectedMarket] = useState<IMarketInfo>()
  const [selectedCollateral, setSelectedCollateral] =
    useState<ICollateralInfo>()
  const [amount, setAmount] = useState('')
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [showBeneficiaryAddress, setShowBeneficiaryAddress] = useState(false)
  const [customInputVisible, setCustomInputVisible] = useState(false)
  const [infoItems, setInfoItems] = useState([
    { title: 'Current APR', content: '0.00%' },
    { title: 'Torque APR', content: '0.00%' },
    { title: 'Annual Savings', content: '$0.00' },
    { title: 'Monthly Savings', content: '$0.00' },
  ])

  const [selectedTab, setSelectedTab] = useState<number | null>(null)

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

  const fetchInfoItems = () => {
    // Placeholder for actual fetching logic
    setInfoItems([
      { title: 'Current APR', content: '0.00%' },
      { title: 'Torque APR', content: '0.00%' },
      { title: 'Annual Savings', content: '$0.00' },
      { title: 'Monthly Savings', content: '$0.00' },
    ])
  }

  const handleResetProgress = () => {
    setProgressToMarket(0)
    setProgressFromMarket(0)
    setSetProgressTransaction(0)
    setCompletedTransaction(false)
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

      const collateralTokenContract = new ethers.Contract(
        selectedCollateral.tokenCI.address,
        selectedCollateral.tokenCI.abi,
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
      const amountRefinance = userReservesData[0]
        ?.find?.(
          (data: any) =>
            data[0]?.toLowerCase() ===
            selectedMarket.tokenCI.address?.toLowerCase()
        )?.[1]
        ?.toString()
      const amountCollateral = userReservesData[0]
        ?.find?.(
          (data: any) =>
            data[0]?.toLowerCase() ===
            selectedCollateral.tokenCI.address?.toLowerCase()
        )?.[1]
        ?.toString()
      console.log('userReservesData', userReservesData)
      console.log('amountRefinance', amountRefinance)
      console.log('amountCollateral', amountCollateral)

      const marketTokenAllowanceBN = await marketTokenContract.allowance(
        address,
        torqRefinanceContractAddress
      )
      const marketTokenAllowance = marketTokenAllowanceBN?.toString()

      const collateralTokenAllowanceBN =
        await collateralTokenContract.allowance(
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
        const tx = await collateralTokenContract.approve(
          torqRefinanceContractAddress,
          maxAmount
        )
        await tx.wait()
      }

      if (
        selectedMarket.label === Market.RadiantUSDC &&
        selectedCollateral.label === Collateral.WBTC
      ) {
        const tx = await torqRefinanceContract.torqRefinanceUSDC(
          amountRefinance,
          amountCollateral,
          {
            gasLimit: '50000',
          }
        )
        await tx.wait()
      }

      if (
        selectedMarket.label === Market.RadiantUSDC &&
        selectedCollateral.label === Collateral.WETH
      ) {
        const tx = await torqRefinanceContract.torqRefinanceUSDC(
          amountRefinance,
          amountCollateral,
          {
            gasLimit: '50000',
          }
        )
        await tx.wait()
      }

      if (
        selectedMarket.label === Market.RadiantUSDCe &&
        selectedCollateral.label === Collateral.WBTC
      ) {
        const tx = await torqRefinanceContract.torqRefinanceUSDCe(
          amountRefinance,
          amountCollateral,
          {
            gasLimit: '50000',
          }
        )
        await tx.wait()
      }

      if (
        selectedMarket.label === Market.RadiantUSDCe &&
        selectedCollateral.label === Collateral.WETH
      ) {
        const tx = await torqRefinanceContract.torqRefinanceUSDCe(
          amountRefinance,
          amountCollateral,
          {
            gasLimit: '50000',
          }
        )
        await tx.wait()
      }

      setProgressFromMarket(500)
      console.log(
        `Refinancing ${amount} on ${selectedMarket.label} with ${selectedCollateral.label}`
      )
      fetchInfoItems()
    } catch (error) {
      console.error('handleImport', error)
    }
    setLoadingSubmit(false)
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
            <button className="mt-[0px]">
              <img
                src="/icons/slider.svg"
                alt="slider icon"
                className="w-[20px]"
              />
            </button>
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
          wrapperClassName="mb-3"
          options={marketOptions}
          value={selectedMarket}
          onSelect={(market) => {
            setSelectedMarket(market)
            setSelectedCollateral(undefined)
            handleResetProgress()
          }}
        />
        <SelectCollateral
          wrapperClassName="mb-3"
          options={selectedMarket?.collaterals}
          value={selectedCollateral}
          onSelect={(collateral) => {
            setSelectedCollateral(collateral)
            handleResetProgress()
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
