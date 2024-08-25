import HoverIndicator from '@/components/common/HoverIndicator'
import Popover from '@/components/common/Popover'
import { ChevronDownIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { ICollateralInfo } from '../constants/types'
import { NumericFormat } from 'react-number-format'

interface ISelectCollateralProps {
  balance?: number
  wrapperClassName?: string
  options?: ICollateralInfo[]
  value?: ICollateralInfo
  onSelect?: (market: ICollateralInfo) => void
}

export const SelectCollateral: React.FC<ISelectCollateralProps> = (props) => {
  const { balance, options, wrapperClassName, value, onSelect } = props
  const [openPopover, setOpenPopover] = useState(false)

  const finalOptions = options || []

  return (
    <div className={wrapperClassName}>
      <div className="mb-1 flex items-center justify-between text-[14px] font-medium text-[#959595]">
        <label className="">Collateral</label>
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
            className={`z-[10] mt-[12px] w-full bg-white leading-none dark:bg-[#030303]`}
            externalOpen={openPopover}
            content={
              <HoverIndicator
                divider
                direction="vertical"
                indicatorClassName="rounded-[6px] w-full"
                className="w-full"
              >
                {finalOptions?.map((collateral, index) => (
                  <div
                    key={collateral.label}
                    className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                      index === 0 ? 'pt-[8px]' : ''
                    } ${index === finalOptions.length - 1 ? 'pb-[8px]' : ''}`}
                    onClick={() => {
                      setOpenPopover((openPopover) => !openPopover)
                      onSelect && onSelect(collateral)
                    }}
                  >
                    <p className="pt-[1px]">{collateral?.label}</p>
                  </div>
                ))}
              </HoverIndicator>
            }
          >
            <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] pt-[8px] text-[#030303] dark:text-[#959595]">
              <div className="inline-flex items-center gap-[4px]">
                {value ? (
                  <p className="cursor-pointer">{value?.label}</p>
                ) : (
                  <p className="cursor-pointer text-[#959595]">
                    Select Collateral
                  </p>
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
