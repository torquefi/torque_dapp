"use client"

import LoadingCircle from "@/components/common/Loading/LoadingCircle"
import Modal from "@/components/common/Modal"
import { torqContract } from "@/constants/contracts"
import type { AppStore } from "@/types/store"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import { NumericFormat } from "react-number-format"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import Web3 from "web3"

export const DelegateModal = (props: any) => {
  const { openModal, handleClose, balance } = props
  const { address } = useAccount()
  const theme = useSelector((store: AppStore) => store.theme.theme)

  const [loading, setLoading] = useState(false)
  const [addressInput, setAddressInput] = useState("")

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(JSON.parse(torqContract.abi), torqContract.address)
    return contract
  }, [Web3.givenProvider, torqContract])

  const handleDelegate = async () => {
    if (!addressInput) {
      toast.error("Please input address")
      return
    }
    if (!address || !tokenContract) {
      return
    }
    try {
      setLoading(true)
      const tx = await tokenContract.methods.delegate(addressInput).send({ from: address })
      if (tx.status) {
        toast.success("Delegation Successful")
        handleClose()
        setAddressInput("")
      }

      console.log("tx :>> ", tx)
    } catch (error) {
      toast.error("Delegation Failed")
      console.log("error :>> ", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={openModal} handleClose={handleClose} title="Delegate" position="right">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Delegate Address</label>
            <input
              className="w-full rounded-xl border border-[#E6E6E6] bg-white dark:bg-transparent dark:border-[#1a1a1a] px-4 py-3 text-[#030303] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AA5BFF] focus:border-transparent"
              type="text"
              placeholder="Enter wallet address (0x...)"
              value={addressInput}
              onChange={(event: any) => setAddressInput(event.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              The address you delegate to will receive voting power but not your tokens.
            </p>
          </motion.div>

          <div
            className={`my-6 h-[1px] w-full ${theme === "light" ? "bg-gradient-divider-light" : "bg-gradient-divider"}`}
          ></div>

          <motion.div
            className="rounded-xl border border-[#E6E6E6] dark:border-[#1a1a1a] p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Balance</p>
              <p className="text-base font-semibold text-[#030303] dark:text-white">
                <NumericFormat
                  value={address ? balance || "0" : "0"}
                  displayType="text"
                  thousandSeparator
                  decimalScale={2}
                  suffix=" TORQ"
                />
              </p>
            </div>
          </motion.div>

          <motion.div
            className="rounded-xl border border-[#E6E6E6] dark:border-[#1a1a1a] p-4 bg-gray-50 dark:bg-[#1A1A1A]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-[#030303] dark:text-white mb-2">About Delegation</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Delegation allows you to grant your voting power to another address without transferring your tokens. This
              is useful if you want someone else to vote on your behalf.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-auto pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleDelegate}
            disabled={loading || !addressInput}
            className={`w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-3 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
            ${loading || !addressInput ? "cursor-not-allowed opacity-50" : ""}`}
            whileHover={{ scale: addressInput && !loading ? 1.02 : 1 }}
            whileTap={{ scale: addressInput && !loading ? 0.98 : 1 }}
          >
            {loading ? <LoadingCircle /> : "Delegate Votes"}
          </motion.button>
        </motion.div>
      </div>
    </Modal>
  )
}

