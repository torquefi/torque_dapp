import React, { useState } from 'react'
import { DelegateModal } from './DelegateModal'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import Popover from '@/components/common/Popover'

export const VotingPower = () => {
  const [openDelegateModal, setOpenDelegateModal] = useState(false)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  return (
    <>
      <div className="ml-4 h-full dark:text-white rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 pt-[16px] pb-[20px] py-[12px] w-full lg:max-w-[40%] text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white xl:px-[32px] mt-6 mr-2 ml-0 md:mr-0 md:mt-0 md:ml-4">
        <div className="flex items-center justify-between">
          <h2 className="font-larken text-[24px] font-[400] leading-[40px]">Vote Power</h2>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`font-mona text-[#030303] dark:text-white mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#0d0d0d]`}
            content="Direct Torque by delegating votes to yourself or an aligned entity."
          >
          <button>
            <img src="/assets/pages/vote/ic-info.svg" alt="information" />
          </button>
          </Popover>
        </div>
        <div className={`mt-2 mb-2 hidden h-[1px] w-full md:block` +`
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
        <div className="grid w-full h-auto grid-cols-2 gap-4 py-2 mb-2 overflow-y-auto">
          <div className="rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  border-[#E6E6E6] dark:border-[#1A1A1A]  dark:bg-transparent dark:bg-gradient-to-b flex h-[102px] flex-col items-center justify-center rounded-[8px] border-[1px] border-[#1A1A1A]">
            <div className="mt-1 font-larken text-[24px] text-[#404040] dark:text-white">
              0.00
            </div>
            {/* TODO: replace hardcode with dynamic value */}
            <div className="mt-1 text-[15px] text-[#959595]">Your Power</div>
          </div>
          <div className="rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0 border-[#E6E6E6] dark:border-[#1A1A1A]  dark:bg-transparent dark:bg-gradient-to-b flex h-[102px] flex-col items-center justify-center rounded-[8px] border-[1px] border-[#1A1A1A]">
            <div className="mt-1 font-larken text-[24px] text-[#404040] dark:text-white">
              $0.00
            </div>
            {/* TODO: replace hardcode with dynamic value */}
            <div className="mt-1 text-[15px] text-[#959595]">Your Value</div>
          </div>
        </div>
        <div className="flex flex-col">
          <button
            onClick={() => setOpenDelegateModal(true)}
            className={`font-mona w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
          `}
          >
            Delegate votes
          </button>
          <Link
            href="https://bit.ly/torq-uniswap"
            target="_blank"
            className="font-mona text-center mt-2 w-full rounded-full border border-[#AA5BFF] bg-transparent py-1 uppercase text-[#AA5BFF] transition-all"
          >
            acquire torq
          </Link>
        </div>
      </div>
      <DelegateModal
        openModal={openDelegateModal}
        handleClose={() => setOpenDelegateModal(false)}
      />
    </>
  )
}
