import React from 'react'

export const VotingPower = () => {
  return (
    <div className="w-[39%] rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[38px] py-[15px]">
      <div className="flex items-center justify-between">
        <h2>Voting Power</h2>
        <button>
          <img src="/assets/pages/vote/ic-info.svg" alt="" />
        </button>
      </div>
      <div className="gradient-border mt-2 hidden h-[1px] w-full md:block"></div>
      <div className="grid h-auto w-full  grid-cols-2 gap-2 overflow-y-auto py-[18px]">
        <div className="bg-claim-reward flex h-[102px] flex-col items-center justify-center rounded-[8px] border-[1px] border-[#1A1A1A]">
          <div className="font-larken text-[24px] text-[#404040] dark:text-white">
            0.00
          </div>
          <div className="mt-2 text-[15px] text-[#959595]">Your Power</div>
        </div>
        <div className="bg-claim-reward flex h-[102px] flex-col items-center justify-center rounded-[8px] border-[1px] border-[#1A1A1A]">
          <div className="font-larken text-[24px] text-[#404040] dark:text-white">
            $0.00
          </div>
          <div className="mt-2 text-[15px] text-[#959595]">Your Value</div>
        </div>
      </div>
      <button
        className={`font-mona w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        `}
      >
        Delegate votes
      </button>
      <button
        className={`font-mona mt-2 w-full rounded-full border border-[#AA5BFF] bg-transparent py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        `}
      >
        acquire torq
      </button>
    </div>
  )
}
