import React from 'react'
import { FaCheck } from 'react-icons/fa'

export const DetailsAndStages = () => {
  return (
    <div className="mt-[24px] w-full md:mt-0 md:w-[43%]">
      <div className="rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[10px] py-[9px] md:px-[30px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-[400] leading-[60px]">Details</h2>
          <button>
            <img src="/assets/pages/vote/ic-info.svg" alt="" />
          </button>
        </div>
        <div className="gradient-border mt-[26px] hidden h-[1px] w-full md:block"></div>

        <div className="flex items-center gap-[7px]">
          <h4 className="text-[14px] font-[400] leading-[20px] md:text-[18px] md:leading-[60px]">
            1)
          </h4>
          <p className="whitespace-nowrap text-[12px] font-[500] text-[#959595] md:text-[16px]">
            Transfer new message to the Hamilton governor
          </p>
        </div>
        <div className="flex items-center gap-[7px]">
          <h4 className="text-[14px] font-[400] leading-[20px] md:text-[18px] md:leading-[60px]">
            a)
          </h4>
          <p className="w-full max-w-[400px] whitespace-nowrap rounded-[12px] bg-[#AA5BFF4D] px-[12px] py-[10px] text-[12px] font-[500] text-[#959595] md:text-[16px]">
            <span className="text-[#AA5BFF]">Configurator.setSupplySpeed</span>
            (“tETH”, 50000000..)
          </p>
        </div>
        <div className="mt-[10px] flex items-center gap-[7px] md:mt-0">
          <h4 className="text-[14px] font-[400] leading-[20px] md:text-[18px] md:leading-[60px]">
            b)
          </h4>
          <p className="w-full max-w-[400px] whitespace-nowrap rounded-[12px] bg-[#AA5BFF4D] px-[12px] py-[10px] text-[12px] font-[500] text-[#959595] md:text-[16px]">
            <span className="text-[#AA5BFF]">Configurator.setSupplySpeed</span>
            (“tUSD”, 50000000..)
          </p>
        </div>
        <div className="gradient-border mt-[22px] hidden h-[1px] w-full md:block"></div>

        <div className="mt-[14px] flex justify-between">
          <p className="font-[500] leading-[60px] text-[#959595]">Proposer</p>
          <div className="flex items-center gap-[9px]">
            <img src="/assets/pages/vote/distribution/btc.png" alt="" />
            <p className="font-larken">Phantom</p>
          </div>
        </div>
      </div>
      <div className="mt-[19px] rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[10px] py-[9px] md:px-[30px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-[400] leading-[60px]">Stages</h2>
          <button>
            <img src="/assets/pages/vote/ic-info.svg" alt="" />
          </button>
        </div>
        <div className="gradient-border mt-[26px] hidden h-[1px] w-full md:block"></div>

        <div className="mt-[29px]">
          <div className="flex items-center gap-[18px]">
            <div className="rounded-full bg-[#FF9C414D] px-[5px] py-[5px] text-[#FF9C41]">
              <FaCheck />
            </div>
            <h3 className="font-larken text-[18px] font-[400]">Pending</h3>
          </div>
          <div className="ml-[42px] flex items-center justify-between">
            <p className="text-[#959595]">October 20th, 2023</p>
            <button>
              <img src="/assets/pages/vote/maincontent/ic-link.png" alt="" />
            </button>
          </div>
        </div>

        <div className="mt-[29px]">
          <div className="flex items-center gap-[18px]">
            <div className="rounded-full bg-[#1EB26B4D] px-[5px] py-[5px] text-[#1EB26B]">
              <FaCheck />
            </div>
            <h3 className="font-larken text-[18px] font-[400]">Active</h3>
          </div>
          <div className="ml-[42px] flex items-center justify-between">
            <p className="text-[#959595]">October 21st, 2023</p>
            <button>
              <img src="/assets/pages/vote/maincontent/ic-link.png" alt="" />
            </button>
          </div>
        </div>

        <div className="mt-[29px]">
          <div className="flex items-center gap-[18px]">
            <div className="rounded-full bg-[#AA5BFF4D] px-[5px] py-[5px] text-[#AA5BFF]">
              <FaCheck />
            </div>
            <h3 className="font-larken text-[18px] font-[400]">Executed</h3>
          </div>
          <div className="ml-[42px] flex items-center justify-between">
            <p className="text-[#959595]">October 26th, 2023</p>
            <button>
              <img src="/assets/pages/vote/maincontent/ic-link.png" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
