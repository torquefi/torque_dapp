'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SelectCollateral from './steps/SelectCollateral'
import SelectBorrowAsset from './steps/SelectBorrowAsset'
import SelectAmount from './steps/SelectAmount'
import SelectLoop from './steps/SelectLoop'
import ReviewLoan from './steps/ReviewLoan'

export interface IBorrowInfo {
  depositTokenIcon: string
  depositTokenSymbol: string
  depositTokenDecimal: number
  borrowTokenSymbol: string
  borrowTokenDecimal: number
  liquidity: number
  loanToValue: number
  getTORQ: number
  borrowRate: number
  name: string
  bonus: number
  arbBonus: number
  borrowRowTokenIcon: string
  borrowTokenIcon?: string
  multiLoan?: boolean
}

export interface BorrowFormData {
  collateral: IBorrowInfo | null
  borrowAsset: string
  collateralAmount: number
  borrowAmount: number
  loopCount: number
}

interface BorrowFormProps {
  availableBorrowOptions: IBorrowInfo[]
  onSubmit: (formData: BorrowFormData) => void
}

const steps = ['Collateral', 'Asset', 'Amount', 'Loop', 'Review']

export default function BorrowForm({
  availableBorrowOptions,
  onSubmit,
}: BorrowFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [formData, setFormData] = useState<BorrowFormData>({
    collateral: null,
    borrowAsset: '',
    collateralAmount: 0,
    borrowAmount: 0,
    loopCount: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [currentStep])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setDirection(-1)
      setCurrentStep(step)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        collateral: null,
        borrowAsset: '',
        collateralAmount: 0,
        borrowAmount: 0,
        loopCount: 1,
      })
      setCurrentStep(0)
    } catch (error) {
      console.error('Error submitting borrow form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return !formData.collateral
      case 1:
        return !formData.borrowAsset
      case 2:
        return formData.collateralAmount <= 0
      default:
        return false
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Progress Indicator */}
      <div className="px-6 pb-3 pt-6">
        <div className="mb-2 flex justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <motion.div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  index < currentStep
                    ? 'bg-[#AA5BFF] text-white'
                    : index === currentStep
                    ? 'border-2 border-[#AA5BFF] bg-[#F5EEFF] text-[#AA5BFF]'
                    : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                }`}
                whileHover={index <= currentStep ? { scale: 1.05 } : {}}
                whileTap={index <= currentStep ? { scale: 0.95 } : {}}
                onClick={() => index < currentStep && goToStep(index)}
                style={{ cursor: index < currentStep ? 'pointer' : 'default' }}
                initial={false}
                animate={{
                  scale: [null, index === currentStep ? 1.1 : 1, 1],
                  transition: { duration: 0.3 },
                }}
              >
                {index < currentStep ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3337 4L6.00033 11.3333L2.66699 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              <span className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            className="h-full origin-left rounded-full bg-[#AA5BFF]"
            initial={false}
            animate={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
              transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] },
            }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div
        ref={contentRef}
        className="relative min-h-[420px] overflow-hidden px-6 py-4"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            {currentStep === 0 && (
              <SelectCollateral
                availableCollaterals={availableBorrowOptions}
                selectedCollateral={formData.collateral}
                onSelect={(collateral) =>
                  setFormData((prev: any) => ({ ...prev, collateral }))
                }
              />
            )}
            {currentStep === 1 && (
              <SelectBorrowAsset
                collateral={formData.collateral}
                selectedBorrowAsset={formData.borrowAsset}
                onSelect={(borrowAsset) =>
                  setFormData((prev) => ({ ...prev, borrowAsset }))
                }
              />
            )}
            {currentStep === 2 && (
              <SelectAmount
                collateral={formData.collateral}
                borrowAsset={formData.borrowAsset}
                collateralAmount={formData.collateralAmount}
                borrowAmount={formData.borrowAmount}
                onChange={(collateralAmount, borrowAmount) =>
                  setFormData((prev) => ({
                    ...prev,
                    collateralAmount,
                    borrowAmount,
                  }))
                }
              />
            )}
            {currentStep === 3 && (
              <SelectLoop
                loopCount={formData.loopCount}
                onChange={(loopCount) =>
                  setFormData((prev) => ({ ...prev, loopCount }))
                }
              />
            )}
            {currentStep === 4 && (
              <ReviewLoan formData={formData} isSubmitting={isSubmitting} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`rounded-full px-5 py-2.5 font-medium transition-colors ${
            currentStep === 0
              ? 'cursor-not-allowed bg-gray-50 text-gray-300 dark:bg-gray-800 dark:text-gray-700'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Back
        </motion.button>

        {currentStep < steps.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            disabled={isNextDisabled()}
            className={`rounded-full px-5 py-2.5 font-medium transition-colors ${
              isNextDisabled()
                ? 'cursor-not-allowed bg-[#AA5BFF]/50 text-white'
                : 'bg-[#AA5BFF] text-white hover:bg-[#9240E3]'
            }`}
          >
            Next
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center rounded-full bg-[#AA5BFF] px-5 py-2.5 font-medium text-white hover:bg-[#9240E3] disabled:bg-[#AA5BFF]/50"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing
              </>
            ) : (
              'Create Position'
            )}
          </motion.button>
        )}
      </div>
    </div>
  )
}
