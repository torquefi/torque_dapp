import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import NumberFormat from '@/components/common/NumberFormat'
import { VaultChart } from '@/components/common/VaultChart'
import { stakeLpContract, tokenTorqContract } from '@/constants/contracts'
import { AppStore } from '@/types/store'
import { BigNumber, ethers } from 'ethers'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AutowidthInput } from 'react-autowidth-input'
import { AiOutlineCheck, AiOutlineEdit } from 'react-icons/ai'
import { useMoralis } from 'react-moralis'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import CurrencySwitch from '../CurrencySwitch'
import { IStakingInfo } from '../types'

interface StakingInfoProps {
  stakeInfo: IStakingInfo
  isRefresh?: boolean
}

export default function StakingInfo({
  stakeInfo,
  isRefresh,
}: StakingInfoProps) {
  const { address, isConnected } = useAccount()

  const { Moralis } = useMoralis()

  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [isSubmitLoading, setSubmitLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)

  const [balance, setBalance] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [allowance, setAllowance] = useState('0')
  const [totalEarnings, setTotalEarnings] = useState<string | number>(0)
  const [totalStaked, setTotalStake] = useState<string | number>(0)
  const [apr, setApr] = useState<string | number>(0)
  const [tokenPrice, setTokenPrice] = useState<any>(0)

  const [label, setLabel] = useState(stakeInfo?.label)
  const [isEdit, setEdit] = useState(false)
  const refLabelInput = useRef<HTMLInputElement>(null)

  const torqContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenTorqContract.abi),
      tokenTorqContract.address
    )
    return contract
  }, [Web3.givenProvider, tokenTorqContract])

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

  const tokenStakeContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(stakeInfo?.tokenStakeContract.abi),
      stakeInfo?.tokenStakeContract?.address
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

  const handleGetInfoStaked = async () => {
    try {
      if (!isConnected || !tokenContract || !address) {
        return setTotalStake(0)
      }
      const decimals = await tokenContract.methods.decimals().call()
      console.log('decimals :>> ', decimals)
      const response = await stakingContract.methods.stakers(address).call()
      console.log('response :>> ', response)
      const principal = response?.principal
      const totalStaked = ethers.utils
        .formatUnits(principal, decimals)
        .toString()
      console.log('totalStaked :>> ', totalStaked)
      setTotalStake(totalStaked)
    } catch (error) {
      console.log('error handle get info staked:>> ', error)
    }
  }

  const handleGetInterestInfo = async () => {
    try {
      if (!isConnected || !tokenStakeContract || !address) {
        return setTotalStake(0)
      }
      const decimals = await tokenStakeContract.methods.decimals().call()

      const response = await stakingContract.methods.getInterest(address).call()
      const totalEarnings = ethers.utils
        .formatUnits(response, decimals)
        .toString()
      setTotalEarnings(totalEarnings)
    } catch (error) {
      console.log('error get interest info:>> ', error)
    }
  }

  const getDataNameStaking = async () => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })
    setLabel(data[`${stakeInfo.data_key}`] || stakeInfo?.label)
  }

  const updateDataNameStaking = async (name: string) => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })

    data[`${stakeInfo.data_key}`] = name
    data[`address`] = address
    await Moralis.Cloud.run('updateDataBorrowUser', {
      ...data,
    })
      .then(() => {
        toast.success('Update name successful')
        getDataNameStaking()
      })
      .catch(() => {
        toast.error('Update name failed')
      })
  }

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
    handleGetInterestInfo()
  }, [stakingContract, isConnected, tokenStakeContract, address, isRefresh])

  useEffect(() => {
    handleGetInfoStaked()
  }, [stakingContract, isConnected, tokenContract, address, isRefresh])

  const handleGetAllowance = async () => {
    if (!isConnected || !tokenStakeContract) {
      return setAllowance('0')
    }
    setSubmitLoading(true)

    try {
      const allowanceToken = await tokenStakeContract.methods
        .allowance(address, stakeInfo?.stakeContract?.address)
        .call()
      const decimals = await tokenStakeContract.methods.decimals().call()
      const allowance = ethers.utils
        .formatUnits(allowanceToken, decimals)
        .toString()
      return allowance
    } catch (error) {
      console.log('Staking.DepositModal.handleGetAllowance', error)
    }
    setSubmitLoading(false)
  }

  const handleGetTokenAllowance = async () => {
    if (!isConnected || !tokenContract) {
      return setAllowance('0')
    }
    setSubmitLoading(true)

    try {
      const allowanceToken = await tokenContract.methods
        .allowance(address, stakeInfo?.stakeContract?.address)
        .call()
      const decimals = await tokenStakeContract.methods.decimals().call()
      const allowance = ethers.utils
        .formatUnits(allowanceToken, decimals)
        .toString()
      return allowance
    } catch (error) {
      console.log('Staking.DepositModal.handleGetAllowance', error)
    }
    setSubmitLoading(false)
  }

  const approveToken = async () => {
    if (!isConnected) {
      return toast.error('You need connect your wallet first')
    }

    setSubmitLoading(true)

    try {
      await tokenStakeContract.methods
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

  const handleWithdraw = async () => {
    if (!isConnected) {
      return toast.error('You need connect your wallet first')
    }
    if (!+amount) {
      return toast.error('You must input amount to withdraw')
    }
    setSubmitLoading(true)
    try {
      const allowanceToken = await handleGetTokenAllowance()
      if (!+allowanceToken) {
        await tokenContract.methods
          .approve(
            stakeInfo?.stakeContract?.address,
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
          )
          .send({ from: address })
      }

      const allowance = await handleGetAllowance()
      if (!+allowance) {
        await tokenStakeContract.methods
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

      console.log('tokenAmount :>> ', tokenAmount)
      await stakingContract.methods.redeem(tokenAmount).send({ from: address })
      toast.success('Withdraw successfully')
      handleGetInterestInfo()
      handleGetInfoStaked()
      setAmount(0)
    } catch (error) {
      toast.error('Withdraw failed ' + error?.message)
      console.log('Staking.ManageStaking.StakingInfo.handleWithdraw', error)
    }
    setSubmitLoading(false)
  }

  useEffect(() => {
    if (isEdit && refLabelInput.current) {
      refLabelInput.current.focus()
    }
  }, [isEdit])

  useEffect(() => {
    const handleGetTorqPrice = async () => {
      try {
        const decimals = await tokenContract.methods.decimals().call()
        const amount = ethers.utils.parseUnits('1', decimals).toString()
        const response = await lpContract.methods
          .getUSDPrice(stakeInfo.tokenContract.address, amount)
          .call()
        const tokenPrice = ethers.utils.formatUnits(response, 18).toString()
        setTokenPrice(tokenPrice)
      } catch (error) {
        console.log('handleGetTorqPrice 123:>> ', error)
      }
    }
    const handleGetLpPrice = async () => {
      try {
        const torqDecimals = await torqContract.methods.decimals().call()
        const amount = ethers.utils.parseUnits('1', torqDecimals).toString()
        const torqTokenPrice6Decimals = await lpContract.methods
          .getUSDPrice(tokenTorqContract.address, amount)
          .call()
        // const torqTokenPrice = ethers.utils.formatUnits(response, 6).toString()

        const pairLpTorqPrice = await lpContract.methods.getPairPrice().call()

        const lpPriceBn = BigNumber.from(pairLpTorqPrice)
          .div(ethers.utils.parseUnits('1', 18).toString())
          .mul(torqTokenPrice6Decimals)
          .div(ethers.utils.parseUnits('1', 18).toString())

        setTokenPrice(lpPriceBn)
      } catch (error) {
        console.log('handleGetTorqPrice 123:>> ', error)
      }
    }
    if (stakeInfo.symbol === 'TORQ') {
      handleGetTorqPrice()
    }
    if (stakeInfo.symbol === 'LP') {
      handleGetLpPrice()
    }
  }, [tokenContract, lpContract, isConnected])

  const summaryInfor = (item: IStakingInfo) => {
    return (
      <div className="flex w-full items-center justify-between">
        <CurrencySwitch
          tokenSymbol={item?.symbol}
          tokenValue={+totalStaked}
          usdDefault
          className="-my-4 flex min-w-[100px] flex-col items-center justify-center gap-2 py-4"
          render={(value) => (
            <>
              <p className="text-[22px]">{value}</p>
              <p className="font-mona text-[14px] text-[#959595]">Deposited</p>
            </>
          )}
          decimalScale={2}
          tokenPrice={tokenPrice}
        />

        <CurrencySwitch
          tokenSymbol={item?.symbol}
          tokenValue={+totalEarnings}
          usdDefault
          className="-my-4 flex min-w-[100px] flex-col items-center justify-center gap-2 py-4"
          render={(value) => (
            <>
              <p className="text-[22px]">{value}</p>
              <p className="font-mona text-[14px] text-[#959595]">Earnings</p>
            </>
          )}
          decimalScale={2}
          tokenPrice={tokenPrice}
        />
        <div className="flex min-w-[100px] flex-col items-center justify-center gap-2 leading-none">
          <div className="text-[22px]">{apr}%</div>
          <div className="font-mona text-[14px] text-[#959595]">Net APR</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-[24px] grid w-full rounded-[12px] border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[24px] py-[20px] text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
      <div className="grid w-full grid-cols-2">
        <div className="flex items-center gap-4">
          <img
            src={`assets/t-logo-circle.svg`}
            alt=""
            className="w-[42px] object-cover"
          />
          {!isEdit && (
            <div
              className="flex cursor-pointer items-center text-[22px] transition-all hover:scale-105"
              onClick={() => setEdit(!isEdit)}
            >
              {label}
              <button className="ml-2">
                <AiOutlineEdit />
              </button>
            </div>
          )}
          {isEdit && (
            <div className="flex cursor-pointer items-center text-[22px]">
              <AutowidthInput
                ref={refLabelInput}
                className="min-w-[60px] bg-transparent"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && setEdit(false)}
              />
              <button className="ml-2">
                <AiOutlineCheck
                  className="transition-all hover:scale-105"
                  onClick={() => {
                    updateDataNameStaking(label)
                    setEdit(!isEdit)
                  }}
                />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-14">
          <div className="hidden items-center justify-between gap-14 lg:flex">
            {summaryInfor(stakeInfo)}
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <button className="" onClick={() => setOpen(!isOpen)}>
              <img
                className={
                  'w-[18px] transition-all' + ` ${isOpen ? 'rotate-180' : ''}`
                }
                src={
                  theme == 'light'
                    ? '/icons/dropdow-dark.png'
                    : '/icons/arrow-down.svg'
                }
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 gap-8 overflow-hidden transition-all duration-300 lg:grid-cols-2 ${
          isOpen
            ? 'max-h-[1000px] py-[16px] ease-in'
            : 'max-h-0 py-0 opacity-0 ease-out'
        }`}
      >
        <div className="flex items-center justify-between gap-4 lg:hidden">
          {summaryInfor(stakeInfo)}
        </div>
        <div className="">
          {/* <Chart /> */}
          {/* <img src="/assets/pages/boost/chart.svg" alt="" /> */}
          <VaultChart label="Stake Apy" percent={2.81} value={49510000} />
        </div>
        <div className="mt-10">
          <div className="text-[28px]">Withdraw {stakeInfo?.symbol}</div>
          <div className="mt-2 flex w-full items-center justify-between rounded-[12px] border bg-[#FCFAFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-2 py-4 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
            <NumberFormat
              className="font-mona w-full bg-transparent bg-none px-2 focus:outline-none"
              placeholder="Select amount"
              value={amount || ''}
              onChange={(e: any, value: any) => setAmount(value)}
              thousandSeparator
              decimalScale={5}
            />
            <div className="flex items-center gap-2">
              {[25, 50, 100].map((item: any, i) => (
                <button
                  key={i}
                  className="font-mona rounded bg-[#F4F4F4] px-2 py-1 text-sm text-[#959595] dark:bg-[#1A1A1A]"
                  onClick={() => setAmount((Number(totalStaked) * item) / 100)}
                >
                  {item}%
                </button>
              ))}
            </div>
          </div>
          <button
            className="font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]"
            onClick={() => handleWithdraw()}
          >
            {isSubmitLoading && <LoadingCircle />}
            Withdraw
          </button>
        </div>
      </div>
    </div>
  )
}
