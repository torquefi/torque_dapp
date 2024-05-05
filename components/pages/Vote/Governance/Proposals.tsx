import React, { useState } from 'react'
import { ProposalsItem } from './ProposalsItem'
import { CreateModal } from './CreateModal'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useAppSelector } from '@/lib/redux/store'

export const Proposals = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { tipData } = useAppSelector(state => state.tips)

  return (
    <>
      <div className="dark:text-white rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[16px] py-[12px] w-full text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b xl:px-[32px] sm:mr-0 md:w-[59%] md:px-[37px] lg:mr-[2px]">
        <div className="flex items-center justify-between">
          <h4 className="font-rogan text-[#030303] dark:text-white text-[24px] font-[400] leading-[40px]">
            Proposals
          </h4>
          <button
            className="flex items-center gap-[5px]"
            onClick={() => setOpenCreateModal(true)}
          >
            <p className="text-[14px] font-[500] uppercase text-[#AA5BFF]">
              create
            </p>
            <img src="/assets/pages/vote/genover/next.svg" alt="" className="mb-1" />
          </button>
        </div>
        <div className={`mt-2 h-[1px] w-full md:block` + `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
        {tipData.map((item, i) => (
          <ProposalsItem menu={item} key={item?.id} />
        ))}
        <Link href="https://www.tally.xyz/gov/torque/proposals" legacyBehavior>
          <a target='_blank'>
            <div className="mt-[18px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595]">
              view all
            </div>
          </a>
        </Link>
      </div>
      <CreateModal
        openModal={openCreateModal}
        handleCLose={() => setOpenCreateModal(false)}
      />
    </>
  )
}
const menu = [
  {
    title: 'Initialize LP Program',
    state: 'pending',
    tip: 'TIP-1',
    timeVote: 'Vote hasn’t started',
    voteRed: 0,
    voteGreen: 0,
    id: 1
  },
  {
    title: 'Hello World [Test Proposal]',
    state: 'active',
    tip: 'TIP-0',
    timeVote: 'Vote has started',
    voteRed: 0,
    voteGreen: 0,
    id: 0
  },
]
