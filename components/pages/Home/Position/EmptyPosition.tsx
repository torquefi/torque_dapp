import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'

export const EmptyPosition = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="mt-[24px] overflow-hidden rounded-[12px] border border-neutral-200 bg-transparent dark:border-[#1a1a1a] dark:bg-[#030303]">
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
          className="mt-[-6px] w-[112px]"
          src={
            theme === 'light'
              ? '/images/ic-borrow-light.png'
              : '/images/ic-borrow-dark.png'
          }
          alt=""
        />
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
