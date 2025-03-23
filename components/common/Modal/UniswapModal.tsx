"use client"

import { tokenEthContract, tokenUsdcContract } from "@/components/pages/Borrow/constants/contract"
import { swapContract } from "@/constants/contracts"
import { getBalanceByContractToken } from "@/constants/utils"
import ConnectWalletModal from "@/layouts/MainLayout/ConnectWalletModal"
import { bigNumberify } from "@/lib/numbers"
import type { AppStore } from "@/types/store"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { NumericFormat } from "react-number-format"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import Modal from "."
import HoverIndicator from "../HoverIndicator"
import LoadingCircle from "../Loading/LoadingCircle"
import NumberFormat from "../NumberFormat"
import Popover from "../Popover"
import { listSwapCoin } from "./constants"
import { useRouter } from "next/router"
import { ChevronDown, Info, Repeat, Settings } from "lucide-react"

export const swapFee: any = {
  ["WBTC-WETH"]: 500,
  ["WETH-WBTC"]: 500,
  ["USDC-WETH"]: 3000,
  ["WETH-USDC"]: 3000,
  ["USDC-TUSD"]: 100,
  ["TUSD-USDC"]: 100,
  ["TORQ-WETH"]: 3000,
  ["WETH-TORQ"]: 3000,
}

export const swapHop: any = {
  ["TUSD-WBTC"]: {
    type: "multi",
    tokenIntermediate: tokenUsdcContract.address,
    fee1: 100,
    fee2: 500,
  },
  ["TUSD-USDC"]: { type: "single" },
  ["TUSD-WETH"]: {
    type: "multi",
    tokenIntermediate: tokenUsdcContract.address,
    fee1: 100,
    fee2: 500,
  },
  ["TUSD-TORQ"]: { type: "not-allowed" },
  ["USDC-TUSD"]: {
    type: "single",
  },
  ["USDC-WBTC"]: {
    type: "single",
  },
  ["USDC-WETH"]: {
    type: "single",
  },
  ["USDC-TORQ"]: {
    type: "multi",
    tokenIntermediate: tokenEthContract.address,
    fee1: 500,
    fee2: 3000,
  },
  ["WBTC-TUSD"]: {
    type: "multi",
    tokenIntermediate: tokenUsdcContract.address,
    fee1: 500,
    fee2: 100,
  },
  ["WBTC-USDC"]: {
    type: "single",
  },
  ["WBTC-WETH"]: {
    type: "single",
  },
  ["WBTC-TORQ"]: {
    type: "multi",
    tokenIntermediate: tokenEthContract.address,
    fee1: 500,
    fee2: 3000,
  },
  ["WETH-TUSD"]: {
    type: "multi",
    tokenIntermediate: tokenUsdcContract.address,
    fee1: 500,
    fee2: 100,
  },
  ["WETH-USDC"]: {
    type: "single",
  },
  ["WETH-WBTC"]: {
    type: "single",
  },
  ["WETH-TORQ"]: {
    type: "single",
  },
  ["TORQ-TUSD"]: {
    type: "not-allowed",
  },
  ["TORQ-USDC"]: {
    type: "multi",
    tokenIntermediate: tokenEthContract.address,
    fee1: 3000,
    fee2: 3000,
  },
  ["TORQ-WBTC"]: {
    type: "multi",
    tokenIntermediate: tokenEthContract.address,
    fee1: 3000,
    fee2: 500,
  },
  ["TORQ-WETH"]: {
    type: "single",
  },
}

export interface UniSwapModalProps {
  open: boolean
  handleClose: () => void
  title?: string
  createButtonText?: string
}

interface Token {
  symbol: string;
  tokenContractInfo?: {
    abi: string;
    address: string;
  };
}

