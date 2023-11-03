import SkeletonDefault from '@/components/skeleton'
import { useEffect, useMemo, useState } from 'react'
import ManageStaking from './ManageStaking'
import StakingPool from './StakingPool'
import Web3 from 'web3'
import {
  stakeLpContract,
  stakeTorqContract,
  tokenLpContract,
  tokenTorqContract,
} from '@/constants/contracts'
import { ethers } from 'ethers'
import NumberFormat from '@/components/common/NumberFormat'

export const StakePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [totalStaked, setTotalStaked] = useState<string | number>(0)
  const [totalLpStaked, setTotalLpStaked] = useState<string | number>(0)
  const [totalDistributed, setTotalDistributed] = useState<string | number>(0)
  const [totalSupply, setTotalSupply] = useState<string | number>(0)
  const [isRefresh, setIsRefresh] = useState(false)

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

  const stakingLpContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(stakeLpContract?.abi),
      stakeLpContract.address
    )
    return contract
  }, [Web3.givenProvider, stakeLpContract])

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenTorqContract.abi),
      tokenTorqContract?.address
    )
    return contract
  }, [Web3.givenProvider, tokenTorqContract])

  const lpContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenLpContract.abi),
      tokenLpContract?.address
    )
    return contract
  }, [Web3.givenProvider, tokenLpContract])

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

  const handleGetTotalLpStaked = async () => {
    try {
      const decimals = await lpContract.methods.decimals().call()
      const response = await stakingLpContract.methods.lpTorqStake().call()
      const totalStaked = ethers.utils
        .formatUnits(response, decimals)
        .toString()
      setTotalLpStaked(totalStaked)
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
    ; (async () => {
      try {
        const decimals = await tokenContract.methods.decimals().call()
        const response = await tokenContract.methods.totalSupply().call()
        const totalSupply = ethers.utils
          .formatUnits(response, decimals)
          .toString()
        setTotalSupply(totalSupply)
      } catch (error) {
        console.log('get total stake full', error)
      }
    })()
  }, [tokenContract])

  useEffect(() => {
    handleGetTotalStaked()
    handleGetTotalDistributed()
    handleGetTotalLpStaked()
  }, [stakingContract, tokenContract, stakingLpContract, lpContract, isRefresh])

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border bg-[#FFFFFF] from-[#161616] to-[#16161679] p-8 text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:text-white">
            <div className="font-larken flex w-full items-center justify-center text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={totalStaked}
                decimalScale={2}
                fixedDecimalScale
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
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border bg-[#FFFFFF] from-[#161616] to-[#16161679] p-8 text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:text-white">
            <div className="font-larken text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={
                  totalSupply
                    ? (Number(totalStaked) / Number(totalSupply)) * 100
                    : 0
                }
                decimalScale={2}
                fixedDecimalScale
              />
              %
            </div>
            <div className="text-[#959595]">Supply Staked</div>
          </div>
        )}

        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border bg-[#FFFFFF] from-[#161616] to-[#16161679] p-8 text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:text-white">
            <div className="font-larken text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={totalLpStaked}
                decimalScale={2}
                fixedDecimalScale
              />
            </div>
            <div className="text-[#959595]">TORQ LP Staked</div>
          </div>
        )}
        {isLoading ? (
          <div className="">
            <SkeletonDefault height={'18vh'} width={'100%'} />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[12px] border bg-[#FFFFFF] from-[#161616] to-[#16161679] p-8 text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:text-white">
            <div className="font-larken text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={totalDistributed}
                decimalScale={2}
                fixedDecimalScale
              />
            </div>
            <div className="text-[#959595]">TORQ Distributed</div>
          </div>
        )}
      </div>

      <div className="font-larken mt-[36px]">
        <div className="font-larken text-[32px]">
          {isLoading ? (
            <div className="">
              <SkeletonDefault height={'5vh'} width={'16%'} />
            </div>
          ) : (
            <div className="Staking Pools text-[24px]">Staking Pools</div>
          )}
        </div>

        <StakingPool setIsRefresh={setIsRefresh} />
      </div>
      <ManageStaking isRefresh={isRefresh} />
    </div>
  )
}
