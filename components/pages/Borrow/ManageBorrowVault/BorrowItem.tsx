import CurrencySwitch from '@/components/common/CurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import SkeletonDefault from '@/components/skeleton'
import { MAX_UINT256 } from '@/constants/utils'
import { AppStore } from '@/types/store'
import { useWeb3Modal } from '@web3modal/react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AutowidthInput } from 'react-autowidth-input'
import { AiOutlineCheck, AiOutlineEdit } from 'react-icons/ai'
import { useMoralis } from 'react-moralis'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { tokenUsdcContract } from '../constants/contract'
import { IBorrowInfoManage } from '../types'
import { BorrowItemChart } from './BorrowItemChart'

enum Action {
  Repay = 'Repay',
  Withdraw = 'Withdraw',
}

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export default function BorrowItem({ item }: { item: IBorrowInfoManage }) {
  const { open } = useWeb3Modal()
  const refLabelInput = useRef<HTMLInputElement>(null)

  const borrowTime = useSelector((store: AppStore) => store)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [isExpand, setExpand] = useState(false)
  const [action, setAction] = useState(Action.Repay)
  const { Moralis, isWeb3Enabled } = useMoralis()
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState(0)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [borrowInfoMap, setBorrowInfoMap] = useState<any>()
  const [label, setLabel] = useState(item?.label)
  const [isEdit, setEdit] = useState(false)
  const { address, isConnected } = useAccount()
  const [borrowed, setBorrowed] = useState('0')
  const [collateral, setCollateral] = useState('0')
  const [depositedToken, setDepositedToken] = useState('0')
  const [ltv, setltv] = useState('')

  const tusdPrice = usdPrice['TUSD']
  const usdcPrice = usdPrice['USDC']

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

  const usdcContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenUsdcContract.abi),
      tokenUsdcContract.address
    )
    return contract
  }, [Web3.givenProvider, tokenUsdcContract])

  const handleGetBorrowData = async () => {
    if (!borrowContract || !address || !tokenContract) {
      return
    }

    try {
      const borrowInfoMap = await borrowContract.methods
        .borrowInfoMap(address)
        .call()
      setBorrowInfoMap(borrowInfoMap)
      console.log('borrowInfoMap :>> ', borrowInfoMap)

      const usdcDecimal = await usdcContract.methods.decimals().call()
      const collateral = new BigNumber(usdcPrice)
        .multipliedBy(
          ethers.utils.formatUnits(borrowInfoMap.supplied, usdcDecimal)
        )
        .toString()
      setCollateral(collateral)

      const tokenDecimal = await tokenContract.methods.decimals().call()
      const borrowed = new BigNumber(tusdPrice)
        .multipliedBy(
          ethers.utils.formatUnits(borrowInfoMap.baseBorrowed, tokenDecimal)
        )
        .toString()
      setBorrowed(borrowed)

      const depositTokenDecimal = await depositContract.methods
        .decimals()
        .call()
      const deposit = ethers.utils
        .formatUnits(borrowInfoMap.supplied, depositTokenDecimal)
        .toString()
      setDepositedToken(deposit)
      console.log('deposit :>> ', deposit)
      console.log('borrowed :>> ', borrowed)
      console.log('tokenDecimal :>> ', tokenDecimal)
      console.log('collateral :>> ', collateral)
      console.log('borrowInfoMap :>> ', borrowInfoMap)
    } catch (error) {
      console.log('handleGetBorrowData :>> ', error)
    }
  }

  useEffect(() => {
    handleGetBorrowData()
  }, [borrowContract])

  const onRepay = async () => {
    if (!isConnected || !address) {
      await open()
      return
    }
    setButtonLoading(true)
    try {
      const allowance = await tokenContract.methods
        .allowance(address, item.borrowContractInfo.address)
        .call()
      console.log('allowance :>> ', allowance)
      if (new BigNumber(allowance).lte(new BigNumber('0'))) {
        await tokenContract.methods
          .approve(item?.borrowContractInfo?.address, MAX_UINT256)
          .send({
            from: address,
          })
      }
      const balanceOfToken = await tokenContract.methods
        .balanceOf(address)
        .call()
      const tokenDecimal = await tokenContract.methods.decimals().call()
      const balanceToken = Number(
        ethers.utils.formatUnits(balanceOfToken, tokenDecimal).toString()
      )
      if (inputValue > Number(balanceToken)) {
        toast.error('Not enough TUSD to repay')
        return
      }
      const amountRepay = ethers.utils
        .parseUnits(inputValue.toString(), tokenDecimal)
        .toString()
      console.log('amountRepay :>> ', amountRepay)
      const wbtcWithdraw = await borrowContract.methods
        .getWbtcWithdraw(amountRepay, address)
        .call()
      console.log('wbtcWithdraw :>> ', wbtcWithdraw)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const borrowContract2 = new ethers.Contract(
        item?.borrowContractInfo?.address,
        item?.borrowContractInfo?.abi,
        signer
      )

      const tx = await borrowContract2.repay(amountRepay, wbtcWithdraw)
      await tx.wait()
      toast.success('Repay Successfully')
      handleGetBorrowData()
      setInputValue(0)
    } catch (e) {
      console.log(e)
      toast.error('Repay Failed')
    } finally {
      setButtonLoading(false)
    }
  }

  const onWithdraw = async () => {
    if (!isConnected || !address) {
      await open()
      return
    }
    setButtonLoading(true)
    try {
      // await depositContract?.methods
      //   .approve(item?.borrowContractInfo.address, MAX_UINT256)
      //   .send({
      //     from: address,
      //   })

      console.log('inputValue :>> ', inputValue)
      const depositTokenDecimal = await depositContract.methods
        .decimals()
        .call()

      // await borrowContract?.methods
      //   .withdraw(
      //     ethers.utils
      //       .parseUnits(inputValue.toFixed(5).toString(), depositTokenDecimal)
      //       .toString()
      //   )
      //   .send({
      //     from: address,
      //   })

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const borrowContract2 = new ethers.Contract(
        item?.borrowContractInfo?.address,
        item?.borrowContractInfo?.abi,
        signer
      )
      console.log(
        'params :>> ',
        ethers.utils
          .parseUnits(inputValue.toFixed(5).toString(), depositTokenDecimal)
          .toString()
      )
      const tx = await borrowContract2.withdraw(
        ethers.utils
          .parseUnits(inputValue.toFixed(5).toString(), depositTokenDecimal)
          .toString()
      )
      await tx.wait()
      toast.success('Withdraw Successfully')
    } catch (e) {
      console.log(e)
      toast.error('Withdraw Failed')
    } finally {
      setButtonLoading(false)
    }
  }

  const getDataNameBorrow = async () => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })
    setLabel(data[`${item.labelKey}`] || item?.label)
  }

  const updateDataNameBorrow = async (name: string) => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })

    data[`${item.labelKey}`] = name
    data[`address`] = address
    await Moralis.Cloud.run('updateDataBorrowUser', {
      ...data,
    })
      .then(() => {
        toast.success('Update name successful')
        getDataNameBorrow()
      })
      .catch(() => {
        toast.error('Update name failed')
      })
  }

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  useEffect(() => {
    getDataNameBorrow()
  }, [address])

  useEffect(() => {
    getDataNameBorrow()
  }, [isWeb3Enabled, address, isConnected, borrowTime])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  useEffect(() => {
    if (isEdit && refLabelInput.current) {
      refLabelInput.current.focus()
    }
  }, [isEdit])

  const renderSubmitText = () => {
    if (!address) {
      return 'Connect Wallet'
    }
    return action
  }

  const summaryInfo = (
    <div className="flex w-full text-center md:w-[400px] lg:w-[500px] xl:w-[600px]">
      <CurrencySwitch
        tokenSymbol={''}
        tokenValue={borrowInfoMap?.supplied || item.collateral}
        className="font-larken -my-4 w-1/4 space-y-1 py-4"
        decimalScale={5}
        render={(value) => (
          <div>
            <p className="mb-[12px] whitespace-nowrap text-[22px]">
              ${Number(collateral || 0)?.toFixed(5)}
            </p>
            <p className="font-mona text-[14px] text-[#959595]">Collateral</p>
          </div>
        )}
      />
      <CurrencySwitch
        tokenSymbol={'TUSD'}
        tokenValue={borrowInfoMap?.borrowed || item.borrowed}
        usdDefault
        className="font-larken -my-4 w-1/4 space-y-1 py-4"
        decimalScale={5}
        render={(value) => (
          <div>
            <p className="mb-[12px] text-[22px] leading-none">
              ${Number(borrowed || 0)?.toFixed(5)}
            </p>
            <p className="font-mona text-[14px] text-[#959595]">Borrowed</p>
          </div>
        )}
      />
      <div className="w-1/4 space-y-1">
        <p className="font-larken whitespace-nowrap text-[22px]">
          {Number(ltv) * 100}%
        </p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">
          Loan-to-value
        </p>
      </div>
      <div className="w-1/4 space-y-1">
        <p className="font-larken whitespace-nowrap text-[22px]">
          {-borrowAPR.toFixed(2)}%
        </p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">
          Variable APR
        </p>
      </div>
    </div>
  )
  if (isLoading)
    return (
      <div className="">
        <SkeletonDefault height={'10vh'} width={'100%'} />
      </div>
    )
  else
    return (
      <>
        <div className="rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
          <div className="flex items-center px-[24px] py-[16px]">
            <div className="xlg:w-[calc(100%-600px-64px)] font-larken flex w-[calc(100%-64px)] items-center space-x-2 text-[22px] md:w-[calc(100%-400px-64px)] lg:w-[calc(100%-500px-64px)]">
              {!isEdit && (
                <div
                  className="flex min-w-max cursor-pointer items-center text-[22px]"
                  onClick={() => setEdit(!isEdit)}
                >
                  <img
                    className="mr-2 w-[54px]"
                    src={`/icons/coin/${item.depositTokenSymbol.toLowerCase()}.png`}
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
                    src={`/icons/coin/${item.depositTokenSymbol.toLowerCase()}.png`}
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
                        updateDataNameBorrow(label)
                        setEdit(!isEdit)
                      }}
                    />
                  </button>
                </div>
              )}
            </div>
            <div className="hidden md:block">{summaryInfo}</div>
            <div
              className="flex h-[64px] w-[64px] cursor-pointer select-none items-center justify-center rounded-full"
              onClick={() => setExpand(!isExpand)}
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
              ` ${isExpand
                ? 'max-h-[1000px] py-[16px] ease-in'
                : 'max-h-0 py-0 ease-out'
              }`
            }
          >
            <div className="w-full md:hidden">{summaryInfo}</div>
            <div className=" w-full md:w-[40%] lg:w-[50%] xl:w-[55%]">
              {/* <Chart
              chartData={[
                {
                  time: new Date().toISOString(),
                  balanceUsd:
                    dataUserBorrow?.supplied * price[item.token.toLowerCase()],
                },
                {
                  time: new Date().toISOString(),
                  balanceUsd:
                    dataUserBorrow?.supplied * price[item.token.toLowerCase()],
                },
              ]}
            /> */}
              {/* <img src="/assets/pages/boost/chart.svg" alt="" /> */}
              <BorrowItemChart
                label="Borrow Apr"
                tokenAddress={item?.borrowContractInfo.address}
                tokenDecimals={item?.depositTokenDecimal}
                tokenPrice={
                  item?.depositTokenSymbol === 'WBTC'
                    ? usdPrice['wbtc']
                    : usdPrice['aeth']
                }
                aprPercent={-borrowAPR}
              />
              {/* <VaultChart
                label="Borrow Apr"
                percent={borrowAPR}
                value={49510000}
              /> */}
            </div>
            <div className="w-full space-y-6 md:w-[60%] md:pl-[36px] lg:w-[50%] xl:w-[45%]">
              <div className="flex items-center justify-between">
                <p className="font-larken text-[24px]">
                  {action}{' '}
                  {action == Action.Repay ? 'TUSD' : item.depositTokenSymbol}
                </p>
                <div className="rounded-md border from-[#161616] via-[#161616]/40 to-[#0e0e0e] dark:border-[#1A1A1A] dark:bg-gradient-to-b">
                  {[Action.Repay, Action.Withdraw].map((item, i) => (
                    <button
                      key={i}
                      className={
                        'w-[52px]  py-[8px] text-[10px] leading-none xs:w-[80px] xs:text-[12px]' +
                        ` ${action === item
                          ? 'rounded-md bg-[#F4F4F4] dark:bg-[#171717]'
                          : 'text-[#959595]'
                        }`
                      }
                      onClick={() => {
                        console.log('323 :>> ', 323);
                        setInputValue(0)
                        setAction(item)
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between rounded-xl border bg-[#FCFAFF] from-[#161616] via-[#161616]/40 to-[#0e0e0e] p-[12px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
                <NumericFormat
                  className="w-[200px] bg-transparent"
                  placeholder="Select amount"
                  value={inputValue || null}
                  onChange={(e) => {
                    setInputValue(Number(e.target.value))
                  }}
                  decimalScale={5}
                />
                <div className="flex select-none justify-between space-x-1 text-[12px] text-[#959595] sm:text-[14px]">
                  {[25, 50, 100].map((percent, i) => (
                    <div
                      className="cursor-pointer rounded-md bg-[#F4F4F4]  px-[6px] py-[2px] transition active:scale-95 xs:px-[8px] xs:py-[4px] dark:bg-[#171717]"
                      onClick={() => {
                        if (action == Action.Withdraw) {
                          setInputValue(
                            (Number(depositedToken) * percent) / 100.01
                          )
                        } else {
                          setInputValue((Number(borrowed) * percent) / 100.01)
                        }
                      }}
                      key={i}
                    >
                      {percent}%
                    </div>
                  ))}
                </div>
              </div>
              <button
                className={`font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF] ${buttonLoading && 'cursor-not-allowed opacity-50'
                  }`}
                disabled={buttonLoading}
                onClick={() =>
                  action == Action.Repay ? onRepay() : onWithdraw()
                }
              >
                {buttonLoading && <LoadingCircle />}
                {renderSubmitText()}
              </button>
            </div>
          </div>
        </div>
      </>
    )
}
