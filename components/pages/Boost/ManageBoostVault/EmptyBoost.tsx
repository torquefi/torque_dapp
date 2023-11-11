import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'

export const EmptyBoost = () => {
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
              ? '/images/ic-boost-light.png'
              : '/images/ic-boost-dark.png'
          }
          alt=""
        />
        <p className="font-larken text-[24px] text-black dark:text-white">
          No vehicles created yet
        </p>
        <p className="mt-[12px] max-w-[400px] text-center font-body text-[16px] text-[#959595]">
          Deposit assets to create a Boost vehicle & capture passive compound
          yield via dynamic strategies.
        </p>
      </div>
    </div>
  )
}
