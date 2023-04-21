import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import SkeletonDefault from '@/components/skeleton'
import { stakeLpContract } from '@/constants/contracts'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import InputCurrencySwitch from '../InputCurrencySwitch'
import { IStakingInfo } from '../types'
import CurrencySwitch from '../CurrencySwitch'

interface StakingPoolItemProps {
  stakeInfo: IStakingInfo
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StakingPoolItem({
  stakeInfo,
  setIsRefresh,
}: StakingPoolItemProps) {
  const { address, isConnected } = useAccount()
  const [isLoading, setLoading] = useState(true)
  const [isSubmitLoading, setSubmitLoading] = useState(false)
  const [apr, setApr] = useState<string | number>(0)
  const [isShowUsd, setShowUsd] = useState(true)
  const [tokenPrice, setTokenPrice] = useState<any>(0)

  const [amount, setAmount] = useState<number>(0)

  const isDisabled = !amount || +amount < 0

  const lpContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(stakeLpContract.abi),
      stakeLpContract.address
    )
    return contract
  }, [Web3.givenProvider, stakeLpContract])

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(stakeInfo?.tokenContract.abi),
      stakeInfo?.tokenContract.address
    )
    return contract
  }, [Web3.givenProvider, stakeInfo?.symbol])

  const stakingContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(stakeInfo?.stakeContract.abi),
      stakeInfo?.stakeContract.address
    )
    return contract
  }, [Web3.givenProvider, stakeInfo?.symbol])

  const stakeToken = async () => {
    if (!isConnected) {
      return toast.error('You need connect your wallet first')
    }
    if (!+amount) {
      return toast.error('You must input amount to deposit')
    }
    setSubmitLoading(true)
    try {
      const allowance = await handleGetAllowance()
      if (!+allowance) {
        await tokenContract.methods
          .approve(
            stakeInfo?.stakeContract?.address,
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
          )
          .send({ from: address })
      }

      const decimals = await tokenContract.methods.decimals().call()
      const tokenAmount = ethers.utils
        .parseUnits(amount.toString(), decimals)
        .toString()

      await stakingContract.methods.deposit(tokenAmount).send({ from: address })
      toast.success('Deposit successfully')
      setIsRefresh((isRefresh) => !isRefresh)
      setAmount(0)
    } catch (error) {
      console.log('Staking.DepositModal.approveToken', error)
    }

    setSubmitLoading(false)
  }

  const handleGetAllowance = async () => {
    try {
      const allowanceToken = await tokenContract.methods
        .allowance(address, stakeInfo?.stakeContract?.address)
        .call()
      const decimals = await tokenContract.methods.decimals().call()
      const allowance = ethers.utils
        .formatUnits(allowanceToken, decimals)
        .toString()

      return allowance
    } catch (error) {
      console.log('Staking.DepositModal.handleGetAllowance', error)
      return 0
    }
  }

  useEffect(() => {
    handleGetAllowance()
  }, [tokenContract, isConnected])

  useEffect(() => {
    ;(async () => {
      try {
        const response = await stakingContract.methods.apr().call()
        setApr(response / 100)
      } catch (error) {
        console.log('error :>> ', error)
      }
    })()
  }, [stakingContract])

  useEffect(() => {
    ;(async () => {
      try {
        const decimals = await tokenContract.methods.decimals().call()
        const amount = ethers.utils.parseUnits('1', decimals).toString()
        const response = await lpContract.methods
          .getUSDPrice(stakeInfo.tokenContract.address, amount)
          .call()
        const tokenPrice = ethers.utils.formatUnits(response, 6).toString()
        setTokenPrice(tokenPrice)
      } catch (error) {
        console.log('error 123:>> ', error)
      }
    })()
  }, [tokenContract, lpContract, isConnected])

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="">
        <SkeletonDefault height={'40vh'} width={'100%'} />
      </div>
    )
  }

  return (
    <div className="rounded-[12px] border from-[#0d0d0d] to-[#0d0d0d]/0 px-8 py-6 text-[#404040] dark:border-[#1A1A1A] dark:bg-gradient-to-br dark:text-white">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={`/assets/t-logo-circle.svg`}
            alt=""
            className="xs:w-26 m-2 w-12 lg:w-[64px]"
          />
          <div className="font-larken grow pb-2 text-[16px] leading-tight xs:text-[18px] lg:text-[26px]">
            Deposit {stakeInfo.label},
            <br className="" /> Earn TORQ
          </div>
        </div>
        <div className="flex items-center rounded-full bg-[#AA5BFF] bg-opacity-20 p-1 text-[12px] xs:text-[14px]">
          <img
            src="/assets/t-logo-circle.svg"
            alt=""
            className="w-[24px] xs:w-[28px]"
          />
          <Link href={'#'} target="_blank">
            <div className="font-mona mx-1 uppercase text-[#AA5BFF] xs:mx-2">
              get {stakeInfo.label}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-4 flex w-full items-center justify-center gap-4 ">
        <div className="flex h-[140px] w-1/2 flex-col items-center justify-center gap-3 rounded-md border from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b">
          <InputCurrencySwitch
            tokenSymbol={stakeInfo?.symbol}
            tokenValue={+amount}
            usdDefault
            className="w-full py-4 lg:py-6"
            decimalScale={2}
            subtitle="Your Stake"
            onChange={(e) => {
              setAmount(e)
            }}
            onSetShowUsd={setShowUsd}
            tokenPrice={tokenPrice}
          />
        </div>
        <div className="flex h-[140px] w-[50%] flex-col items-center justify-center rounded-md border from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-gradient-to-b">
          <CurrencySwitch
            tokenSymbol={stakeInfo?.symbol}
            tokenValue={(+(amount || 0) * 3 * Number(apr)) / 10000 || 0}
            usdDefault
            className="w-full space-y-2 py-6 py-[23px] lg:py-[31px]"
            decimalScale={2}
            tokenPrice={tokenPrice}
            render={(value) => (
              <>
                <p className="text-[32px] leading-none">{value}</p>
                <div className="font-mona text-[16px] text-[#959595]">
                  3-Year Value
                </div>
              </>
            )}
          />
        </div>
      </div>

      <div className="font-mona mt-2 flex w-full items-center justify-between text-[#959595]">
        <div className="">Variable APR</div>
        <div className="">{apr}%</div>
      </div>
      <button
        className={
          'font-mona mt-4 flex w-full items-center justify-center rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white hover:bg-gradient-to-t' +
          ` ${
            isSubmitLoading || isDisabled
              ? 'cursor-not-allowed text-[#eee]'
              : 'cursor-pointer '
          }`
        }
        disabled={isDisabled || isSubmitLoading}
        onClick={() => stakeToken()}
      >
        {isSubmitLoading && <LoadingCircle />}
        Deposit {stakeInfo?.label}
      </button>
    </div>
  )
}
