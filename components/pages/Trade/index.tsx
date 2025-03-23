"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BasicMode } from "./Basic"
import { ProMode } from "./Pro"

export const TradePage = () => {
  const [mode, setMode] = useState<"basic" | "pro">("basic")

  return (
    <div className="w-full h-full min-h-[calc(100vh-120px)] px-4 py-6">
      {/* Mode Toggle */}
      <motion.div
        className="flex justify-between items-center mb-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-2xl font-bold text-[#030303] dark:text-white">
          {mode === "basic" ? "Basic" : "Pro"}
        </h1>
        <motion.div
          className="bg-gray-100 dark:bg-[#1E2025] rounded-full p-1 flex"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
              mode === "basic"
                ? "bg-white dark:bg-[#2A2D35] text-[#AA5BFF] shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setMode("basic")}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Basic
          </motion.button>
          <motion.button
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
              mode === "pro"
                ? "bg-white dark:bg-[#2A2D35] text-[#AA5BFF] shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setMode("pro")}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Pro
          </motion.button>
        </motion.div>
      </motion.div>

      {mode === "basic" ? <BasicMode /> : <ProMode />}
    </div>
  )
}

export default TradePage