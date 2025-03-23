// Basic.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import type { AppStore } from "@/types/store"
import { useSelector } from "react-redux"
import { ChevronDown, Plus, Minus, X, Repeat, Settings, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Network {
  name: string
  chainId: number
  icon: string
}

interface Token {
  symbol: string
  name: string
  balance: string
  logo: string
  amount: string
}

export const BasicMode = () => {
  const router = useRouter()
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [fromTokens, setFromTokens] = useState<Token[]>([
    { symbol: "ETH", name: "Ethereum", balance: "0", logo: "/icons/coin/weth.svg", amount: "" },
  ])
  const [toTokens, setToTokens] = useState<Token[]>([
    { symbol: "USDC", name: "USD Coin", balance: "0", logo: "/icons/coin/usdc.png", amount: "" },
  ])
  const [slippage, setSlippage] = useState("0.5")
  const [showSettings, setShowSettings] = useState(false)
  const [isCrossChain, setIsCrossChain] = useState(false)
  const [fromNetwork, setFromNetwork] = useState<Network>({
    name: "Arbitrum",
    chainId: 42161,
    icon: "/icons/networks/arbitrum.png",
  })
  const [toNetwork, setToNetwork] = useState<Network>({
    name: "Ethereum",
    chainId: 1,
    icon: "/icons/networks/ethereum.png",
  })
  const [showDestinationAddress, setShowDestinationAddress] = useState(false)
  const [destinationAddress, setDestinationAddress] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableNetworks: Network[] = [
    { name: "Ethereum", chainId: 1, icon: "/icons/networks/ethereum.png" },
    { name: "Arbitrum", chainId: 42161, icon: "/icons/networks/arbitrum.png" },
    { name: "Optimism", chainId: 10, icon: "/icons/networks/optimism.png" },
    { name: "Polygon", chainId: 137, icon: "/icons/networks/polygon.png" },
    { name: "Base", chainId: 8453, icon: "/icons/networks/base.png" },
  ]

  const availableTokens: Token[] = [
    { symbol: "ETH", name: "Ethereum", balance: "0", logo: "/icons/coin/weth.svg", amount: "" },
    { symbol: "USDC", name: "USD Coin", balance: "0", logo: "/icons/coin/usdc.png", amount: "" },
    { symbol: "BTC", name: "Bitcoin", balance: "0", logo: "/icons/coin/wbtc.png", amount: "" },
    { symbol: "ARB", name: "Arbitrum", balance: "0", logo: "/icons/coin/arb.png", amount: "" },
    { symbol: "TORQ", name: "Torque", balance: "0", logo: "/icons/coin/torq.svg", amount: "" },
    { symbol: "USDT", name: "Tether", balance: "0", logo: "/icons/coin/usdt.png", amount: "" },
  ]

  const handleSwap = () => {
    const newFromTokens = toTokens.map((token) => ({ ...token, amount: "" }))
    const newToTokens = fromTokens.map((token) => ({ ...token, amount: "" }))
    setFromTokens(newFromTokens)
    setToTokens(newToTokens)
  }

  const executeSwap = () => {
    if (!fromTokens[0].amount || Number.parseFloat(fromTokens[0].amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsSwapping(true)
    setError(null)

    if (isCrossChain && fromNetwork.chainId !== toNetwork.chainId) {
      toast.info(`Bridging ${fromTokens[0].amount} ${fromTokens[0].symbol} from ${fromNetwork.name} to ${toNetwork.name}`)
    } else {
      toast.info(`Swapping ${fromTokens[0].amount} ${fromTokens[0].symbol} for ${toTokens[0].amount} ${toTokens[0].symbol}`)
    }

    setTimeout(() => {
      setIsSwapping(false)
      setFromTokens(fromTokens.map((token) => ({ ...token, amount: "" })))
      setToTokens(toTokens.map((token) => ({ ...token, amount: "" })))
      toast.success("Transaction submitted successfully!")
    }, 2000)
  }

  const toggleCrossChain = () => {
    setIsCrossChain(!isCrossChain)
    if (!isCrossChain) {
      const alternativeNetwork = availableNetworks.find((network) => network.chainId !== fromNetwork.chainId)
      if (alternativeNetwork) {
        setToNetwork(alternativeNetwork)
      }
    } else {
      setToNetwork(fromNetwork)
    }
  }

  const TokenDropdown = ({ tokens, currentSymbol, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="relative">
        <motion.div
          className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg pl-2 pr-1 py-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={availableTokens.find((token) => token.symbol === currentSymbol)?.logo || "/placeholder.svg"}
            alt={currentSymbol}
            className="w-5 h-5 rounded-full mr-1"
          />
          <span className="font-medium text-[#030303] dark:text-white mr-1">{currentSymbol}</span>
          <ChevronDown size={14} className="text-gray-500 group-hover:text-[#030303] dark:group-hover:text-white" />
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1A1D21] rounded-lg shadow-lg border border-gray-100 dark:border-[#2A2D35] overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-h-40 overflow-y-auto">
                {tokens.map((token) => (
                  <div
                    key={token.symbol}
                    className={`flex items-center p-1.5 hover:bg-gray-50 dark:hover:bg-[#2A2D35] cursor-pointer ${
                      token.symbol === currentSymbol ? "bg-gray-50 dark:bg-[#2A2D35]" : ""
                    }`}
                    onClick={() => {
                      onChange(token.symbol)
                      setIsOpen(false)
                    }}
                  >
                    <img
                      src={token.logo || "/placeholder.svg"}
                      alt={token.symbol}
                      className="w-5 h-5 rounded-full mr-1.5"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-[#030303] dark:text-white">{token.symbol}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{token.name}</span>
                    </div>
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{token.balance}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const NetworkSelector = ({ isFrom = true, network, setNetwork }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="relative">
        <button
          className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-[#2A2D35] px-2 py-1 text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img src={network.icon || "/placeholder.svg"} alt={network.name} className="h-4 w-4 rounded-full" />
          <span className="font-medium text-[#030303] dark:text-white">{network.name}</span>
          <ChevronDown size={14} className="text-gray-500" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-50 mt-1 w-40 bg-white dark:bg-[#1A1D21] rounded-lg shadow-lg border border-gray-100 dark:border-[#2A2D35] overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-h-40 overflow-y-auto">
                {availableNetworks.map((net) => (
                  <div
                    key={net.chainId}
                    className={`flex items-center p-2 hover:bg-gray-50 dark:hover:bg-[#2A2D35] cursor-pointer ${
                      net.chainId === network.chainId ? "bg-gray-50 dark:bg-[#2A2D35]" : ""
                    }`}
                    onClick={() => {
                      setNetwork(net)
                      setIsOpen(false)

                      if (!isCrossChain) {
                        if (isFrom) {
                          setToNetwork(net)
                        } else {
                          setFromNetwork(net)
                        }
                      }
                    }}
                  >
                    <img src={net.icon || "/placeholder.svg"} alt={net.name} className="h-5 w-5 rounded-full mr-2" />
                    <span className="font-medium text-sm text-[#030303] dark:text-white">{net.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.div className="max-w-md mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
      <motion.div
        className="bg-white dark:bg-[#1A1D21] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A2D35] p-4"
        variants={slideIn}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#030303] dark:text-white">Swap</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isCrossChain}
                  onChange={toggleCrossChain}
                />
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
          </div>
        </div>

        {showSettings && (
          <motion.div
            className="mb-4 p-3 bg-[#EFF2F5] dark:bg-[#1D2833] rounded-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
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

        <div className="relative">
          <div className="rounded-xl w-full items-center justify-center rounded-md border bg-transparent border-[#efefef] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b p-3 mb-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500 font-medium dark:text-gray-400">From</span>
            </div>
            <div className="flex justify-between mb-0 items-center">
              <div className="flex flex-col">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full border-none font-semibold bg-transparent text-xl focus:outline-none dark:text-white"
                  value={fromTokens[0].amount}
                  onChange={(e) => updateFromAmount(0, e.target.value)}
                />
                <span className="text-sm text-gray-500 font-medium dark:text-gray-400 mt-1">$0.00</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-2">
                  <TokenDropdown
                    tokens={availableTokens.filter(
                      (t) => !fromTokens.some((ft, i) => i !== 0 && ft.symbol === t.symbol),
                    )}
                    currentSymbol={fromTokens[0].symbol}
                    onChange={(symbol) => changeFromToken(0, symbol)}
                  />
                  {isCrossChain && (
                    <NetworkSelector isFrom={true} network={fromNetwork} setNetwork={setFromNetwork} />
                  )}
                </div>
                <span className="text-sm text-gray-500 font-medium dark:text-gray-400 mt-1">
                  Balance: {fromTokens[0].balance}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-[56%] z-10">
            <motion.div
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#EFF2F5] dark:bg-[#1D2833] border-4 border-white dark:border-[#1A1D21]"
              onClick={handleSwap}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Repeat className="h-5 w-5 dark:text-gray-300" />
            </motion.div>
          </div>

          <div className="rounded-xl w-full items-center justify-center rounded-md border bg-transparent border-[#efefef] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b p-3 mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500 font-medium dark:text-gray-400">To</span>
            </div>
            <div className="flex justify-between mb-0 items-center">
              <div className="flex flex-col">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full border-none font-semibold bg-transparent text-xl focus:outline-none dark:text-white"
                  value={toTokens[0].amount}
                  onChange={(e) => updateToAmount(0, e.target.value)}
                />
                <span className="text-sm text-gray-500 font-medium dark:text-gray-400 mt-1">
                  Balance: {toTokens[0].balance}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <TokenDropdown
                    tokens={availableTokens.filter(
                      (t) => !toTokens.some((tt, i) => i !== 0 && tt.symbol === t.symbol),
                    )}
                    currentSymbol={toTokens[0].symbol}
                    onChange={(symbol) => changeToToken(0, symbol)}
                  />
                  {isCrossChain && <NetworkSelector isFrom={false} network={toNetwork} setNetwork={setToNetwork} />}
                </div>
                <span className="text-sm text-gray-500 font-medium dark:text-gray-400 mt-1">$0.00</span>
              </div>
            </div>
          </div>

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

          {fromTokens[0].amount && toTokens[0].amount && (
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
                    1 {fromTokens[0].symbol} = {fromTokens[0].symbol === "ETH" ? "1,825.00" : "0.000548"}{" "}
                    {toTokens[0].symbol}
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

          <button
            className="w-full py-3 bg-[#AA5BFF] text-white font-semibold rounded-full hover:bg-[#9A4AEF] transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={executeSwap}
            disabled={isSwapping}
          >
            {isSwapping ? (
              <svg
                className="animate-spin mx-auto h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : isCrossChain ? (
              "SWAP & BRIDGE"
            ) : (
              "SWAP"
            )}
          </button>

          {error && <div className="text-sm mt-3 font-medium text-red-500 text-center">{error}</div>}
        </div>
      </motion.div>
    </motion.div>
  )
}
