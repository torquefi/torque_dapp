import React from 'react'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export const For = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="mt-[12px] rounded-xl border border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white px-[24px] py-[12px] md:mt-0 md:w-[49%] font-larken">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-[400] leading-[60px]">For</h2>
        <p className="font-[500] leading-[24px] text-[#1EB26B] font-mona font-medium">0.00</p>
      </div>
      <div className="relative h-[4px] w-full bg-[#1eb26b55]">
        <div className="absolute h-[4px] w-[1%] bg-[#1eb26b]"></div>
      </div>
      <div className={`mt-[24px] hidden h-[1px] w-full md:block ` + `${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
        }`} />
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-[50%] py-[12px] text-left font-[500] leading-[24px] text-[#959595] font-mona">
              No voters yet
            </th>
            <th className="w-[50%] py-[12px] text-right font-[500] leading-[24px] text-[#959595] font-mona">
              Votes
            </th>
          </tr>
        </thead>

        {menu.map((item, i) => (
          <tbody key={i}>
            <tr className="relative">
              <td className="py-[12px] text-left">{item.delegates}</td>
              <td className="py-[12px] text-right">{item.votes}</td>
              <div className={`absolute left-0 hidden h-[1px] w-full md:block ` + `${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
                }`} />
            </tr>
          </tbody>
        ))}
      </table>
      <div className={`mt-[0px] hidden h-[1px] w-full md:block ` + `${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
        }`}></div>
      <div className="mt-[12px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595] font-mona">
        view all
      </div>
    </div >
  )
}

const menu = [
  { delegates: '0x123..4567', votes: '0.00' },
  { delegates: '0x123..4567', votes: '0.00' },
  { delegates: '0x123..4567', votes: '0.00' },
]
