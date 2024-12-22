import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'

const ItemSkeleton = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="mx-[-1px] flex h-[106px] items-center space-x-[20px] rounded-[12px] border border-[#CDCDCD] bg-white px-[16px] dark:border-[#1D1D1D] dark:bg-[#030303] md:space-x-[36px] md:px-[32px]">
      <div className="h-[32px] w-[32px] animate-pulse rounded-full bg-[#D9D9D9] dark:bg-[#535353] md:h-[48px] md:w-[48px]"></div>
      <div className="flex-1">
        <div className="h-[28px] w-[160px] animate-pulse rounded-full bg-[#D9D9D9] dark:bg-[#535353]"></div>
      </div>
      <div className="hidden space-x-[40px] md:flex">
        <div className="h-[28px] w-[160px] animate-pulse rounded-full bg-[#D9D9D9] dark:bg-[#535353]"></div>
        <div className="h-[28px] w-[160px] animate-pulse rounded-full bg-[#D9D9D9] dark:bg-[#535353]"></div>
        <div className="h-[28px] w-[160px] animate-pulse rounded-full bg-[#D9D9D9] dark:bg-[#535353]"></div>
      </div>
      <img
        className={'w-[18px] transition-all'}
        src={
          theme == 'light' ? '/icons/dropdow-dark.png' : '/icons/arrow-down.svg'
        }
        alt=""
      />
    </div>
  )
}

export default ItemSkeleton
