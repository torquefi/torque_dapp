import React from 'react'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import { NumericFormat } from 'react-number-format'
import { toMetricUnits } from '@/lib/helpers/number'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export const For = (props: any) => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { votesInfo } = props

  const votesFor =
    Number(
      new BigNumber(
        ethers.utils.formatUnits(votesInfo?.forVotes || 0, 18)
      )
    )
  const voteForAgainst = Number(
    new BigNumber(
      ethers.utils.formatUnits(votesInfo?.againstVotes || 0, 18)
    )
  )

  const percentVoteFor = (votesFor + voteForAgainst) ? votesFor / (voteForAgainst + votesFor) * 100 : 0

  console.log('percentVoteFor :>> ', percentVoteFor);
  return (
    <div className="font-larken rounded-xl border border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 pb-4 px-[18px] py-[0px] md:px-[24px] text-[#030303] md:w-[49%] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-[400] leading-[60px]">For</h2>
        <p className="font-mona font-[500] font-medium leading-[24px] text-[#1EB26B]">
          {votesInfo?.forVotes
            ? toMetricUnits(
              Number(
                new BigNumber(
                  ethers.utils.formatUnits(votesInfo?.forVotes, 18)
                )
              )
            )
            : '0.00'}
        </p>
      </div>
      <div className="relative h-[4px] w-full bg-[#1eb26b55]">
        <div className={`absolute h-[4px] bg-[#1eb26b] ${percentVoteFor ? percentVoteFor >= 100 ? 'w-full' : `w-[${Math.floor(percentVoteFor)}%]` : 'w-[1%]'}`}
          style={{
            width:
              percentVoteFor ? Math.round(
                percentVoteFor
              ) + '%' : '0%',
          }}
        ></div>
      </div>
      {/* <div className={`mt-[24px] hidden h-[1px] w-full md:block ` + `${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
        }`} /> */}
      {/* <table className="w-full">
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
      </table> */}
      {/* <div className={`mt-[0px] hidden h-[1px] w-full md:block ` + `${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
        }`}></div>
      <div className="mt-[12px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595] font-mona">
        view all
      </div> */}
    </div>
  )
}

const menu = [
  { delegates: '0x123..4567', votes: '0.00' },
  { delegates: '0x123..4567', votes: '0.00' },
  { delegates: '0x123..4567', votes: '0.00' },
]
