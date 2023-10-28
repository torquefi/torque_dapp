import React from 'react'
import { OptionToken } from './OptionToken'
import { Proposals } from './Proposals'
import { VotingPower } from './VotingPower'

export const Governance = () => {
  return (
    <div>
      <div className="w-full mx-auto text-center">
        <h1 className="font-larken text-[52px] font-[400] leading-[60px]">Governance</h1>
        <p className="mx-auto w-full max-w-[332px] font-[500] leading-[24px] text-[#959595]">
          Shape the future of Torque by delegating vote power to yourself or a
          trusted entity.
        </p>
      </div>
      <OptionToken />
      <div className="mt-[24px] flex items-start justify-between">
        <Proposals />
        <VotingPower />
      </div>
    </div>
  )
}
