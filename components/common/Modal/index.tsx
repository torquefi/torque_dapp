"use client"

import { useEffect } from "react"
import { IoMdClose } from "react-icons/io"
import { motion, AnimatePresence } from "framer-motion"

interface ModalProps {
  open: boolean
  handleClose: () => void
  className?: string
  children?: any
  title?: string
  hideCloseIcon?: boolean
  position?: "right" | "center" // Added position prop with default to right
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
}

const sidebarVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: "0", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
}

const centerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeInOut" } },
}

const Modal = ({
  open,
  handleClose,
  className,
  title,
  hideCloseIcon = false,
  children,
  position = "right", // Default to right sidebar
}: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflowY = "hidden"
    } else {
      document.body.style.overflowY = "auto"
    }

    return () => {
      document.body.style.overflowY = "auto"
    }
  }, [open])

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] bg-white bg-opacity-10 dark:bg-[#030303] dark:bg-opacity-40 backdrop-blur-sm flex"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={handleClose}
        >
          {position === "right" ? (
            // Sidebar from right
            <motion.div
              className={`${className} h-screen ml-auto w-full max-w-sm border-l border-[#efefef] dark:border-[#1D1D1D] bg-white dark:bg-[#030303] flex flex-col`}
              onClick={(e) => e.stopPropagation()}
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#efefef] dark:border-[#1D1D1D]">
                {title && <h3 className="text-xl font-semibold text-[#030303] dark:text-white">{title}</h3>}
                {!hideCloseIcon && (
                  <motion.button
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f5f5f5] dark:bg-[#1A1A1A] hover:bg-opacity-80 ml-auto"
                    onClick={handleClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IoMdClose className="text-[#030303] dark:text-white" />
                  </motion.button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </motion.div>
          ) : (
            // Centered modal (original style)
            <div className="flex min-h-screen items-center justify-center py-[10px] px-[8px] w-full">
              <motion.div
                className={`${className} relative mx-auto w-[90%] rounded-[24px] border dark:border-[#1D1D1D] bg-white dark:bg-[#030303] p-[16px]`}
                onClick={(e) => e.stopPropagation()}
                variants={centerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {title && (
                  <h3 className="mb-[16px] text-[24px] font-semibold text-[#030303] dark:text-white">{title}</h3>
                )}
                {!hideCloseIcon && (
                  <motion.button
                    className="absolute top-2 right-2 z-10 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full bg-[#f5f5f5] dark:bg-[#1A1A1A] hover:bg-opacity-80"
                    onClick={handleClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IoMdClose className="text-[#030303] dark:text-white text-[18px]" />
                  </motion.button>
                )}
                {children}
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal

