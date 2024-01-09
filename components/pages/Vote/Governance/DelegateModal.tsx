import Modal from '@/components/common/Modal'
import { AiOutlineClose } from 'react-icons/ai'
import { FaAngleDown } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export const DelegateModal = (props: any) => {
  const { openModal, handleClose } = props
  const theme = useSelector((store: AppStore) => store.theme.theme)
  return (
    <div>
      <Modal
        open={openModal}
        handleClose={handleClose}
        className="bg-[#FCFAFF] dark:bg-[#030303] mx-auto w-[90%] max-w-[360px] px-[24px]"
        hideCloseIcon
      >
        <div className="flex items-center justify-between py-2">
          <div className="font-larken text-[16px] font-[400] text-[#030303] dark:text-white md:text-[28px]">
            Delegate
          </div>
          <AiOutlineClose
            className="cursor-pointer text-[#030303] dark:text-[#ffff]"
            onClick={handleClose}
          />
        </div>
        <div className={`mt-2 hidden h-[1px] w-full md:block` +`
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
        <div className="mt-[18px]">
          <input
            className="w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] dark:border-[#1a1a1a] bg-transparent px-[21px] py-[12px] text-[14px] font-[500] text-[#959595]"
            type="text"
            placeholder="Address*"
          />
        </div>
        <div className={`mt-[18px] hidden h-[1px] w-full md:block` +`
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
        <div className="mt-[22px]">
          <div className="flex justify-between font-[500] leading-[20px] text-[#959595]">
            <p>Wallet balance</p>
            <p>0.00 TORQ</p>
          </div>
          <div className="mt-[22px] flex justify-between font-[500] leading-[20px] text-[#959595]">
            <p>Vote power</p>
            <p>0.00 TORQ</p>
          </div>
          {/* <div className="mt-[22px] flex justify-between font-[500] leading-[20px] text-[#959595]">
            <p>Delegate APR</p>
            <p>0.00%</p>
          </div> */}
        </div>
        <button
          className={`font-mona mt-[16px] w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        `}
        >
          delegate votes
        </button>
      </Modal>
    </div>
  )
}
