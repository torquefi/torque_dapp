import { updateTheme } from '@/lib/redux/slices/theme'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
export default function Footer() {
  const dispatch = useDispatch()
  const [isChecked, setIsChecked] = useState<boolean>(true)
  useEffect(() => {
    if (typeof window != 'undefined') {
      const status =
        window.localStorage.getItem('theme') === 'light' ? true : false
      setIsChecked(status)
    }
  }, [])
  const handleDarkMode = (e: any) => {
    if (typeof window != 'undefined') {
      if (e.target.checked) {
        dispatch(updateTheme('light'))
        window.localStorage.setItem('theme', 'light')
        window.location.reload()
      } else {
        dispatch(updateTheme('dark'))
        window.localStorage.setItem('theme', 'dark')
        window.location.reload()
      }
    }
  }
  return (
    <div className=" flex flex w-full justify-center ">
      <div className="bg-gradient-divider absolute bottom-0 left-0 h-[1px] w-full" />
      <footer className="mt-8 flex w-[1280px] max-w-[1280px] justify-between  px-4 py-4 text-[#959595] sm:px-8">
        <div className="cursor-pointer text-[10px] transition-colors duration-100 ease-linear hover:text-white hover:underline xs:text-[10px]">
          © 2023 TORQUE INC.
        </div>
        <div className="flex space-x-2 text-[10px] xs:text-[10px]">
          {socials.map((item, i) => (
            <Link
              href={item.link}
              key={i}
              className="block transition-colors duration-300 ease-linear hover:-translate-y-[1px] hover:text-white"
              target="_blank"
            >
              {item.label}
            </Link>
          ))}
          {privacies.map((item, i) => (
            <Link
              href={item.link}
              key={i}
              className="hidden transition-colors duration-300 ease-linear hover:-translate-y-[1px] hover:text-white xs:block"
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
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#F4F4F4] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4  dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-[#F4F4F4]"></div>
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
