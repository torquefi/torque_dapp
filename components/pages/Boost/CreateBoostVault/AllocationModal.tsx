import Modal from '@/components/common/Modal'
import React, { useEffect, useState } from 'react'
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'

const AllocationModal = ({
  open,
  handleClose,
  item,
  onConfirm,
}: {
  open?: boolean
  handleClose: () => void
  item: any
  onConfirm: () => void
}) => {
  const [isEditFirst, setIsEditFirst] = useState(false)
  const [isEditSecond, setIsEditSecond] = useState(false)
  const [firstAllocation, setFirstAllocation] = useState(item?.firstAllocation)
  const [secondAllocation, setSecondAllocation] = useState(
    item?.secondAllocation
  )
  const [editFirstAllocation, setEditFirstAllocation] = useState(
    item?.firstAllocation
  )
  const [editSecondAllocation, setEditSecondAllocation] = useState(
    item?.secondAllocation
  )
  const [isCheckedFirst, setIsCheckedFirst] = useState(false)
  const [isCheckedSecond, setIsCheckedSecond] = useState(false)

  useEffect(() => {
    if (open && item) {
      setEditFirstAllocation(item?.firstAllocation)
      setEditSecondAllocation(item?.secondAllocation)
      setFirstAllocation(item?.firstAllocation)
      setSecondAllocation(item?.secondAllocation)
    }

    if (!open) {
      setIsEditFirst(false)
      setIsEditSecond(false)
    }
  }, [item, open])

  console.log('editFirstAllocation :>> ', editFirstAllocation)

  return (
    <Modal
      className="mx-auto w-[90%] max-w-[540px] bg-[#FFFFFF] px-[22px] dark:bg-[#030303]"
      open={open}
      handleClose={() => {
        handleClose()
      }}
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

      <div className="mt-[24px] grid grid-cols-2 gap-[12px]">
        <div className="bg-[#f9f9f9]dark:bg-[#141414] col-span-1 rounded-[12px] border border-solid border-[#efefef] p-[12px] dark:border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <img
              src={item?.yield_provider1}
              className="h-[54px] w-[54px] object-contain"
            />
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                onChange={(e) => {
                  setIsCheckedSecond(false)
                  setIsEditFirst(false)
                  setIsCheckedFirst(e.target.checked)
                  setFirstAllocation(item?.firstAllocation)
                  setEditFirstAllocation(item?.firstAllocation)
                }}
                type="checkbox"
                checked={isCheckedFirst}
                className="peer sr-only"
              />
              <div className="h-6 w-12 rounded-full border border-[#F4F4F4] bg-[#fff] shadow-inner after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[#fff] after:transition-all after:content-[''] peer-checked:after:translate-x-[110%] dark:border-[#1D1D1D] dark:bg-[#141414] after:dark:bg-[#3B3B3B] peer-checked:dark:bg-[#AA5BFF]" />
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
                        setEditSecondAllocation(item?.secondAllocation)
                        setSecondAllocation(item?.secondAllocation)
                      }
                    }}
                  />
                ) : (
                  <AiOutlineCheck
                    onClick={() => {
                      setFirstAllocation(editFirstAllocation)
                      setSecondAllocation(
                        100 - Number(editFirstAllocation) > 0
                          ? 100 - Number(editFirstAllocation)
                          : 0
                      )
                      setIsEditFirst(false)
                      setIsEditSecond(false)
                    }}
                  />
                )}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[20px] font-semibold text-[#030303] dark:text-white">
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
                      setEditFirstAllocation(newValue)
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
        <div className="bg-[#f9f9f9]dark:bg-[#141414] col-span-1 rounded-[12px] border border-solid border-[#efefef] p-[12px] dark:border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <img
              src={item?.yield_provider2}
              className="h-[54px] w-[54px] object-contain"
            />

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                onChange={(e) => {
                  setIsCheckedSecond(e.target.checked)
                  setIsEditSecond(false)
                  setEditFirstAllocation(item?.firstAllocation)
                  setFirstAllocation(item?.firstAllocation)
                }}
                type="checkbox"
                checked={isCheckedSecond}
                className="peer sr-only"
              />
              <div className="h-6 w-12 rounded-full border border-[#F4F4F4] bg-[#fff] shadow-inner after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[#fff] after:transition-all after:content-[''] peer-checked:after:translate-x-[110%] dark:border-[#1D1D1D] dark:bg-[#141414] after:dark:bg-[#3B3B3B] peer-checked:dark:bg-[#AA5BFF]" />
            </label>
          </div>
          <div className="mt-[32px]">
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[16px] font-semibold text-[#959595]">
                {item?.secondVersionAllocation}
              </p>
              <p className="font-rogan cursor-pointer text-[16px] font-semibold text-[#959595] underline">
                {!isEditSecond ? (
                  <AiOutlineEdit
                    onClick={() => {
                      setIsEditSecond(true)
                      setIsEditFirst(false)
                      setEditFirstAllocation(item?.secondAllocation)
                      setFirstAllocation(item?.secondAllocation)
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
                      setEditSecondAllocation(newValue)
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
        className="font-rogan-regular mt-[24px] w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] px-[12px] py-1 text-[14px] uppercase transition-all duration-300 ease-linear hover:bg-gradient-to-t"
        onClick={onConfirm}
      >
        Confirm Allocation
      </button>
    </Modal>
  )
}

export default AllocationModal
