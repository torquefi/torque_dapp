import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'

export const EmptyPosition = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="mt-[18px] overflow-hidden rounded-[12px] border border-neutral-200 bg-transparent dark:border-[#1a1a1a] dark:bg-[#030303]">
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
        <div className="relative mt-[-6px] flex h-[112px] w-[112px] items-center justify-center">
          <img
            className="absolute inset-0 object-contain"
            src={
              theme === 'light'
                ? '/images/ic-polygon-light.svg'
                : '/images/ic-polygon-dark.svg'
            }
            alt=""
          />
          <img
            className="relative w-[60%]"
            src={
              theme === 'light'
                ? '/images/ic-positions.svg'
                : '/images/ic-positions.svg'
            }
            alt=""
          />
        </div>
        <p className="font-rogan text-[24px] text-[#404040] dark:text-white">
          No positions yet
        </p>
        <p className="font-rogan-regular mb-1 mt-[6px] max-w-[320px] text-center font-body text-[15.4px] text-[#959595]">
          Create a position by supplying or borrowing assets through the Torque
          Interface.
        </p>
      </div>
    </div>
  )
}
