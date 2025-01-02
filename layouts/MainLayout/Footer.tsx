import { updateTheme } from '@/lib/redux/slices/theme'
import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Footer() {
  const dispatch = useDispatch()
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [isChecked, setIsChecked] = useState(theme === 'dark')
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setIsChecked(theme === 'dark')
  }, [theme])

  const handleDarkMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDark = e.target.checked
    setIsChecked(isDark)
    document.documentElement.classList.toggle('dark', isDark)
    dispatch(updateTheme(isDark ? ('dark' as typeof theme) : ('light' as typeof theme)))
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  return (
    <div className="container relative mx-auto mt-[46px] flex max-w-[1244px] w-full justify-center px-4 lg:px-8">
      <div
        className={`absolute left-0 top-0 h-[1px] w-full ${
          theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
        }`}
      />
      <footer className="flex w-full max-w-[1244px] justify-between pb-4 pt-6 text-[#959595] xs:text-[14px] sm:text-[14px] md:pb-[12px] md:pt-4">
        <Link
          href="https://torque.fi"
          className="cursor-pointer flex items-center transition-colors duration-100 ease-linear hover:text-gray-500 dark:hover:text-white"
          target="_blank"
        >
          <span className="this-year mr-1">© {currentYear}</span>Torque Inc.
        </Link>
        <div className="hidden md:flex space-x-8 text-[14px]">
          {socials.map((item) => (
            <Link
              href={item.link}
              key={item.label}
              className="transition-colors duration-300 ease-linear hover:text-gray-500 dark:hover:text-white"
              target="_blank"
            >
              {item.label}
            </Link>
          ))}
          {privacies.map((item) => (
            <Link
              href={item.link}
              key={item.label}
              className="hidden xs:block transition-colors duration-300 ease-linear hover:text-gray-500 dark:hover:text-white"
              target="_blank"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex space-x-2 text-[10px] sm:ml-12">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              onChange={handleDarkMode}
              type="checkbox"
              checked={isChecked}
              className="peer sr-only"
            />
            <div className="h-6 w-16 rounded-full border border-[#F4F4F4] bg-[#F6F6F6] shadow-inner after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[#fff] after:transition-all peer-checked:after:translate-x-[200%] dark:border-[#1D1D1D] peer-checked:bg-[#0D0D0D] after:dark:bg-[#3B3B3B]" />
          </label>
        </div>
      </footer>
    </div>
  )
}

const socials = [
  { label: 'Blog', link: 'https://medium.com/@torquefi' },
  { label: 'Telegram', link: 'https://t.me/torquefi' },
  { label: 'GitHub', link: 'https://github.com/torquefi' },
]

const privacies = [
  { label: 'Terms', link: 'https://torque.fi/terms' },
]
