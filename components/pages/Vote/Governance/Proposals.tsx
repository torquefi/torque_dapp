import React, { useState } from 'react'
import { ProposalsItem } from './ProposalsItem'
import { CreateModal } from './CreateModal'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export const Proposals = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <>
      <div className="dark:text-white rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[16px] py-[12px] w-full text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b xl:px-[32px] sm:mr-0 md:w-[59%] md:px-[37px] lg:mr-[2px]">
        <div className="flex items-center justify-between">
          <h4 className="font-larken text-[#030303] dark:text-white text-[24px] font-[400] leading-[40px]">
            Proposals
          </h4>
          <button
            className="flex items-center gap-[5px]"
            onClick={() => setOpenCreateModal(true)}
          >
            <p className="text-[14px] font-[500] uppercase text-[#AA5BFF]">
              create
            </p>
            <img src="/assets/pages/vote/genover/next.svg" alt="" className="mb-1"/>
          </button>
        </div>
        <div className={`mt-2 h-[1px] w-full md:block` +`
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
        {menu.map((item, i) => (
          <ProposalsItem menu={item} />
        ))}
        {/* <div className="mx-auto w-full py-[58px]">
          <img
            src={
              theme === 'light'
                ? '/assets/pages/vote/genover/noproposal-white.png'
                : '/assets/pages/vote/genover/noproposal.png'
            }
            alt=""
            className="mx-auto w-full max-w-[84px]"
          />
          <h3 className="font-larken mt-[12px] text-center text-[24px] font-[400] leading-[34px]">
            No proposals yet
          </h3>
          <p className="mx-auto mt-[6px] w-full text-center text-[16px] font-[500] text-[#959595] max-w-[280px]">
            TORQ token is now live! Stay tuned for our first community proposals.
          </p>
        </div> */}
        <div className="mt-[18px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595]">
          view all
        </div>
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
    title: 'Incentivize Uniswap Liquidity',
    state: 'pending',
    tip: 'TIP-1',
    timeVote: 'Vote hasn’t started',
    voteRed: 0,
    voteGreen: 0,
  },
  // {
  //   title: 'Increase rate of distributio..',
  //   state: 'active',
  //   tip: 'TIP-15',
  //   timeVote: '4 days, 12 hours left',
  //   voteRed: 0,
  //   voteGreen: 0,
  // },
  // {
  //   title: 'Lorid viverra conse tetus lo..',
  //   state: 'active',
  //   tip: 'TIP-14',
  //   timeVote: '1 day, 22 hours left',
  //   voteRed: 0,
  //   voteGreen: 0,
  // },
  // {
  //   title: 'Donec vel dui ut mi congse..',
  //   state: 'failed',
  //   tip: 'TIP-13',
  //   timeVote: 'Vote has ended',
  //   voteRed: 0,
  //   voteGreen: 0,
  // },
]
