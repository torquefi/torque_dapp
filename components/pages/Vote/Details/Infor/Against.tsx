import React from 'react'

export const Against = () => {
  return (
    <div className="mt-[24px] w-full rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[56px] py-[17px] md:mt-0 md:w-[49%]">
      <div className="mx-auto w-full py-[58px]">
        <img
          src="/assets/pages/vote/genover/noproposal.png"
          alt=""
          className="mx-auto w-full max-w-[132px]"
        />
        <h3 className="font-larken mt-[35px] text-center text-[28px] font-[400] leading-[34px]">
          No proposals yet
        </h3>
        <p className="mx-auto mt-[6px] w-full max-w-[320px] text-[18px] font-[500] text-[#959595]">
          Stay tuned for the launch of TORQ, our deflationary governance token.
        </p>
      </div>
      {/* <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-[400] leading-[60px]">Against</h2>
        <p className="font-[500] leading-[24px] text-[#F05858]">682</p>
      </div>
      <div className="relative h-[4px] w-full bg-[#F058584D]">
        <div className="absolute h-[4px] w-[5%] bg-[#F05858]"></div>
      </div>
      <div className="gradient-border mt-[31px] hidden h-[1px] w-full md:block"></div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-[50%] py-[16px] text-left font-[500] leading-[24px] text-[#959595]">
              25 Delegates
            </th>
            <th className="w-[50%] py-[16px] text-right font-[500] leading-[24px] text-[#959595]">
              Votes
            </th>
          </tr>
        </thead>

        {menu.map((item, i) => (
          <tbody>
            <tr className="relative">
              <td className="py-[16px] text-left">{item.delegates}</td>
              <td className="py-[16px] text-right">{item.votes}</td>
              <div className="gradient-border absolute left-0 hidden h-[1px] w-full md:block"></div>
            </tr>
          </tbody>
        ))}
      </table>
      <div className="gradient-border mt-[24px] hidden h-[1px] w-full md:block"></div> */}
      {/* <div className="mt-[18px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595]">
        view all
      </div> */}
    </div>
  )
}

const menu = [{ delegates: '0x123..4567', votes: '0.00' }]
