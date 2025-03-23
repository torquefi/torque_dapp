"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { IBorrowInfo } from "../BorrowForm"

interface SelectAmountProps {
  collateral: IBorrowInfo | null
  borrowAsset: string
  collateralAmount: number
  borrowAmount: number
  onChange: (collateralAmount: number, borrowAmount: number) => void
}

export default function SelectAmount({
  collateral,
  borrowAsset,
  collateralAmount,
  borrowAmount,
  onChange,
}: SelectAmountProps) {
  const [amount, setAmount] = useState(collateralAmount > 0 ? collateralAmount.toString() : "")
  const [percentSelected, setPercentSelected] = useState<number | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Mock balance for demo purposes
  const maxBalance = 10.0

  useEffect(() => {
    if (collateral) {
      // Calculate borrow amount based on LTV
      const calculatedBorrowAmount = Number.parseFloat(amount) * (collateral.loanToValue / 100)
      onChange(Number.parseFloat(amount) || 0, calculatedBorrowAmount || 0)
    }
  }, [amount, collateral, onChange])

  if (!collateral || !borrowAsset) {
    return (
      <motion.div
        className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-[#AA5BFF]">Please select collateral and borrow asset first</p>
      </motion.div>
    )
  }

  const handlePercentClick = (percent: number) => {
    const newAmount = ((maxBalance * percent) / 100).toFixed(6)
    setAmount(newAmount)
    setPercentSelected(percent)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      setPercentSelected(null)
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
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Select Amount</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Choose how much {collateral.depositTokenSymbol} to supply
        </p>
      </motion.div>

      {/* Selected Assets Info */}
      <motion.div className="flex gap-2" custom={1} variants={fadeInUp} initial="initial" animate="animate">
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <img
                src={collateral.depositTokenIcon || "/placeholder.svg"}
                alt={collateral.depositTokenSymbol}
                className="w-6 h-6 rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Collateral</h3>
              <p className="text-sm text-gray-900 dark:text-white">{collateral.depositTokenSymbol}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <img
                src={collateral.borrowRowTokenIcon || "/placeholder.svg"}
                alt={borrowAsset}
                className="w-6 h-6 rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Borrow Asset</h3>
              <p className="text-sm text-gray-900 dark:text-white">{borrowAsset}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Amount Input */}
      <motion.div className="space-y-2" custom={2} variants={fadeInUp} initial="initial" animate="animate">
        <div className="flex justify-between">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Collateral Amount
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Balance: {maxBalance.toFixed(6)} {collateral.depositTokenSymbol}
          </span>
        </div>

        <motion.div
          className={`relative border rounded-lg transition-all ${
            isFocused ? "border-[#AA5BFF] ring-1 ring-[#AA5BFF]/20" : "border-gray-100 dark:border-gray-700"
          }`}
          animate={{
            boxShadow: isFocused ? "0 0 0 2px rgba(170, 91, 255, 0.1)" : "none",
            scale: isFocused ? 1.005 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="bg-white dark:bg-gray-800 text-gray-900 text-base rounded-lg block w-full p-2.5 pr-20 dark:text-white focus:outline-none"
            placeholder="0.0"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 dark:text-gray-400">{collateral.depositTokenSymbol}</span>
          </div>
        </motion.div>

        {/* Percentage Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((percent, index) => (
            <motion.button
              key={percent}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handlePercentClick(percent)}
              className={`py-1.5 px-1 text-xs rounded-md transition-all ${
                percentSelected === percent
                  ? "bg-[#AA5BFF] text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              initial={{ opacity: 0, y: 5 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.3 + index * 0.05 },
              }}
            >
              {percent}%
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Borrow Amount */}
      <motion.div className="space-y-2" custom={3} variants={fadeInUp} initial="initial" animate="animate">
        <div className="flex justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Borrow Amount (Based on LTV)
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">LTV: {collateral.loanToValue}%</span>
        </div>

        <motion.div
          className="bg-gray-50 border border-gray-100 text-gray-900 text-base rounded-lg p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white flex justify-between items-center"
          animate={{
            backgroundColor:
              borrowAmount > 0
                ? ["rgba(245, 238, 255, 0)", "rgba(245, 238, 255, 0.3)", "rgba(245, 238, 255, 0)"]
                : "rgba(245, 238, 255, 0)",
          }}
          transition={{ duration: 1, times: [0, 0.5, 1], ease: "easeInOut" }}
        >
          <span>{borrowAmount.toFixed(6)}</span>
          <span className="text-gray-500 dark:text-gray-400">{borrowAsset}</span>
        </motion.div>
      </motion.div>

      {/* Info Box */}
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
            The Loan-to-Value (LTV) ratio determines how much you can borrow based on your collateral value.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

