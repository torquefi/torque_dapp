import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'

export const EmptyBorrow = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="bg-transparent mt-[24px] overflow-hidden rounded-[12px] border border-neutral-200 dark:border-[#1a1a1a] dark:bg-[#030303]">
      <div
        className={
          'flex h-[280px] flex-col items-center justify-center bg-cover bg-top bg-no-repeat' +
          ` ${
            theme === 'light'
              ? 'bg-[url(/images/bg-grid-light.png)]'
              : 'bg-[url(/images/bg-grid-dark.png)]'
          }`
        }
      >
        <img
          className="w-[112px] mt-[-6px]"
          src={
            theme === 'light'
              ? '/images/ic-borrow-light.png'
              : '/images/ic-borrow-dark.png'
          }
          alt=""
        />
        <p className="font-rogan text-[24px] text-[#404040] dark:text-white">
          No vaults created yet
        </p>
        <p className="font-rogan-regular mt-[6px] mb-1 max-w-[320px] text-center font-body text-[15.4px] text-[#959595]">
          Supply collateral to create a Borrow vault and access your personal line
          of credit.
        </p>
      </div>
    </div>
  )
}
