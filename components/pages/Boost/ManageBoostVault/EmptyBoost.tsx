import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'

export const EmptyBoost = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="bg-transparent mt-[18px] overflow-hidden rounded-[12px] border border-neutral-200 dark:border-[#1a1a1a] dark:bg-[#030303]">
      <div
        className={
          'flex h-[280px] flex-col items-center justify-center bg-contain' +
          ` ${
            theme === 'light'
              ? 'bg-[url(/images/bg-grid-light.png)] bg-[5px_center]'
              : 'bg-[url(/images/bg-grid-dark.png)] bg-[5px_center]'
          }`
        }
      >
        <img
          className="w-[112px] mt-[-6px]"
          src={
            theme === 'light'
              ? '/images/ic-boost-light.png'
              : '/images/ic-boost-dark.png'
          }
          alt=""
        />
        <p className="font-rogan text-[24px] text-[#404040] dark:text-white">
          No vehicles created yet
        </p>
        <p className="font-rogan-regular mt-[6px] mb-1 max-w-[320px] text-center font-body text-[15.4px] text-[#959595]">
          Supply assets to create a Boost vehicle and capture fully automated compound
          yield.
        </p>
      </div>
    </div>
  )
}
