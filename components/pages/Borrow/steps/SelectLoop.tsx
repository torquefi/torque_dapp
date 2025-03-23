"use client"

import { motion } from "framer-motion"

interface SelectLoopProps {
  loopCount: number
  onChange: (loopCount: number) => void
}

export default function SelectLoop({ loopCount, onChange }: SelectLoopProps) {
  const loopOptions = [1, 2, 3, 4, 5]

  const getRiskLevel = (count: number) => {
    if (count === 1) return { level: "Low", color: "green" }
    if (count === 2) return { level: "Low-Medium", color: "blue" }
    if (count === 3) return { level: "Medium", color: "yellow" }
    if (count === 4) return { level: "Medium-High", color: "orange" }
    return { level: "High", color: "red" }
  }

  const risk = getRiskLevel(loopCount)

  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600 dark:text-green-400"
      case "blue":
        return "text-blue-600 dark:text-blue-400"
      case "yellow":
        return "text-yellow-600 dark:text-yellow-400"
      case "orange":
        return "text-orange-600 dark:text-orange-400"
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
      case "blue":
        return "bg-blue-500"
      case "yellow":
        return "bg-yellow-500"
      case "orange":
        return "bg-orange-500"
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
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Select Loop Count</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Choose your leverage multiplier</p>
      </motion.div>

      <motion.div
        className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
        custom={1}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <p className="text-xs text-gray-700 dark:text-gray-300">
          Looping multiplies your exposure by borrowing against your collateral multiple times. Higher loop counts
          increase potential returns but also increase risk.
        </p>
      </motion.div>

      {/* Loop Selection */}
      <motion.div className="space-y-3" custom={2} variants={fadeInUp} initial="initial" animate="animate">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Loop Multiplier</h3>

        <div className="grid grid-cols-5 gap-2">
          {loopOptions.map((count, index) => {
            const countRisk = getRiskLevel(count)
            return (
              <motion.div
                key={count}
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ y: 0, boxShadow: "none" }}
                onClick={() => onChange(count)}
                className={`p-2 rounded-lg border cursor-pointer transition-all text-center ${
                  loopCount === count
                    ? "border-[#AA5BFF] bg-[#F5EEFF] dark:bg-[#2A1A3A] dark:border-[#AA5BFF]"
                    : "border-gray-100 hover:border-[#AA5BFF]/30 dark:border-gray-800 dark:hover:border-[#AA5BFF]/30"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: loopCount === count ? [1, 1.05, 1] : 1,
                  transition: {
                    delay: 0.3 + index * 0.05,
                    duration: 0.3,
                    scale: { duration: 0.3, times: [0, 0.5, 1] },
                  },
                }}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}×</div>
                <div className={`text-xs mt-1 font-medium ${getColorClass(countRisk.color)}`}>{countRisk.level}</div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Risk Visualization */}
      <motion.div className="space-y-1.5" custom={3} variants={fadeInUp} initial="initial" animate="animate">
        <div className="flex justify-between">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Risk Level</span>
          <span className={`text-xs font-medium ${getColorClass(risk.color)}`}>{risk.level}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getBgClass(risk.color)}`}
            initial={{ width: 0 }}
            animate={{ width: `${(loopCount / 5) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Risk Details */}
      <motion.div
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden"
        custom={4}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="p-2.5 border-b border-gray-100 dark:border-gray-800">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Position Details</h4>
        </div>
        <div className="p-2.5 space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Leverage</span>
            <motion.span
              className="text-xs font-medium text-gray-900 dark:text-white"
              key={loopCount}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {loopCount}×
            </motion.span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Potential Return</span>
            <motion.span
              className="text-xs font-medium text-green-600 dark:text-green-400"
              key={`return-${loopCount}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              ~{loopCount}×
            </motion.span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Liquidation Risk</span>
            <motion.span
              className={`text-xs font-medium ${getColorClass(risk.color)}`}
              key={`risk-${loopCount}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {risk.level}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        className="bg-[#F5EEFF] dark:bg-[#2A1A3A] p-3 rounded-lg"
        custom={5}
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
            Looping is a strategy where you deposit collateral, borrow against it, and then use the borrowed assets as
            additional collateral.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

