import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRef } from 'react'
import useScreen from '@/lib/hooks/useScreen'
import { useMemo } from 'react'

export const MenuMobile = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const router = useRouter()
  const menuContainer = useRef<HTMLDivElement>(null)
  const menuIndicator = useRef<HTMLDivElement>(null)

  const currentTabIndex = useMemo(
    () => menu.map((item) => item.path).indexOf(router.pathname),
    [router.pathname]
  )

  useEffect(() => {
    if (router.isReady) {
      setActiveTabIndex(currentTabIndex)
    }
  }, [router])

  useEffect(() => {
    const handleUpdateIndicatorPosition = () => {
      if (menuIndicator.current && menuContainer.current) {
        const menuRect = menuContainer.current.getBoundingClientRect()
        const indicatorRect = menuIndicator.current.getBoundingClientRect()
        const left = (menuRect.width / menu.length) * activeTabIndex
        menuIndicator.current.style.left = `${
          left + menuRect.width / menu.length / 2 - indicatorRect.width / 2
        }px`
      }
    }
    handleUpdateIndicatorPosition()
    window.addEventListener('resize', handleUpdateIndicatorPosition)
    return () => {
      window.removeEventListener('resize', handleUpdateIndicatorPosition)
    }
  }, [activeTabIndex])

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-500 h-[76px] border-t-2 border-[#181818] md:hidden">
        <div ref={menuContainer} className="relative z-10 flex h-full w-full">
          <div
            className="absolute top-[-8px] z-[-1] transition-all duration-300"
            ref={menuIndicator}
          >
            <div
              className={
                'mx-auto aspect-1 w-[56px] rounded-full bg-gradient-to-r from-[#181818] via-[#282828] to-[#181818] p-[2px]' +
                ` ${
                  router.pathname === '/overview'
                    ? 'via-[#332048]'
                    : 'via-[#181818]'
                }`
              }
            >
              <div className="h-full w-full rounded-full bg-[#030303]"></div>
            </div>
          </div>
          <div className="flex h-full w-full items-center bg-[#030303]">
            {menu.map((item, i) => (
              <Link
                href={item.path}
                key={i}
                className={
                  'flex h-[35px] w-1/5 items-center justify-center font-mona transition-all' +
                  ` ${activeTabIndex === i ? ' origin-bottom scale-[1.4]' : ''}`
                }
              >
                <img className="w-[35px]" src={item.icon} alt="" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[56px] md:hidden"></div>
    </>
  )
}

const menu = [
  {
    label: 'Home',
    path: '/',
    icon: '/assets/main-layout/home-1.png',
  },
  {
    label: 'Boost',
    path: '/boost',
    icon: '/assets/main-layout/boost-1.png',
  },
  {
    label: 'Overview',
    path: '/overview',
    icon: '/assets/main-layout/t-menu.png',
  },
  {
    label: 'Borrow',
    path: '/borrow',
    icon: '/assets/main-layout/graph-1.png',
  },
  {
    label: 'Stake',
    path: '/stake',
    icon: '/assets/main-layout/lock-1.png',
  },
]
