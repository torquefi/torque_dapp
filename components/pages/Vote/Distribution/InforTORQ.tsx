import React from 'react'

export const InforTORQ = () => {
  return (
    <div className="mt-[42px] items-center justify-between px-[15%] md:flex md:px-0">
      <div className="w-full rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[36px] py-[20px] text-center md:w-[32%]">
        <h4 className="text-[24px] font-larken font-[400] leading-[40px]">0.00</h4>
        <p className="font-[500] leading-[24px] text-[#959595]">
          TORQ Per Day
        </p>
      </div>
      <div className="mt-[20px] w-full rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[36px] py-[20px] text-center md:mt-0 md:w-[32%]">
        <h4 className="text-[24px] font-larken font-[400] leading-[40px]">0.00</h4>
        <p className="font-[500] leading-[24px] text-[#959595]">
          TORQ Distributed
        </p>
      </div>
      <div className="mt-[20px] w-full rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[36px] py-[20px] text-center md:mt-0 md:w-[32%]">
        <h4 className="text-[24px] font-larken font-[400] leading-[40px]">240,000,000</h4>
        <p className="font-[500] leading-[24px] text-[#959595]">
          TORQ Remaining
        </p>
      </div>
    </div>
  )
}
