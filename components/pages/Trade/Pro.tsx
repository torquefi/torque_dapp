// Pro.tsx
"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Plus, Minus, X, TrendingUp, TrendingDown, Clock, BarChart3, Layers, DollarSign, ChevronsDownUp } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { useSelector } from "react-redux"
import { AppStore } from "@/types/store"

export const ProMode = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [selectedMarket, setSelectedMarket] = useState("ETH-USD")
  const [timeframe, setTimeframe] = useState("1D")
  const [position, setPosition] = useState("long")
  const [leverage, setLeverage] = useState(2)
  const [orderType, setOrderType] = useState("market")
  const [activeTab, setActiveTab] = useState("positions")
  const [collateral, setCollateral] = useState("100")
  const [marketPrice, setMarketPrice] = useState("1,825.45")
  const [limitPrice, setLimitPrice] = useState("1,820.00")
  const [stopPrice, setStopPrice] = useState("1,800.00")
  const [showMarketSelector, setShowMarketSelector] = useState(false)

  const availableMarkets = [
    { symbol: "ETH-USD", name: "Ethereum", price: "1,825.45", change: "+1.2%", logo: "/icons/coin/weth.svg" },
    { symbol: "BTC-USD", name: "Bitcoin", price: "35,400.00", change: "+0.8%", logo: "/icons/coin/wbtc.png" },
    { symbol: "ARB-USD", name: "Arbitrum", price: "1.05", change: "-0.3%", logo: "/icons/coin/arb.png" },
  ]

  const chartData = [
    { time: "00:00", price: 1810, volume: 120 },
    { time: "04:00", price: 1815, volume: 180 },
    { time: "08:00", price: 1830, volume: 200 },
    { time: "12:00", price: 1820, volume: 150 },
    { time: "16:00", price: 1825, volume: 220 },
    { time: "20:00", price: 1835, volume: 190 },
    { time: "24:00", price: 1825.45, volume: 210 },
  ]

  const mockPositions = [
    {
      id: 1,
      pair: "ETH-USD",
      type: "long",
      size: "2.5 ETH",
      leverage: "2x",
      entryPrice: "1,820.45",
      markPrice: "1,825.45",
      pnl: "+$25.00",
      pnlPercent: "+0.55%",
      liquidationPrice: "1,642.91",
      collateral: "$2,275.56",
    },
    {
      id: 2,
      pair: "BTC-USD",
      type: "short",
      size: "0.15 BTC",
      leverage: "3x",
      entryPrice: "35,450.00",
      markPrice: "35,400.00",
      pnl: "+$22.50",
      pnlPercent: "+0.42%",
      liquidationPrice: "38,995.00",
      collateral: "$1,772.50",
    },
  ]

  const mockOrders = [
    { id: 1, type: "limit", side: "buy", price: "1,805.45", amount: "0.5", total: "902.73", time: "12:45:30" },
    { id: 2, type: "stop", side: "sell", price: "1,850.32", amount: "1.2", total: "2,220.38", time: "12:44:15" },
  ]

  const mockTrades = [
    {
      id: 1,
      pair: "ETH-USD",
      side: "buy",
      price: "1,825.45",
      amount: "0.5",
      total: "912.73",
      time: "12:45:30",
      fee: "0.27",
    },
    {
      id: 2,
      pair: "ETH-USD",
      side: "sell",
      price: "1,824.32",
      amount: "1.2",
      total: "2,189.18",
      time: "12:44:15",
      fee: "0.66",
    },
    {
      id: 3,
      pair: "BTC-USD",
      side: "buy",
      price: "35,450.00",
      amount: "0.05",
      total: "1,772.50",
      time: "12:43:22",
      fee: "0.53",
    },
  ]

  const positionSize = useMemo(() => {
    if (!collateral || !marketPrice) return "0"
    const size =
      (Number.parseFloat(collateral.replace(/,/g, "")) * leverage / Number.parseFloat(marketPrice.replace(/,/g, "")))
    return size.toFixed(4)
  }, [collateral, marketPrice, leverage])

  const liquidationPrice = useMemo(() => {
    if (position === "long") {
      const liqPrice = Number.parseFloat(marketPrice.replace(/,/g, "")) * (1 - 0.9 / leverage)
      return liqPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } else {
      const liqPrice = Number.parseFloat(marketPrice.replace(/,/g, "")) * (1 + 0.9 / leverage)
      return liqPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }, [marketPrice, leverage, position])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1A1D21] p-3 rounded-lg shadow-md border border-gray-100 dark:border-[#2A2D35]">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm text-[#AA5BFF]">{`Price: $${payload[0].value.toFixed(2)}`}</p>
          <p className="text-sm text-gray-500">{`Volume: ${payload[0].payload.volume}`}</p>
        </div>
      )
    }
    return null
  }

  const MarketSelector = () => {
    return (
      <div className="relative group">
        <motion.div
          className="flex items-center bg-white dark:bg-[#1A1D21] rounded-lg p-2 cursor-pointer"
          onClick={() => setShowMarketSelector(!showMarketSelector)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={availableMarkets.find((m) => m.symbol === selectedMarket)?.logo || "/placeholder.svg"}
            alt={selectedMarket}
            className="w-6 h-6 rounded-full mr-2"
          />
          <div className="flex flex-col">
            <span className="font-medium text-[#030303] dark:text-white">{selectedMarket}</span>
            <span className="text-xs text-[#AA5BFF]">
              ${availableMarkets.find((m) => m.symbol === selectedMarket)?.price}
            </span>
          </div>
          <ChevronDown size={16} className="text-gray-500 group-hover:text-[#030303] dark:group-hover:text-white" />
        </motion.div>

        <AnimatePresence>
          {showMarketSelector && (
            <motion.div
              className="absolute z-50 mt-1 w-64 bg-white dark:bg-[#1A1D21] rounded-lg shadow-lg border border-gray-100 dark:border-[#2A2D35] overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-h-64 overflow-y-auto">
                {availableMarkets.map((market) => (
                  <div
                    key={market.symbol}
                    className={`flex items-center p-3 hover:bg-gray-50 dark:hover:bg-[#2A2D35] cursor-pointer ${
                      market.symbol === selectedMarket ? "bg-gray-50 dark:bg-[#2A2D35]" : ""
                    }`}
                    onClick={() => {
                      setSelectedMarket(market.symbol)
                      setShowMarketSelector(false)
                    }}
                  >
                    <img
                      src={market.logo || "/placeholder.svg"}
                      alt={market.symbol}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-[#030303] dark:text-white">{market.symbol}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{market.name}</span>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <span className="text-sm text-[#030303] dark:text-white">${market.price}</span>
                      <span className={`text-xs ${market.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                        {market.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const CollateralInput = () => {
    return (
      <div className="relative">
        <div className="flex items-center p-3 bg-gray-50 dark:bg-[#2A2D35] rounded-lg">
          <DollarSign size={16} className="text-gray-400 mr-1" />
          <input
            type="text"
            value={collateral}
            onChange={(e) => setCollateral(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-base font-medium text-[#030303] dark:text-white outline-none"
          />
          <button
            className="text-xs font-medium text-[#AA5BFF] px-2 py-1 rounded-full bg-[#AA5BFF]/10"
            onClick={() => setCollateral("0")}
          >
            MAX
          </button>
        </div>
        <div className="absolute right-3 -bottom-5 text-xs text-gray-500">Balance: 0 USDC</div>
      </div>
    )
  }

  const LeverageSelector = () => {
    const presets = [1, 5, 20, 50, 100]
    const [showDetails, setShowDetails] = useState(false)

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Leverage</span>
          <span className="text-sm font-medium text-[#030303] dark:text-white">{leverage}x</span>
        </div>

        <div className="flex gap-2 mb-2">
          {presets.map((preset) => (
            <button
              key={preset}
              className={`flex-1 py-1 text-xs rounded-full ${
                leverage === preset
                  ? "bg-[#AA5BFF] text-white"
                  : "bg-gray-100 dark:bg-[#2A2D35] text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setLeverage(preset)}
            >
              {preset}x
            </button>
          ))}
        </div>

        <div className="flex items-center">
          <motion.button
            className="p-1 rounded-md bg-gray-100 dark:bg-[#2A2D35]"
            onClick={() => setLeverage(Math.max(1, leverage - 1))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Minus size={16} className="text-[#AA5BFF]" />
          </motion.button>
          <div className="flex-1 mx-2 h-2 bg-gray-100 dark:bg-[#2A2D35] rounded-full relative">
            <motion.div
              className="absolute top-0 left-0 h-2 bg-[#AA5BFF] rounded-full"
              style={{ width: `${(leverage / 100) * 100}%` }}
              initial={{ width: "10%" }}
              animate={{ width: `${(leverage / 100) * 100}%` }}
              transition={{ duration: 0.2 }}
            ></motion.div>
            <motion.div
              className="absolute top-0 h-4 w-4 bg-white dark:bg-[#353A45] rounded-full border-2 border-[#AA5BFF] -mt-1 cursor-pointer"
              style={{ left: `${(leverage / 100) * 100}%`, transform: "translateX(-50%)" }}
              initial={{ left: "10%" }}
              animate={{ left: `${(leverage / 100) * 100}%` }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            ></motion.div>
          </div>
          <motion.button
            className="p-1 rounded-md bg-gray-100 dark:bg-[#2A2D35]"
            onClick={() => setLeverage(Math.min(100, leverage + 1))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Plus size={16} className="text-[#AA5BFF]" />
          </motion.button>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>1x</span>
          <span>25x</span>
          <span>50x</span>
          <span>75x</span>
          <span>100x</span>
        </div>

        <div className="mt-4 flex items-center group">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          <button
            className="mx-2 flex items-center text-xs text-gray-500 hover:text-[#030303] dark:hover:text-white transition-colors"
            onClick={() => setShowDetails(!showDetails)}
          >
            Show {showDetails ? "less" : "more"}
            <ChevronsDownUp
              size={14}
              className="ml-1 text-gray-500 group-hover:text-[#030303] dark:group-hover:text-white"
            />
          </button>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-gray-50 dark:bg-[#2A2D35] rounded-lg text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Market Price</span>
                  <span className="text-[#030303] dark:text-white">${marketPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Position Size</span>
                  <span className="text-[#030303] dark:text-white">
                    {positionSize} {selectedMarket.split("-")[0]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Liquidation Price</span>
                  <span className="text-[#030303] dark:text-white">${liquidationPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Fees</span>
                  <span className="text-[#030303] dark:text-white">$0.30 (0.3%)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const OrderTypeTabs = () => {
    return (
      <div className="flex mb-4 border-b border-gray-200 dark:border-[#2A2D35]">
        <motion.button
          className={`flex-1 py-2 text-center text-sm ${
            orderType === "market"
              ? "border-b-2 border-[#AA5BFF] text-[#030303] dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setOrderType("market")}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Market
        </motion.button>
        <motion.button
          className={`flex-1 py-2 text-center text-sm ${
            orderType === "limit"
              ? "border-b-2 border-[#AA5BFF] text-[#030303] dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setOrderType("limit")}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Limit
        </motion.button>
        <motion.button
          className={`flex-1 py-2 text-center text-sm ${
            orderType === "stop"
              ? "border-b-2 border-[#AA5BFF] text-[#030303] dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setOrderType("stop")}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Stop
        </motion.button>
      </div>
    )
  }

  const PositionTabs = () => {
    return (
      <div className="flex mb-4 border-b border-gray-200 dark:border-[#2A2D35]">
        <motion.button
          className={`flex-1 py-2 text-center text-sm ${
            activeTab === "positions"
              ? "border-b-2 border-[#AA5BFF] text-[#030303] dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("positions")}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Positions
        </motion.button>
        <motion.button
          className={`flex-1 py-2 text-center text-sm ${
            activeTab === "orders"
              ? "border-b-2 border-[#AA5BFF] text-[#030303] dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("orders")}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Orders
        </motion.button>
        <motion.button
          className={`flex-1 py-2 text-center text-sm ${
            activeTab === "trades"
              ? "border-b-2 border-[#AA5BFF] text-[#030303] dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("trades")}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Trades
        </motion.button>
      </div>
    )
  }

  const OrderForm = () => {
    if (orderType === "market") {
      return (
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Collateral</span>
            </div>
            <CollateralInput />
          </div>

          <LeverageSelector />

          <div className="mt-4">
            <button className="w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-2 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]">
              {position === "long" ? "LONG" : "SHORT"}
            </button>
          </div>
        </div>
      )
    } else if (orderType === "limit") {
      return (
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Limit Price</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Market: ${marketPrice}</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-[#2A2D35] rounded-lg">
              <DollarSign size={16} className="text-gray-400 mr-1" />
              <input
                type="text"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-base font-medium text-[#030303] dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Collateral</span>
            </div>
            <CollateralInput />
          </div>

          <LeverageSelector />

          <div className="mt-4">
            <button className="w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-2 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]">
              {position === "long" ? "LONG" : "SHORT"}
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Trigger Price</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Market: ${marketPrice}</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-[#2A2D35] rounded-lg">
              <DollarSign size={16} className="text-gray-400 mr-1" />
              <input
                type="text"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-base font-medium text-[#030303] dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Collateral</span>
            </div>
            <CollateralInput />
          </div>

          <LeverageSelector />

          <div className="mt-4">
            <button className="w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-2 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]">
              {position === "long" ? "STOP LONG" : "STOP SHORT"}
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      // variants={fadeIn}
    >
      {/* Left Column - Chart */}
      <motion.div
        className="lg:col-span-3 bg-white dark:bg-[#1A1D21] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A2D35] overflow-hidden"
        // variants={slideIn}
      >
        <div className="p-4 border-b border-gray-100 dark:border-[#2A2D35]">
          <div className="flex justify-between items-center">
            <MarketSelector />
            <div className="flex space-x-2">
              <motion.button
                className={`px-3 py-1 text-xs rounded-full ${timeframe === "1H" ? "bg-[#AA5BFF] text-white" : "bg-gray-100 dark:bg-[#2A2D35] text-gray-500 dark:text-gray-400"}`}
                onClick={() => setTimeframe("1H")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                1H
              </motion.button>
              <motion.button
                className={`px-3 py-1 text-xs rounded-full ${timeframe === "4H" ? "bg-[#AA5BFF] text-white" : "bg-gray-100 dark:bg-[#2A2D35] text-gray-500 dark:text-gray-400"}`}
                onClick={() => setTimeframe("4H")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                4H
              </motion.button>
              <motion.button
                className={`px-3 py-1 text-xs rounded-full ${timeframe === "1D" ? "bg-[#AA5BFF] text-white" : "bg-gray-100 dark:bg-[#2A2D35] text-gray-500 dark:text-gray-400"}`}
                onClick={() => setTimeframe("1D")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                1D
              </motion.button>
              <motion.button
                className={`px-3 py-1 text-xs rounded-full ${timeframe === "1W" ? "bg-[#AA5BFF] text-white" : "bg-gray-100 dark:bg-[#2A2D35] text-gray-500 dark:text-gray-400"}`}
                onClick={() => setTimeframe("1W")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                1W
              </motion.button>
            </div>
          </div>
        </div>
        <div className="h-[400px] bg-white dark:bg-[#1A1D21] relative p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AA5BFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#AA5BFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme === "dark" ? "#A7B0BC" : "#5D6670", fontSize: 12 }}
              />
              <YAxis
                domain={["auto", "auto"]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme === "dark" ? "#A7B0BC" : "#5D6670", fontSize: 12 }}
                orientation="right"
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={theme === "dark" ? "#2A2D35" : "#f0f0f0"}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#AA5BFF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                activeDot={{ r: 6, fill: "#AA5BFF", stroke: theme === "dark" ? "#1A1D21" : "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Right Column - Order Form */}
      <motion.div
        className="bg-white dark:bg-[#1A1D21] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A2D35] p-4"
        // variants={slideIn}
      >
        <div className="flex mb-4">
          <motion.button
            className={`flex-1 py-2 text-center rounded-l-xl ${
              position === "long"
                ? "bg-[#AA5BFF] text-white"
                : "bg-gray-100 dark:bg-[#2A2D35] text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setPosition("long")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center">
              <TrendingUp size={16} className="mr-1" />
              <span>Long</span>
            </div>
          </motion.button>
          <motion.button
            className={`flex-1 py-2 text-center rounded-r-xl ${
              position === "short"
                ? "bg-[#AA5BFF] text-white"
                : "bg-gray-100 dark:bg-[#2A2D35] text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setPosition("short")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center">
              <TrendingDown size={16} className="mr-1" />
              <span>Short</span>
            </div>
          </motion.button>
        </div>

        <OrderTypeTabs />
        <OrderForm />
      </motion.div>

      {/* Bottom Section - Positions/Orders/Trades */}
      <motion.div
        className="lg:col-span-4 bg-white dark:bg-[#1A1D21] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A2D35] p-4"
        // variants={slideIn}
        transition={{ delay: 0.2 }}
      >
        <PositionTabs />

        {activeTab === "positions" && (
          <div className="overflow-x-auto">
            {mockPositions.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#2A2D35]">
                    <th className="text-left py-2">Market</th>
                    <th className="text-left py-2">Size</th>
                    <th className="text-left py-2">Entry Price</th>
                    <th className="text-right py-2">PnL</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPositions.map((position) => (
                    <tr key={position.id} className="border-b border-gray-100 dark:border-[#2A2D35]">
                      <td className="py-2">
                        <div className="flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${position.type === "long" ? "bg-green-500" : "bg-red-500"}`}
                          ></span>
                          <span className="font-medium text-[#030303] dark:text-white">{position.pair}</span>
                          <span className="ml-1 text-xs bg-gray-100 dark:bg-[#2A2D35] px-1.5 py-0.5 rounded">
                            {position.leverage}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 text-[#030303] dark:text-white">{position.size}</td>
                      <td className="py-2 text-[#030303] dark:text-white">${position.entryPrice}</td>
                      <td
                        className={`py-2 text-right ${position.pnl.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                      >
                        {position.pnl} <span className="text-xs">({position.pnlPercent})</span>
                      </td>
                      <td className="py-2 text-right">
                        <button className="px-2 py-1 text-xs rounded-full bg-[#AA5BFF] text-white">Close</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <Layers size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No open positions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="overflow-x-auto">
            {mockOrders.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#2A2D35]">
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Side</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 dark:border-[#2A2D35]">
                      <td className="py-2 capitalize text-[#030303] dark:text-white">{order.type}</td>
                      <td className={`py-2 capitalize ${order.side === "buy" ? "text-green-500" : "text-red-500"}`}>
                        {order.side}
                      </td>
                      <td className="py-2 text-[#030303] dark:text-white">${order.price}</td>
                      <td className="py-2 text-[#030303] dark:text-white">{order.amount} ETH</td>
                      <td className="py-2 text-right">
                        <button className="p-1 rounded-full text-red-500 hover:bg-red-500/10">
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <Clock size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No active orders</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "trades" && (
          <div className="overflow-x-auto">
            {mockTrades.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#2A2D35]">
                    <th className="text-left py-2">Market</th>
                    <th className="text-left py-2">Side</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Size</th>
                    <th className="text-right py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-gray-100 dark:border-[#2A2D35]">
                      <td className="py-2 text-[#030303] dark:text-white">{trade.pair}</td>
                      <td className={`py-2 capitalize ${trade.side === "buy" ? "text-green-500" : "text-red-500"}`}>
                        {trade.side}
                      </td>
                      <td className="py-2 text-[#030303] dark:text-white">${trade.price}</td>
                      <td className="py-2 text-[#030303] dark:text-white">{trade.amount}</td>
                      <td className="py-2 text-right text-gray-500 dark:text-gray-400">{trade.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No recent trades</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Market Data */}
      <motion.div
        className="lg:col-span-4 bg-white dark:bg-[#1A1D21] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A2D35] p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-[#030303] dark:text-white mb-4">Market Data</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="p-3 bg-gray-50 dark:bg-[#2A2D35] rounded-xl"
            whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(170, 91, 255, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">24h Volume</div>
            <div className="text-xl font-bold text-[#030303] dark:text-white">$1.25B</div>
          </motion.div>
          <motion.div
            className="p-3 bg-gray-50 dark:bg-[#2A2D35] rounded-xl"
            whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(170, 91, 255, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Open Interest</div>
            <div className="text-xl font-bold text-[#030303] dark:text-white">$450.8M</div>
          </motion.div>
          <motion.div
            className="p-3 bg-gray-50 dark:bg-[#2A2D35] rounded-xl"
            whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(170, 91, 255, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Funding Rate</div>
            <div className="text-xl font-bold text-[#AA5BFF]">+0.01%</div>
          </motion.div>
          <motion.div
            className="p-3 bg-gray-50 dark:bg-[#2A2D35] rounded-xl"
            whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(170, 91, 255, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">24h Change</div>
            <div className="text-xl font-bold text-[#AA5BFF]">+1.2%</div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}