import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import ConfirmModal from '@/components/common/Modal/ConfirmModal'
import SkeletonDefault from '@/components/skeleton'
import { TORQ } from '@/constants/coins'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { IStakingInfo } from '../types'

interface StakingPoolItemProps {
  stakeInfo: IStakingInfo
}

export default function StakingPoolItem({ stakeInfo }: StakingPoolItemProps) {
  const { address, isConnected } = useAccount()
  const [isLoading, setLoading] = useState(true)
  const [isSubmitLoading, setSubmitLoading] = useState(false)
  const [isOpenConfirmModal, setOpenConfirmModal] = useState(false)

  const [balance, setBalance] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [allowance, setAllowance] = useState('0')

  const isDisabled = !amount || +amount < 0
  const isApproved = +allowance >= +amount

  console.log(stakeInfo.symbol, address, balance, allowance)

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
    setSubmitLoading(false)
  }

  const approveToken = async () => {
    if (!isConnected) {
      return toast.error('You need connect your wallet first')
    }
    setSubmitLoading(true)
    try {
      await tokenContract.methods
        .approve(
          stakeInfo?.stakeContract?.address,
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        )
        .send({ from: address })
      handleGetAllowance()
    } catch (error) {
      console.log('Staking.DepositModal.approveToken', error)
    }
    setSubmitLoading(false)
  }

  const handleGetAllowance = async () => {
    if (!isConnected || !tokenContract) {
      return setBalance(0)
    }
    setSubmitLoading(true)
    try {
      const allowanceToken = await tokenContract.methods
        .allowance(address, stakeInfo?.stakeContract?.address)
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
    setSubmitLoading(false)
  }

  useEffect(() => {
    const handleGetBalance = async () => {
      if (!isConnected || !tokenContract) {
        return setBalance(0)
      }
      setSubmitLoading(true)
      try {
        const balanceToken = await tokenContract.methods
          .balanceOf(address)
          .call()
        const decimals = await tokenContract.methods.decimals().call()
        const balance = ethers.utils
          .formatUnits(balanceToken, decimals)
          .toString()
        console.log('balance', balance)
        setBalance(+balance)
      } catch (error) {
        console.log('Staking.DepositModal.handleGetBalance', error)
      }
      setSubmitLoading(false)
    }
    handleGetBalance()
  }, [tokenContract, isConnected])

  useEffect(() => {
    handleGetAllowance()
  }, [tokenContract, isConnected])

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
            <div className="mx-1 font-mona uppercase text-[#AA5BFF] xs:mx-2">
              get {stakeInfo.label}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-4 flex w-full items-center justify-center gap-4 ">
        <div className="flex h-[140px] w-1/2 flex-col items-center justify-center gap-3 rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0">
          <InputCurrencySwitch
            tokenSymbol={stakeInfo?.symbol}
            tokenValue={+amount}
            usdDefault
            className="w-full py-4 lg:py-6"
            decimalScale={2}
            subtitle="Your Stake"
            onChange={(e) => {
              // stakeInfo.amount = e
              // setStakingPool([...stakingPool])
              setAmount(e)
            }}
          />
        </div>
        <div className="flex h-[140px] w-[50%] flex-col items-center justify-center rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0">
          <CurrencySwitch
            tokenSymbol={stakeInfo?.symbol}
            tokenValue={+amount || 0 * stakeInfo.rate || 0}
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
        <div className="">{stakeInfo.APY}%</div>
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
        onClick={() =>
          !isApproved ? approveToken() : setOpenConfirmModal(true)
        }
      >
        {isSubmitLoading && <LoadingCircle />}
        {!isApproved ? 'Approve' : 'Deposit'} {stakeInfo?.label}
      </button>
      <ConfirmModal
        open={isOpenConfirmModal}
        handleClose={() => setOpenConfirmModal(false)}
        title="Confirm stake"
        content={`Do you want to deposit ${amount} ${stakeInfo.symbol}?`}
        onConfirm={() => {
          stakeToken()
          setOpenConfirmModal(false)
        }}
      />
    </div>
  )
}
