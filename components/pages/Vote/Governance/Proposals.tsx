import React, { useState } from 'react'
import { ProposalsItem } from './ProposalsItem'

export const Proposals = () => {
  return (
    <div className="w-[59%] rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[37px] py-[15px]">
      <div className="flex items-center justify-between">
        <h4 className="text-[24px] font-[400] leading-[40px]">Proposals</h4>
        <div className="flex items-center gap-[5px]">
          <p className="text-[14px] font-[500] uppercase text-[#AA5BFF]">
            create
          </p>
          <img src="/assets/pages/vote/genover/next.svg" alt="" />
        </div>
      </div>
      <div className="gradient-border mt-2 hidden h-[1px] w-full md:block"></div>
      {menu.map((item, i) => (
        <ProposalsItem menu={item} />
      ))}
      <div className="mt-[18px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595]">
        view all
      </div>
    </div>
  )
}
const menu = [
  {
    title: 'Nunc neque ipsum, vulputate..',
    state: 'pending',
    tip: 'TIP-16',
    timeVote: 'Vote hasn’t started',
    voteRed: 0,
    voteGreen: 0,
  },
  {
    title: 'Increase rate of distributio..',
    state: 'active',
    tip: 'TIP-15',
    timeVote: '4 days, 12 hours left',
    voteRed: 682,
    voteGreen: 10200000,
  },
  {
    title: 'Lorid viverra conse tetus lo..',
    state: 'active',
    tip: 'TIP-14',
    timeVote: '1 day, 22 hours left',
    voteRed: 101,
    voteGreen: 4600000,
  },
  {
    title: 'Donec vel dui ut mi congse..',
    state: 'failed',
    tip: 'TIP-13',
    timeVote: 'Vote has ended',
    voteRed: 12200000,
    voteGreen: 1200,
  },
  {
    title: 'Fusce ut enim tristiq lorp..',
    state: 'passed',
    tip: 'TIP-12',
    timeVote: 'Vote has ended',
    voteRed: 0,
    voteGreen: 18800000,
  },
]
