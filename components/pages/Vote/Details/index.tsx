import React, { useEffect, useMemo, useState } from 'react'
import { InforVotes } from './Infor'
import { MainContent } from './MainContent'
import SkeletonDefault from '@/components/skeleton'
import { useRouter } from 'next/router'
import { useAppSelector } from '@/lib/redux/store'
import Web3 from 'web3'
import { hamiltonContractInfo } from '../constants/contracts'

export const DetailsVotes = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [tipDetails, setTipDetails] = useState(null)
  const router = useRouter()
  const { id } = router?.query
  const { tipData } = useAppSelector((state) => state.tips)
  const [votesInfo, setVotesInfo] = useState<any>({})

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  useEffect(() => {
    try {
      const data = tipData.find((tip) => tip?.id.toString() === id)
      if (data) {
        setTipDetails(data)
      } else {
      }
    } catch (error) { }
  }, [id, tipData])

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
      const response = await hamiltonContract.methods.proposalVotes(tipDetails?.proposalId).call()
      setVotesInfo(response)
      console.log('response :>> ', response);
    } catch (error) {
      console.log('handleGetVotesInfo error :>> ', error);
    }
  }

  useEffect(() => {
    if (hamiltonContract && tipDetails?.proposalId) {
      handleGetVotesInfo()
    }
  }, [tipDetails, hamiltonContract])

  if (isLoading) {
    return (
      <div className="mt-0 md:mt-[-16px]">
        <div className="mx-auto w-full rounded-full mb-4 max-w-[340px]">
          <SkeletonDefault className="h-[56px]" />
        </div>

        <div className="mx-auto w-full rounded-full max-w-[340px]">
          <SkeletonDefault className="h-[56px]" />
        </div>

        <div className="mx-auto w-full max-w-[740px]">
          <div className="mt-[32px] justify-between md:flex">
            <div className="w-full rounded-[24px] md:w-[49%]">
              <SkeletonDefault className="h-[90px]" />
            </div>
            <div className="mt-[20px] w-full rounded-[24px] md:mt-[0px] md:w-[49%]">
              <SkeletonDefault className="h-[90px]" />
            </div>
          </div>

          <div className="mt-[26px] w-full rounded-[48px]">
            <SkeletonDefault className="h-[400px]" />
          </div>
        </div>
      </div >
    )
  }

  return (
    <div className="mx-auto mt-0 md:mt-[-16px] w-full text-center max-w-[740px]">
      <h1 className="font-larken mx-auto mt-4 w-full text-[28px] font-[400] leading-[23px] text-[#030303] dark:text-white md:text-[36px] md:leading-[44px]">
        {tipDetails?.title}
      </h1>
      <div className="mt-[14px]">
        <div className="mx-auto flex items-center justify-center gap-[8px]">
          {tipDetails?.stage === 'Active' && (
            <div className="rounded-[6px] bg-[#1eb26b55] px-[12px] py-[2px] text-[12px] font-[500] uppercase text-[#1EB26B]">
              Active
            </div>
          )}
          {tipDetails?.stage === 'Pending' && (
            <div className="rounded-[6px] bg-[#FF9C414D] px-[12px] py-[2px] text-[12px] font-[500] uppercase text-[#FF9C41]">
              Pending
            </div>
          )}
          <p className="font-[500] text-[#959595]">TIP-{id}</p>
          <div className="h-[5px] w-[5px] rounded-full bg-[#959595]"></div>
          <p className="font-[500] text-[#959595]">{tipDetails?.timeVote}</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[740px]">
        <InforVotes votesInfo={votesInfo} />
        <MainContent />
      </div>
    </div>
  )
}
