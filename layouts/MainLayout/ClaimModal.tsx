"use client"

import LoadingCircle from "@/components/common/Loading/LoadingCircle"
import {
  boostLinkContract,
  boostUniContract,
  boostWbtcContract,
  boostWethContract,
} from "@/components/pages/Boost/constants/contracts"
import { simpleBorrowBtcContract, simpleBorrowEthContract } from "@/components/pages/Borrow/constants/contract"
import { arbContract, rewardsArbContract, rewardsTorqContract, torqContract } from "@/constants/contracts"
import { toMetricUnits } from "@/lib/helpers/number"
import { pairContract } from "@/lib/hooks/usePriceToken"
import type { AppStore } from "@/types/store"
import axios from "axios"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { NumericFormat } from "react-number-format"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import Web3 from "web3"
import type { Contract } from "web3-eth-contract"
import { motion, AnimatePresence } from "framer-motion"

interface ClaimModalProps {
  openModal: boolean
  handleClose: () => void
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
}

const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: "0", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
}

export default function ClaimModal({ openModal, handleClose }: ClaimModalProps) {
  const [currentPair, setCurrentPair] = useState<any>({})
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { address } = useAccount()
  const [torqReward, setTorqReward] = useState("0")
  const [arbReward, setArbReward] = useState("0")
  const [loadingClaimTorq, setLoadingClaimTorq] = useState(false)
  const [loadingClaimArb, setLoadingClaimArb] = useState(false)

  const rewardTorqContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(JSON.parse(rewardsTorqContract?.abi), rewardsTorqContract?.address)
    return contract
  }, [Web3.givenProvider, rewardsTorqContract])

  const rewardArbContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(JSON.parse(rewardsArbContract?.abi), rewardsArbContract?.address)
    return contract
  }, [Web3.givenProvider, rewardsArbContract])

  const tokenTorqContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(JSON.parse(torqContract?.abi), torqContract?.address)
    return contract
  }, [Web3.givenProvider, torqContract])

  const tokenArbContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(JSON.parse(arbContract?.abi), arbContract?.address)
    return contract
  }, [Web3.givenProvider, arbContract])

  const handleClaimTorq = useCallback(async () => {
    if (!address) {
      return
    }
    setLoadingClaimTorq(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const rewardsContract = new ethers.Contract(
        rewardsTorqContract?.address,
        JSON.parse(rewardsTorqContract?.abi),
        signer,
      )
      const tx = await rewardsContract.claimReward([
        simpleBorrowBtcContract.address,
        simpleBorrowEthContract.address,
        boostWbtcContract.address,
        boostWethContract.address,
        boostLinkContract.address,
        boostUniContract.address,
      ])
      console.log("handleClaimTorq tx :>> ", tx)
      await tx.wait()
      handleClose()
      handleGetRewards()
      toast.success("Claim Successful")
    } catch (error) {
      console.log("error handleClaim reward :>> ", error)
      toast.success("Claim Failed")
    } finally {
      setLoadingClaimTorq(false)
    }
  }, [address])

  const handleClaimArb = useCallback(async () => {
    if (!address) {
      return
    }
    setLoadingClaimArb(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const rewardsContract = new ethers.Contract(
        rewardsArbContract?.address,
        JSON.parse(rewardsArbContract?.abi),
        signer,
      )
      const tx = await rewardsContract.claimReward([simpleBorrowBtcContract.address, simpleBorrowEthContract.address])
      console.log("handleClaimArb tx :>> ", tx)
      await tx.wait()
      handleClose()
      handleGetRewards()
      toast.success("Claim Successful")
    } catch (error) {
      console.log("error handleClaim reward :>> ", error)
      toast.success("Claim Failed")
    } finally {
      setLoadingClaimArb(false)
    }
  }, [address])

  const handleGetRewards = useCallback(async () => {
    if (!rewardTorqContract || !tokenTorqContract || !rewardArbContract || !tokenArbContract || !address) {
      return
    }

    const getRewardByContract = async (
      rewardContract: Contract,
      tokenContract: Contract,
      options: {
        hasBoost: boolean
      },
    ) => {
      const borrowWbtcReward = await rewardContract.methods
        ._calculateReward(simpleBorrowBtcContract.address, address)
        .call()
      const borrowWethReward = await rewardContract.methods
        ._calculateReward(simpleBorrowEthContract.address, address)
        .call()

      const tokenDecimal = await tokenContract.methods.decimals().call()

      let totalRewardsBN = new BigNumber(borrowWbtcReward || 0).plus(new BigNumber(borrowWethReward || 0))

      if (options.hasBoost) {
        const boostWbtcReward = await rewardContract.methods._calculateReward(boostWbtcContract.address, address).call()
        const boostWethReward = await rewardContract.methods._calculateReward(boostWethContract.address, address).call()

        totalRewardsBN = totalRewardsBN
          .plus(new BigNumber(boostWbtcReward || 0))
          .plus(new BigNumber(boostWethReward || 0))
      }

      const totalRewards = totalRewardsBN.toString()

      const rewardFormatted = new BigNumber(ethers.utils.formatUnits(totalRewards, tokenDecimal)).toString()

      return rewardFormatted
    }

    try {
      const [torqReward, arbReward] = await Promise.all([
        getRewardByContract(rewardTorqContract, tokenTorqContract, {
          hasBoost: true,
        }),
        getRewardByContract(rewardArbContract, tokenArbContract, {
          hasBoost: false,
        }),
      ])

      console.log(torqReward, arbReward)

      setTorqReward(torqReward)
      setArbReward(arbReward)
    } catch (error) {
      console.log("handleGetRewards :>> ", error)
    }
  }, [rewardTorqContract, tokenTorqContract, rewardArbContract, tokenArbContract, address])

  useEffect(() => {
    if (address) {
      handleGetRewards()
    }
  }, [handleGetRewards, openModal])

  const handleGetTokenInfo = async () => {
    try {
      const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${torqContract?.address}`)
      const pairs = response?.data?.pairs || []
      const currentPair = pairs.find((pair: any) => pair.pairAddress?.toLowerCase() === pairContract?.toLowerCase())
      setCurrentPair(currentPair)
    } catch (error) {
      console.error("LiquidityPool.getLiquidityPoolInfo.getPairData", error)
    }
  }

  useEffect(() => {
    handleGetTokenInfo()
  }, [openModal])

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflowY
    document.body.style.overflowY = openModal ? "hidden" : "auto"
    return () => {
      document.body.style.overflowY = originalOverflow
    }
  }, [openModal])

  const infos = [
    {
      title:
        Number(torqReward) >= 1000 ? (
          `${toMetricUnits(Number(torqReward) || 0)} TORQ`
        ) : (
          <NumericFormat displayType="text" value={torqReward} decimalScale={5} suffix=" TORQ" />
        ),
      content: "Claimable",
    },
    {
      title:
        Number(arbReward) >= 1000 ? (
          `${toMetricUnits(Number(arbReward) || 0)} ARB`
        ) : (
          <NumericFormat displayType="text" value={arbReward} decimalScale={5} suffix=" ARB" />
        ),
      content: "Claimable",
    },
  ]

  if (!openModal) return null

  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          className="fixed inset-0 z-[1000] bg-black bg-opacity-40 backdrop-blur-sm flex justify-end"
          onClick={handleClose}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            className="h-screen w-full max-w-sm border-l border-[#efefef] dark:border-[#1A1A1A] bg-white dark:bg-[#030303] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#efefef] dark:border-[#1A1A1A]">
              <div className="font-rogan text-[24px] font-[400] text-[#030303] dark:text-white">Rewards</div>
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f5f5f5] dark:bg-[#1A1A1A] hover:bg-opacity-80"
                onClick={handleClose}
              >
                <AiOutlineClose className="text-[#030303] dark:text-white" />
              </button>
            </div>

            <div
              className={
                `px-4 py-2 h-[1px] w-full` +
                `
                ${theme === "light" ? "bg-gradient-divider-light" : "bg-gradient-divider"}`
              }
            ></div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid h-auto w-full grid-cols-2 gap-[12px] py-[18px]">
                {infos.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex h-[98px] flex-col items-center justify-center rounded-[12px] border border-[1px] border-[#1A1A1A] border-[#E6E6E6] bg-[#FCFCFC] from-[#161616] to-[#161616]/0 pt-[6px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="font-rogan text-[24px] text-[#404040] dark:text-white">{item.title}</div>
                    <div className="mt-1 text-[15px] text-[#959595]">{item?.content}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-2 border-t border-[#efefef] dark:border-[#1A1A1A]">
              <motion.button
                className={`font-rogan-regular w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-3 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
                ${loadingClaimTorq || !Number(torqReward) ? " cursor-not-allowed opacity-50" : " cursor-pointer"} `}
                onClick={handleClaimTorq}
                disabled={loadingClaimTorq || !Number(torqReward)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loadingClaimTorq && <LoadingCircle />}
                CLAIM TORQ
              </motion.button>

              <motion.button
                className={`font-rogan-regular w-full rounded-full border border-[#AA5BFF] bg-transparent py-3 text-center text-[14px] uppercase text-[#AA5BFF] transition-all
                ${loadingClaimArb || !Number(arbReward) ? " cursor-not-allowed opacity-50" : " cursor-pointer"} `}
                onClick={handleClaimArb}
                disabled={loadingClaimArb || !Number(arbReward)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loadingClaimArb && <LoadingCircle />}
                CLAIM ARB
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

