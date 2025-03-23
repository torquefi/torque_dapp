"use client"

import type React from "react"

import { useEffect, useMemo, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { useAccount, useDisconnect, useNetwork } from "wagmi"
import { useWeb3Modal } from "@web3modal/react"
import { createPortal } from "react-dom"
import {
  Home,
  TrendingUp,
  Landmark,
  Vote,
  ImportIcon,
  ArrowRightLeft,
  Layers,
  Gift,
  UserCog,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Wallet,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Plus,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react"
import BigNumber from "bignumber.js"
import Web3 from "web3"
import { ethers } from "ethers"
import { motion, AnimatePresence } from "framer-motion"

import Popover from "@/components/common/Popover"
import { requestSwitchNetwork } from "@/lib/helpers/network"
import { shortenAddress } from "@/lib/helpers/utils"
import type { AppStore } from "@/types/store"
import { torqContract } from "@/constants/contracts"
import ClaimModal from "./ClaimModal"
import ConnectWalletModal from "./ConnectWalletModal"
import UniSwapModal from "@/components/common/Modal/UniswapModal"
import { DelegateModal } from "@/components/pages/Vote/Governance/DelegateModal"
import { updateTheme } from "@/lib/redux/slices/theme"
import { useDispatch } from "react-redux"

BigNumber.config({ EXPONENTIAL_AT: 100 })

const arbitrumMainnetInfo = {
  name: "Arbitrum",
  symbol: "ETH",
  chainId: 42161,
  chainName: "eth",
  coinName: "ETH",
  coinSymbol: "ETH",
  rpcUrls: ["https://arbitrum-mainnet.infura.io"],
  blockchainExplorer: "https://explorer.arbitrum.io",
}

// Portal-based tooltip component
const TooltipPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return mounted ? createPortal(children, document.body) : null
}

export const Sidebar = () => {
  const dispatch = useDispatch()
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { address } = useAccount()
  const { chain, chains } = useNetwork()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  const [isShowNetworkAlert, setIsShowNetworkAlert] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [isOpenClaim, setIsOpenClaim] = useState(false)
  const [openDelegateModal, setOpenDelegateModal] = useState(false)
  const [openUniSwapModal, setOpenUniSwapModal] = useState(false)
  const [torqueBalance, setTorqueBalance] = useState("0")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [fabMenuOpen, setFabMenuOpen] = useState(false)

  // Refs for tooltip positioning
  const navItemRefs = useRef([])
  const actionItemRefs = useRef([])
  const profileRef = useRef(null)
  const fabButtonRef = useRef(null)

  // Get the current path for active menu highlighting
  const currentPath = router.pathname

  // Define all navigation items - moved up before it's used
  const navItems = [
    {
      label: "Home",
      path: "/home",
      icon: <Home strokeWidth={2} size={18} />,
    },
    // {
    //   label: "Swap",
    //   path: "/trade",
    //   icon: <ArrowRightLeft strokeWidth={2} size={18} />,
    // },
    {
      label: "Boost",
      path: "/boost",
      icon: <TrendingUp strokeWidth={2} size={18} />,
    },
    {
      label: "Borrow",
      path: "/borrow",
      icon: <Landmark strokeWidth={2} size={18} />,
    },
    {
      label: "Import",
      path: "/import",
      icon: <ImportIcon strokeWidth={2} size={18} />,
    },
    {
      label: "Pools",
      path: "/vote/distribution",
      icon: <Layers strokeWidth={2} size={18} />,
    },
    {
      label: "Vote",
      path: "/vote",
      icon: <Vote strokeWidth={2} size={18} />,
    },
  ]

  // Get current active index
  const activeNavIndex = useMemo(() => {
    return navItems.findIndex((item) => currentPath.includes(item.path))
  }, [currentPath, navItems])

  // Define action items
  const actionItems = [
    {
      label: "Rewards",
      icon: <Gift strokeWidth={2} size={18} />,
      onClick: () => {
        setIsOpenClaim(true)
        setFabMenuOpen(false)
      },
    },
    {
      label: "Delegate",
      icon: <UserCog strokeWidth={2} size={18} />,
      onClick: () => {
        setOpenDelegateModal(true)
        setFabMenuOpen(false)
      },
    },
  ]

  const handleChangeNetwork = async () => {
    await requestSwitchNetwork(arbitrumMainnetInfo)
  }

  useEffect(() => {
    if (chain?.id) {
      const network = chains?.find((item: any) => item?.id === chain?.id)
      setIsShowNetworkAlert(!network)
    }
  }, [chain, chains])

  const handleDisconnect = () => {
    disconnect()
  }

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(JSON.parse(torqContract.abi), torqContract.address)
    return contract
  }, [Web3.givenProvider, torqContract])

  const handleGetTorqueBalance = async () => {
    if (!tokenContract || !address) {
      return
    }
    try {
      const balance = await tokenContract.methods.balanceOf(address).call()
      const decimals = await tokenContract.methods.decimals().call()
      setTorqueBalance(ethers.utils.formatUnits(balance, decimals).toString())
    } catch (error) {
      console.log("error get usdc balance:>> ", error)
    }
  }

  useEffect(() => {
    handleGetTorqueBalance()
  }, [address, tokenContract])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false)
    setFabMenuOpen(false)
  }, [router.pathname])

  // Load sidebar state from localStorage with default closed state
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar:expanded")
    if (savedState !== null) {
      setExpanded(savedState === "true")
    } else {
      // Default to closed if no saved state exists
      setExpanded(false)
    }
  }, [])

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabButtonRef.current && !fabButtonRef.current.contains(event.target) && fabMenuOpen) {
        setFabMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [fabMenuOpen])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    dispatch(updateTheme(newTheme as any))
  }

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    const newState = !expanded
    setExpanded(newState)
    localStorage.setItem("sidebar:expanded", String(newState))
    // Trigger storage event for other components
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "sidebar:expanded",
        newValue: String(newState),
      }),
    )
  }

  // Check if a path is active
  const isActive = (path) => {
    return currentPath.includes(path)
  }

  // Generate random color for avatar
  const getAvatarColor = () => {
    if (!address) return "#AA5BFF"
    const hash = address.slice(2, 10)
    const hue = Number.parseInt(hash, 16) % 360
    return `hsl(${hue}, 70%, 60%)`
  }

  // Update tooltip position based on the element
  const updateTooltipPosition = (index, type) => {
    let ref

    if (type === "nav") {
      ref = navItemRefs.current[index]
    } else if (type === "action") {
      ref = actionItemRefs.current[index]
    } else if (type === "profile") {
      ref = profileRef.current
    }

    if (ref) {
      const rect = ref.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + rect.height / 2 - 10,
        left: rect.right + 10,
      })
    }
  }
  
  // Toggle FAB menu
  const toggleFabMenu = (e) => {
    e.stopPropagation()
    setFabMenuOpen(!fabMenuOpen)
  }

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-[100] flex h-14 items-center justify-between bg-white px-4 dark:bg-[#0e0e0e] md:hidden ${isShowNetworkAlert ? "mt-6" : ""}`}
      >
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#1E2025]"
        >
          <Menu className="h-5 w-5 text-[#0A0B0D] dark:text-white" />
        </button>

        <Link href="/" className="flex items-center font-bold">
          <img className="h-[24px]" src="/assets/logo.png" alt="" />
          <h2 className=" ml-[6px] text-[24px] text-[#0A0B0D] font-semibold font-rogan dark:text-white">Torque</h2>
        </Link>

        <div>
          {address ? (
            <div className="h-9 w-9 overflow-hidden rounded-full" style={{ backgroundColor: getAvatarColor() }}>
              <div className="flex h-full w-full items-center justify-center text-white">
                {address.substring(2, 4).toUpperCase()}
              </div>
            </div>
          ) : (
            <div
              className="font-rogan-regular cursor-pointer rounded-full border border-[#AA5BFF] px-[10px] py-[3px] text-[11px] uppercase leading-none text-[#AA5BFF]"
              onClick={() => setOpenConnectWalletModal(true)}
            >
              Connect
            </div>
          )}
        </div>
      </div>

      {/* Network Alert */}
      {isShowNetworkAlert && (
        <div
          className="fixed top-0 left-0 right-0 z-[101] flex h-[24px] cursor-pointer items-center justify-center bg-[#FF6969] text-center text-[9px] uppercase md:top-0"
          onClick={handleChangeNetwork}
        >
          Please switch to {arbitrumMainnetInfo.name} network.
        </div>
      )}

      {/* Modern Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[50] flex h-full flex-col bg-white py-4 transition-all duration-200 ease-in-out dark:bg-[#030303] ${
          isShowNetworkAlert ? "mt-6" : ""
        } ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${
          expanded ? "w-[180px]" : "w-[60px]"
        }`}
        style={{ "--sidebar-width": expanded ? "180px" : "60px" } as React.CSSProperties}
      >
        {/* Logo and Toggle */}
        <div className="flex items-center px-3 mb-6">
          <Link href="/" className="flex items-center justify-center">
            <div className="flex h-10 mr-[2px] w-10 items-center justify-center overflow-hidden">
              <img className="h-7 w-8" src="/assets/logo.png" alt="Torque" />
            </div>
            {expanded && <span className="text-[#030303] text-[24px] font-semibold font-rogan dark:text-white">Torque</span>}
          </Link>

          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className="ml-auto flex h-8 w-8 p-2 bg-gray-100 dark:bg-[#1A1A1A] mt-[6px] rounded-full items-center justify-center text-[#959595] dark:text-[#959595]"
          >
            {expanded ? <PanelRightOpen size={20} strokeWidth={2} /> : <PanelRightClose size={20} strokeWidth={2} />}
          </button>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm md:hidden dark:bg-[#2A2D35]"
        >
          <X className="h-3 w-3 text-[#0A0B0D] dark:text-white" />
        </button>

        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col px-2 space-y-1 overflow-y-auto">
          <div className="flex flex-col">
            <div className="flex flex-col relative">
              {/* Gradient indicator line */}
              {(hoveredIndex !== -1 || activeNavIndex !== -1) && (
                <motion.div
                  className="absolute left-0 w-[2.5px] rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF]"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    top: `${(hoveredIndex !== -1 ? hoveredIndex : activeNavIndex) * 36 + 8}px`,
                    height: "20px",
                  }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {navItems.map((item, index) => (
                <div
                  key={item.label}
                  className="relative"
                  ref={(el) => (navItemRefs.current[index] = el)}
                  onMouseEnter={() => {
                    setHoveredIndex(index)
                    if (!expanded) {
                      setActiveTooltip(`nav-${index}`)
                      updateTooltipPosition(index, "nav")
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(-1)
                    if (!expanded) setActiveTooltip(null)
                  }}
                >
                  <Link
                    href={item.path}
                    className={`group flex h-9 items-center rounded-md transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-[#030303] dark:text-white font-medium"
                        : "text-[#5D6670] hover:text-[#030303] dark:text-[#A7B0BC] dark:hover:text-white"
                    } ${expanded ? "px-3" : "justify-center w-9"}`}
                  >
                    <span className="flex items-center justify-center">{item.icon}</span>
                    {expanded && <span className="ml-3 text-sm">{item.label}</span>}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto flex flex-col px-2 space-y-1 pt-2">
          {/* Action Items (Rewards & Delegate) */}
          {actionItems.map((item, index) => (
            <div
              key={item.label}
              className="relative"
              ref={(el) => (actionItemRefs.current[index] = el)}
              onMouseEnter={() => {
                if (!expanded) {
                  setActiveTooltip(`action-${index}`)
                  updateTooltipPosition(index, "action")
                }
              }}
              onMouseLeave={() => {
                if (!expanded) setActiveTooltip(null)
              }}
            >
              <button
                onClick={item.onClick}
                className={`group flex h-9 items-center rounded-md transition-all duration-200 text-[#5D6670] hover:text-[#030303] dark:text-[#A7B0BC] dark:hover:text-white ${
                  expanded ? "px-3" : "justify-center w-9"
                }`}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                {expanded && <span className="ml-3 text-sm">{item.label}</span>}
              </button>
            </div>
          ))}

          {/* User Profile / Connect Wallet */}
          <div
            className="relative"
            ref={profileRef}
            onMouseEnter={() => {
              if (!expanded) {
                setActiveTooltip("profile")
                updateTooltipPosition(0, "profile")
              }
            }}
            onMouseLeave={() => {
              if (!expanded) setActiveTooltip(null)
            }}
          >
            {address ? (
              <Popover
                placement="right"
                className="w-[180px] px-[4px] py-[4px] leading-none"
                content={
                  <div className="rounded-lg border border-[#e5e7eb] bg-white p-1 shadow-lg dark:border-[#2C2F36] dark:bg-[#1E2025]">
                    <div className="mb-2 border-b border-gray-100 p-2 dark:border-gray-800">
                      <div className="text-sm font-medium text-[#0A0B0D] dark:text-white">
                        {shortenAddress(address)}
                      </div>
                      <div className="text-xs text-[#5D6670] dark:text-[#A7B0BC]">Arbitrum</div>
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href={`https://arbiscan.io/address/${address}`}
                        className="flex items-center justify-between rounded-md p-[10px] text-[14px] text-[#0A0B0D] transition-colors hover:text-[#030303] dark:text-white dark:hover:text-white"
                        target="_blank"
                      >
                        Explorer <ExternalLink strokeWidth={2} size={14} />
                      </Link>
                      <div
                        className="flex cursor-pointer items-center justify-between rounded-md p-[10px] text-[14px] text-[#0A0B0D] transition-colors hover:text-[#030303] dark:text-white dark:hover:text-white"
                        onClick={handleDisconnect}
                      >
                        Disconnect <LogOut strokeWidth={2} size={14} />
                      </div>
                    </div>
                  </div>
                }
              >
                <div className={`flex items-center rounded-md ${expanded ? "px-3 py-2" : "justify-center h-9 w-9"}`}>
                  <div className="h-7 w-7 overflow-hidden rounded-full" style={{ backgroundColor: getAvatarColor() }}>
                    <div className="flex h-full w-full items-center justify-center text-white text-xs">
                      {address.substring(2, 4).toUpperCase()}
                    </div>
                  </div>
                  {expanded && <span className="ml-3 text-sm truncate">{shortenAddress(address)}</span>}
                </div>
              </Popover>
            ) : (
            <button
              onClick={() => setOpenConnectWalletModal(true)}
              className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 px-6 font-medium text-sm transition-all duration-300 ${expanded ? "w-full" : ""}`}
            >
              {/* Expanding circle effect */}
              <span className="absolute h-0 w-0 rounded-full bg-[#aa5bff] transition-all duration-300 group-hover:h-48 group-hover:w-48"></span>
              {/* Button content */}
              <span className="relative flex items-center group-hover:text-white">
                <Wallet strokeWidth={2} size={16} className={expanded ? "mr-2" : ""} />
                {expanded && <span className="text-sm font-medium">Connect</span>}
              </span>
            </button>
            )}
          </div>
        </div>
      </aside>

      {/* Floating Action Button (mobile only) */}
      <div 
        className="fixed right-6 bottom-6 z-[60] md:hidden"
        ref={fabButtonRef}
      >
        <AnimatePresence>
          {fabMenuOpen && (
            <motion.div
              className="absolute bottom-16 right-0 bg-white dark:bg-[#1E2025] rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {actionItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center px-4 py-3 w-full hover:bg-gray-50 dark:hover:bg-[#2A2D35] border-b border-gray-100 dark:border-[#2C2F36] last:border-0"
                >
                  <span className="mr-3 text-[#AA5BFF]">{item.icon}</span>
                  <span className="text-[#0A0B0D] dark:text-white font-medium">{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={toggleFabMenu}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#AA5BFF] to-[#912BFF] text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {fabMenuOpen ? (
            <X size={20} strokeWidth={2} />
          ) : (
            <Plus size={20} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[49] bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Tooltips rendered via portal */}
      <TooltipPortal>
        <AnimatePresence>
          {activeTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="fixed z-[999999] ml-[-16px] rounded-md bg-white text-[#030303] dark:text-[#030303] border border-[#efefef] dark:border-[#1c1c1c] px-2 py-1 text-xs shadow-lg"
              style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
            >
              {activeTooltip.startsWith("nav-")
                ? navItems[Number.parseInt(activeTooltip.split("-")[1])].label
                : activeTooltip.startsWith("action-")
                  ? actionItems[Number.parseInt(activeTooltip.split("-")[1])].label
                  : activeTooltip === "profile"
                    ? address
                      ? shortenAddress(address)
                      : "Connect Wallet"
                    : null}
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipPortal>

      {/* Modals */}
      <ConnectWalletModal openModal={isOpenConnectWalletModal} handleClose={() => setOpenConnectWalletModal(false)} />
      <ClaimModal openModal={isOpenClaim} handleClose={() => setIsOpenClaim(false)} />
      <UniSwapModal open={openUniSwapModal} handleClose={() => setOpenUniSwapModal(false)} />
      <DelegateModal
        openModal={openDelegateModal}
        handleClose={() => setOpenDelegateModal(false)}
        balance={torqueBalance}
      />
    </>
  )
}
