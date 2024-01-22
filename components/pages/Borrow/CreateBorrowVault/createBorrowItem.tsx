import InputCurrencySwitch, {
  getPriceToken,
} from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import { toMetricUnits } from '@/lib/helpers/number'
import { useWeb3Modal } from '@web3modal/react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContract,
  borrowEthContract,
  tokenBtcContract,
  tokenEthContract,
} from '../constants/contract'
import { IBorrowInfo } from '../types'

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365

interface CreateBorrowItemProps {
  item: IBorrowInfo
  setIsFetchBorrowLoading?: any
}

export default function CreateBorrowItem({ item, setIsFetchBorrowLoading }: CreateBorrowItemProps) {
  const web3 = new Web3(Web3.givenProvider)
  const { open } = useWeb3Modal()

  const [dataBorrow, setDataBorrow] = useState(item)
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState(0)
  const [amountReceive, setAmountReceive] = useState(0)
  const [contractBorrowETH, setContractBorrowETH] = useState<any>(null)
  const [contractBorrowBTC, setContractBorrowBTC] = useState<any>(null)
  const [contractBTC, setContractBTC] = useState<any>(null)
  const [contractETH, setContractETH] = useState<any>(null)
  const [buttonLoading, setButtonLoading] = useState('')
  const [borrow1Contract, setBorrow1Contract] = useState<any>()
  const [price, setPrice] = useState<any>({
    weth: 0,
    wbtc: 0,
    tusd: 1,
  })
  const { address, isConnected } = useAccount()
  const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
    useState(false)
  const dispatch = useDispatch()
  const [aprBorrow, setAprBorrow] = useState('')

  useEffect(() => {
    ; (async () => {
      const ethPrice = await getPriceToken('ETH')
      const btcPrice = await getPriceToken('BTC')
      setPrice({
        weth: ethPrice,
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
      if (contractBorrowETH && item.depositTokenSymbol === 'WETH') {
        const aprBorrowETH = await contractBorrowETH.methods.getApr().call({
          from: address,
        })
        setAprBorrow(web3.utils.fromWei(aprBorrowETH.toString(), 'ether'))
        setContractBorrowETH(contractBorrowETH)
      }

      if (contractBorrowBTC && item.depositTokenSymbol === 'WBTC') {
        const aprBorrowBTC = await contractBorrowBTC.methods.getApr().call({
          from: address,
        })
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

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.tokenContractInfo?.abi),
      item?.tokenContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.tokenContractInfo])

  const borrowContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.borrowContractInfo?.abi),
      item?.borrowContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.borrowContractInfo])

  const handleConfirmDeposit = async () => {
    if (!isConnected) {
      await open()
      return
    }
    setOpenConfirmDepositModal(true)
  }

  const onBorrow = async () => {
    if (amount <= 0) {
      toast.error('You must deposit WBTC to borrow')
      return
    }
    // if (amountReceive <= 0) {
    //   toast.error('Can not borrow less than 0 TUSD')
    //   return
    // }
    try {
      setIsLoading(true)
      if (item.depositTokenSymbol == 'WBTC') {
        const allowance = await tokenContract.methods
          .allowance(address, item.borrowContractInfo.address)
          .call()
        if (new BigNumber(allowance).lte(new BigNumber('0'))) {
          await tokenContract.methods
            .approve(
              item?.borrowContractInfo?.address,
              '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            )
            .send({
              from: address,
            })
        }
        const tokenDepositDecimals = await tokenContract.methods
          .decimals()
          .call()
        const borrow = Number(
          new BigNumber(amount.toFixed(tokenDepositDecimals))
            .multipliedBy(10 ** tokenDepositDecimals)
            .toString()
        )
        const usdcBorrowAmount = await borrowContract.methods
          .getBorrowableUsdc(borrow)
          .call()
        const newUsdcBorrowAmount = new BigNumber(usdcBorrowAmount)
          .multipliedBy(0.98)
          .toFixed(0)
          .toString()

        const borrowInfoMap = await borrowContract.methods
          .borrowInfoMap(address)
          .call()
        const tusdBorrowedAmount = borrowInfoMap?.baseBorrowed
        console.log('tusdBorrowedAmount :>> ', tusdBorrowedAmount)

        const tusdBorrowAmount = await borrowContract.methods
          .getMintableToken(newUsdcBorrowAmount, tusdBorrowedAmount, 0)
          .call()
        console.log(
          'params :>> ',
          borrow.toString(),
          newUsdcBorrowAmount,
          tusdBorrowAmount
        )

        // await borrowContract.methods
        //   .borrow(borrow.toString(), newUsdcBorrowAmount, tusdBorrowAmount)
        //   .send({
        //     from: address,
        //     gasPrice: '5000000000'
        //   })

        console.log(
          JSON.parse(item?.borrowContractInfo?.abi),
          item?.borrowContractInfo?.address
        )
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(address)
        const borrowContract2 = new ethers.Contract(
          item?.borrowContractInfo?.address,
          item?.borrowContractInfo?.abi,
          signer
        )
        const tx = await borrowContract2.borrow(
          borrow.toString(),
          newUsdcBorrowAmount,
          tusdBorrowAmount
        )
        await tx.wait()
        toast.success('Borrow Successful')
        setOpenConfirmDepositModal(false)
        setIsLoading(false)
        setIsFetchBorrowLoading && setIsFetchBorrowLoading((prev: any) => !prev)
      }
      if (item.depositTokenSymbol == 'WETH') {
        const allowance = await tokenContract.methods
          .allowance(address, item.borrowContractInfo.address)
          .call()
        if (new BigNumber(allowance).lte(new BigNumber('0'))) {
          await tokenContract.methods
            .approve(
              item?.borrowContractInfo?.address,
              '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            )
            .send({
              from: address,
            })
        }
        const tokenDepositDecimals = await tokenContract.methods
          .decimals()
          .call()
        const borrow = Number(
          new BigNumber(amount.toFixed(tokenDepositDecimals))
            .multipliedBy(10 ** tokenDepositDecimals)
            .toString()
        )
        const usdcBorrowAmount = await borrowContract.methods
          .getBorrowableUsdc(borrow)
          .call()
        const newUsdcBorrowAmount = new BigNumber(usdcBorrowAmount)
          .multipliedBy(0.98)
          .toFixed(0)
          .toString()

        const borrowInfoMap = await borrowContract.methods
          .borrowInfoMap(address)
          .call()
        const tusdBorrowedAmount = borrowInfoMap?.baseBorrowed
        console.log('tusdBorrowedAmount :>> ', tusdBorrowedAmount)

        const tusdBorrowAmount = await borrowContract.methods
          .getMintableToken(newUsdcBorrowAmount, tusdBorrowedAmount, 0)
          .call()
        console.log(
          'params :>> ',
          borrow.toString(),
          newUsdcBorrowAmount,
          tusdBorrowAmount
        )

        // await borrowContract.methods
        //   .borrow(borrow.toString(), newUsdcBorrowAmount, tusdBorrowAmount)
        //   .send({
        //     from: address,
        //     gasPrice: '5000000000'
        //   })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(address)
        const borrowContract2 = new ethers.Contract(
          item?.borrowContractInfo?.address,
          item?.borrowContractInfo?.abi,
          signer
        )

        console.log(
          'object :>> ',
          borrow.toString(),
          newUsdcBorrowAmount,
          tusdBorrowAmount
        )

        const tx = await borrowContract2.borrow(
          borrow.toString(),
          newUsdcBorrowAmount,
          tusdBorrowAmount
        )
        await tx.wait()
        toast.success('Borrow Successful')
        setOpenConfirmDepositModal(false)
        setIsLoading(false)
        setIsFetchBorrowLoading && setIsFetchBorrowLoading((prev: any) => !prev)
      }
      // dispatch(updateborrowTime(new Date().getTime() as any))
    } catch (e) {
      console.log('CreateBorrowItem.onBorrow', e)
      toast.error('Borrow Failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    initContract()
  }, [])

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
        className="rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-5 pt-3 text-[#030303] xl:px-[32px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white"
        key={dataBorrow.depositTokenSymbol}
      >
        <div className="flex w-full items-center justify-between">
          <div className="ml-[-12px] flex items-center">
            <img
              className="w-[72px] md:w-24"
              src={dataBorrow.depositTokenIcon}
              alt=""
            />
            <div className="font-larken text-[18px] leading-tight text-[#030303] md:text-[22px] lg:text-[26px] dark:text-white">
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
                  src="/assets/t-logo-circle.png"
                  alt=""
                  className="w-[24px]"
                />
                <div className="font-mona mx-1 uppercase text-[#AA5BFF] xs:mx-2">
                  +0.00 TORQ
                </div>
              </div>
            </Link>
          </Popover>
        </div>
        <div className="font-larken mb-1 mt-1 grid grid-cols-2 gap-4">
          <div className="flex w-full items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  lg:h-[140px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
            <InputCurrencySwitch
              tokenSymbol={item?.depositTokenSymbol}
              tokenValue={Number(amount)}
              className="w-full py-4 text-[#030303] lg:py-6 dark:text-white"
              subtitle="Collateral"
              usdDefault
              decimalScale={4}
              onChange={(e) => {
                setAmount(e)
              }}
            />
          </div>
          <div className="font-larken flex h-[110px] flex-col items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0 lg:h-[140px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
            <InputCurrencySwitch
              tokenSymbol="TUSD"
              tokenValue={Number(amountReceive)}
              tokenValueChange={Number(
                amount *
                price[`${dataBorrow.depositTokenSymbol.toLowerCase()}`] *
                (dataBorrow.loanToValue / 140)
              )}
              usdDefault
              decimalScale={4}
              className="w-full py-4 text-[#030303] dark:text-white"
              subtitle="Borrowing"
              onChange={(e) => {
                setAmountReceive(e)
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between py-4 text-[#959595]">
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
            <Link
              href={'https://tusd.torque.fi/'}
              className=""
              target={'_blank'}
            >
              <img
                src={'/icons/coin/torq-yi.svg'}
                alt="Torque USD"
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
            {!aprBorrow
              ? '-0.00%'
              : -(Number(aprBorrow) * 100).toFixed(2) + '%'}
          </p>
        </div>
        <div className="flex justify-between text-[#959595]">
          <p>Liquidity</p>
          <p>
            {!item?.liquidity ? '0.00%' : '$' + toMetricUnits(item?.liquidity)}
          </p>
        </div>
        <button
          className={`font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF] ${buttonLoading && 'cursor-not-allowed opacity-50'
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
      <ConfirmDepositModal
        open={isOpenConfirmDepositModal}
        handleClose={() => setOpenConfirmDepositModal(false)}
        confirmButtonText="Deposit & Borrow"
        onConfirm={() => onBorrow()}
        loading={isLoading}
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
            value: !aprBorrow
              ? '-0.00%'
              : -(Number(aprBorrow) * 100).toFixed(2) + '%',
          },
        ]}
      />
    </>
  )
}
