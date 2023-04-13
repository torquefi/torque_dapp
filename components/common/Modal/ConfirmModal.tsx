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
      className="max-w-[460px] font-mona"
      open={open}
      handleClose={handleClose}
      title={title}
    >
      <p className="lg:text-18 my-10">{content}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="rounded-full px-[12px] py-1" onClick={handleClose}>
          Close
        </button>
        <button
          className="rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] px-[12px] py-1 font-mona text-[16px] uppercase transition-all duration-300 ease-linear hover:bg-gradient-to-t"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}
