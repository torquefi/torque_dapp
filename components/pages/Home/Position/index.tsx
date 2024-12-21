import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { EmptyPosition } from './EmptyPosition'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export default function Position() {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const web3 = new Web3(Web3.givenProvider)
  const { address, isConnected } = useAccount()

  if (0) {
    return (
      <div className="mt-[40px] space-y-[18px]">
        <h3 className="font-rogan text-[12px] text-[#404040] dark:text-white">
          Position
        </h3>

        <EmptyPosition />
      </div>
    )
  }

  const Item = () => {
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
            theme == 'light'
              ? '/icons/dropdow-dark.png'
              : '/icons/arrow-down.svg'
          }
          alt=""
        />
      </div>
    )
  }

  return (
    <div className="mt-[40px] space-y-[32px]">
      <h3 className="font-rogan text-[28px] text-black dark:text-white">
        Positions
      </h3>

      <div className="rounded-b-[12px] rounded-t-[8px] border-x border-[#CDCDCD] dark:border-[#1D1D1D]">
        <div className="relative mb-[-32px]">
          <div className="absolute inset-x-0 top-0 flex">
            <div className="w-[calc(50%-100px)] bg-white dark:bg-[#030303]"></div>
            <img
              className="w-[200px]"
              src={
                theme == 'light'
                  ? '/assets/pages/home/position-header-wrap.png'
                  : '/assets/pages/home/position-header-wrap-dark.png'
              }
              alt=""
            />
            <div className="w-[calc(50%-100px)] bg-white dark:bg-[#030303]"></div>
          </div>
          <h4 className="pt-[8px] text-center font-bold text-black dark:text-white">
            BOOST
          </h4>
        </div>
        <div className="mx-[-1px] space-y-[32px] rounded-b-[12px] border-x border-[#CDCDCD] bg-[#F9F9F9] pt-[32px] dark:border-[#1D1D1D] dark:bg-[#141414]">
          {[1, 2]?.map((item, i) => (
            <Item key={i} />
          ))}
        </div>
      </div>

      <div className="rounded-b-[12px] rounded-t-[8px] border-x border-[#CDCDCD] dark:border-[#1D1D1D]">
        <div className="relative mb-[-32px]">
          <div className="absolute inset-x-0 top-0 flex">
            <div className="w-[calc(50%-100px)] bg-white dark:bg-[#030303]"></div>
            <img
              className="w-[200px]"
              src={
                theme == 'light'
                  ? '/assets/pages/home/position-header-wrap.png'
                  : '/assets/pages/home/position-header-wrap-dark.png'
              }
              alt=""
            />
            <div className="w-[calc(50%-100px)] bg-white dark:bg-[#030303]"></div>
          </div>
          <h4 className="pt-[8px] text-center font-bold text-black dark:text-white">
            BORROW
          </h4>
        </div>
        <div className="mx-[-1px] space-y-[32px] rounded-b-[12px] border-x border-[#CDCDCD] bg-[#F9F9F9] pt-[32px] dark:border-[#1D1D1D] dark:bg-[#141414]">
          {[1, 2]?.map((item, i) => (
            <Item key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
