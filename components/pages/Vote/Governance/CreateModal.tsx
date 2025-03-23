"use client"

import HoverIndicator from "@/components/common/HoverIndicator"
import Modal from "@/components/common/Modal"
import type { AppStore } from "@/types/store"
import { Menu, Transition } from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { motion } from "framer-motion"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { FaAngleDown } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useState } from "react"
import * as yup from "yup"

const validationSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  link: yup.string().trim().required("Link is required"),
  description: yup.string().trim().required("Description is required"),
  action: yup.string().trim().required("Action is required"),
  amount: yup.number().nullable(),
  asset: yup.string().nullable(),
  pool: yup.string().nullable(),
})

type DefaultValues = {
  title: string
  link: string
  description: string
  action: string
  amount: number | null
  asset: string
  pool: string
}

const defaultValues: DefaultValues = {
  title: "",
  link: "",
  description: "",
  action: "",
  amount: null,
  asset: "",
  pool: "",
}

export const CreateModal = (props: any) => {
  const { openModal, handleClose } = props
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [showAmountInput, setShowAmountInput] = useState(false)
  const [showAssetInput, setShowAssetInput] = useState(false)
  const [showPoolInput, setShowPoolInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  })

  const values = watch()

  const options = [
    { value: "TransferFromTreasury", label: "Transfer from treasury" },
    { value: "SetPoolRewardSpeed", label: "Set pool reward speed" },
  ]

  const optionLabel = options?.find((item) => item?.value === values?.action)?.label

  let optionIndex = options?.findIndex((item) => item?.value === values?.action)
  if (optionIndex < 0) {
    optionIndex = undefined
  }

  useEffect(() => {
    if (openModal) {
      reset()
      setShowAmountInput(false)
    }
  }, [openModal, reset])

  useEffect(() => {
    if (values.action === "TransferFromTreasury") {
      setShowAmountInput(true)
      setShowAssetInput(true)
      setShowPoolInput(false)
    } else if (values.action === "SetPoolRewardSpeed") {
      setShowAmountInput(true)
      setShowAssetInput(false)
      setShowPoolInput(true)
    } else {
      setShowAmountInput(false)
      setShowAssetInput(false)
      setShowPoolInput(false)
    }
  }, [values.action])

  const onSubmit = (data: DefaultValues) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data)
      setIsSubmitting(false)
      handleClose()
    }, 1000)
  }

  return (
    <Modal open={openModal} handleClose={handleClose} title="Create Proposal" position="right">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div
            className={`h-[1px] w-full mb-6 ${theme === "light" ? "bg-gradient-divider-light" : "bg-gradient-divider"}`}
          ></div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <div className="relative">
                <input
                  className={`w-full rounded-xl border ${errors.title ? "border-red-500" : "border-[#E6E6E6] dark:border-[#1a1a1a]"} bg-transparent px-4 py-3 text-[#030303] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AA5BFF] focus:border-transparent`}
                  type="text"
                  placeholder="Title*"
                  {...register("title")}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  className={`w-full rounded-xl border ${errors.link ? "border-red-500" : "border-[#E6E6E6] dark:border-[#1a1a1a]"} bg-transparent px-4 py-3 text-[#030303] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AA5BFF] focus:border-transparent`}
                  type="text"
                  placeholder="Forum link*"
                  {...register("link")}
                />
                {errors.link && <p className="mt-1 text-xs text-red-500">{errors.link.message}</p>}
              </div>
            </div>

            <div>
              <div className="relative">
                <textarea
                  className={`w-full rounded-xl border ${errors.description ? "border-red-500" : "border-[#E6E6E6] dark:border-[#1a1a1a]"} bg-transparent px-4 py-3 text-[#030303] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AA5BFF] focus:border-transparent min-h-[120px] resize-none`}
                  placeholder="Description*"
                  {...register("description")}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>

            <div>
              <Menu as="div" className="relative block text-left">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button
                        className={`flex w-full items-center text-[14px] justify-between rounded-xl border ${errors.action ? "border-red-500" : "border-[#E6E6E6] dark:border-[#1a1a1a]"} px-4 py-3 text-[#030303] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#AA5BFF] focus:border-transparent`}
                      >
                        <span className={optionLabel ? "text-[#030303] dark:text-white" : "text-gray-400"}>
                          {optionLabel || "Add action*"}
                        </span>
                        <FaAngleDown
                          className={`h-5 w-5 text-gray-400 transition-all duration-200 ${open ? "rotate-180" : ""}`}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-10 mt-1 w-full origin-top-right rounded-md border border-[#E6E6E6] dark:border-[#1D1D1D] bg-white dark:bg-[#090909] shadow-lg">
                        <div className="py-1">
                          <HoverIndicator direction="vertical" activeIndex={optionIndex} divider>
                            {options.map((item, i) => (
                              <Menu.Item key={i}>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    className="flex w-full items-center px-4 py-3 text-sm text-[#030303] dark:text-white"
                                    onClick={() => setValue("action", item?.value, { shouldValidate: true })}
                                  >
                                    {item?.label}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </HoverIndicator>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
              {errors.action && <p className="mt-1 text-xs text-red-500">{errors.action.message}</p>}
            </div>

            {/* Conditional fields */}
            {showAmountInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  className="w-full rounded-xl border border-[#E6E6E6] dark:border-[#1a1a1a] bg-transparent px-4 py-3 text-[#030303] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AA5BFF] focus:border-transparent"
                  type="number"
                  placeholder="Amount"
                  {...register("amount")}
                />
              </motion.div>
            )}

            {showAssetInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  className="w-full rounded-xl border border-[#E6E6E6] dark:border-[#1a1a1a] bg-transparent px-4 py-3 text-[#030303] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AA5BFF] focus:border-transparent"
                  type="text"
                  placeholder="Asset"
                  {...register("asset")}
                />
              </motion.div>
            )}

            {showPoolInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  className="w-full rounded-xl border border-[#E6E6E6] dark:border-[#1a1a1a] bg-transparent px-4 py-3 text-[#030303] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AA5BFF] focus:border-transparent"
                  type="text"
                  placeholder="Pool"
                  {...register("pool")}
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          className="mt-auto pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-3 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
            ${!isValid || isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
            whileHover={{ scale: isValid && !isSubmitting ? 1.02 : 1 }}
            whileTap={{ scale: isValid && !isSubmitting ? 0.98 : 1 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Submit Proposal"
            )}
          </motion.button>
        </motion.div>
      </form>
    </Modal>
  )
}
