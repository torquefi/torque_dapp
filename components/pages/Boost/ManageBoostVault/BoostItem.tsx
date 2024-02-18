import CurrencySwitch from '@/components/common/CurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { useTokensDataRequest } from '@/domain/synthetics/tokens'
import { LabelApi } from '@/lib/api/LabelApi'
import { bigNumberify } from '@/lib/numbers'
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
import { useAccount, useChainId } from 'wagmi'
import { arbitrum } from 'wagmi/dist/chains'
import Web3 from 'web3'
import { estimateExecuteWithdrawalGasLimit, getExecutionFee } from '../hooks/getExecutionFee'
import { useGasLimits } from '../hooks/useGasLimits'
import { useGasPrice } from '../hooks/useGasPrice'
import { IBoostInfo } from '../types'
import { BoostItemChart } from './BoostItemChart'

interface BoostItemProps {
  item: IBoostInfo
  onWithdrawSuccess?: VoidFunction
}

export function BoostItem({ item, onWithdrawSuccess }: BoostItemProps) {
  const { open } = useWeb3Modal()
  const chainId = useChainId()
  const { address, isConnected } = useAccount()
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const refLabelInput = useRef<HTMLInputElement>(null)

  const [isOpen, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [isEdit, setEdit] = useState(false)
  const [isSubmitLoading, setSubmitLoading] = useState(false)
  const [label, setLabel] = useState(item?.defaultLabel)
  const [apr, setApr] = useState('')
  const [earnings, setEarnings] = useState('')
  const [deposited, setDeposited] = useState('')
  const [isExecuteLoading, setIsExecuteLoading] = useState(false)
  const { tokensData, pricesUpdatedAt } = useTokensDataRequest(chainId)
  const { gasPrice } = useGasPrice(chainId)

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.tokenContractInfo?.abi),
      item?.tokenContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item?.tokenSymbol])

  const gmxContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    if (!item?.gmxContractInfo?.abi) {
      console.error('Token contract ABI is undefined')
      return null
    }
    return new web3.eth.Contract(
      JSON.parse(item.gmxContractInfo.abi),
      item.gmxContractInfo.address
    )
  }, [Web3.givenProvider, item.gmxContractInfo])

  const boostContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.boostContractInfo?.abi),
      item?.boostContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item?.tokenSymbol])

  const { gasLimits } = useGasLimits(arbitrum.id)

  console.log('gasLimits :>> ', gasLimits)



  const handleGetBoostData = async () => {
    if (!boostContract || !address || !tokenContract) {
      return
    }

    try {
      const tokenDecimal = await tokenContract.methods.decimals().call()
      const deposited = await boostContract.methods.balanceOf(address).call()
      setDeposited(
        new BigNumber(
          ethers.utils.formatUnits(deposited, tokenDecimal)
        ).toString()
      )
    } catch (error) {
      console.log('error get boost data item :>> ', error)
    }
  }

  useEffect(() => {
    handleGetBoostData()
  }, [boostContract, address, tokenContract])

  const onWithdraw = async () => {
    if (!isConnected || !address) {
      await open()
      return
    }
    setIsExecuteLoading(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const gmxContract2 = new ethers.Contract(
        item?.gmxContractInfo?.address,
        JSON.parse(item?.gmxContractInfo?.abi),
        signer
      )
      const slippage = 10
      await gmxContract.methods.withdrawAmount(slippage).send({ from: address })
      // await tx.wait()
      toast.success('Execute Successfully')
      handleGetBoostData()
    } catch (error) {
      console.log('error :>> ', error)
      toast.error('Execute Failed')
    } finally {
      setIsExecuteLoading(false)
    }
  }

  const onCreate = async () => {
    if (!isConnected || !address) {
      await open()
      return
    }
    try {
      setSubmitLoading(true)
      const decimalToken = await tokenContract.methods.decimals().call()
      const withdrawAmount = ethers.utils
        .parseUnits(Number(amount).toFixed(decimalToken), decimalToken)
        .toString()

      const allowanceToken = await tokenContract.methods
        .allowance(address, item?.boostContractInfo?.address)
        .call()
      if (
        new BigNumber(allowanceToken).lte(new BigNumber('0')) ||
        new BigNumber(allowanceToken).lte(withdrawAmount)
      ) {
        // await tokenContract.methods
        //   .approve(
        //     item?.boostContractInfo?.address,
        //     '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        //   )
        //   .send({ from: address })
      }
      // const executionFee = await gmxContract.methods.executionFee().call()

      const estimateExecuteWithdrawalGasLimitValue =
        estimateExecuteWithdrawalGasLimit(gasLimits, {})

      console.log(
        'estimateExecuteWithdrawalGasLimit',
        estimateExecuteWithdrawalGasLimitValue?.toString()
      )

      const executionFee = getExecutionFee(
        chainId,
        gasLimits,
        tokensData,
        estimateExecuteWithdrawalGasLimitValue,
        gasPrice
      )

      const executionFeeAmount = bigNumberify(executionFee?.feeTokenAmount).toString()

      console.log('executionFeeAmount', executionFeeAmount, executionFee)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const boostContract2 = new ethers.Contract(
        item?.boostContractInfo?.address,
        JSON.parse(item?.boostContractInfo?.abi),
        signer
      )
      if (item.tokenSymbol === 'WETH') {
        const tx = await boostContract2.withdrawETH(withdrawAmount, {
          value: executionFeeAmount,
        })
        await tx.wait()
      } else {
        const tx = await boostContract2.withdrawBTC(withdrawAmount, {
          value: executionFeeAmount,
        })
        await tx.wait()
      }
      setAmount('')
      toast.success('Withdrawal Success')
      onWithdrawSuccess && onWithdrawSuccess()
      handleGetBoostData()
    } catch (e) {
      toast.error('Withdraw Failed')
      console.log(e)
    } finally {
      setSubmitLoading(false)
    }
  }

  const updateBoostLabel = async () => {
    setEdit(false)
    try {
      await LabelApi.updateLabel({
        walletAddress: address,
        tokenSymbol: item?.tokenSymbol,
        position: 'Boost',
        name: label,
      })
      toast.success('Update name successfully')
    } catch (error) {
      toast.error('Update name failed')
      console.error('updateBoostLabel', error)
    }
  }

  useEffect(() => {
    if (isEdit && refLabelInput.current) {
      refLabelInput.current.focus()
    }
  }, [isEdit])

  useEffect(() => {
    setLabel(item?.label)
  }, [item?.label])

  console.log('deposited :>> ', deposited)

  const summaryInfo = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <CurrencySwitch
          tokenSymbol={item?.tokenSymbol}
          tokenValue={Number(deposited)}
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
          decimalScale={5}
        />
        <CurrencySwitch
          tokenSymbol={item?.tokenSymbol}
          tokenValue={item.earnings}
          usdDefault
          className="-my-4 flex h-full min-w-[130px] flex-col items-center justify-center gap-2 py-4"
          decimalScale={5}
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
          <div className="text-[22px]">
            <NumericFormat
              displayType="text"
              value={item?.APR}
              suffix="%"
              decimalScale={2}
            />
          </div>

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
    return 'Create'
  }

  console.log('amount :>> ', amount)

  return (
    <>
      <div className="dark-text-[#000] mt-[24px] grid w-full rounded-[12px] border border-[#E6E6E6] bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[24px] py-[20px] text-[#464646] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
        <div className="grid w-full grid-cols-2">
          <div className="font-larken flex w-[calc(100%-64px)] items-center space-x-2 text-[22px] md:w-[calc(100%-400px-64px)] lg:w-[calc(100%-500px-64px)] xl:w-[calc(100%-600px-64px)]">
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
                <div className="">{label}</div>
                <button className="ml-[8px]">
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
                  className="bg-transparent"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && updateBoostLabel()}
                />
                <button className="ml-[0]">
                  <AiOutlineCheck
                    className=""
                    onClick={() => updateBoostLabel()}
                  />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-14">
            <div className="items-center justify-between hidden gap-14 lg:flex">
              {summaryInfo()}
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <button className="" onClick={() => setOpen(!isOpen)}>
                <img
                  className={
                    'w-[18px] text-[#000] transition-all' +
                    ` ${isOpen ? 'rotate-180' : ''}`
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
          className={`grid grid-cols-1 gap-8 overflow-hidden transition-all duration-300 lg:grid-cols-2 ${isOpen
            ? 'max-h-[1000px] py-[16px] ease-in'
            : 'max-h-0 py-0 opacity-0 ease-out'
            }`}
        >
          <div className="flex items-center justify-between gap-4 lg:hidden">
            {summaryInfo()}
          </div>
          <div className="">
            <BoostItemChart
              label="Boost Apy"
              contractAddress={item?.boostContractInfo.address}
              tokenDecimals={item?.tokenDecimals}
              tokenPrice={
                item?.tokenSymbol === 'WBTC'
                  ? usdPrice['wbtc']
                  : usdPrice['weth']
              }
              aprPercent={item?.APR}
            />
          </div>
          <div className="mt-10">
            <div className="text-[28px]">Withdraw {item?.tokenSymbol}</div>
            <div className="mt-2 flex w-full items-center justify-between rounded-[12px] border bg-[#FCFAFF] px-2 py-4 dark:border-[#1A1A1A] dark:bg-[#161616]">
              <NumericFormat
                className="w-full px-2 bg-transparent font-mona bg-none focus:outline-none"
                placeholder="Select amount"
                value={amount || null}
                onChange={(e) => setAmount(e.target.value)}
                decimalScale={5}
              />

              <div className="flex items-center gap-2">
                {[25, 50, 100].map((percent: any, i) => (
                  <button
                    key={i}
                    className="font-mona rounded bg-[#F4F4F4] px-2 py-1 text-sm text-[#959595] dark:bg-[#1A1A1A]"
                    onClick={() => {
                      setAmount(
                        `${(percent * Number(deposited || 0)) / 100.01}`
                      )
                    }}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>
            <button
              className={
                `font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]` +
                ` ${isSubmitLoading || isExecuteLoading
                  ? 'cursor-not-allowed opacity-70'
                  : ''
                }`
              }
              disabled={isSubmitLoading || isExecuteLoading}
              onClick={() => onCreate()}
            >
              {isSubmitLoading && <LoadingCircle />}
              {renderSubmitText()}
            </button>
            <button
              className={
                `font-mona mt-2 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-transparent to-transparent  py-1 text-[14px] uppercase text-[#AA5BFF] transition-all hover:border hover:from-[#AA5BFF] hover:to-[#912BFF] hover:text-white` +
                ` ${isSubmitLoading || isExecuteLoading
                  ? 'cursor-not-allowed opacity-70'
                  : ''
                }`
              }
              disabled={isSubmitLoading || isExecuteLoading}
              onClick={() => onWithdraw()}
            >
              {isExecuteLoading && <LoadingCircle />}
              Execute
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
