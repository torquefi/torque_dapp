import { toMetricUnits } from '@/lib/helpers/number'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'
import { hamiltonContractInfo } from '../constants/contracts'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export const ProposalsItem = (props: any) => {
  const { menu } = props
  console.log(menu)
  const [votesInfo, setVotesInfo] = useState<any>({})

  const votesFor =
    Number(
      new BigNumber(
        ethers.utils.formatUnits(votesInfo?.forVotes || 0, 18)
      )
    )
  console.log('votesFor :>> ', votesFor)
  const voteForAgainst = Number(
    new BigNumber(
      ethers.utils.formatUnits(votesInfo?.againstVotes || 0, 18)
    )
  )
  console.log('voteForAgainst :>> ', voteForAgainst)

  const theme = useSelector((store: AppStore) => store.theme.theme)

  let classnamesState =
    'rounded-[6px] bg-[#ff9c4155] px-[12px] py-[1px] text-[14px] font-[500] uppercase text-[#1EB26B]'
  if (menu.stage === 'Active') {
    classnamesState =
      'rounded-[6px] bg-[#1eb26b55] px-[12px] py-[1px] text-[14px] font-[500] uppercase text-[#1EB26B]'
  } else if (menu.stage === 'Pending') {
    classnamesState =
      'rounded-[6px] bg-[#ff9c4155] px-[12px] py-[1px] text-[14px] font-[500] uppercase text-[#FF9C41]'
  } else if (menu.stage === 'Complete') {
    classnamesState =
      'rounded-[6px] bg-[#ff3e3e55] px-[12px] py-[1px] text-[14px] font-[500] uppercase text-[#F05858]'
  } else if (menu.stage === 'Passed') {
    classnamesState =
      'rounded-[6px] bg-[#aa5bff55] px-[12px] py-[1px] text-[14px] font-[500] uppercase text-[#C38BFF]'
  }

  const hamiltonContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(hamiltonContractInfo?.abi),
      hamiltonContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, hamiltonContractInfo])

  const handleGetVotesInfo = async () => {
    try {
      const response = await hamiltonContract.methods.proposalVotes(menu?.proposalId).call()
      setVotesInfo(response)
      console.log('response :>> ', response)
    } catch (error) {
      console.log('handleGetVotesInfo error :>> ', error)
    }
  }

  useEffect(() => {
    if (hamiltonContract && menu?.proposalId) {
      handleGetVotesInfo()
    }
  }, [menu, hamiltonContract])

  const percentVoteFor = (votesFor + voteForAgainst) ? votesFor / (voteForAgainst + votesFor) * 100 : 0
  const percentVoteAgainst = (votesFor + voteForAgainst) ? voteForAgainst / (voteForAgainst + votesFor) * 100 : 0

  return (
    <Link href={menu.url} legacyBehavior>
      <a target="_blank" rel="noopener noreferrer" className="block mt-[10px] cursor-pointer transition-all duration-100 ease-linear hover:opacity-70">
        <div className="items-center justify-between lg:flex">
          <div className="sm:mt-[0px] md:mt-0 lg:w-[60%]">
            <h4 className="font-rogan text-[24px] md:text-[20px] truncate ... font-[400] leading-[40px] text-[#030303] dark:text-white">
              {menu.title}
            </h4>
            <div className="flex items-center gap-[8px] mt-2 md:mt-0">
              <div className={classnamesState}>
                {menu.stage}
              </div>
              <p className="font-[500] text-[#959595] text-[16px] whitespace-nowrap">
                TIP-{menu.id}
              </p>
              <div className="h-[5px] w-[5px] rounded-full bg-[#959595]"></div>
              <p className="font-[500] text-[#959595] text-[16px] whitespace-nowrap">
                {menu.timeVote}
              </p>
            </div>
          </div>

          <div className="mt-[10px] lg:w-[40%]">
            <div className="flex w-full items-center justify-start gap-[8px] lg:justify-end">
              <p className="text-[14px] font-[500] text-[#1EB26B]">
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
              <div className="relative h-[4px] w-full max-w-[160px] rounded-[12px]">
                {voteForAgainst === 0 && votesFor === 0 ? (
                  <>
                    <div className="absolute left-0 h-[4px] w-[50%] rounded-[12px] rounded-br-none rounded-tr-none bg-[#1EB26B] "></div>
                    <div className="absolute right-0 h-[4px] w-[50%] rounded-[12px] rounded-bl-none rounded-tl-none bg-[#F05858]"></div>
                  </>
                ) : (
                  <>
                    <div
                      className="absolute left-0 h-[4px] rounded-[12px] bg-[#1EB26B]"
                      style={{
                        width:
                          (votesFor + voteForAgainst) ? Math.round(
                            (votesFor / (votesFor + voteForAgainst)) *
                            100
                          ) + '%' : '0%',
                      }}
                    ></div>
                    <div
                      className="absolute right-0 h-[4px] rounded-[12px] bg-[#F05858]"
                      style={{
                        width:
                          (votesFor + voteForAgainst) ? Math.round(
                            (voteForAgainst / (votesFor + voteForAgainst)) *
                            100
                          ) + '%' : '0%',
                      }}
                    ></div>
                  </>
                )}
              </div>
              <p className="text-[14px] font-[500] text-[#F05858]">
                {votesInfo?.againstVotes
                  ? toMetricUnits(
                    Number(
                      new BigNumber(
                        ethers.utils.formatUnits(votesInfo?.againstVotes, 18)
                      )
                    )
                  )
                  : '0.00'}
              </p>
            </div>
            <p className="text-left font-[500] leading-[24px] text-[#959595] lg:text-right">
              {(votesFor + voteForAgainst) > 0 ? toMetricUnits(Number(votesFor + voteForAgainst)) : '0.00'} total votes
            </p>
          </div>
        </div>
        <div
          className={
            `mt-3 h-[1px] w-full md:block` +
            `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
            }`
          }
        ></div>
      </a>
    </Link>
  )
}
