import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { AppStore } from '@/types/store'
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/react'
import { useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useConnect } from 'wagmi'

interface ConfirmDepositModalProps {
  openModal: boolean
  handleClose: () => void
  contentButton: string
  handleAction: () => void
  contentCoin: any
}

export default function ConfirmDepositModal({
  openModal,
  handleClose,
  contentButton,
  handleAction,
  contentCoin
}: ConfirmDepositModalProps) {
  return (
    <Modal
      className="w-full max-w-[420px]  bg-[#FCFAFF] p-[10px] dark:bg-[#030303]"
      open={openModal}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between py-3">
        <div className="font-larken text-[18px] text-[32px] dark:text-white">
          Confirm
        </div>
        <AiOutlineClose
          className="cursor-pointer text-[#ffff]"
          onClick={handleClose}
        />
      </div>
      <div className="gradient-border mt-2 hidden h-[1px] w-full md:block"></div>
      <div className=" h-auto w-full   overflow-y-auto py-[18px]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[16px] text-[#959595]">You deposit</span>
            <div className="font-larken pt-2 text-[23px]">0.00 USG</div>
          </div>
          <div>
            <img className="w-16" src={contentCoin?.coin} alt="" />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div>
            <span className="text-[16px] text-[#959595]">You receive</span>
            <div className="font-larken pt-2 text-[23px]">0.00 USG</div>
          </div>
          <div className='relative w-16'>
            <img className="w-16 " src={contentCoin?.coin} alt="" />
            <img className='absolute w-5 bottom-3 right-3' src={contentCoin?.coinItem} alt="" />
          </div>
        </div>
      </div>
      <div className="gradient-border mt-2 hidden h-[1px] w-full md:block"></div>
      <div className="my-5 flex flex-wrap gap-3 text-[16px] text-[#959595]">
        <div className="flex w-full items-center justify-between text-[15px]">
          <p>Wallet balance</p>
          <span>0.00 USG</span>
        </div>
        <div className="flex w-full items-center justify-between">
          <p>Exchange rate</p>
          <span>1 USG = 1 tUSG</span>
        </div>
        <div className="flex w-full items-center justify-between">
          <p>Variable APY</p>
          <span>0.00%</span>
        </div>
      </div>
      <button
        onClick={handleAction}
        className={`font-mona w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        `}
      >
        {contentButton}
      </button>
    </Modal>
  )
}
