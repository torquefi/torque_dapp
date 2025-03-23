"use client"

import type React from "react"

import { useState } from "react"
import SkeletonDefault from "@/components/skeleton"

interface ManageBorrowVaultProps {
  setIsFetchBorrowLoading?: (value: React.SetStateAction<boolean>) => void
}

const ManageBorrowVault = ({ setIsFetchBorrowLoading }: ManageBorrowVaultProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [borrowPositions, setBorrowPositions] = useState([])

  // This would be replaced with actual data fetching
  const fetchBorrowPositions = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setBorrowPositions([])
    setIsLoading(false)
  }

  return (
    <div className="mt-8">
      <h3 className="font-rogan text-[24px] text-[#030303] dark:text-white mb-6">Your Borrow Positions</h3>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonDefault height={160} width="100%" />
          <SkeletonDefault height={160} width="100%" />
        </div>
      ) : borrowPositions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Borrow positions would be mapped here */}
          <div className="p-4 border border-gray-200 dark:border-[#2A2D35] rounded-lg">No positions yet</div>
        </div>
      ) : (
        <div className="p-6 text-center border border-gray-200 dark:border-[#2A2D35] rounded-lg bg-white dark:bg-[#1A1D21]">
          <p className="text-gray-500 dark:text-gray-400">You don't have any active borrow positions.</p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Create a new position to get started.</p>
        </div>
      )}
    </div>
  )
}

export default ManageBorrowVault

