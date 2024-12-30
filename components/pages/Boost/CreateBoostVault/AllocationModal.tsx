import Modal from '@/components/common/Modal'
import React, { useEffect, useState } from 'react'
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

const AllocationModal = ({
  open,
  handleClose,
  item,
  onConfirm,
}: {
  open?: boolean
  handleClose: () => void
  item: any
  onConfirm: (allocations: { firstAllocation: number; secondAllocation: number }) => void
}) => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [isEditFirst, setIsEditFirst] = useState(false)
  const [isEditSecond, setIsEditSecond] = useState(false)
  const [firstAllocation, setFirstAllocation] = useState(item?.firstAllocation)
  const [secondAllocation, setSecondAllocation] = useState(item?.secondAllocation)
  const [editFirstAllocation, setEditFirstAllocation] = useState(item?.firstAllocation)
  const [editSecondAllocation, setEditSecondAllocation] = useState(item?.secondAllocation)
  const [isCheckedFirst, setIsCheckedFirst] = useState(false)
  const [isCheckedSecond, setIsCheckedSecond] = useState(false)

  useEffect(() => {
    if (open && item) {
      setEditFirstAllocation(item?.firstAllocation)
      setEditSecondAllocation(item?.secondAllocation)
      setFirstAllocation(item?.firstAllocation)
      setSecondAllocation(item?.secondAllocation)
      setIsCheckedFirst(true)
      setIsCheckedSecond(true)
    }

    if (!open) {
      setIsEditFirst(false)
      setIsEditSecond(false)
      setIsCheckedFirst(false)
      setIsCheckedSecond(false)
    }
  }, [item, open])

  const handleFirstCheckboxChange = (checked: boolean) => {
    setIsCheckedFirst(checked)
    if (!checked) {
      setFirstAllocation(0)
      setSecondAllocation(100)
    } else if (isCheckedSecond) {
      setFirstAllocation(50)
      setSecondAllocation(50)
    } else {
      setFirstAllocation(editFirstAllocation)
      setSecondAllocation(100 - editFirstAllocation)
    }
  }

  const handleSecondCheckboxChange = (checked: boolean) => {
    setIsCheckedSecond(checked)
    if (!checked) {
      setSecondAllocation(0)
      setFirstAllocation(100)
    } else if (isCheckedFirst) {
      setFirstAllocation(50)
      setSecondAllocation(50)
    } else {
      setSecondAllocation(editSecondAllocation)
      setFirstAllocation(100 - editSecondAllocation)
    }
  }

  return (
    <Modal
      className="mx-auto w-[90%] max-w-[360px] bg-[#FFFFFF] px-[22px] dark:bg-[#030303]"
      open={open}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between py-1">
        <div className="font-rogan text-[24px] font-[400] text-[#030303] dark:text-white md:text-[28px]">
          Allocation
        </div>
        <AiOutlineClose
          className="cursor-pointer text-[#030303] dark:text-[#ffff]"
          onClick={handleClose}
        />
      </div>
      <div
        className={`mt-3 h-[1px] w-full md:block ${
          theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
        }`}
      ></div>
      <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
        {/* First Allocation Section */}
        <div className="bg-transparent dark:bg-[#141414] col-span-1 rounded-[12px] border border-solid border-[#efefef] p-[12px] dark:border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <img
              src={item?.yield_provider1}
              className="h-[42px] w-[42px] object-contain"
            />
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isCheckedFirst}
                onChange={(e) => handleFirstCheckboxChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-12 flex items-center rounded-full border border-[#F4F4F4] bg-[#D2D5DA] shadow-inner relative after:absolute after:top-1/2 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[#fff] after:transition-all after:transform after:-translate-y-1/2 after:content-[''] peer-checked:after:translate-x-[110%] dark:border-[#1D1D1D] dark:bg-[#141414] after:dark:bg-[#3B3B3B] peer-checked:bg-[#AA5BFF]" />
            </label>
          </div>
          <div className="mt-[32px]">
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[16px] font-semibold text-[#959595]">
                {item?.firstVersionAllocation}
              </p>
              <p className="font-rogan cursor-pointer text-[16px] font-semibold text-[#959595] underline">
                {!isEditFirst ? (
                  <AiOutlineEdit
                    onClick={() => {
                      if (isCheckedFirst) {
                        setIsEditFirst(true)
                        setIsEditSecond(false)
                      }
                    }}
                  />
                ) : (
                  <AiOutlineCheck
                    onClick={() => {
                      setFirstAllocation(editFirstAllocation)
                      setSecondAllocation(100 - editFirstAllocation)
                      setIsEditFirst(false)
                      setIsEditSecond(false)
                    }}
                  />
                )}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[20px] font-semibold text-[#030303] dark:text-white transition-transform duration-300 transform peer-checked:-translate-y-1">
                {item?.firstRoute}
              </p>
              <p className="font-rogan text-[20px] font-semibold text-[#030303] dark:text-white">
                {isEditFirst ? (
                  <NumericFormat
                    value={editFirstAllocation}
                    thousandSeparator
                    suffix="%"
                    allowNegative={false}
                    decimalScale={0}
                    isAllowed={(values) => {
                      const { floatValue } = values
                      return floatValue <= 100
                    }}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/[^0-9]/g, '')
                      if (Number(newValue) > 100) return
                      setEditFirstAllocation(Number(newValue))
                      setSecondAllocation(100 - Number(newValue))
                    }}
                    className="w-full bg-transparent pl-[8px] text-right"
                  />
                ) : (
                  `${firstAllocation}%`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Second Allocation Section */}
        <div className="bg-transparent dark:bg-[#141414] col-span-1 rounded-[12px] border border-solid border-[#efefef] p-[12px] dark:border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <img
              src={item?.yield_provider2}
              className="h-[42px] w-[42px] object-contain"
            />
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isCheckedSecond}
                onChange={(e) => handleSecondCheckboxChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-12 flex items-center rounded-full border border-[#F4F4F4] bg-[#D2D5DA] shadow-inner relative after:absolute after:top-1/2 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[#fff] after:transition-all after:transform after:-translate-y-1/2 after:content-[''] peer-checked:after:translate-x-[110%] dark:border-[#1D1D1D] dark:bg-[#141414] after:dark:bg-[#3B3B3B] peer-checked:bg-[#AA5BFF]" />
            </label>
          </div>
          <div className="mt-[32px]">
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[16px] font-medium text-[#959595]">
                {item?.secondVersionAllocation}
              </p>
              <p className="font-rogan cursor-pointer text-[16px] font-semibold text-[#959595] underline">
                {!isEditSecond ? (
                  <AiOutlineEdit
                    onClick={() => {
                      setIsEditSecond(true)
                      setIsEditFirst(false)
                    }}
                  />
                ) : (
                  <AiOutlineCheck
                    onClick={() => {
                      setIsEditSecond(false)
                    }}
                  />
                )}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[20px] font-semibold text-[#030303] dark:text-white">
                {item?.secondRoute}
              </p>
              <p className="font-rogan text-[20px] font-semibold text-[#030303] dark:text-white">
                {isEditSecond ? (
                  <NumericFormat
                    value={editSecondAllocation}
                    thousandSeparator
                    suffix="%"
                    allowNegative={false}
                    decimalScale={0}
                    isAllowed={(values) => {
                      const { floatValue } = values
                      return floatValue <= 100
                    }}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/[^0-9]/g, '')
                      if (Number(newValue) > 100) return
                      setEditSecondAllocation(Number(newValue))
                      setFirstAllocation(100 - Number(newValue))
                    }}
                    className="w-full bg-transparent pl-[8px] text-right"
                  />
                ) : (
                  `${secondAllocation}%`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        className="font-rogan-regular mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]"
        onClick={() =>
          onConfirm({
            firstAllocation,
            secondAllocation,
          })
        }
      >
        Confirm Allocation
      </button>
    </Modal>
  )
}

export default AllocationModal
