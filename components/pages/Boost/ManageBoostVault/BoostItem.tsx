import CurrencySwitch from '@/components/common/CurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { VaultChart } from '@/components/common/VaultChart'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { AppStore } from '@/types/store'
import { ethers } from 'ethers'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AutowidthInput } from 'react-autowidth-input'
import { AiOutlineCheck, AiOutlineEdit } from 'react-icons/ai'
import { useMoralis } from 'react-moralis'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { IBoostInfo } from '../types'

interface BoostItemProps {
  item: IBoostInfo
  onWithdrawSuccess?: VoidFunction
}

export function BoostItem({ item, onWithdrawSuccess }: BoostItemProps) {
  const [theme, setTheme] = useState(null)
  const [label, setLabel] = useState(item?.defaultLabel)
  const [isOpen, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [isEdit, setEdit] = useState(false)
  const [btnLoading, setBtnLoading] = useState('')
  const [isSubmitLoading, setSubmitLoading] = useState(false)
  const { address, isConnected } = useAccount()
  const { Moralis, isWeb3Enabled } = useMoralis()
  const borrowTime = useSelector((store: AppStore) => store)
  const refLabelInput = useRef<HTMLInputElement>(null)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.tokenContractInfo?.abi),
      item?.tokenContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item?.tokenSymbol])

  const boostContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.boostContractInfo?.abi),
      item?.boostContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item?.tokenSymbol])

  const onWithdraw = async () => {
    if (!isConnected) {
      setOpenConnectWalletModal(true)
      return
    }
    try {
      setSubmitLoading(true)
      console.log(
        'token',
        item.tokenContractInfo?.address,
        ethers.utils.parseUnits(amount, item.tokenDecimals).toString()
      )
      const tx = await boostContract.methods
        .withdraw(
          item.tokenContractInfo?.address,
          ethers.utils.parseUnits(amount, item.tokenDecimals).toString()
        )
        .send({
          from: address,
          value:
            item?.tokenSymbol === 'ETH'
              ? ethers.utils.parseUnits(amount, item.tokenDecimals).toString()
              : 0,
        })
      onWithdrawSuccess && onWithdrawSuccess()
      setAmount('')
      toast.success('Withdraw Successful')
    } catch (e) {
      toast.error('Withdraw Failed')
      console.log(e)
    }
    setSubmitLoading(false)
  }

  const getDataNameBoost = async () => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })
    setLabel(data[`${item.labelKey}`] || item?.defaultLabel)
  }

  const updateDataNameBoost = async (name: string) => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })

    data[`${item.labelKey}`] = name
    data[`address`] = address
    // console.log(data)
    await Moralis.Cloud.run('updateDataBorrowUser', {
      ...data,
    })
      .then(() => {
        getDataNameBoost()
        toast.success('Update name successful')
      })
      .catch(() => {
        toast.error('Update name failed')
      })
  }

  useEffect(() => {
    if (isEdit && refLabelInput.current) {
      refLabelInput.current.focus()
    }
  }, [isEdit])

  useEffect(() => {
    setTheme(
      typeof window !== 'undefined'
        ? window.localStorage.getItem('theme')
        : null
    )
  }, [typeof window !== 'undefined'])

  useEffect(() => {
    getDataNameBoost()
  }, [isWeb3Enabled, address, isConnected, borrowTime])

  const summaryInfo = () => {
    return (
      <div className="flex w-full items-center justify-between">
        <CurrencySwitch
          tokenSymbol={item?.tokenSymbol}
          tokenValue={item.deposited}
          usdDefault
          className="-my-4 flex h-full min-w-[130px] flex-col items-center justify-center gap-2 py-4"
          render={(value) => (
            <div className="flex min-w-[130px] flex-col items-center justify-center gap-2">
              <p className="text-[22px]">{value}</p>
              <div className="font-mona text-[14px] text-[#959595]">
                Deposited
              </div>
            </div>
          )}
          decimalScale={2}
        />
        <CurrencySwitch
          tokenSymbol={item?.tokenSymbol}
          tokenValue={item.earnings}
          usdDefault
          className="-my-4 flex h-full min-w-[130px] flex-col items-center justify-center gap-2 py-4"
          decimalScale={2}
          render={(value) => (
            <div className="flex min-w-[130px] flex-col items-center justify-center gap-2">
              <p className="text-[22px]">{value}</p>
              <div className="font-mona text-[14px] text-[#959595]">
                Earnings
              </div>
            </div>
          )}
        />
        <div className="flex min-w-[130px] flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{item.APR}</div>
          <div className="font-mona text-[14px] text-[#959595]">
            Variable APY
          </div>
        </div>
      </div>
    )
  }

  const renderSubmitText = () => {
    if (!address) {
      return 'Connect Wallet'
    }
    if (isSubmitLoading) {
      return 'WITHDRAWING...'
    }
    return 'Withdraw'
  }

  return (
    <>
      <div className="dark-text-[#000] mt-[24px] grid w-full rounded-[12px] border border-[#E6E6E6] bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[24px] py-[20px] text-[#464646] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
        <div className="grid w-full grid-cols-2">
          <div className="xlg:w-[calc(100%-600px-64px)] font-larken flex w-[calc(100%-64px)] items-center space-x-2 text-[22px] md:w-[calc(100%-400px-64px)] lg:w-[calc(100%-500px-64px)]">
            {!isEdit && (
              <div
                className="flex min-w-max cursor-pointer items-center text-[22px]"
                onClick={() => setEdit(!isEdit)}
              >
                <img
                  className="mr-2 w-[54px]"
                  src={`/icons/coin/${item.tokenSymbol.toLowerCase()}.png`}
                  alt=""
                />
                {label}
                <button className="ml-2">
                  <AiOutlineEdit />
                </button>
              </div>
            )}
            {isEdit && (
              <div className="flex cursor-pointer items-center text-[22px]">
                <img
                  className="mr-2 w-[54px]"
                  src={`/icons/coin/${item.tokenSymbol.toLowerCase()}.png`}
                  alt=""
                />
                <AutowidthInput
                  ref={refLabelInput}
                  className="min-w-[60px] bg-transparent"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && setEdit(false)}
                />
                <button className="">
                  <AiOutlineCheck
                    className=""
                    onClick={() => {
                      updateDataNameBoost(label)
                      setEdit(!isEdit)
                    }}
                  />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-14">
            <div className="hidden items-center justify-between gap-14 lg:flex">
              {summaryInfo()}
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <button className="" onClick={() => setOpen(!isOpen)}>
                <img
                  className={
                    'w-[18px] text-[#000] transition-all' +
                    ` ${isOpen ? 'rotate-180' : ''}`
                  }
                  // src="/icons/arrow-down.svg"
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
            {summaryInfo()}
          </div>
          <div className="">
            {/* <Chart /> */}
            {/* <img src="/assets/pages/boost/chart.svg" alt="" /> */}
            <VaultChart
              label="Boost Apr"
              percent={+item.APR}
              value={49510000}
            />
          </div>
          <div className="mt-10">
            <div className="text-[28px]">Withdraw ETH</div>
            <div className="mt-2 flex w-full items-center justify-between rounded-[12px] border bg-[#FCFAFF] px-2 py-4 dark:border-[#1A1A1A] dark:bg-[#161616]">
              <input
                type="number"
                className="font-mona w-full bg-none px-2 focus:outline-none"
                style={{ backgroundColor: 'transparent' }}
                value={amount}
                placeholder="Select amount"
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex items-center gap-2">
                {[25, 50, 100].map((percent: any, i) => (
                  <button
                    key={i}
                    className="font-mona rounded bg-[#F4F4F4] px-2 py-1 text-sm text-[#959595] dark:bg-[#1A1A1A]"
                    onClick={() => {
                      setAmount(`${(percent * item.deposited) / 100}`)
                    }}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>
            <button
              className={
                `font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]` +
                ` ${isSubmitLoading && 'cursor-not-allowed opacity-70'}`
              }
              disabled={isSubmitLoading}
              onClick={() => onWithdraw()}
            >
              {isSubmitLoading && <LoadingCircle />}
              {renderSubmitText()}
            </button>
          </div>
        </div>
      </div>
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
    </>
  )
}
