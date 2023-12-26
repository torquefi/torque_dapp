import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'

export const EmptyBorrow = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="bg-white mt-[24px] overflow-hidden rounded-[12px] border border-neutral-200 dark:border-[#1a1a1a] dark:bg-[#030303]">
      <div
        className={
          'flex h-[300px] flex-col items-center justify-center bg-cover bg-top bg-no-repeat' +
          ` ${
            theme === 'light'
              ? 'bg-[url(/images/bg-grid-light.png)]'
              : 'bg-[url(/images/bg-grid-dark.png)]'
          }`
        }
      >
        <img
          className="w-[112px]"
          src={
            theme === 'light'
              ? '/images/ic-borrow-light.png'
              : '/images/ic-borrow-dark.png'
          }
          alt=""
        />
        <p className="font-larken text-[24px] text-[#404040] dark:text-white">
          No vaults created yet
        </p>
        <p className="mt-[12px] max-w-[360px] text-center font-body text-[16px] text-[#959595]">
          Deposit assets to create a Borrow vault & access a self-service line
          of credit. Repay as you prefer.
        </p>
      </div>
    </div>
  )
}
