"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { AppStore } from "@/types/store"
import { useSelector } from "react-redux"

export default function Banner() {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  // Preload both images to ensure they're in browser cache
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lightImage = new window.Image()
      lightImage.src = "/assets/banners/borrow-light-compressed.png"
      lightImage.crossOrigin = "anonymous"

      const darkImage = new window.Image()
      darkImage.src = "/assets/banners/borrow-compressed.png"
      darkImage.crossOrigin = "anonymous"
    }
  }, [])

  const currentImageSrc =
    theme === "light" ? "/assets/banners/borrow-light-compressed.png" : "/assets/banners/borrow-compressed.png"

  return (
    <div className="relative">
      <div className="relative w-full aspect-[4/1] rounded-xl overflow-hidden">
        <Image
          src={currentImageSrc || "/placeholder.svg"}
          alt="Torque Borrow"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          style={{
            objectFit: "cover",
          }}
          className="rounded-xl"
        />
      </div>

      <Link
        href="/home"
        className="absolute left-[10px] top-[10px] md:left-[18px] md:top-[16px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#FFFFFF] dark:bg-[#030303] lg:h-[48px] lg:w-[48px]"
      >
        <div className="relative w-[10px] h-[10px] lg:w-[14px] lg:h-[14px]">
          <Image
            src={theme === "light" ? "/icons/arrow-left-dark.png" : "/icons/arrow-left.svg"}
            alt="Back home"
            fill
            sizes="14px"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      </Link>
    </div>
  )
}
