"use client"

import { motion } from "framer-motion"
import type { BorrowFormData } from "../BorrowForm"

interface ReviewLoanProps {
  formData: BorrowFormData
  isSubmitting: boolean
}

export default function ReviewLoan({ formData, isSubmitting }: ReviewLoanProps) {
  const { collateral, borrowAsset, collateralAmount, borrowAmount, loopCount } = formData

  if (!collateral) {
    return (
      <motion.div
        className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-[#AA5BFF]">Please complete all previous steps first</p>
      </motion.div>
    )
  }

  // Calculate total position size with looping
  const totalCollateral = collateralAmount * loopCount
  const totalBorrow = borrowAmount * (loopCount - 1)

  // Calculate health factor (simplified for demo)
  const healthFactor = (totalCollateral / (totalBorrow || 1)) * (collateral.loanToValue / 100)
  const healthFactorPercentage = Math.min(healthFactor * 50, 100)

  const getHealthColor = () => {
    if (healthFactor >= 1.5) return "green"
    if (healthFactor >= 1.2) return "yellow"
    return "red"
  }

  const healthColor = getHealthColor()

  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600 dark:text-green-400"
      case "yellow":
        return "text-yellow-600 dark:text-yellow-400"
      case "red":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getBgClass = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: custom * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <div className="space-y-4">
      <motion.div custom={0} variants={fadeInUp} initial="initial" animate="animate">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Review Position</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Review your position details before creating it
        </p>
      </motion.div>

      {/* Position Summary */}
      <motion.div
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden"
        custom={1}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="p-2.5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Position Summary</h3>
        </div>

        <div className="p-2.5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Initial Collateral</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <img
                  src={collateral.depositTokenIcon || "/placeholder.svg"}
                  alt={collateral.depositTokenSymbol}
                  className="w-4 h-4 rounded-full"
                />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {collateralAmount.toFixed(6)} {collateral.depositTokenSymbol}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Initial Borrow</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <img
                  src={collateral.borrowRowTokenIcon || "/placeholder.svg"}
                  alt={borrowAsset}
                  className="w-4 h-4 rounded-full"
                />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {borrowAmount.toFixed(6)} {borrowAsset}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Loop Count</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{loopCount}×</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">LTV</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{collateral.loanToValue}%</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">TORQ Rewards</p>
              <p className="text-sm font-medium text-[#AA5BFF] dark:text-[#C17FFF]">{collateral.getTORQ}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Total Position */}
      <motion.div
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden"
        custom={2}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="p-2.5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Total Position (After Looping)</h3>
        </div>

        <div className="p-2.5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Collateral</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <img
                  src={collateral.depositTokenIcon || "/placeholder.svg"}
                  alt={collateral.depositTokenSymbol}
                  className="w-4 h-4 rounded-full"
                />
                <motion.p
                  className="text-sm font-medium text-gray-900 dark:text-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {totalCollateral.toFixed(6)} {collateral.depositTokenSymbol}
                </motion.p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Borrow</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <img
                  src={collateral.borrowRowTokenIcon || "/placeholder.svg"}
                  alt={borrowAsset}
                  className="w-4 h-4 rounded-full"
                />
                <motion.p
                  className="text-sm font-medium text-gray-900 dark:text-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  {totalBorrow.toFixed(6)} {borrowAsset}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Position Health */}
      <motion.div
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden"
        custom={3}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="p-2.5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Position Health</h3>
        </div>

        <div className="p-2.5 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Health Factor</p>
            <motion.p
              className={`text-sm font-medium ${getColorClass(healthColor)}`}
              animate={{
                scale: [1, 1.05, 1],
                transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              }}
            >
              {healthFactor.toFixed(2)}
            </motion.p>
          </div>

          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
            <motion.div
              className={`h-1.5 rounded-full ${getBgClass(healthColor)}`}
              initial={{ width: 0 }}
              animate={{ width: `${healthFactorPercentage}%` }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.7,
              }}
            />
          </div>

          <motion.p
            className={`text-xs mt-0.5 ${getColorClass(healthColor)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            {healthColor === "green"
              ? "Healthy position with low liquidation risk"
              : healthColor === "yellow"
                ? "Moderate risk - monitor your position regularly"
                : "High risk - position may be close to liquidation"}
          </motion.p>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Liquidation Threshold</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{collateral.loanToValue + 5}%</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Utilization</p>
              <p
                className={`text-sm font-medium ${
                  (borrowAmount / collateralAmount) * 100 > collateral.loanToValue * 0.8
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {((borrowAmount / collateralAmount) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        className="bg-[#F5EEFF] dark:bg-[#2A1A3A] p-3 rounded-lg"
        custom={4}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="flex space-x-2">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
                stroke="#AA5BFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.33337V8.00004"
                stroke="#AA5BFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10.6666H8.00667"
                stroke="#AA5BFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-xs text-[#AA5BFF]">
            Borrowing assets involves risk, including the risk of liquidation if the value of your collateral falls.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

