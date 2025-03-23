"use client"

import { motion } from "framer-motion"
import type { IBorrowInfo } from "../BorrowForm"

interface SelectBorrowAssetProps {
  collateral: IBorrowInfo | null
  selectedBorrowAsset: string
  onSelect: (borrowAsset: string) => void
}

export default function SelectBorrowAsset({ collateral, selectedBorrowAsset, onSelect }: SelectBorrowAssetProps) {
  if (!collateral) {
    return (
      <motion.div
        className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-[#AA5BFF]">Please select a collateral first</p>
      </motion.div>
    )
  }

  // For this example, we'll just use the borrowTokenSymbol from the collateral
  // In a real app, you might have multiple borrow options for each collateral
  const borrowOptions = [
    {
      symbol: collateral.borrowTokenSymbol,
      icon: collateral.borrowRowTokenIcon,
      loanToValue: collateral.loanToValue,
      borrowRate: collateral.borrowRate,
    },
  ]

  // If the collateral has multiLoan option, add TUSD as another option
  if (collateral.multiLoan) {
    borrowOptions.push({
      symbol: "TUSD",
      icon: "/icons/coin/tusd.svg",
      loanToValue: collateral.loanToValue - 5, // Slightly lower LTV for TUSD
      borrowRate: collateral.borrowRate + 0.5, // Slightly higher rate for TUSD
    })
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
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Select Borrow Asset</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Choose the asset you want to borrow against your collateral
        </p>
      </motion.div>

      {/* Selected Collateral */}
      <motion.div
        className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
        custom={1}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img
              src={collateral.depositTokenIcon || "/placeholder.svg"}
              alt={collateral.depositTokenSymbol}
              className="w-8 h-8 rounded-full"
            />
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Selected Collateral</h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {collateral.depositTokenSymbol} ({collateral.name})
            </p>
          </div>
        </div>
      </motion.div>

      {/* Borrow Assets */}
      <motion.div className="space-y-3" custom={2} variants={fadeInUp} initial="initial" animate="animate">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Available Borrow Assets</h3>

        <div className="space-y-2">
          {borrowOptions.map((option, index) => (
            <motion.div
              key={option.symbol}
              custom={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.4 + index * 0.1,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
              whileTap={{ y: 0, boxShadow: "none" }}
              onClick={() => onSelect(option.symbol)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedBorrowAsset === option.symbol
                  ? "border-[#AA5BFF] bg-[#F5EEFF] dark:bg-[#2A1A3A] dark:border-[#AA5BFF]"
                  : "border-gray-100 hover:border-[#AA5BFF]/30 dark:border-gray-800 dark:hover:border-[#AA5BFF]/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={option.icon || "/placeholder.svg"}
                      alt={option.symbol}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{option.symbol}</h3>
                    <div className="flex space-x-3 mt-0.5">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        LTV: <span className="font-medium">{option.loanToValue}%</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Rate: <span className="font-medium">{option.borrowRate}%</span>
                      </p>
                    </div>
                  </div>
                </div>

                {selectedBorrowAsset === option.symbol && (
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <div className="w-6 h-6 bg-[#AA5BFF] rounded-full flex items-center justify-center">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.6668 1.5L4.25016 7.91667L1.3335 5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        className="bg-[#F5EEFF] dark:bg-[#2A1A3A] p-3 rounded-lg"
        custom={3}
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
            The borrow asset determines what you'll receive when you create this position. You'll need to repay this
            asset plus interest when closing your position.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

