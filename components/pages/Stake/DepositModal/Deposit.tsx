import NumberFormat from '@/components/common/NumberFormat'
import { TORQ } from '@/constants/coins'
import useNetwork from '@/lib/hooks/useNetwork'
import classNames from 'classnames'
import { ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import AutoWidthInput from 'react-autowidth-input'
import { AiOutlineSwap } from 'react-icons/ai'
import { useMoralis } from 'react-moralis'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import ChoosePercent from './ChoosePercent'

interface DepositModalProps {
  coin: any
  onSuccess?: () => void
}

export default function DepositModal({ coin, onSuccess }: DepositModalProps) {
  const { network } = useNetwork()
  const { address } = useAccount()
  const web3 = new Web3(Web3.givenProvider)
  const { user } = useMoralis()
  const [balance, setBalance] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [isUsdDeposit, setUsdDeposit] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
    try {
      const stakingContract = new web3.eth.Contract(
        JSON.parse(coin?.stakingContractAbi),
        coin?.stakingContractAddress
      )

      const decimals = await tokenContract.methods.decimals().call()
      const tokenAmount = ethers.utils
        .parseUnits(amount.toString(), decimals)
        .toString()
      console.log(tokenAmount)

      await stakingContract.methods.deposit(tokenAmount).send({ from: address })
    } catch (error) {
      console.log('Staking.DepositModal.stakeToken', error)
    }
    setLoading(false)
  }

  const approveToken = async () => {
    setLoading(true)
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
    setLoading(false)
  }

  const handleGetAllowance = async () => {
    if (!coin?.symbol) {
      return
    }
    setLoading(true)
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
    setLoading(false)
  }

  useEffect(() => {
    setAmount(balance)
  }, [balance, coin?.symbol])

  useEffect(() => {
    const handleGetBalance = async () => {
      if (!coin?.symbol) {
        return
      }
      setLoading(true)
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
      setLoading(false)
    }
    handleGetBalance()
  }, [coin?.symbol, tokenContract])

  useEffect(() => {
    handleGetAllowance()
  }, [coin?.symbol, tokenContract])

  return (
    <>
      <div className="relative flex items-center justify-center py-10">
        <div className="flex items-center justify-center">
          {isUsdDeposit && (
            <span className="mr-1 h-[30px] self-start text-18 text-[#77838F] sm:h-[55px] md:text-24">
              $
            </span>
          )}
          <NumberFormat
            className={
              'bg-transparent text-[25px] font-bold dark:focus:text-white sm:text-[50px]' +
              ` ${amount ? 'min-w-[0px]' : 'min-w-[70px] sm:min-w-[120px]'}` +
              ` ${isUsdDeposit ? 'max-w-[270px]' : 'max-w-[155px]'}`
            }
            value={amount || null}
            onValueChange={(event: any) => {
              setAmount(event.value)
            }}
            thousandSeparator
            placeholder="0.00"
            customInput={AutoWidthInput}
          />
        </div>
        {!isUsdDeposit && (
          <span className="text-[25px] text-[#77838F] sm:text-[50px]">
            {coin?.label}
          </span>
        )}
        <div
          className="absolute inset-y-0 right-0 flex flex-col items-center justify-center"
          onClick={() => setUsdDeposit(!isUsdDeposit)}
        >
          <div className="flex w-full items-center justify-center">
            <div className="primary-btn h-[40px] w-[40px] rotate-90 cursor-pointer rounded-full border border-[#2c2b2b] bg-[#1A1A1A] p-2 text-white">
              <AiOutlineSwap className="text-[24px]" />
            </div>
          </div>
          <div className="flex h-[30px] w-full items-center justify-center">
            {isUsdDeposit ? 'USD' : coin?.label}
          </div>
        </div>
      </div>
      <div className="mt-9 text-14 md:text-18">
        {/* <div className="flex items-center justify-between my-5">
          <p>Balance</p>
          <p>
            <NumberFormatValue
              value={balance}
              thousandSeparator
              decimalScale={2}
              displayType="text"
            />{' '}
            {coin?.symbol}
          </p>
        </div> */}
        <ChoosePercent
          className="mb-4"
          total={balance}
          value={amount}
          onClickPercent={(value) => setAmount(value)}
        />
        <div className="bg-gradient-primary w-full cursor-pointer rounded-[10px] p-[1px]">
          <button
            disabled={isDisabled || loading}
            onClick={() => (!isApproved ? approveToken() : stakeToken())}
            className={
              `flex w-full items-center justify-center  rounded-xl bg-black py-4 text-16 md:text-18` +
              ` ${
                isDisabled || loading
                  ? 'cursor-not-allowed text-[#8d8d8d]'
                  : 'cursor-pointer '
              }`
            }
          >
            {loading && <Loading />}
            {!isApproved ? 'Approve' : 'Deposit'}
          </button>
        </div>
      </div>
    </>
  )
}

const Loading = () => (
  <div className="pr-3">
    <svg
      role="status"
      className="mr-3 inline h-4 w-4 animate-spin text-white"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="#E5E7EB"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"
      />
    </svg>
  </div>
)
