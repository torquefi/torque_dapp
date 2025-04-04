import CurrencySwitch from '@/components/common/CurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import SkeletonDefault from '@/components/skeleton'
import { MAX_UINT256 } from '@/constants/utils'
import { LabelApi } from '@/lib/api/LabelApi'
import { AppStore } from '@/types/store'
import { useWeb3Modal } from '@web3modal/react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AutowidthInput } from 'react-autowidth-input'
import { AiOutlineCheck, AiOutlineEdit } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { IBorrowInfoManage } from '../types'
import { BorrowItemChart } from './BorrowItemChart'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { cn } from '@/lib/helpers/utils'

enum Action {
  Borrow = 'Borrow',
  Repay = 'Repay',
  Withdraw = 'Withdraw',
}

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365

interface IBorrowItemProps {
  item: IBorrowInfoManage
  className?: string
}

export default function BorrowItem({ item, className }: IBorrowItemProps) {
  const { open } = useWeb3Modal()
  const refLabelInput = useRef<HTMLInputElement>(null)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [isExpand, setExpand] = useState(false)
  const [action, setAction] = useState(Action.Borrow)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [sliderValue, setSliderValue] = useState(0)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [label, setLabel] = useState(item?.label)
  const [isEdit, setEdit] = useState(false)
  const { address, isConnected } = useAccount()
  const [borrowed, setBorrowed] = useState('0')
  const [collateral, setCollateral] = useState('0')
  const [depositedToken, setDepositedToken] = useState('0')
  const [maxMoreMinTable, setMaxMoreMinTable] = useState('0')
  const [collateralWithdraw, setCollateralWithdraw] = useState('0')
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)

  const tusdPrice = usdPrice['TUSD']
  const usdcPrice = usdPrice['USDC']
  const usdtPrice = usdPrice['USDT']

  const borrowAPR = useMemo(
    () =>
      Number(ethers.utils.formatUnits(item?.borrowRate, 18).toString()) *
      SECONDS_PER_YEAR *
      100,
    [item?.borrowRate]
  )

  const depositContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.depositContractInfo?.abi),
      item?.depositContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.depositContractInfo])

  const borrowContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.borrowContractInfo?.abi),
      item?.borrowContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.borrowContractInfo])

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.tokenContractInfo?.abi),
      item?.tokenContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.tokenContractInfo])

  const handleGetBorrowData = async () => {
    if (!borrowContract || !address || !tokenContract) {
      return
    }
    try {
      const userDetails = await borrowContract.methods
        .getUserDetails(address)
        .call()
      const depositTokenDecimal = await depositContract.methods
        .decimals()
        .call()
      const collateral = new BigNumber(
        ethers.utils.formatUnits(userDetails?.['0'], depositTokenDecimal)
      ).toString()
      setCollateral(collateral)

      const tokenDecimal = await tokenContract.methods.decimals().call()
      if (item.borrowTokenSymbol === 'TUSD') {
        const maxMoreMinTable = await borrowContract.methods
          .maxMoreMintable(address)
          .call()
        setMaxMoreMinTable(
          new BigNumber(
            ethers.utils.formatUnits(maxMoreMinTable, tokenDecimal)
          ).toString()
        )
      }

      if (item.borrowTokenSymbol === 'USDC') {
        const maxMoreMinTable = await borrowContract.methods
          .getMoreBorrowableUsdc(address)
          .call()
        setMaxMoreMinTable(
          new BigNumber(
            ethers.utils.formatUnits(maxMoreMinTable, tokenDecimal)
          ).toString()
        )
      }

      if (item.borrowTokenSymbol === 'USDT') {
        const maxMoreMinTable = await borrowContract.methods
          .getMoreBorrowableUsdt(address)
          .call()
        setMaxMoreMinTable(
          new BigNumber(
            ethers.utils.formatUnits(maxMoreMinTable, tokenDecimal)
          ).toString()
        )
      }

      if (item.borrowTokenSymbol === 'TUSD') {
        const borrowed = new BigNumber(tusdPrice || 0)
          .multipliedBy(
            ethers.utils.formatUnits(userDetails?.['2'], tokenDecimal)
          )
          .toString()
        setBorrowed(borrowed)
      }
      if (item.borrowTokenSymbol === 'USDC') {
        const borrowed = new BigNumber(usdcPrice || 0)
          .multipliedBy(
            ethers.utils.formatUnits(userDetails?.['1'], tokenDecimal)
          )
          .toString()
        setBorrowed(borrowed)
      }
      if (item.borrowTokenSymbol === 'USDT') {
        const borrowed = new BigNumber(usdtPrice || 0)
          .multipliedBy(
            ethers.utils.formatUnits(userDetails?.['3'], tokenDecimal)
          )
          .toString()
        setBorrowed(borrowed)
      }

      const deposit = ethers.utils
        .formatUnits(userDetails?.['0'], depositTokenDecimal)
        .toString()
      setDepositedToken(deposit)
    } catch (error) {
      console.log('handleGetBorrowData :>> ', error)
    }
  }

  useEffect(() => {
    handleGetBorrowData()
  }, [borrowContract, usdPrice])

  const approveSpending = async (amount: string) => {
    const userAddressContract = await borrowContract.methods
      .userContract(address)
      .call()
    const allowance = await tokenContract.methods
      .allowance(address, userAddressContract)
      .call()
    if (new BigNumber(allowance).lt(new BigNumber(amount))) {
      await tokenContract.methods.approve(userAddressContract, amount).send({
        from: address,
      })
    }
  }

  const onRepay = async () => {
    setButtonLoading(true)
    try {
      const balanceOfToken = await tokenContract.methods
        .balanceOf(address)
        .call()
      const tokenDecimal = await tokenContract.methods.decimals().call()
      const balanceToken = Number(
        ethers.utils.formatUnits(balanceOfToken, tokenDecimal).toString()
      )
      if (new BigNumber(inputValue).gt(new BigNumber(balanceToken))) {
        toast.error(`Not enough ${item.borrowTokenSymbol} to repay`)
        return
      }
      const amountRepay = ethers.utils
        .parseUnits(Number(inputValue).toFixed(tokenDecimal), tokenDecimal)
        .toString()

      await approveSpending(amountRepay)

      const collateralWithdraw = ethers.utils
        .parseUnits(
          (Number(collateral) * (sliderValue / 100)).toFixed(tokenDecimal),
          tokenDecimal
        )
        .toString()

      let withdraw = 0
      if (item.borrowTokenSymbol === 'TUSD') {
        if (item.depositTokenSymbol === 'WBTC') {
          withdraw = await borrowContract.methods
            .getWbtcWithdraw(address, amountRepay)
            .call()
        } else {
          withdraw = await borrowContract.methods
            .getWethWithdraw(address, amountRepay)
            .call()
        }
      }

      if (item.borrowTokenSymbol === 'USDC') {
        if (item.depositTokenSymbol === 'WBTC') {
          withdraw = await borrowContract.methods
            .getWbtcWithdrawWithSlippage(address, amountRepay, 0)
            .call()
        } else {
          withdraw = await borrowContract.methods
            .getWethWithdrawWithSlippage(address, amountRepay, 0)
            .call()
        }
      }

      if (item.borrowTokenSymbol === 'USDT') {
        if (item.depositTokenSymbol === 'WBTC') {
          withdraw = await borrowContract.methods
            .getWbtcWithdrawWithSlippageUsdt(address, amountRepay, 0)
            .call()
        } else {
          withdraw = await borrowContract.methods
            .getWethWithdrawWithSlippageUsdt(address, amountRepay, 0)
            .call()
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const borrowContract2 = new ethers.Contract(
        item?.borrowContractInfo?.address,
        item?.borrowContractInfo?.abi,
        signer
      )

      console.log('params :>> ', amountRepay, collateralWithdraw)
      const tx = await borrowContract2.callRepay(
        amountRepay,
        collateralWithdraw
      )
      await tx.wait()
      toast.success('Repay Successful')
      handleGetBorrowData()
      setInputValue('')
    } catch (e) {
      console.log(e)
      toast.error('Repay Failed')
    } finally {
      setButtonLoading(false)
    }
  }

  const onWithdraw = async () => {
    setButtonLoading(true)
    try {
      const depositTokenDecimal = await depositContract.methods
        .decimals()
        .call()

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const borrowContract2 = new ethers.Contract(
        item?.borrowContractInfo?.address,
        item?.borrowContractInfo?.abi,
        signer
      )
      console.log('inputValue :>> ', inputValue)
      console.log('depositTokenDecimal :>> ', depositTokenDecimal)
      console.log(
        'params :>> ',
        ethers.utils
          .parseUnits(
            Number(inputValue).toFixed(depositTokenDecimal).toString(),
            depositTokenDecimal
          )
          .toString()
      )
      const tx = await borrowContract2.callWithdraw(
        ethers.utils
          .parseUnits(
            Number(inputValue).toFixed(depositTokenDecimal).toString(),
            depositTokenDecimal
          )
          .toString()
      )
      await tx.wait()
      toast.success('Withdraw Successful')
    } catch (e) {
      console.log(e)
      toast.error('Withdraw Failed')
    } finally {
      setButtonLoading(false)
    }
  }

  const onBorrow = async () => {
    try {
      setButtonLoading(true)
      const tokenDecimal = await tokenContract.methods.decimals().call()
      const tokenBorrowAmount = ethers.utils
        .parseUnits(Number(inputValue).toFixed(tokenDecimal), tokenDecimal)
        .toString()

      await approveSpending(tokenBorrowAmount)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const borrowContract2 = new ethers.Contract(
        item?.borrowContractInfo?.address,
        item?.borrowContractInfo?.abi,
        signer
      )
      console.log('tokenBorrowAmount :>> ', tokenBorrowAmount)

      if (item.borrowTokenSymbol === 'TUSD') {
        const tx = await borrowContract2.callMintTUSD(tokenBorrowAmount)
        await tx.wait()
      }
      if (item.borrowTokenSymbol === 'USDC') {
        const tx = await borrowContract2.callBorrowMore(tokenBorrowAmount)
        await tx.wait()
      }
      if (item.borrowTokenSymbol === 'USDT') {
        const tx = await borrowContract2.callBorrowMoreUsdt(tokenBorrowAmount)
        await tx.wait()
      }

      toast.success('Borrow Successful')
      handleGetBorrowData()
      setIsLoading(false)
    } catch (e) {
      console.log('CreateBorrowItem.onBorrow', e)
      toast.error('Borrow Failed')
    } finally {
      setButtonLoading(false)
    }
  }

  const handleAction = async () => {
    if (!isConnected || !address) {
      setOpenConnectWalletModal(true)
      return
    }
    if (!inputValue) {
      toast.error('You must input amount')
      return
    }
    if (action === Action.Borrow) {
      onBorrow()
    } else if (action === Action.Repay) {
      onRepay()
    } else if (action === Action.Withdraw) {
      onWithdraw()
    }
  }

  const updateBorrowLabel = async () => {
    setEdit(false)
    try {
      await LabelApi.updateLabel({
        walletAddress: address,
        tokenSymbol: item?.depositTokenSymbol,
        position: 'Borrow',
        name: label,
        symbol: item.borrowTokenSymbol,
      })
      toast.success('Update name successful')
    } catch (error) {
      toast.error('Update name failed')
      console.error('updateBorrowLabel', error)
    }
  }

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  useEffect(() => {
    if (isEdit && refLabelInput.current) {
      refLabelInput.current.focus()
    }
  }, [isEdit])

  useEffect(() => {
    setLabel(item?.label)
  }, [item?.label])

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
    const collateralValue = parseFloat(collateral)
    const newCollateralWithdraw = (collateralValue * (value / 100)).toFixed(5)
    setCollateralWithdraw(newCollateralWithdraw)
  }

  const handlePercentageClick = (percent: number) => {
    if (action === Action.Repay) {
      const newRepayValue = new BigNumber(borrowed)
        .multipliedBy(percent)
        .dividedBy(100.01)
        .toString()
      setInputValue(newRepayValue)
    } else if (action === Action.Borrow) {
      const newBorrowValue = new BigNumber(maxMoreMinTable)
        .multipliedBy(percent)
        .dividedBy(100.01)
        .toString()
      setInputValue(newBorrowValue)
    } else if (action === Action.Withdraw) {
      const newWithdrawValue = new BigNumber(depositedToken)
        .multipliedBy(percent)
        .dividedBy(100.01)
        .toString()
      setInputValue(newWithdrawValue)
    }
  }

  const renderSubmitText = () => {
    if (!address) {
      return 'Connect Wallet'
    }
    return action
  }

  const collateralUsd = (
    Number(collateral || 0) * (usdPrice[item?.depositTokenSymbol] || 0)
  )?.toFixed(5)

  const summaryInfo = (
    <div className="mb-3 grid w-full grid-cols-2 gap-[12px] py-[10px] md:mb-0 md:w-[500px] md:grid-cols-4 lg:w-[600px] xl:w-[700px]">
      <CurrencySwitch
        tokenSymbol={item.depositTokenSymbol}
        tokenValue={collateral ? Number(collateral) : 0}
        className="font-rogan flex w-full flex-col items-center justify-center space-y-1 rounded-[12px] border border-[1px] border-[#E6E6E6] bg-[#FCFCFC] py-4 text-center dark:border-[#1A1A1A] dark:bg-transparent md:-my-4 md:border-none md:bg-transparent"
        decimalScale={5}
        render={(value) => (
          <div>
            <p className="mb-[12px] whitespace-nowrap text-[22px]">{value}</p>
            <p className="font-rogan-regular text-[14px] text-[#959595]">
              Collateral
            </p>
          </div>
        )}
        usdDefault
      />
      <CurrencySwitch
        tokenSymbol={item.borrowTokenSymbol}
        tokenValue={borrowed ? Number(borrowed) : 0}
        usdDefault
        className="font-rogan flex w-full flex-col items-center justify-center space-y-1 rounded-[12px] border border-[1px] border-[#E6E6E6] bg-[#FCFCFC] py-4 text-center dark:border-[#1A1A1A] dark:bg-transparent md:-my-4 md:border-none md:bg-transparent"
        decimalScale={5}
        render={(value) => (
          <div>
            <p className="mb-[12px] text-[22px] leading-none">{value}</p>
            <p className="font-rogan-regular text-[14px] text-[#959595]">
              Borrowed
            </p>
          </div>
        )}
      />
      <div className="font-rogan flex w-full flex-col items-center justify-center space-y-1 rounded-[12px] border border-[1px] border-[#E6E6E6] bg-[#FCFCFC] py-4 text-center dark:border-[#1A1A1A] dark:bg-transparent md:-my-4 md:border-none md:bg-transparent">
        <p className="whitespace-nowrap text-[22px]">
          {!Number(collateralUsd)
            ? 0
            : +((Number(borrowed || 0) / Number(collateralUsd)) * 100).toFixed(
                2
              ) || 0}
          %
        </p>
        <p className="font-rogan-regular whitespace-nowrap text-[14px] text-[#959595]">
          Loan-to-value
        </p>
      </div>
      <div className="font-rogan flex w-full flex-col items-center justify-center space-y-1 rounded-[12px] border border-[1px] border-[#E6E6E6] bg-[#FCFCFC] py-4 text-center dark:border-[#1A1A1A] dark:bg-transparent md:-my-4 md:border-none md:bg-transparent">
        <p className="whitespace-nowrap text-[22px]">
          {borrowAPR ? -borrowAPR.toFixed(2) : 0}%
        </p>
        <p className="font-rogan-regular whitespace-nowrap text-[14px] text-[#959595]">
          Variable APR
        </p>
      </div>
    </div>
  )

  // if (isLoading) {
  //   return (
  //     <div className="">
  //       <SkeletonDefault height={'10vh'} width={'100%'} />
  //     </div>
  //   )
  // }

  return (
    <>
      <div
        className={cn(
          'rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white',
          className
        )}
      >
        <div className="flex items-center px-[18px] py-[10px] md:px-[24px]">
          <div className="font-rogan flex w-[calc(100%-64px)] items-center space-x-2 text-[22px] md:w-[calc(100%-400px-64px)] lg:w-[calc(100%-500px-64px)] xl:w-[calc(100%-600px-64px)]">
            <div className="flex items-center text-[22px]">
              <div className="relative flex justify-center -space-x-14">
                <img
                  className="mr-1 w-[54px]"
                  src={`/icons/coin/${item.depositTokenSymbol.toLowerCase()}.png`}
                  alt=""
                />
                <img
                  className="z-1 absolute bottom-1 right-1 w-[20px] object-cover md:w-[28px]"
                  src={`/icons/coin/${item.borrowTokenSymbol.toLowerCase()}${
                    item.borrowTokenSymbol === 'USDC' ? '.svg' : '.png'
                  }`}
                  alt=""
                />
              </div>
              <div className="flex items-center">
                {!isEdit ? (
                  <>
                    <div className="mr-1 flex-shrink-0">{label}</div>
                    <div className="relative flex items-center">
                      <button
                        className="absolute ml-[4px]"
                        onClick={() => setEdit(true)}
                      >
                        <AiOutlineEdit />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <AutowidthInput
                      ref={refLabelInput}
                      className="min-w-[60px] bg-transparent"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      onKeyUp={(e) => e.key === 'Enter' && updateBorrowLabel()}
                    />
                    <div className="relative flex items-center">
                      <button
                        className="absolute ml-[4px]"
                        onClick={() => updateBorrowLabel()}
                      >
                        <AiOutlineCheck />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">{summaryInfo}</div>
          <div
            className="flex h-[64px] w-[64px] cursor-pointer select-none items-center justify-center rounded-full"
            onClick={() => {
              setExpand(!isExpand)
              setInputValue('')
              setAction(Action.Borrow)
            }}
          >
            <img
              className={
                'w-[18px] transition-all' + ` ${isExpand ? 'rotate-180' : ''}`
              }
              src={
                theme == 'light'
                  ? '/icons/dropdow-dark.png'
                  : '/icons/arrow-down.svg'
              }
              alt=""
            />
          </div>
        </div>
        <div
          className={
            'flex flex-wrap overflow-hidden px-[16px] transition-all duration-300 sm:px-[24px]' +
            ` ${
              isExpand
                ? 'max-h-[1000px] py-[16px] ease-in'
                : 'max-h-0 py-0 ease-out'
            }`
          }
        >
          <div className="w-full md:hidden">{summaryInfo}</div>
          <div className="mb-[24px] w-full md:mb-0 md:w-[40%] lg:w-[50%] xl:w-[55%]">
            <BorrowItemChart
              label="Borrow Apr"
              tokenAddress={item?.borrowContractInfo.address}
              tokenDecimals={item?.depositTokenDecimal}
              tokenPrice={
                item?.depositTokenSymbol === 'WBTC'
                  ? usdPrice['wbtc']
                  : usdPrice['weth']
              }
              aprPercent={-borrowAPR}
            />
          </div>
          <div className="w-full space-y-4 md:w-[60%] md:space-y-5 md:pl-[36px] lg:w-[50%] xl:w-[45%]">
            <div className="flex items-center justify-between">
              <p className="font-rogan text-[24px]">
                {action}{' '}
                {action == Action.Repay || action === Action.Borrow
                  ? item.borrowTokenSymbol
                  : item.depositTokenSymbol}
              </p>
              <div className="rounded-md border from-[#161616] via-[#161616]/40 to-[#0e0e0e] dark:border-[#1A1A1A] dark:bg-gradient-to-b">
                {[Action.Borrow, Action.Repay, Action.Withdraw].map(
                  (item, i) => (
                    <button
                      key={i}
                      className={
                        'w-[52px]  py-[8px] text-[10px] leading-none xs:w-[80px] xs:text-[12px]' +
                        ` ${
                          action === item
                            ? 'rounded-md bg-[#F4F4F4] dark:bg-[#171717]'
                            : 'text-[#959595]'
                        }`
                      }
                      onClick={() => {
                        setInputValue('')
                        setAction(item)
                      }}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="flex justify-between rounded-xl border bg-[#FFFFFF] from-[#161616] via-[#161616]/40 to-[#0e0e0e] p-[12px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
              <NumericFormat
                className="w-[200px] bg-transparent"
                placeholder="Select amount"
                value={inputValue || null}
                onChange={(e) => {
                  setInputValue(e.target.value)
                }}
                decimalScale={5}
              />
              <div className="flex select-none justify-between space-x-1 text-[12px] text-[#959595] sm:text-[14px]">
                {[25, 50, 100].map((percent, i) => (
                  <div
                    className="cursor-pointer rounded-md bg-[#F4F4F4]  px-[6px] py-[2px] transition active:scale-95 dark:bg-[#171717] xs:px-[8px] xs:py-[4px]"
                    onClick={() => handlePercentageClick(percent)}
                    key={i}
                  >
                    {percent}%
                  </div>
                ))}
              </div>
            </div>
            {action === Action.Repay && (
              <div className="w-full">
                <p className="font-rogan mb-2 text-[18px]">
                  Collateral Withdraw Amount
                </p>
                <div className="flex items-center space-x-2">
                  <p className="font-rogan text-[14px]">{sliderValue}%</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                    onChange={(e) =>
                      handleSliderChange(parseInt(e.target.value))
                    }
                    style={{
                      background: `linear-gradient(to right, #AA5BFF ${sliderValue}%, ${
                        theme === 'light' ? '#E5E7EB' : '#374151'
                      } ${sliderValue}%)`,
                    }}
                  />
                </div>
              </div>
            )}
            <button
              className={`font-rogan-regular mt-2 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF] md:mt-3 ${
                buttonLoading && 'cursor-not-allowed opacity-50'
              }`}
              disabled={buttonLoading}
              onClick={handleAction}
            >
              {buttonLoading && <LoadingCircle />}
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
