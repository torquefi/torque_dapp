import SkeletonDefault from '@/components/skeleton'
import { useEffect, useMemo, useState } from 'react'
import ManageStaking from './ManageStaking'
import StakingPool from './StakingPool'
import Web3 from 'web3'
import { stakeTorqContract, tokenTorqContract } from '@/constants/contracts'
import { ethers } from 'ethers'
import NumberFormat from '@/components/common/NumberFormat'

export const StakePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [totalStaked, setTotalStaked] = useState<string | number>(0)
  const [totalDistributed, setTotalDistributed] = useState<string | number>(0)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const stakingContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(stakeTorqContract?.abi),
      stakeTorqContract.address
    )
    return contract
  }, [Web3.givenProvider, stakeTorqContract])

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenTorqContract.abi),
      tokenTorqContract?.address
    )
    return contract
  }, [Web3.givenProvider, tokenTorqContract])

  const handleGetTotalStaked = async () => {
    try {
      const decimals = await tokenContract.methods.decimals().call()
      const response = await stakingContract.methods.torqStake().call()
      const totalStaked = ethers.utils
        .formatUnits(response, decimals)
        .toString()
      setTotalStaked(totalStaked)
    } catch (error) {
      console.log('get total stake full', error)
    }
  }

  const handleGetTotalDistributed = async () => {
    try {
      const decimals = await tokenContract.methods.decimals().call()
      const response = await stakingContract.methods.torqDistribute().call()
      const totalDistributed = ethers.utils
        .formatUnits(response, decimals)
        .toString()
      setTotalDistributed(totalDistributed)
    } catch (error) {
      console.log('get total stake full', error)
    }
  }

  useEffect(() => {
    handleGetTotalStaked()
    handleGetTotalDistributed()
  }, [stakingContract, tokenContract])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="flex w-full items-center justify-center font-larken text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={totalStaked}
                decimalScale={2}
              />
            </div>
            <div className="text-[#959595]">TORQ Staked</div>
          </div>
        )}

        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">0.00%</div>
            <div className="text-[#959595]">Supply Staked</div>
          </div>
        )}

        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">0.00</div>
            <div className="text-[#959595]">TORQ LP Staked</div>
          </div>
        )}
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#16161679] p-8">
            <div className="font-larken text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={totalDistributed}
                decimalScale={5}
              />
            </div>
            <div className="text-[#959595]">TORQ Distributed</div>
          </div>
        )}
      </div>

      <div className="mt-[36px] font-larken">
        <div className="font-larken text-[32px]">
          {isLoading ? (
            <div className="">
              <SkeletonDefault height={'5vh'} width={'16%'} />
            </div>
          ) : (
            <div className="text-[24px]">Staking Pools</div>
          )}
        </div>

        <StakingPool />
      </div>
      <ManageStaking />
    </>
  )
}
