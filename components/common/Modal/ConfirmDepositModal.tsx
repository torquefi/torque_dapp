import Modal from '@/components/common/Modal'
import { AiOutlineClose } from 'react-icons/ai'
import NumberFormat from '../NumberFormat'
import React, { useEffect, useState } from 'react'
import { getBalanceByContractToken } from '@/constants/utils'
import { btcContract, ethContract, tusdContract } from '@/constants/contracts'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { formatUnits } from 'ethers/lib/utils'
import LoadingCircle from '../Loading/LoadingCircle'
import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'
import { convertNumber } from '@/lib/helpers/number'

interface Detail {
  label: string
  value: string
}

interface DepositCoinDetail {
  amount: any
  symbol: string
  icon: string
}

interface ConfirmDepositModalProps {
  open: boolean
  handleClose: () => void
  confirmButtonText: string
  onConfirm: () => void
  coinFrom: DepositCoinDetail
  coinTo: DepositCoinDetail
  details?: Detail[]
  loading?: boolean
}

export function ConfirmDepositModal(props: ConfirmDepositModalProps) {
  const {
    open,
    handleClose,
    confirmButtonText,
    onConfirm,
    coinFrom,
    coinTo,
    details = [],
    loading,
  } = props
  const web3 = new Web3(Web3.givenProvider)
  const { address } = useAccount()
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [balanceWallet, setBalanceWallet] = useState<any>(0)
  useEffect(() => {
    if (address) {
      ; (async () => {
        if (coinFrom.symbol === 'BTC') {
          const amount = await getBalanceByContractToken(
            btcContract.abi,
            btcContract.address,
            address
          )
          setBalanceWallet(amount)
        } else if (coinFrom.symbol === 'ETH') {
          const balance = await web3.eth.getBalance(address)
          setBalanceWallet(Number(formatUnits(balance, 18)))
        } else if (coinFrom.symbol === 'TUSD') {
          const amount = await getBalanceByContractToken(
            tusdContract.abi,
            tusdContract.address,
            address
          )
          setBalanceWallet(amount)
        }
      })()
    }
  }, [coinFrom.symbol, address])

  return (
    <Modal
      className="mx-auto w-[90%] max-w-[360px] bg-[#FCFAFF] px-[24px] dark:bg-[#030303]"
      open={open}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between py-2">
        <div className="font-larken text-[16px] font-[400] text-[#030303] md:text-[28px] dark:text-white">
          Confirm
        </div>
        <AiOutlineClose
          className="cursor-pointer text-[#030303] dark:text-[#ffff]"
          onClick={handleClose}
        />
      </div>
      <div
        className={
          `mt-2 hidden h-[1px] w-full md:block` +
          `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
          }`
        }
      ></div>
      <div className=" h-auto w-full   overflow-y-auto py-[18px]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[16px] text-[#959595]">You deposit</span>
            <div className="font-larken pt-2 text-[23px] text-[#030303] dark:text-white">
              <NumberFormat
                displayType="text"
                value={convertNumber(coinFrom?.amount || 0)}
                suffix={` ${coinFrom.symbol}`}
              // thousandSeparator
              // decimalScale={4}
              />
            </div>
          </div>
          <div>
            <img className="w-16" src={coinFrom?.icon} alt="" />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div>
            <span className="text-[16px] text-[#959595]">You receive</span>
            <div className="font-larken pt-2 text-[23px] text-[#030303] dark:text-white">
              <NumberFormat
                displayType="text"
                value={convertNumber(coinTo?.amount || 0)}
                suffix={` ${coinTo.symbol}`}
                thousandSeparator
              />
            </div>
          </div>
          <div className="relative w-16">
            <img className="w-16 " src={coinTo?.icon} alt="" />
            <img
              className="absolute bottom-3 right-3 w-5"
              src="/assets/t-logo-circle.svg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div
        className={
          `mt-2 hidden h-[1px] w-full md:block` +
          `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
          }`
        }
      ></div>
      <div className="my-5 flex flex-wrap gap-3 text-[16px] text-[#959595]">
        <div className="flex w-full items-center justify-between text-[15px]">
          <p>Wallet balance</p>
          <span>
            {Number(balanceWallet).toFixed(2)} {coinFrom.symbol}
          </span>
        </div>
        {details?.map((item, i) => (
          <div
            className="flex w-full items-center justify-between text-[15px]"
            key={i}
          >
            <p>{item?.label}</p>
            <span>{item?.value}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onConfirm}
        disabled={loading}
        className={`font-mona w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        ${loading ? ' cursor-not-allowed text-[#eee]' : ' cursor-pointer'}
        `}
      >
        {loading && <LoadingCircle />}
        {confirmButtonText}
      </button>
    </Modal >
  )
}
