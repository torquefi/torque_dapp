import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export const DetailsAndStages = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="mt-[24px] w-full md:mt-0 md:w-[43%]">
      <div className="rounded-[12px] border border-[#E6E6E6] bg-[#ffffff]  from-[#0d0d0d] to-[#0d0d0d]/0 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white px-[10px] pt-[9px] pb-[14px] md:px-[24px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] text-[#030303] dark:text-white font-rogan font-[400] mt-2">Details</h2>
          <button>
            <img src="/assets/pages/vote/ic-info.svg" alt="" />
          </button>
        </div>
        <div className={`mt-4 h-[1px] w-full block` + `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>

        <div className="flex items-center gap-[6px] mt-4 mb-2">
          <h4 className="text-[14px] text-[#959595] font-[400] leading-[20px] md:text-[18px]">
            1)
          </h4>
          <p className="ml-2 whitespace-nowrap text-[12px] font-[500] text-[#959595] md:text-[16px]">
            Transfer message to the Hamilton governor
          </p>
        </div>
        <div className="flex items-center gap-[6px]">
          <h4 className="text-[14px] text-[#959595] font-[400] leading-[20px] md:text-[18px] md:leading-[60px]">
            a)
          </h4>
          <p className="ml-2 w-full w-auto max-w-[400px] whitespace-nowrap rounded-[8px] bg-[#AA5BFF4D] px-[12px] py-[10px] text-[12px] font-[500] text-[#959595] md:text-[16px]">
            <span className="text-[#AA5BFF]">Configurator."function"</span>
            ("params")
          </p>
        </div>
        <div className="flex items-center gap-[6px] md:mt-0">
          <h4 className="text-[14px] text-[#959595] font-[400] leading-[20px] md:text-[18px] md:leading-[60px]">
            b)
          </h4>
          <p className="ml-2 w-full max-w-[400px w-auto whitespace-nowrap rounded-[8px] bg-[#AA5BFF4D] px-[12px] py-[10px] text-[12px] font-[500] text-[#959595] md:text-[16px]">
            <span className="text-[#AA5BFF]">Configurator."function"</span>
            ("params")
          </p>
        </div>
        <div className={`mt-4 h-[1px] w-full block` + `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
        <div className="mt-[12px] flex justify-between">
          <p className="font-[500] text-[#959595]">Proposer</p>
          <p className="font-rogan-regular text-[#959595]">0x123..4567</p>
        </div>
      </div>
      <div className="mt-[24px] rounded-[12px] border border-[#E6E6E6] bg-[#ffffff]  from-[#0d0d0d] to-[#0d0d0d]/0 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white pt-[9px] pb-[16px] px-[24px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] text-[#030303] dark:text-white font-rogan font-[400] mt-2">Stages</h2>
          <button>
            <img src="/assets/pages/vote/ic-info.svg" alt="" />
          </button>
        </div>
        <div className={`mt-4 h-[1px] w-full block` + `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>

        <div className="mt-[18px]">
          <div className="flex items-center gap-[18px] justify-between">
            <div className="flex items-center gap-[18px] justify-between">
            <div className="rounded-full bg-[#FF9C414D] px-[5px] py-[5px] text-[#FF9C41]">
              <FaCheck />
            </div>
            <div className="flex flex-col">
            <h3 className="text-left font-rogan text-[#030303] dark:text-white text-[18px] font-[400]">Pending</h3>
            <p className="text-left text-[#959595] text-[14px]">Date</p>
            </div>
            </div>
          <button>
            <img src="/assets/pages/vote/maincontent/ic-link.png" alt="" />
          </button>
          </div>
        </div>

        <div className="mt-[18px]">
          <div className="flex items-center gap-[18px] justify-between">
            <div className="flex items-center gap-[18px] justify-between">
            <div className="rounded-full bg-[#1EB26B4D] px-[5px] py-[5px] text-[#1EB26B]">
              <FaCheck />
            </div>
            <div className="flex flex-col">
            <h3 className="text-left font-rogan text-[#030303] dark:text-white text-[18px] font-[400]">Active</h3>
            <p className="text-left text-[#959595] text-[14px]">Date</p>
            </div>
            </div>
          <button>
            <img src="/assets/pages/vote/maincontent/ic-link.png" alt="" />
          </button>
          </div>
        </div>

        <div className="mt-[18px]">
          <div className="flex items-center gap-[18px] justify-between">
            <div className="flex items-center gap-[18px] justify-between">
            <div className="rounded-full bg-[#AA5BFF4D] px-[5px] py-[5px] text-[#AA5BFF]">
              <FaCheck />
            </div>
            <div className="flex flex-col">
            <h3 className="text-left font-rogan text-[#030303] dark:text-white text-[18px] font-[400]">Executed</h3>
            <p className="text-left text-[#959595] text-[14px]">Date</p>
            </div>
            </div>
          <button>
            <img src="/assets/pages/vote/maincontent/ic-link.png" alt="" />
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}
