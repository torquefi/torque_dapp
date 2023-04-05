import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import SkeletonDefault from '@/components/skeleton'
import { TORQ } from '@/constants/coins'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'

interface StakingPoolItemProps {
  coin: any
}

export default function StakingPoolItem({ coin }: StakingPoolItemProps) {
  const { address } = useAccount()
  const [isLoading, setLoading] = useState(true)
  const [isSubmitLoading, setSubmitLoadingLoading] = useState(true)

  const [balance, setBalance] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [allowance, setAllowance] = useState('0')

  const isDisabled = !amount || +amount < 0 || +amount > +balance
  const isApproved = +allowance >= +amount

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(TORQ.contractAbi),
      TORQ.contractAddress
    )
    return contract
  }, [])

  const stakeToken = async () => {
    setSubmitLoadingLoading(true)
    try {
      const web3 = new Web3(Web3.givenProvider)
      const stakingContract = new web3.eth.Contract(
        JSON.parse(coin?.stakingContractAbi),
        coin?.stakingContractAddress
      )

      const decimals = await tokenContract.methods.decimals().call()
      const tokenAmount = ethers.utils
        .parseUnits(amount.toString(), decimals)
        .toString()

      await stakingContract.methods.deposit(tokenAmount).send({ from: address })
      toast.success('Deposit successful')
      setAmount(0)
    } catch (error) {
      toast.error('Deposit failed ' + error?.message)
      console.log('Staking.DepositModal.stakeToken', error)
    }
    setSubmitLoadingLoading(false)
  }

  const approveToken = async () => {
    setSubmitLoadingLoading(true)
    try {
      await tokenContract.methods
        .approve(
          coin?.stakingContractAddress,
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        )
        .send({ from: address })
      handleGetAllowance()
    } catch (error) {
      console.log('Staking.DepositModal.approveToken', error)
    }
    setSubmitLoadingLoading(false)
  }

  const handleGetAllowance = async () => {
    if (!coin?.symbol) {
      return
    }
    setSubmitLoadingLoading(true)
    try {
      const allowanceToken = await tokenContract.methods
        .allowance(address, coin?.stakingContractAddress)
        .call()
      const decimals = await tokenContract.methods.decimals().call()
      const allowance = ethers.utils
        .formatUnits(allowanceToken, decimals)
        .toString()

      // console.log('allowance', allowance)
      setAllowance(allowance)
    } catch (error) {
      console.log('Staking.DepositModal.handleGetAllowance', error)
    }
    setSubmitLoadingLoading(false)
  }

  useEffect(() => {
    const handleGetBalance = async () => {
      if (!coin?.symbol) {
        return
      }
      setSubmitLoadingLoading(true)
      try {
        const balanceToken = await tokenContract.methods
          .balanceOf(address)
          .call()
        const decimals = await tokenContract.methods.decimals().call()
        const balance = ethers.utils
          .formatUnits(balanceToken, decimals)
          .toString()

        setBalance(+balance)
      } catch (error) {
        console.log('Staking.DepositModal.handleGetBalance', error)
      }
      setSubmitLoadingLoading(false)
    }
    handleGetBalance()
  }, [coin?.symbol, tokenContract])

  useEffect(() => {
    handleGetAllowance()
  }, [coin?.symbol, tokenContract])

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
    <div className="rounded-[12px] border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 px-8 py-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={`/assets/t-logo-circle.svg`}
            alt=""
            className="xs:w-26 m-2 w-12 lg:w-[64px]"
          />
          <div className="grow pb-2 font-larken text-[16px] leading-tight xs:text-[18px] lg:text-[26px]">
            Deposit {coin.label},
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
            <div className="mx-1 font-mona uppercase text-[#AA5BFF] xs:mx-2">
              get {coin.label}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-4 flex w-full items-center justify-center gap-4 ">
        <div className="flex h-[140px] w-1/2 flex-col items-center justify-center gap-3 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0">
          <InputCurrencySwitch
            tokenSymbol={coin?.token}
            tokenValue={+amount}
            usdDefault
            className="w-full py-4 lg:py-6"
            decimalScale={2}
            subtitle="Your Stake"
            onChange={(e) => {
              // coin.amount = e
              // setStakingPool([...stakingPool])
              console.log(e)
              setAmount(e)
            }}
          />
        </div>
        <div className="flex h-[140px] w-[50%] flex-col items-center justify-center rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0">
          <CurrencySwitch
            tokenSymbol={coin?.token}
            tokenValue={+amount || 0 * coin.rate}
            usdDefault
            className="w-full space-y-2 py-6 py-[23px] lg:py-[31px]"
            decimalScale={2}
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

      <div className="mt-2 flex w-full items-center justify-between font-mona text-[#959595]">
        <div className="">Variable APR</div>
        <div className="">{coin.APY}%</div>
      </div>
      <button
        className={
          'mt-4 flex w-full items-center justify-center rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 font-mona uppercase hover:bg-gradient-to-t' +
          ` ${
            isDisabled || isSubmitLoading
              ? 'cursor-not-allowed text-[#eee]'
              : 'cursor-pointer '
          }`
        }
        disabled={isDisabled || isSubmitLoading}
        onClick={() => (!isApproved ? approveToken() : stakeToken())}
      >
        {isSubmitLoading && <LoadingCircle />}
        {!isApproved ? 'Approve' : 'Deposit'} {coin?.label}
      </button>
    </div>
  )
}