export default function UniSwapModal({ open, handleClose, title, createButtonText }: UniSwapModalProps) {
  const { address } = useAccount()
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [openPopover, setOpenPopover] = useState(false)

  const [loading, setLoading] = useState(false)
  const [coinFrom, setCoinFrom] = useState<Token>(listSwapCoin[0])
  const [coinTo, setCoinTo] = useState<Token>(listSwapCoin[2])
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [listBalances, setListBalances] = useState<any>({})
  const [amountFrom, setAmountFrom] = useState("")
  const [amountTo, setAmountTo] = useState("")
  const [mode, setMode] = useState("basic")
  const [showDetails, setShowDetails] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [slippage, setSlippage] = useState("0.5")
  const [isCrossChain, setIsCrossChain] = useState(false)
  const [showDestinationAddress, setShowDestinationAddress] = useState(false)
  const [destinationAddress, setDestinationAddress] = useState("")
  const router = useRouter()
  const [fromTokens, setFromTokens] = useState(null)

  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const convertRate = Number(usdPrice[coinFrom?.symbol]) / Number(usdPrice[coinTo?.symbol] || 1)

  const handleGetBalanceToken = async (item: Token) => {
    try {
      const amount = await getBalanceByContractToken(
        item.tokenContractInfo?.abi,
        item.tokenContractInfo?.address,
        address,
      )
      return amount
    } catch (error) {}
  }

  const handleGetListBalances = async () => {
    try {
      const listBalances = await Promise.all(listSwapCoin.map(handleGetBalanceToken))
      const convertListBalances = listBalances.reduce((acc: any, item: any, i: number) => {
        acc[listSwapCoin[i].symbol] = item
        return acc
      }, {})
      setListBalances(convertListBalances)
    } catch (error) {}
  }

  const handleSwap = async () => {
    setLoading(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const fromTokenContract = new ethers.Contract(
        coinFrom?.tokenContractInfo?.address,
        JSON.parse(coinFrom?.tokenContractInfo?.abi),
        signer,
      )

      const decimals = await fromTokenContract?.decimals()
      const amountParsed = ethers.utils.parseUnits(amountFrom, bigNumberify(decimals)).toString()

      console.log(amountParsed, decimals, {
        fromTokenAddress: coinFrom?.tokenContractInfo?.address,
        toTokenAddress: coinTo?.tokenContractInfo?.address,
        amount: amountParsed,
        fromAddress: address,
      })

      const allowance = await fromTokenContract.allowance(address, swapContract.address)

      if (
        new BigNumber(allowance?.toString()).lte(new BigNumber("0")) ||
        new BigNumber(allowance?.toString()).lte(new BigNumber(amountParsed))
      ) {
        console.log("allowance 11111:>> ", allowance)
        const tx = await fromTokenContract.approve(
          swapContract.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        )
        await tx.wait()
      }

      const swapContract1 = new ethers.Contract(swapContract?.address, JSON.parse(swapContract?.abi), signer)

      const fromSymbol = coinFrom.symbol
      const toSymbol = coinTo.symbol
      const combineSymbol = `${fromSymbol}-${toSymbol}`
      const swapType = swapHop?.[`${fromSymbol}-${toSymbol}`]
      if (swapType?.type === "not-allowed") {
        return toast.error("Swap Failed: Not Allowing")
      } else if (swapType?.type === "single") {
        console.log("typeSwap :>> ", swapType)
        const fee = swapFee?.[`${fromSymbol}-${toSymbol}`] || 500
        console.log("fee :>> ", fee)

        console.log(
          "params ",
          amountParsed,
          0,
          fee,
          coinFrom.tokenContractInfo?.address,
          coinTo.tokenContractInfo?.address,
        )

        const tx = await swapContract1.swapExactInputSingleHop(
          amountParsed,
          0,
          fee,
          coinFrom.tokenContractInfo?.address,
          coinTo.tokenContractInfo?.address,
        )
        await tx.wait()
      } else if (swapType?.type === "multi") {
        const path = await swapContract1.encoderPath(
          coinFrom.tokenContractInfo?.address,
          swapType?.fee1,
          swapType?.tokenIntermediate,
          swapType?.fee2,
          coinTo.tokenContractInfo?.address,
        )
        const tx = await swapContract1.swapExactInputMultiHop(amountParsed, 0, path, coinFrom.tokenContractInfo?.address)
        await tx.wait()
        console.log("path :>> ", path)
      }

      toast.success("Successful Swap")
      handleGetListBalances()
      handleClose()
    } catch (error) {
      console.error("swap error", error)
      toast.error("Swap Failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setCoinFrom(listSwapCoin[1])
      setCoinTo(listSwapCoin[2])
      setAmountFrom("")
      setAmountTo("")
    }
  }, [open])

  useEffect(() => {
    if (address) {
      handleGetListBalances()
    }
  }, [address])

  const renderSubmitText = () => {
    if (!address) {
      return "Connect Wallet"
    }
    return createButtonText ? createButtonText : isCrossChain ? "SWAP & BRIDGE" : "SWAP"
  }

  const toggleMode = () => {
    if (mode === "basic") {
      setMode("pro")
      router.push("/trade")
    } else {
      setMode("basic")
    }
  }

  // Toggle cross-chain mode
  const toggleCrossChain = () => {
    setIsCrossChain(!isCrossChain)
  }

  // Calculate estimated values
  const estimatedGas = "~$5.00"
  const priceImpact = "0.05%"
  const minimumReceived = amountTo ? (Number(amountTo) * 0.995).toFixed(6) : "0.00"

  // Token selection component
  const TokenSelector = ({ token, onClick }: { token: Token; onClick: () => void }) => (
    <div
      className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-1 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={
          token.symbol === "USDC"
            ? `/icons/coin/${token.symbol.toLowerCase()}.svg`
            : `/icons/coin/${token.symbol.toLowerCase()}.png`
        }
        alt={token.symbol}
        className="h-5 w-5 rounded-full"
      />
      <span className="font-medium text-[#030303] dark:text-white">{token.symbol}</span>
      <ChevronDown size={14} className="text-gray-500" />
    </div>
  )

  return (
    <>
      <Modal open={open} handleClose={handleClose} title={title || "Swap"} position="right">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div
              className={`h-[1px] w-full mb-6 ${theme === "light" ? "bg-gradient-divider-light" : "bg-gradient-divider"}`}
            ></div>

            {/* Mode Toggle */}
            <motion.div
              className="flex justify-between items-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">Trade Mode</div>
              <div className="flex items-center space-x-2">
                <button
                  className={`px-3 py-1 text-xs rounded-full ${mode === "basic" ? "bg-[#AA5BFF] text-white" : "bg-gray-100 dark:bg-[#1A1A1A] text-gray-500 dark:text-gray-400"}`}
                  onClick={() => setMode("basic")}
                >
                  Basic
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-full ${mode === "pro" ? "bg-[#AA5BFF] text-white" : "bg-gray-100 dark:bg-[#1A1A1A] text-gray-500 dark:text-gray-400"}`}
                  onClick={toggleMode}
                >
                  Pro
                </button>
              </div>
            </motion.div>

            {/* Settings and Cross-chain toggle */}
            <motion.div
              className="flex justify-between items-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isCrossChain} onChange={toggleCrossChain} />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#AA5BFF]"></div>
                  <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-300">Omnichain</span>
                </label>
              </div>
              <motion.button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#EFF2F5] dark:bg-[#2A2D35] hover:bg-opacity-80"
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Settings size={16} className="text-gray-500 dark:text-gray-400" />
              </motion.button>
            </motion.div>

            {/* Settings Dropdown */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  className="mb-4 p-3 bg-[#EFF2F5] dark:bg-[#1D2833] rounded-lg"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Slippage Tolerance</span>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className={`px-2 py-1 text-xs rounded-md ${slippage === "0.1" ? "bg-gray-200 dark:bg-[#353A45]" : "bg-gray-100 dark:bg-[#2A2D35]"}`}
                        onClick={() => setSlippage("0.1")}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        0.1%
                      </motion.button>
                      <motion.button
                        className={`px-2 py-1 text-xs rounded-md ${slippage === "0.5" ? "bg-gray-200 dark:bg-[#353A45]" : "bg-gray-100 dark:bg-[#2A2D35]"}`}
                        onClick={() => setSlippage("0.5")}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        0.5%
                      </motion.button>
                      <motion.button
                        className={`px-2 py-1 text-xs rounded-md ${slippage === "1.0" ? "bg-gray-200 dark:bg-[#353A45]" : "bg-gray-100 dark:bg-[#2A2D35]"}`}
                        onClick={() => setSlippage("1.0")}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        1.0%
                      </motion.button>
                      <div className="relative">
                        <input
                          type="text"
                          value={slippage}
                          onChange={(e) => setSlippage(e.target.value)}
                          className="w-12 px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-[#2A2D35] text-right"
                        />
                        <span className="absolute right-2 top-1 text-xs">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Destination Address Toggle */}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Custom Recipient</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={showDestinationAddress}
                        onChange={() => setShowDestinationAddress(!showDestinationAddress)}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#AA5BFF]"></div>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* From Token */}
            <div className="relative">
              <motion.div
                className="rounded-xl bg-[#EFF2F5] dark:bg-[#1D2833] border border-[#efefef] dark:border-[#28303e] p-3 mb-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500 font-medium dark:text-gray-400">From</span>
                </div>
                <div className="flex justify-between mb-0 items-center">
                  <div className="gap-2 flex flex-col">
                    <div className="flex items-center gap-2">
                      <Popover
                        placement="bottom-right"
                        trigger="click"
                        className="z-[10] mt-[12px] w-[120px] leading-none"
                        externalOpen={openPopover}
                        content={
                          <div className="bg-white dark:bg-[#1A1D21] rounded-lg border border-[#E6E6E6] dark:border-[#1A1A1A] p-1">
                            <HoverIndicator divider direction="vertical" indicatorClassName="rounded-[6px]">
                              {listSwapCoin?.map((coin) => (
                                <div
                                  key={coin?.symbol}
                                  onClick={() => {
                                    let newCoinTo = coinTo
                                    if (coin?.symbol === coinTo?.symbol) {
                                      newCoinTo = coinFrom
                                      setCoinTo(coinFrom)
                                    }
                                    setCoinFrom(coin)
                                    const convertRate =
                                      Number(usdPrice[coin?.symbol]) / Number(usdPrice[newCoinTo?.symbol] || 1)
                                    setAmountTo(
                                      amountFrom ? new BigNumber(amountFrom).multipliedBy(convertRate).toString() : "",
                                    )
                                    setOpenPopover((openPopover) => !openPopover)
                                  }}
                                  className="flex cursor-pointer items-center gap-2 p-2 hover:bg-[#F8F9FA] dark:hover:bg-[#1D2833] rounded-md"
                                >
                                  <img
                                    src={
                                      coin.symbol === "USDC"
                                        ? `/icons/coin/${coin.symbol.toLowerCase()}.svg`
                                        : `/icons/coin/${coin.symbol.toLowerCase()}.png`
                                    }
                                    alt={`${coin.symbol} logo`}
                                    className="h-6 w-6 rounded-full"
                                  />
                                  <span className="text-sm font-medium text-[#030303] dark:text-white">
                                    {coin?.symbol}
                                  </span>
                                </div>
                              ))}
                            </HoverIndicator>
                          </div>
                        }
                      >
                        <TokenSelector token={coinFrom} onClick={() => {}} />
                      </Popover>
                    </div>
                    <NumberFormat
                      className={`w-full bg-transparent text-xl font-medium ${amountFrom ? "text-[#030303] dark:text-white" : "text-gray-400"} outline-none`}
                      value={amountFrom}
                      onChange={(event: any, value2: any) => {
                        setAmountFrom(value2)
                        setAmountTo(value2 ? new BigNumber(value2).multipliedBy(convertRate).toString() : "")
                      }}
                      thousandSeparator
                      placeholder="0.00"
                      decimalScale={6}
                    />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      <NumericFormat
                        value={
                          amountFrom
                            ? Number(amountFrom || 0) * Number(usdPrice?.[coinFrom?.symbol] || 0)
                            : Number("0").toFixed(2)
                        }
                        displayType="text"
                        thousandSeparator
                        decimalScale={2}
                        prefix="$"
                      />
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Balance:{" "}
                        <NumericFormat
                          value={
                            address && Number(listBalances?.[coinFrom?.symbol] || 0)
                              ? listBalances?.[coinFrom?.symbol]
                              : 0
                          }
                          displayType="text"
                          thousandSeparator
                          decimalScale={6}
                        />
                      </span>
                      <button
                        className="ml-2 text-xs font-medium text-[#AA5BFF] px-2 py-1 rounded-full bg-[#AA5BFF]/10"
                        onClick={() => {
                          setAmountFrom(listBalances?.[coinFrom?.symbol] ? listBalances?.[coinFrom?.symbol] : "")
                          setAmountTo(
                            listBalances?.[coinFrom?.symbol]
                              ? new BigNumber(listBalances?.[coinFrom?.symbol]).multipliedBy(convertRate).toString()
                              : "",
                          )
                        }}
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Swap Toggle Button */}
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-[56%] z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <motion.div
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#EFF2F5] dark:bg-[#1D2833] border-4 border-white dark:border-[#1A1D21]"
                  onClick={() => {
                    setCoinFrom(coinTo)
                    setCoinTo(coinFrom)
                    setAmountFrom(amountTo)
                    const convertRate = Number(usdPrice[coinTo?.symbol]) / Number(usdPrice[coinFrom?.symbol] || 1)
                    setAmountTo(amountTo ? new BigNumber(amountTo).multipliedBy(convertRate).toString() : "")
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Repeat className="h-5 w-5 dark:text-gray-300" />
                </motion.div>
              </motion.div>

              {/* To Token */}
              <motion.div
                className="rounded-xl bg-[#EFF2F5] dark:bg-[#1D2833] border border-[#efefef] dark:border-[#28303e] p-3 mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500 font-medium dark:text-gray-400">To</span>
                </div>
                <div className="flex justify-between mb-0 items-center">
                  <div className="gap-2 flex flex-col">
                    <div className="flex items-center gap-2">
                      <Popover
                        placement="bottom-right"
                        trigger="click"
                        className="z-[10] mt-[12px] w-[120px] leading-none"
                        externalOpen={openPopover}
                        content={
                          <div className="bg-white dark:bg-[#1A1D21] rounded-lg border border-[#E6E6E6] dark:border-[#1A1A1A] p-1">
                            <HoverIndicator divider direction="vertical" indicatorClassName="rounded-[6px]">
                              {listSwapCoin?.map((coin) => (
                                <div
                                  key={coin?.symbol}
                                  onClick={() => {
                                    setCoinTo(coin)
                                    setOpenPopover((openPopover) => !openPopover)
                                    if (coin?.symbol === coinFrom?.symbol) {
                                      setCoinFrom(coinTo)
                                      setAmountFrom(amountTo)
                                    } else {
                                      const convertRate =
                                        Number(usdPrice[coinFrom?.symbol]) / Number(usdPrice[coin?.symbol] || 1)
                                      setAmountTo(
                                        amountFrom
                                          ? new BigNumber(amountFrom).multipliedBy(convertRate).toString()
                                          : "",
                                      )
                                    }
                                  }}
                                  className="flex cursor-pointer items-center gap-2 p-2 hover:bg-[#F8F9FA] dark:hover:bg-[#1D2833] rounded-md"
                                >
                                  <img
                                    src={
                                      coin.symbol === "USDC"
                                        ? `/icons/coin/${coin.symbol.toLowerCase()}.svg`
                                        : `/icons/coin/${coin.symbol.toLowerCase()}.png`
                                    }
                                    alt={`${coin.symbol} logo`}
                                    className="h-6 w-6 rounded-full"
                                  />
                                  <span className="text-sm font-medium text-[#030303] dark:text-white">
                                    {coin?.symbol}
                                  </span>
                                </div>
                              ))}
                            </HoverIndicator>
                          </div>
                        }
                      >
                        <TokenSelector token={coinTo} onClick={() => {}} />
                      </Popover>
                    </div>
                    <NumberFormat
                      className={`w-full bg-transparent text-xl font-medium ${amountTo ? "text-[#030303] dark:text-white" : "text-gray-400"} outline-none`}
                      value={amountTo}
                      onChange={(event: any, value2: any) => {
                        setAmountTo(value2)
                        setAmountFrom(value2 ? new BigNumber(value2).dividedBy(convertRate || 1).toString() : "")
                      }}
                      thousandSeparator
                      placeholder="0.00"
                      decimalScale={6}
                    />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      <NumericFormat
                        value={
                          amountTo
                            ? Number(amountTo || 0) * Number(usdPrice?.[coinTo?.symbol] || 0)
                            : Number("0").toFixed(2)
                        }
                        displayType="text"
                        thousandSeparator
                        decimalScale={2}
                        prefix="$"
                      />
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Balance:{" "}
                      <NumericFormat
                        value={
                          address && Number(listBalances?.[coinTo?.symbol] || 0) ? listBalances?.[coinTo?.symbol] : 0
                        }
                        displayType="text"
                        thousandSeparator
                        decimalScale={6}
                      />
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Custom Recipient Address */}
              <AnimatePresence>
                {showDestinationAddress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-3"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 font-medium dark:text-gray-400">Recipient Address</span>
                    </div>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full rounded-lg border border-[#efefef] dark:border-[#28303e] bg-[#EFF2F5] dark:bg-[#1D2833] p-3 text-[#030303] dark:text-white outline-none"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Transaction Info */}
              <AnimatePresence>
                {amountFrom && amountTo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-3 p-3 rounded-lg bg-[#EFF2F5] dark:bg-[#1D2833] border border-[#efefef] dark:border-[#28303e]"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rate</span>
                      <div className="flex items-center">
                        <span className="text-sm text-[#030303] dark:text-white">
                          1 {coinFrom?.symbol} = {convertRate.toFixed(6)} {coinTo?.symbol}
                        </span>
                      </div>
                    </div>

                    {isCrossChain && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Bridge Fee</span>
                        <span className="text-sm text-[#030303] dark:text-white">~$2.50</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isCrossChain ? "Gas Fee" : "Network Fee"}
                      </span>
                      <span className="text-sm text-[#030303] dark:text-white">~$1.20</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Slippage Tolerance</span>
                      <span className="text-sm text-[#030303] dark:text-white">{slippage}%</span>
                    </div>

                    {isCrossChain && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Info size={12} />
                          <span>Omnichain transfers typically take 10-30 minutes to complete</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            className="mt-auto pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => {
                if (!address) {
                  handleClose()
                  setOpenConnectWalletModal(true)
                } else {
                  handleSwap()
                }
              }}
              disabled={loading || !amountFrom || !amountTo}
              className={`w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-3 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
              ${loading || !amountFrom || !amountTo ? "cursor-not-allowed opacity-50" : ""}`}
              whileHover={{ scale: !loading && amountFrom && amountTo ? 1.02 : 1 }}
              whileTap={{ scale: !loading && amountFrom && amountTo ? 0.98 : 1 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingCircle />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                renderSubmitText()
              )}
            </motion.button>
          </motion.div>
        </div>
      </Modal>

      <ConnectWalletModal openModal={isOpenConnectWalletModal} handleClose={() => setOpenConnectWalletModal(false)} />
    </>
  )
}
