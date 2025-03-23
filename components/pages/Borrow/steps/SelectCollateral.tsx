"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { IBorrowInfo } from "../types"

interface SelectCollateralProps {
  availableCollaterals: IBorrowInfo[]
  selectedCollateral: IBorrowInfo | null
  onSelect: (collateral: IBorrowInfo) => void
  onNext?: () => void
}

const SelectCollateral = ({ availableCollaterals, selectedCollateral, onSelect, onNext }: SelectCollateralProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Replace the filtering logic with this improved implementation:
  const filteredCollaterals = availableCollaterals.filter((collateral) => {
    // Check if the token matches the search term
    const matchesSearch =
      collateral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collateral.depositTokenSymbol.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#030303] dark:text-white">Select Collateral</h2>
      <p className="text-gray-500 dark:text-gray-400">Choose the asset you want to use as collateral for your loan.</p>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search collateral assets..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-[#030303] outline-none focus:border-[#AA5BFF] dark:border-[#2A2D35] dark:bg-[#1D2833] dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Collateral Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {filteredCollaterals.map((collateral) => (
          <motion.div
            key={collateral.depositTokenSymbol}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 transition-all ${
              selectedCollateral?.depositTokenSymbol === collateral.depositTokenSymbol
                ? "border-[#AA5BFF] bg-[#AA5BFF]/5"
                : "border-gray-200 bg-white hover:border-[#AA5BFF]/50 dark:border-[#2A2D35] dark:bg-[#1A1D21] dark:hover:border-[#AA5BFF]/50"
            }`}
            onClick={() => onSelect(collateral)}
          >
            <div className="relative mb-2">
              <img
                src={collateral.depositTokenIcon || "/placeholder.svg"}
                alt={collateral.name}
                className="h-16 w-16 rounded-full"
              />
              {selectedCollateral?.depositTokenSymbol === collateral.depositTokenSymbol && (
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#AA5BFF] text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <span className="font-medium text-[#030303] dark:text-white">{collateral.depositTokenSymbol}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{collateral.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Dropdown for Mobile */}
      <div className="md:hidden">
        <button
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-[#2A2D35] dark:bg-[#1A1D21]"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center">
            {selectedCollateral ? (
              <>
                <img
                  src={selectedCollateral.depositTokenIcon || "/placeholder.svg"}
                  alt={selectedCollateral.name}
                  className="mr-2 h-8 w-8 rounded-full"
                />
                <span className="font-medium text-[#030303] dark:text-white">
                  {selectedCollateral.depositTokenSymbol}
                </span>
              </>
            ) : (
              <span className="text-gray-500">Select a collateral</span>
            )}
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-[#2A2D35] dark:bg-[#1A1D21]">
            {filteredCollaterals.map((collateral) => (
              <div
                key={collateral.depositTokenSymbol}
                className="flex cursor-pointer items-center p-3 hover:bg-gray-50 dark:hover:bg-[#2A2D35]"
                onClick={() => {
                  onSelect(collateral)
                  setIsDropdownOpen(false)
                }}
              >
                <img
                  src={collateral.depositTokenIcon || "/placeholder.svg"}
                  alt={collateral.name}
                  className="mr-2 h-8 w-8 rounded-full"
                />
                <div>
                  <div className="font-medium text-[#030303] dark:text-white">{collateral.depositTokenSymbol}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{collateral.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectCollateral

