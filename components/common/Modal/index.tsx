import { useEffect } from 'react'
import { IoMdClose } from 'react-icons/io'

interface ModalProps {
  open: boolean
  handleClose: () => void
  className?: string
  children?: any
  title?: string
  hideCloseIcon?: boolean
}

const Modal = ({
  open,
  handleClose,
  className,
  title,
  hideCloseIcon = false,
  children,
}: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
  }, [open])

  return (
    <div
      className={
        ` fixed top-0 left-0 z-500 h-screen w-full overflow-y-auto bg-[#030303] bg-opacity-70 transition-all ` +
        `${
          open ? `opacity-1 backdrop-blur-sm` : `pointer-events-none opacity-0 `
        }`
      }
      onClick={() => handleClose()}
    >
      <div className="flex min-h-screen items-center justify-center py-[10px] px-[8px]">
        <div
          className={`relative mx-auto w-[90%] rounded-[24px] border dark:border-[#1D1D1D] bg-[#030303] p-[16px] transition-all ${className} ${
            open ? `scale-100` : `scale-[0.9]`
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <h3 className="mb-[16px] text-[24px] font-semibold">{title}</h3>
          )}
          {!hideCloseIcon ? (
            <div
              className="absolute top-2 right-2 z-10 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full bg-[#fff] bg-opacity-10 hover:bg-opacity-20"
              onClick={() => handleClose()}
            >
              <IoMdClose className="stroke-[#fff] text-[18px]" />
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  )
}
export default Modal
