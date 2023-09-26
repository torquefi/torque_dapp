import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'

export const EmptyStake = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="mt-[24px] overflow-hidden rounded-[12px] border border-neutral-200 from-[#030303] to-[#030303] dark:border-neutral-800 dark:bg-gradient-to-b">
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
              ? '/images/ic-stake-light.png'
              : '/images/ic-stake-dark.png'
          }
          alt=""
        />
        <p className="font-larken text-[28px] text-black dark:text-white">
          No stakes created yet
        </p>
        <p className="mt-[16px] max-w-[428px] text-center font-body text-[18px] text-[#959595]">
          Deposit assets to create a stake, which powers community governance, &
          earn passive TORQ.
        </p>
      </div>
    </div>
  )
}
