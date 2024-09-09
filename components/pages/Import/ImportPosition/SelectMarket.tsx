import HoverIndicator from '@/components/common/HoverIndicator'
import Popover from '@/components/common/Popover'
import { ChevronDownIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { marketOptions } from '../constants/provider'
import { IMarketInfo } from '../constants/types'
import { NumericFormat } from 'react-number-format'

interface ISelectMarketProps {
  balance?: number
  wrapperClassName?: string
  options?: IMarketInfo[]
  value?: IMarketInfo
  onSelect?: (market: IMarketInfo) => void
}

export const SelectMarket: React.FC<ISelectMarketProps> = (props) => {
  const { balance, options, wrapperClassName, value, onSelect } = props
  const [openPopover, setOpenPopover] = useState(false)

  const finalOptions = options || marketOptions

  // Function to extract the core market name (e.g., "Aave" or "Radiant")
  const getMarketIconName = (label: string) => {
    return label.split(' ')[0].toLocaleLowerCase()  // Extract the first word (market name) and convert to lowercase
  }

  return (
    <div className={wrapperClassName}>
      <div className="mb-1 flex items-center justify-between text-[14px] font-medium text-[#959595]">
        <label className="">Market</label>
        <NumericFormat
          displayType="text"
          value={balance || 0}
          prefix="Balance: "
          decimalScale={4}
          fixedDecimalScale
        />
      </div>
      <div className="flex items-center">
        <div className="transition-ease w-full rounded-[10px] border-[1px] border-solid border-[#ececec] duration-100 ease-linear dark:border-[#181818]">
          <Popover
            placement="bottom-left"
            trigger="click"
            wrapperClassName="w-full"
            className={`z-[10] mt-[12px] max-h-[200px] w-full overflow-y-auto bg-white leading-none dark:bg-[#030303]`}
            externalOpen={openPopover}
            content={
              <HoverIndicator
                divider
                direction="vertical"
                indicatorClassName="rounded-[6px] w-full"
                className="w-full"
              >
                {finalOptions?.map((market, index) => (
                  <div
                    key={market.label}
                    className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                      index === 0 ? 'pt-[8px]' : ''
                    } ${index === finalOptions.length - 1 ? 'pb-[8px]' : ''}`}
                    onClick={() => {
                      setOpenPopover((openPopover) => !openPopover)
                      onSelect && onSelect(market)
                    }}
                  >
                    <img
                      src={`/icons/coin/${getMarketIconName(market.label)}.png`}  // Use extracted market name
                      alt={`${market.label} icon`}
                      className="h-[18px] w-[18px] rounded-[6px]"
                    />
                    <p className="pt-[1px]">{market?.label}</p>
                  </div>
                ))}
              </HoverIndicator>
            }
          >
            <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] pt-[8px] text-[#030303] dark:text-[#959595]">
              <div className="inline-flex items-center gap-[4px]">
                {value ? (
                  <>
                    <img
                      src={`/icons/coin/${getMarketIconName(value.label)}.png`}  // Use extracted market name
                      alt={`${value.label} icon`}
                      className="h-[18px] w-[18px] rounded-[6px]"
                    />
                    <p className="cursor-pointer">{value?.label}</p>
                  </>
                ) : (
                  <>
                    <div className="h-[18px] w-[18px] rounded-[6px] bg-[#E0E0E0] dark:bg-[#282828]" />
                    <p className="cursor-pointer text-[#959595]">Select Market</p>
                  </>
                )}
              </div>
              <ChevronDownIcon className="pointer-events-none h-4 w-4 text-[#030303] dark:text-white" />
            </div>
          </Popover>
        </div>
      </div>
    </div>
  )
}
