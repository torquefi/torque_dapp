import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import ClaimModal from './ClaimModal'

export const MenuMobile = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(2)
  const router = useRouter()
  const menuContainer = useRef<HTMLDivElement>(null)
  const menuIndicator = useRef<HTMLDivElement>(null)
  const [isOpenClaim, setIsOpenClaim] = useState(false)
  const currentTabIndex = useMemo(
    () => menu.map((item) => item.path).indexOf(router.pathname),
    [router.pathname]
  )

  // useEffect(() => {
  //   if (router.isReady) {
  //     console.log("currentTabIndex",currentTabIndex);

  //     setActiveTabIndex(currentTabIndex)
  //   }
  // }, [router])

  useEffect(() => {
    const handleUpdateIndicatorPosition = () => {
      if (menuIndicator.current && menuContainer.current) {
        const menuRect = menuContainer.current.getBoundingClientRect()
        const indicatorRect = menuIndicator.current.getBoundingClientRect()
        const left = (menuRect.width / menu.length) * activeTabIndex
        menuIndicator.current.style.left = `${left + menuRect.width / menu.length / 2 - indicatorRect.width / 2
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
    <div>
      <div className="fixed inset-x-0 bottom-0 z-50 h-[76px] border-t-2 dark:border-[#181818] md:hidden">
        <div ref={menuContainer} className="relative z-10 flex h-full w-full">
          <div
            className="absolute top-[-8px] z-[-1] transition-all duration-300"
            ref={menuIndicator}
          >
            <div
              className={
                'mx-auto aspect-1 w-[76px] rounded-full  from-[#181818] via-[#282828] to-[#181818] p-[2px] dark:bg-gradient-to-r' +
                ` ${router.pathname === '/overview'
                  ? 'via-[#332048]'
                  : 'via-[#181818]'
                }`
              }
            >
              <div className="h-full w-full rounded-full bg-[#fff]  dark:bg-[#030303]" />
            </div>
          </div>
          <div className="flex h-full w-full items-center bg-[#030303] bg-opacity-40 dark:bg-[#030303]">
            {menu.map((item, i) =>
              !item.isExternalLink ? (
                <Link
                  onClick={
                    item.path === '/home' ? () => setIsOpenClaim(true) : null
                  }
                  href={item.path}
                  key={i}
                  className={
                    'font-mona flex h-[32px] w-1/5 items-center justify-center transition-all' +
                    ` ${item.path === '/home' ? 'origin-bottom scale-[1.6]' : ''
                    }`
                  }
                >
                  <img className="z-52 w-[32px]" src={item.icon} alt="" />
                </Link>
              ) : (
                <Link
                  href={item.path}
                  key={i}
                  legacyBehavior
                  className={
                    'font-mona flex h-[32px] w-1/5 items-center justify-center transition-all' +
                    ` ${activeTabIndex === i ? ' origin-bottom scale-[1.6]' : ''
                    }`
                  }
                >
                  <a target="_blank">
                    <img className="z-52 w-[35px]" src={item.icon} alt="" />
                  </a>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
      <div className="h-[56px] md:hidden" />
      <ClaimModal
        openModal={isOpenClaim}
        handleClose={() => setIsOpenClaim(false)}
      />
    </div>
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
    path: '/home',
    icon: '/assets/main-layout/t-menu.png',
  },
  {
    label: 'Borrow',
    path: '/borrow',
    icon: '/assets/main-layout/graph-1.png',
  },
  {
    label: 'Vote',
    path: 'https://snapshot.org/#/',
    icon: '/assets/main-layout/lock-1.png',
    isExternalLink: true,
  },
]
