import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useSelector } from 'react-redux'

export default function Banner() {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  return (
    <div className="relative">
      <img
        className="rounded-xl"
        src={
          theme === 'light'
            ? '/assets/banners/borrow-light-large.png'
            : '/assets/banners/borrow-compressed.png'
        }
        alt="Torque Borrow"
      />
      <Link
        href="/overview"
        className="absolute left-[24px] top-[24px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FCFAFF] dark:bg-[#030303]"
      >
        <img
          className="w-[12px]"
          src={
            theme === 'light'
              ? '/icons/arrow-left-dark.png'
              : '/icons/arrow-left.svg'
          }
          alt=""
        />
      </Link>
    </div>
  )
}
