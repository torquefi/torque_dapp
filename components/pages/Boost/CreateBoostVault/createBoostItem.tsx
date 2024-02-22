import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import { useTokensDataRequest } from '@/domain/synthetics/tokens'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { bigNumberify } from '@/lib/numbers'
import { AppStore } from '@/types/store'
import { useWeb3Modal } from '@web3modal/react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount, useChainId } from 'wagmi'
import { arbitrum } from 'wagmi/dist/chains'
import Web3 from 'web3'
import {
  estimateExecuteDepositGasLimit,
  getExecutionFee,
} from '../hooks/getExecutionFee'
import { useGasLimits } from '../hooks/useGasLimits'
import { useGasPrice } from '../hooks/useGasPrice'

const RPC = 'https://arb1.arbitrum.io/rpc'

export function CreateBoostItem({ item, setIsFetchBoostLoading }: any) {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [btnLoading, setBtnLoading] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
    useState(false)
  const [isUsdDepositToken, setIsUsdDepositToken] = useState(true)
  const [amount, setAmount] = useState<number>(0)
  const [amountRaw, setAmountRaw] = useState(0)
  const [amountReceiveRaw, setAmountReceiveRaw] = useState(0)
  const [totalSupply, setTotalSupply] = useState('')
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)
  const { tokensData, pricesUpdatedAt } = useTokensDataRequest(chainId)
  const { gasPrice } = useGasPrice(chainId)

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    if (!item?.tokenContractInfo?.abi) {
      console.error('Token contract ABI is undefined')
      return null
    }
    return new web3.eth.Contract(
      JSON.parse(item.tokenContractInfo.abi),
      item.tokenContractInfo.address
    )
  }, [Web3.givenProvider, item.tokenContractInfo])

  const boostReadContract = useMemo(() => {
    const web3 = new Web3(RPC)
    if (!item?.boostContractInfo?.abi) {
      console.error('Token contract ABI is undefined')
      return null
    }
    return new web3.eth.Contract(
      JSON.parse(item.boostContractInfo.abi),
      item.boostContractInfo.address
    )
  }, [Web3.givenProvider, item.boostContractInfo])

  const handleGetTotalSupply = async () => {
    if (!tokenContract || !boostReadContract) {
      return
    }
    try {
      const tokenDecimal = await tokenContract.methods.decimals().call()
      const totalSupply = await boostReadContract.methods.totalSupply().call()
      setTotalSupply(
        new BigNumber(
          ethers.utils.formatUnits(totalSupply, tokenDecimal)
        ).toString()
      )
    } catch (error) {
      console.log('handleGetTotalSupply error :>> ', error)
    }
  }

  useEffect(() => {
    handleGetTotalSupply()
  }, [boostReadContract, tokenContract])

  const { gasLimits } = useGasLimits(arbitrum.id)

  console.log('gasLimits :>> ', gasLimits)

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

  const handleConfirmDeposit = async () => {
    if (!isConnected || !address) {
      await open()
      return
    }
    if (!+amount) {
      return toast.error('You must input amount to deposit')
    }
    setOpenConfirmDepositModal(true)
  }

  const onDeposit = async () => {
    try {
      setBtnLoading(true)
      const tokenDecimal = await tokenContract.methods.decimals().call()
      const depositToken = ethers.utils
        .parseUnits(Number(amount).toFixed(tokenDecimal), tokenDecimal)
        .toString()

      const usdcDecimal = 6
      const estimateExecuteDepositGasLimitValue =
        estimateExecuteDepositGasLimit(gasLimits, {
          longTokenSwapsCount: 1,
          shortTokenSwapsCount: 1,
          initialLongTokenAmount: ethers.utils.parseUnits(
            (amount / 2).toFixed(tokenDecimal),
            tokenDecimal
          ),
          // initialShortTokenAmount: ethers.utils.parseUnits(
          //   (((amount / 2) * usdPrice[item?.token]) / usdPrice['USDC']).toFixed(
          //     usdcDecimal
          //   ),
          //   usdcDecimal
          // ),
          initialShortTokenAmount: bigNumberify(0),
        })

      console.log(
        'estimateExecuteDepositGasLimitValue',
        estimateExecuteDepositGasLimitValue?.toString()
      )

      const executionFee = getExecutionFee(
        chainId,
        gasLimits,
        tokensData,
        estimateExecuteDepositGasLimitValue,
        gasPrice
      )

      const executionFeeAmount = bigNumberify(executionFee?.feeTokenAmount).toString()

      console.log('executionFeeAmount', executionFeeAmount, executionFee)

      // const executionFee = estimateExecuteDepositGasLimitValue?.toString()

      const allowance = await tokenContract.methods
        .allowance(address, item.boostContractInfo.address)
        .call()
      if (
        new BigNumber(allowance).lte(new BigNumber('0')) ||
        new BigNumber(allowance).lte(new BigNumber(depositToken))
      ) {
        await tokenContract.methods
          .approve(
            item?.boostContractInfo?.address,
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
          )
          .send({
            from: address,
          })
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const boostContract2 = new ethers.Contract(
        item?.boostContractInfo?.address,
        JSON.parse(item?.boostContractInfo?.abi),
        signer
      )

      if (item.token === 'WETH') {
        const tx = await boostContract2.depositETH(depositToken, {
          value: executionFeeAmount,
        })
        await tx.wait()
      } else {
        console.log('depositToken wbtc:>> ', depositToken)
        console.log('fee wbtc:>> ', executionFeeAmount)
        const tx = await boostContract2.depositBTC(depositToken, {
          value: executionFeeAmount,
        })
        await tx.wait()
      }
      toast.success('Boost Successfully')
      setIsFetchBoostLoading && setIsFetchBoostLoading((prev: any) => !prev)
      setOpenConfirmDepositModal(false)
    } catch (e) {
      console.log('11111', e)
      toast.error('Boost Failed')
    } finally {
      setBtnLoading(false)
    }
  }

  const renderSubmitText = () => {
    if (!address) {
      return 'Connect Wallet'
    }
    return 'Confirm Deposit'
  }

  console.log('item :>> ', item)

  return (
    <>
      <div
        className={
          `rounded-[12px] border border-[#E6E6E6] bg-[#ffffff]  from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-5 pt-3  text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br  dark:text-white lg:px-8` +
          `  ${theme === 'light' ? ' bg-[#FCFAFF]' : 'bg-overview'}`
        }
      >
        <div className="flex w-full items-center justify-between">
          <div className="ml-[-12px] flex items-center">
            <img
              src={`/icons/coin/${item.token.toLocaleLowerCase()}.png`}
              alt=""
              className="w-[72px] md:w-24"
            />
            <div className="font-larken text-[18px] leading-tight text-[#030303] dark:text-white md:text-[22px] lg:text-[26px]">
              Deposit {item.token},<br className="" /> Earn {item.token}
            </div>
          </div>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`font-mona mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#0d0d0d]`}
            content="The projected TORQ rewards after 1 year of $1,000 supplied"
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
          <div className="flex w-full items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={item?.token}
              tokenValue={Number(amount)}
              className="w-full py-4 text-[#030303] dark:text-white lg:py-6"
              subtitle="Deposit"
              usdDefault
              decimalScale={5}
              onChange={(tokenValue, rawValue) => {
                setAmount(tokenValue)
                setAmountRaw(rawValue)
              }}
              onSetShowUsd={setIsUsdDepositToken}
            />
          </div>
          <div className="flex h-[110px] w-full flex-col items-center justify-center gap-3 rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  dark:border-[#1A1A1A]  dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={item?.token}
              tokenValue={
                Number(amount || 0) * (1 + Number(item?.APR || 0) / 100) * 3
              }
              subtitle="3-Year Value"
              usdDefault
              decimalScale={5}
              className="w-full py-4 text-[#030303] dark:text-white lg:py-6"
              displayType="text"
              tokenValueChange={
                Number(amount) * Math.pow((1 + Number(item?.APR || 0) / 100), 3)
              }
            // const
            />
          </div>
        </div>
        <div className="font-mona flex w-full items-center justify-between py-4 text-[16px] text-[#959595]">
          <div className="font-mona">Yield providers</div>
          <div className="flex items-center">
            <Link
              href={item.link_yield1}
              className="translate-x-3"
              target={'_blank'}
            >
              <img src={item.yield_provider1} alt="" className="w-[26px]" />
            </Link>
            <Link href={item.link_yield2} className="" target={'_blank'}>
              <img src={item.yield_provider2} alt="" className="w-[26px]" />
            </Link>
          </div>
        </div>
        <div className="font-mona flex w-full items-center justify-between text-[16px] text-[#959595]">
          <div className="font-mona">Variable APY</div>
          <NumericFormat
            displayType="text"
            value={item?.APR}
            suffix="%"
            decimalScale={2}
          />
        </div>
        <div className="font-mona flex w-full items-center justify-between py-[16px] text-[16px] text-[#959595]">
          <div className="flex items-center justify-center">
            <div>Safety score</div>
            <Popover
              trigger="hover"
              placement="bottom-left"
              className={`font-mona mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
              content="Factors include raw yield, total value locked, IL, and history"
            >
              <button className="ml-[5px] mt-[7px]">
                <img
                  src="/assets/pages/vote/ic-info.svg"
                  alt="risk score system"
                  className="w-[13px]"
                />
              </button>
            </Popover>
          </div>
          <div>9.8/10</div>
        </div>
        <div className="font-mona flex w-full items-center justify-between text-[16px] text-[#959595]">
          <div>Assets routed</div>
          <NumericFormat
            prefix="$"
            value={Number(
              new BigNumber(totalSupply || 0)
                .multipliedBy(usdPrice?.[item.token] || 0)
                .toString()
            ).toFixed(2)}
            displayType="text"
          />
        </div>
        <button
          className={`font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
          ${btnLoading ? 'cursor-not-allowed text-[#eee]' : 'cursor-pointer '}
        `}
          onClick={handleConfirmDeposit}
        >
          {btnLoading && <LoadingCircle />}
          {renderSubmitText()}
        </button>
      </div>

      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />

      <ConfirmDepositModal
        open={isOpenConfirmDepositModal}
        handleClose={() => setOpenConfirmDepositModal(false)}
        confirmButtonText="Deposit & Earn"
        onConfirm={() => onDeposit()}
        loading={btnLoading}
        coinFrom={{
          amount: amountRaw,
          icon: `/icons/coin/${item.token.toLocaleLowerCase()}.png`,
          symbol: item.token,
          isUsd: isUsdDepositToken,
        }}
        coinTo={{
          amount: amountRaw,
          // amount:
          //   +(
          //     (isUsdDepositToken ? amount * usdPrice[item?.token] : amount) || 0
          //   ) * item?.rate,
          icon: `/icons/coin/${item.token.toLocaleLowerCase()}.png`,
          symbol: item?.earnToken,
          isUsd: isUsdDepositToken,
        }}
        details={[
          {
            label: 'Exchange rate',
            value: `1 ${item?.token} = 1 ${item?.earnToken}`,
          },
          {
            label: 'Variable APY',
            value: item?.APR + '%',
          },
        ]}
      />
    </>
  )
}
