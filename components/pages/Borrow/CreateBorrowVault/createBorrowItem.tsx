import InputCurrencySwitch, {
  getPriceToken,
} from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { toMetricUnits } from '@/lib/helpers/number'
import { updateborrowTime } from '@/lib/redux/slices/borrow'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContract,
  borrowEthContract,
  engineTusdContract,
  tokenBtcContract,
  tokenEthContract,
} from '../constants/contract'
import { IBorrowInfo } from '../types'
import { log } from 'console'
import BigNumber from 'bignumber.js'

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365

interface CreateBorrowItemProps {
  item: IBorrowInfo
}

export default function CreateBorrowItem({ item }: CreateBorrowItemProps) {
  let web3 = new Web3(Web3.givenProvider)
  const [dataBorrow, setDataBorrow] = useState(item)
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState(0)
  const [amountReceive, setAmountReceive] = useState(0)
  const [contractBorrowETH, setContractBorrowETH] = useState<any>(null)
  const [contractBorrowBTC, setContractBorrowBTC] = useState<any>(null)
  const [contractBTC, setContractBTC] = useState<any>(null)
  const [contractETH, setContractETH] = useState<any>(null)
  const [allowance, setAllowance] = useState(0)
  const [balance, setBalance] = useState(0)
  const [buttonLoading, setButtonLoading] = useState('')

  const [price, setPrice] = useState<any>({
    aeth: 0,
    wbtc: 0,
    tusd: 1,
  })
  const { address, isConnected } = useAccount()
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
    useState(false)

  const dispatch = useDispatch()

  const [aprBorrow, setAprBorrow] = useState('')

  const [ltv, setltv] = useState('')
  useEffect(() => {
    ;(async () => {
      const ethPrice = await getPriceToken('ETH')
      const btcPrice = await getPriceToken('BTC')
      setPrice({
        aeth: ethPrice,
        wbtc: btcPrice,
        tusd: 1,
      })
    })()
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const initContract = async () => {
    try {
      const contractBorrowETH = new web3.eth.Contract(
        JSON.parse(borrowEthContract?.abi),
        borrowEthContract?.address
      )

      let contractBorrowBTC = new web3.eth.Contract(
        JSON.parse(borrowBtcContract?.abi),
        borrowBtcContract?.address
      )
      if (contractBorrowETH && item.depositTokenSymbol === 'AETH') {
        const aprBorrowETH = await contractBorrowETH.methods.getApr().call({
          from: address,
        })
        // const ltvETH = await contractBorrowETH.methods
        //   .getCollateralFactor()
        //   .call({
        //     from: address,
        //   })
        // setltv(web3.utils.fromWei(ltvETH.toString(), 'ether'))
        setAprBorrow(web3.utils.fromWei(aprBorrowETH.toString(), 'ether'))
        setContractBorrowETH(contractBorrowETH)
      }

      if (contractBorrowBTC && item.depositTokenSymbol === 'WBTC') {
        const aprBorrowBTC = await contractBorrowBTC.methods.getApr().call({
          from: address,
        })
        // const ltvBTC = await contractBorrowBTC.methods
        //   .getCollateralFactor()
        //   .call({
        //     from: address,
        //   })
        // setltv(web3.utils.fromWei(ltvBTC.toString(), 'ether'))
        setAprBorrow(web3.utils.fromWei(aprBorrowBTC.toString(), 'ether'))
        setContractBorrowBTC(contractBorrowBTC)
      }

      let contractBTC = new web3.eth.Contract(
        JSON.parse(tokenBtcContract?.abi),
        tokenBtcContract?.address
      )

      let contractETH = new web3.eth.Contract(
        JSON.parse(tokenEthContract?.abi),
        tokenEthContract?.address
      )
      if (contractETH) {
        setContractETH(contractETH)
      }
      if (contractBTC) {
        setContractBTC(contractBTC)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getAllowance = async () => {
    try {
      if (
        item.depositTokenSymbol === 'WBTC' &&
        contractBTC &&
        contractBorrowBTC &&
        address
      ) {
        const allowance = await contractBTC.methods
          .allowance(address, borrowBtcContract?.address)
          .call({
            from: address,
          })
        setAllowance(allowance / 10 ** dataBorrow.depositTokenDecimal || 0)
      } else if (
        item.depositTokenSymbol === 'AETH' &&
        contractETH &&
        contractBorrowETH &&
        address
      ) {
        const allowance = await contractETH.methods
          .allowance(address, borrowEthContract?.address)
          .call({
            from: address,
          })
        console.log('allowance', allowance)

        setAllowance(allowance / 10 ** dataBorrow.depositTokenDecimal || 0)
      }
    } catch (e) {
      console.log('CreateBorrowItem.getAllowance', e)
    }
  }

  useEffect(() => {
    if (address && contractBorrowBTC && contractBTC) {
      getAllowance()
    }
  }, [
    address,
    contractBorrowBTC,
    contractBTC,
    dataBorrow.depositTokenDecimal,
    amount,
  ])

  const updateBalance = async () => {
    try {
      if (item.tokenContract && address) {
        const balance = await item.tokenContract.methods
          .balanceOf(address)
          .call()
        setBalance(
          ethers?.utils
            .parseUnits(balance, dataBorrow.depositTokenDecimal)
            .toNumber()
        )
      }
    } catch (e) {
      console.log('item :>> ', item?.depositTokenSymbol)
      console.log('CreateBorrowItem.updateBalance', e)
    }
  }

  async function getMintable(balance: any, tokenCollateralAddress: string) {
    try {
      const tusdEngineContract = new web3.eth.Contract(
        JSON.parse(engineTusdContract?.abi),
        engineTusdContract?.address
      ) as any
      let mintable = await tusdEngineContract.methods
        .getMintableTusd(tokenCollateralAddress, address, balance)
        .call()
      return Number(mintable[0]) - 100000 || 0
    } catch (e) {
      console.log('CreateBorrowItem.getMintable', e)
      return 0
    }
  }

  const handleConfirmDeposit = () => {
    if (!isConnected) {
      setOpenConnectWalletModal(true)
      return
    }
    setOpenConfirmDepositModal(true)
  }

  const onBorrow = async () => {
    try {
      if (amount <= 0) {
        toast.error('You must deposit WBTC to borrow')
        return
      }
      if (amountReceive < 0) {
        toast.error('Can not borrow less than 0 TUSD')
        return
      }
      setButtonLoading('APPROVING...')
      if (!isApproved && item.depositTokenSymbol == 'WBTC') {
        const borrowAmount = Number(
          new BigNumber(amount)
            .multipliedBy(10 ** item.depositTokenDecimal)
            .toString()
        ).toFixed(0)
        await contractBTC.methods
          .approve(item?.borrowContractInfo?.address, borrowAmount)
          .send({
            from: address,
          })
        toast.success('Approve Successful')
      }
      // else if (!isApproved && item.depositTokenSymbol == 'ETH') {
      //   const borrowAmount = Number(
      //     new BigNumber(amount)
      //       .multipliedBy(10 ** item.depositTokenDecimal)
      //       .toString()
      //   ).toFixed(0)
      //   await contractETH.methods
      //     .approve(item?.borrowContractInfo?.address, borrowAmount)
      //     .send({
      //       from: address,
      //     })
      //   toast.success('Approve Successful')
      // }
      setButtonLoading('BORROWING...')

      if (item.depositTokenSymbol == 'WBTC') {
        const borrow = Number(
          new BigNumber(amount)
            .multipliedBy(10 ** item.borrowTokenDecimal)
            .toString()
        ).toFixed(0)
        const borrowAmount = Number(
          new BigNumber(amountReceive)
            .multipliedBy(10 ** item.borrowTokenDecimal)
            .toString()
        )
        const usdcBorrowAmount = await contractBorrowBTC.methods
          .getBorrowableUsdc(borrow)
          .call()
        const tusdBorrowAmount = await contractBorrowBTC.methods
          .getBorrowable(borrowAmount, address)
          .call()
        if (tusdBorrowAmount == 0) {
          toast.error('Borrow failed. Please try again')
          return
        }
        await contractBorrowBTC.methods
          .borrow(
            borrow,
            usdcBorrowAmount.toString(),
            (Number(tusdBorrowAmount) * 0.98).toString() || 0
          )
          .send({
            from: address,
          })
      } else if (item.depositTokenSymbol === 'AETH') {
        const borrowAmount =
          amountReceive /
          price[`${dataBorrow.depositTokenSymbol.toLowerCase()}`]
        console.log('borrowAmount', borrowAmount)

        const borrow = Number(
          new BigNumber(borrowAmount)
            .multipliedBy(10 ** item.depositTokenDecimal)
            .toString()
        ).toFixed(0)
        const usdcBorrowAmount = await contractBorrowETH.methods
          .getBorrowableUsdc(borrow)
          .call()
        const tusdBorrowAmount = await contractBorrowETH.methods
          .getBorrowable(borrow, address)
          .call()

        if (tusdBorrowAmount == 0) {
          toast.error('Borrow failed. Please try again')
          return
        }
        await contractBorrowETH.methods
          .borrow(
            usdcBorrowAmount.toString(),
            (Number(tusdBorrowAmount) * 0.99).toString() || 0
          )
          .send({
            value: borrow,
            from: address,
          })
      }
      dispatch(updateborrowTime(new Date().getTime() as any))
      toast.success('Borrow Successful')
    } catch (e) {
      console.log('CreateBorrowItem.onBorrow', e)
      toast.error('Borrow Failed')
    } finally {
      setButtonLoading('')
      setOpenConfirmDepositModal(false)
    }
  }

  useEffect(() => {
    if (address) {
      updateBalance()
    }
  }, [dataBorrow, item?.tokenContract, item?.borrowContract, address])

  useEffect(() => {
    initContract()
  }, [])

  const isApproved = useMemo(
    () => amount < allowance,
    [allowance, dataBorrow, amount]
  )
  const renderSubmitText = () => {
    if (!address) {
      return 'Connect Wallet'
    }
    // return 'Deposit & Borrow'
    return 'Confirm Deposit'
  }
  return (
    <>
      <div
        className="rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pt-3 pb-5 text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white xl:px-[32px]"
        key={dataBorrow.depositTokenSymbol}
      >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center ml-[-12px]">
          <img
            className="w-[72px] md:w-24"
            src={dataBorrow.depositTokenIcon}
            alt=""
          />
          <div className="font-larken text-[#404040] dark:text-white text-[18px] md:text-[22px] leading-tight lg:text-[26px]">
            Deposit {dataBorrow.depositTokenSymbol},<br /> Borrow{' '}
            {dataBorrow.borrowTokenSymbol}
          </div>
        </div>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#161616]`}
            content="The projected TORQ rewards after 1 year of $1,000 borrowed"
          >
            <Link href="#" className="" target={'_blank'}>
              <div className="flex items-center rounded-full bg-[#AA5BFF] bg-opacity-20 p-1  text-[12px] xs:text-[14px]">
                <img
                  src="/assets/t-logo-circle.svg"
                  alt=""
                  className="w-[24px]"/>
                <div className="font-mona mx-1 uppercase text-[#AA5BFF] xs:mx-2">
                  +0.00 TORQ
                </div>
              </div>
            </Link>
          </Popover>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-1 mb-1 font-larken">
          <div className="flex w-full items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={item?.depositTokenSymbol}
              tokenValue={Number(amount)}
              className="w-full py-4 dark:text-white lg:py-6"
              subtitle="Collateral"
              usdDefault
              decimalScale={2}
              onChange={(e) => {
                setAmount(e)
              }}
            />
          </div>
          <div className="font-larken h-[110px] flex flex-col items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={'TUSD'}
              tokenValue={Number(amountReceive)}
              tokenValueChange={Number(
                amount * price[`${dataBorrow.depositTokenSymbol.toLowerCase()}`] * (dataBorrow.loanToValue / 140)
              )}              
              usdDefault
              decimalScale={2}
              className="w-full py-4"
              subtitle="Borrowing"
              onChange={(e) => {
                setAmountReceive(e)
              }}
            />
          </div>
        </div>
        <div className="flex items-center py-4 justify-between text-[#959595]">
          <p>Loan providers</p>
          <div className="flex items-center">
            <Link
              href={'https://compound.finance/'}
              className="translate-x-3"
              target={'_blank'}
            >
              <img
                src={'/icons/coin/compound.svg'}
                alt="Compound"
                className="w-[26px]"
              />
            </Link>
            <Link href={'https://www.usd.farm/'} className="" target={'_blank'}>
              <img
                src={'/icons/coin/torq-yi.svg'}
                alt="USD.farm"
                className="w-[26px]"
              />
            </Link>
          </div>
        </div>
        <div className="flex justify-between text-[#959595]">
          <p>Loan-to-value</p>
          <p>
            {'<'}
            {item?.loanToValue}%
          </p>
        </div>
        <div className="flex justify-between py-[16px] text-[#959595]">
          <p>Variable APR</p>
          <p>
            {!aprBorrow ? '-0.00%' : -(Number(aprBorrow) * 100).toFixed(2) + '%'}
          </p>
        </div>
        <div className="flex justify-between text-[#959595]">
          <p>Liquidity</p>
          <p>
            {!item?.liquidity ? '0.00%' : '$' + toMetricUnits(item?.liquidity)}
          </p>
        </div>
        <button
          className={`font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF] ${
            buttonLoading && 'cursor-not-allowed opacity-50'
          }`}
          disabled={buttonLoading != ''}
          onClick={() => {
            if (
              amountReceive /
                (amount *
                  price[`${dataBorrow.depositTokenSymbol.toLowerCase()}`]) >
                item?.loanToValue
            ) {
              toast.error(`Loan-to-value exceeds ${item?.loanToValue}%`)
            } else {
              handleConfirmDeposit()
            }
          }}
        >
          {buttonLoading != '' && <LoadingCircle />}
          {buttonLoading != '' ? buttonLoading : renderSubmitText()}
        </button>
      </div>
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
      <ConfirmDepositModal
        open={isOpenConfirmDepositModal}
        handleClose={() => setOpenConfirmDepositModal(false)}
        confirmButtonText="Deposit & Borrow"
        onConfirm={() => onBorrow()}
        coinFrom={{
          amount: amount,
          icon: `/icons/coin/${item.depositTokenSymbol.toLocaleLowerCase()}.png`,
          symbol: item.depositTokenSymbol,
        }}
        coinTo={{
          amount: amountReceive,
          icon: `/icons/coin/${item.borrowTokenSymbol.toLocaleLowerCase()}.png`,
          symbol: item.borrowTokenSymbol,
        }}
        details={[
          {
            label: 'Loan-to-value',
            value: `<${item?.loanToValue}%`,
          },
          {
            label: 'Variable APR',
            value: `${Number(aprBorrow).toFixed(2)}%`,
          },
        ]}
      />
    </>
  )
}
