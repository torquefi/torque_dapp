import Modal from '@/components/common/Modal'
import { AppStore } from '@/types/store'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'

interface IIAllocationItem {
  firstAllocation: number
  secondAllocation: number
}

interface IAllocationModalProps {
  open?: boolean
  handleClose: () => void
  item: any
  onConfirm: (allocations: IIAllocationItem) => void
}

const AllocationModal = ({
  open,
  handleClose,
  item,
  onConfirm,
}: IAllocationModalProps) => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [firstAllocationInit, setFirstAllocationInit] = useState(
    item?.firstAllocation
  )
  const [secondAllocationInit, setSecondAllocationInit] = useState(
    item?.secondAllocation
  )
  const [firstAllocation, setFirstAllocation] = useState(item?.firstAllocation)
  const [secondAllocation, setSecondAllocation] = useState(
    item?.secondAllocation
  )
  const [isEditingFirst, setIsEditingFirst] = useState(false)
  const [isEditingSecond, setIsEditingSecond] = useState(false)
  const [isCheckedFirst, setIsCheckedFirst] = useState(false)
  const [isCheckedSecond, setIsCheckedSecond] = useState(false)

  useEffect(() => {
    if (open && item) {
      // setFirstAllocationInit(item?.firstAllocation)
      // setSecondAllocationInit(item?.secondAllocation)
      setFirstAllocation(item?.firstAllocation)
      setSecondAllocation(item?.secondAllocation)
      setIsCheckedFirst(true)
      setIsCheckedSecond(true)
    }

    if (!open) {
      setIsEditingFirst(false)
      setIsEditingSecond(false)
      setIsCheckedFirst(false)
      setIsCheckedSecond(false)
    }
  }, [item?.firstAllocation, item?.secondAllocation, open])

  const handleFirstCheckboxChange = (checked: boolean) => {
    setIsCheckedFirst(checked)
    setIsEditingFirst(false)
    setIsEditingSecond(false)

    if (!checked && !isCheckedSecond) {
      setFirstAllocation(0)
      setSecondAllocation(100)
      setIsCheckedSecond(true)
    }
    if (!checked && isCheckedSecond) {
      setFirstAllocation(0)
      setSecondAllocation(100)
    }
    if (checked && !isCheckedSecond) {
      setFirstAllocation(100)
      setSecondAllocation(0)
    }
    if (checked && isCheckedSecond) {
      setFirstAllocation(50)
      setSecondAllocation(50)
    }
  }

  const handleSecondCheckboxChange = (checked: boolean) => {
    setIsCheckedSecond(checked)
    setIsEditingFirst(false)
    setIsEditingSecond(false)

    if (!checked && !isCheckedFirst) {
      setFirstAllocation(100)
      setSecondAllocation(0)
      setIsCheckedFirst(true)
    }
    if (!checked && isCheckedFirst) {
      setFirstAllocation(100)
      setSecondAllocation(0)
    }
    if (checked && !isCheckedFirst) {
      setFirstAllocation(100)
      setSecondAllocation(0)
    }
    if (checked && isCheckedFirst) {
      setFirstAllocation(50)
      setSecondAllocation(50)
    }
  }

  const percentageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
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
          theme === 'light'
            ? 'bg-gradient-divider-light'
            : 'bg-gradient-divider'
        }`}
      ></div>
      <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
        {/* First Allocation Section */}
        <div className="col-span-1 rounded-[12px] border border-solid border-[#efefef] bg-transparent p-[12px] dark:border-[#1a1a1a] dark:bg-[#141414]">
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
              <div className="relative flex h-6 w-12 items-center rounded-full border border-[#F4F4F4] bg-[#D2D5DA] shadow-inner after:absolute after:left-[2px] after:top-1/2 after:h-5 after:w-5 after:-translate-y-1/2 after:transform after:rounded-full after:bg-[#fff] after:transition-all after:content-[''] peer-checked:bg-[#AA5BFF] peer-checked:after:translate-x-[110%] dark:border-[#1D1D1D] dark:bg-[#141414] after:dark:bg-[#3B3B3B]" />
            </label>
          </div>
          <div className="mt-[32px]">
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[16px] font-semibold text-[#959595]">
                {item?.firstVersionAllocation}
              </p>
              <p className="font-rogan cursor-pointer text-[16px] font-semibold text-[#959595] underline">
                {!isEditingFirst ? (
                  <AiOutlineEdit
                    onClick={() => {
                      if (isCheckedFirst) {
                        setIsEditingFirst(true)
                        setIsEditingSecond(false)
                      }
                    }}
                  />
                ) : (
                  <AiOutlineCheck
                    onClick={() => {
                      setFirstAllocation(firstAllocation)
                      setSecondAllocation(100 - firstAllocation)
                      setIsEditingFirst(false)
                      setIsEditingSecond(false)
                    }}
                  />
                )}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-rogan transform text-[20px] font-semibold text-[#030303] transition-transform duration-300 peer-checked:-translate-y-1 dark:text-white">
                {item?.firstRoute}
              </p>
              <motion.p
                className="font-rogan text-[20px] font-semibold text-[#030303] dark:text-white"
                key={!isEditingFirst ? firstAllocation : 'first'}
                variants={percentageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {isEditingFirst ? (
                  <NumericFormat
                    value={firstAllocation}
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
                      setFirstAllocation(Number(newValue))
                      setSecondAllocation(100 - Number(newValue))
                    }}
                    className="w-full bg-transparent pl-[8px] text-right"
                  />
                ) : (
                  `${firstAllocation}%`
                )}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Second Allocation Section */}
        <div className="col-span-1 rounded-[12px] border border-solid border-[#efefef] bg-transparent p-[12px] dark:border-[#1a1a1a] dark:bg-[#141414]">
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
              <div className="relative flex h-6 w-12 items-center rounded-full border border-[#F4F4F4] bg-[#D2D5DA] shadow-inner after:absolute after:left-[2px] after:top-1/2 after:h-5 after:w-5 after:-translate-y-1/2 after:transform after:rounded-full after:bg-[#fff] after:transition-all after:content-[''] peer-checked:bg-[#AA5BFF] peer-checked:after:translate-x-[110%] dark:border-[#1D1D1D] dark:bg-[#141414] after:dark:bg-[#3B3B3B]" />
            </label>
          </div>
          <div className="mt-[32px]">
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[16px] font-medium text-[#959595]">
                {item?.secondVersionAllocation}
              </p>
              <p className="font-rogan cursor-pointer text-[16px] font-semibold text-[#959595] underline">
                {!isEditingSecond ? (
                  <AiOutlineEdit
                    onClick={() => {
                      setIsEditingSecond(true)
                      setIsEditingFirst(false)
                    }}
                  />
                ) : (
                  <AiOutlineCheck
                    onClick={() => {
                      setIsEditingSecond(false)
                    }}
                  />
                )}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[20px] font-semibold text-[#030303] dark:text-white">
                {item?.secondRoute}
              </p>
              <motion.p
                className="font-rogan text-[20px] font-semibold text-[#030303] dark:text-white"
                key={!isEditingSecond ? secondAllocation : 'second'}
                variants={percentageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {isEditingSecond ? (
                  <NumericFormat
                    value={secondAllocation}
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
                      setSecondAllocation(Number(newValue))
                      setFirstAllocation(100 - Number(newValue))
                    }}
                    className="w-full bg-transparent pl-[8px] text-right"
                  />
                ) : (
                  `${secondAllocation}%`
                )}
              </motion.p>
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
