import Modal from '.'

interface ConfirmModalProps {
  open: boolean
  handleClose: VoidFunction
  title?: string
  content?: string
  onConfirm: VoidFunction
}

export default function ConfirmModal({
  open,
  handleClose,
  title,
  content,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal
      className="max-w-[460px] font-rogan-regular"
      open={open}
      handleClose={handleClose}
      title={title}
    >
      <p className="my-10 lg:text-18">{content}</p>
      <div className="flex justify-end mt-4 space-x-2">
        <button className="rounded-full px-[12px] py-1" onClick={handleClose}>
          Close
        </button>
        <button
          className="rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] px-[12px] py-1 font-rogan-regular text-[14px] uppercase transition-all duration-300 ease-linear hover:bg-gradient-to-t"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}
