import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { AppStore } from '@/types/store'
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/react'
import { useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useConnect } from 'wagmi'

interface ClaimModalProps {
  openModal: boolean
  handleClose: () => void
}

export default function ClaimModal({
  openModal,
  handleClose,
}: ClaimModalProps) {
  return (
    <Modal
      className="w-full max-w-[420px]  bg-[#FCFAFF] p-[10px] dark:bg-[#030303]"
      open={openModal}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between p-4">
        <div className="font-larken text-[18px] text-[22px] dark:text-white">
          Rewards
        </div>
        <AiOutlineClose
          className=" cursor-pointer text-[#ffff]"
          onClick={handleClose}
        />
      </div>
      <div className="gradient-border hidden h-[1px] w-full md:block"></div>
      <div className="grid h-[280px] w-full  grid-cols-2 gap-2 overflow-y-auto py-[22px]">
        {rewards.map((item) => (
          <div className="flex bg-claim-reward h-[102px] flex-col items-center justify-center rounded-[8px] border-[1px] border-[#1A1A1A]">
            <div className="font-larken text-[24px] text-[#404040] dark:text-white">
              {item.title}
            </div>
            <div className="mt-2 text-[15px] text-[#959595]">
              {item?.content}
            </div>
          </div>
        ))}
      </div>
      <button
        className={`font-mona w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all duration-300 ease-linear hover:bg-gradient-to-t 
        `}
      >
        CLAIM TORQ
      </button>
    </Modal>
  )
}

const rewards = [
  {
    title: '0.00 TORQ',
    content: 'Claimable',
  },
  {
    title: '$0.00',
    content: 'Dollar value',
  },
  {
    title: '$0.00',
    content: 'Current price',
  },
  {
    title: '$0.00',
    content: 'Market cap',
  },
]
