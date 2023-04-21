import { updateTheme } from '@/lib/redux/slices/theme'
import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
export default function Footer() {
  const dispatch = useDispatch()
  const [isChecked, setIsChecked] = useState<boolean>(true)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  useEffect(() => {
    const status = theme === 'light' ? true : false
    setIsChecked(status)
  }, [theme])
  const handleDarkMode = (e: any) => {
    if (typeof window != 'undefined') {
      if (e.target.checked) {
        document.documentElement.classList.remove('dark')
        dispatch(updateTheme('light' as any))
        window.localStorage.setItem('theme', 'light')
      } else {
        document.documentElement.classList.add('dark')
        dispatch(updateTheme('dark' as any))
        window.localStorage.setItem('theme', 'dark')
      }
    }
  }
  return (
    <div className="relative flex flex w-full justify-center ">
      <div
        className={
          ` absolute left-0 top-0 h-[1px] w-full` +
          `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}
      `
        }
      />
      <footer className="flex w-[1280px] max-w-[1280px] items-center justify-between  px-4 py-7 text-[#959595] sm:px-8">
        <div className="cursor-pointer text-[10px] transition-colors duration-100 ease-linear hover:text-white hover:underline xs:text-[10px]">
          © 2023 TORQUE INC.
        </div>
        <div className="flex space-x-2 text-[10px] xs:text-[10px]">
          {socials.map((item, i) => (
            <Link
              href={item.link}
              key={i}
              className="block transition-colors duration-300 ease-linear hover:-translate-y-[1px] hover:text-gray-500 dark:hover:text-white"
              target="_blank"
            >
              {item.label}
            </Link>
          ))}
          {privacies.map((item, i) => (
            <Link
              href={item.link}
              key={i}
              className="hidden transition-colors duration-300 ease-linear hover:-translate-y-[1px] hover:text-gray-500 dark:hover:text-white xs:block"
              target="_blank"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex space-x-2 text-[10px] xs:text-[10px]">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              onChange={(e) => handleDarkMode(e)}
              type="checkbox"
              checked={isChecked}
              className="peer sr-only"
            />
            <div className="boder-[#F4F4F4] peer h-6 w-16 rounded-full border bg-[#F6F6F6] after:absolute after:left-[20px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[#fff] after:transition-all after:content-['']  peer-checked:bg-[#F6F6F6] peer-checked:after:translate-x-full dark:border-gray-600 dark:bg-[#1D1D1D]     after:dark:left-[2px] after:dark:bg-[#3B3B3B] "></div>
          </label>
        </div>
      </footer>
    </div>
  )
}

const socials = [
  {
    label: 'BLOG',
    link: 'https://medium.com/@torquefi',
  },
  {
    label: 'TELEGRAM',
    link: 'https://t.me/torquefi',
  },
  {
    label: 'TWITTER',
    link: 'https://twitter.com/torquefi',
  },
]

const privacies = [
  {
    label: 'BOUNTY',
    link: '#',
  },
  {
    label: 'AUDITS',
    link: '#',
  },
]
