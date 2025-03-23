"use client"

import { useDispatch, useSelector } from "react-redux"
import Footer from "./Footer"
import { Sidebar } from "./Sidebar"
import type { AppStore } from "@/types/store"
import { useEffect, useState } from "react"
import { updateTheme } from "@/lib/redux/slices/theme"
import Announcement from "./Announcement"

interface MainLayoutProps {
  children: any
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const dispatch = useDispatch()
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  useEffect(() => {
    // Get sidebar state
    const savedState = localStorage.getItem("sidebar:expanded")
    if (savedState !== null) {
      setSidebarExpanded(savedState === "true")
    }

    // Listen for sidebar state changes
    const handleStorageChange = (e: any) => {
      if (e.key === "sidebar:expanded") {
        setSidebarExpanded(e.newValue === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    if (theme === "") {
      dispatch(updateTheme("light" as any))
    }

    if (typeof window !== "undefined") {
      if (theme === "light") {
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.add("light")
      } else {
        document.documentElement.classList.add("dark")
        document.documentElement.classList.remove("light")
      }
    }
  }, [theme, dispatch])

  // Example logic to determine the number of positions
  const positionsCount = 0; // Replace this with your actual logic to determine positions

  return (
    <div className="font-rogan-regular min-h-screen bg-[#FFFFFF] text-[#0A0B0D] dark:bg-[#0A0B0D] dark:text-white">
      <div className="flex h-screen">
        <Sidebar />
        <div
          className={`flex flex-1 flex-col transition-all duration-200 ${sidebarExpanded ? "md:ml-[170px]" : "md:ml-[60px]"}`}
        >
          {/* Announcement Bar */}
          <Announcement positionsCount={positionsCount} />

          {/* Content Area */}
          <main className="flex-1 p-4 md:p-8">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
