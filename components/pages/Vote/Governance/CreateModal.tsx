import Modal from '@/components/common/Modal'
import { AiOutlineClose } from 'react-icons/ai'
import { FaAngleDown } from 'react-icons/fa'

export const CreateModal = (props: any) => {
  const { openModal, handleCLose } = props
  return (
    <div>
      <Modal
        open={openModal}
        handleClose={handleCLose}
        className="mx-auto w-full max-w-[600px] px-[33px]"
        hideCloseIcon
      >
        <div className="flex items-center justify-between py-3">
          <div className="font-larken text-[18px] font-[400] dark:text-white md:text-[28px]">
            Create
          </div>
          <AiOutlineClose
            className="cursor-pointer text-[#ffff]"
            onClick={handleCLose}
          />
        </div>
        <div className="gradient-border mt-2 hidden h-[1px] w-full md:block"></div>
        <div className="mt-[22px]">
          <input
            className="w-full rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-transparent px-[21px] py-[24px] text-[18px] font-[500] text-[#959595]"
            type="text"
            placeholder="Title*"
          />
          <input
            className="mt-[14px] w-full rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-transparent px-[21px] py-[24px] text-[18px] font-[500] text-[#959595]"
            type="text"
            placeholder="Forum link*"
          />
          <input
            className="mt-[14px] w-full rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-transparent px-[21px] pb-[190px] pt-[26px] text-[18px] font-[500] text-[#959595]"
            type="text"
            placeholder="Description*"
          />
          <div className="mt-[14px] flex w-full items-center  justify-between rounded-[12px] border-[1px] border-solid border-[#1a1a1a] px-[21px] py-[25px]">
            <input
              type="text"
              className="bg-transparent text-[18px] font-[500] text-[#959595]"
              placeholder="Add action"
            />
            <FaAngleDown className="h-[24px] cursor-pointer text-[#959595]" />
          </div>
        </div>
        <button
          className={`font-mona mt-[30px] w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        `}
        >
          submit proposal
        </button>
      </Modal>
    </div>
  )
}
