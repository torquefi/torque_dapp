import { Chart } from '@/components/common/Chart'
import CurrencySwitch from '@/components/common/CurrencySwitch'
import { getPriceToken } from '@/components/common/InputCurrencySwitch'
import SkeletonDefault from '@/components/skeleton'
import { useEffect, useMemo, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { useMoralis } from 'react-moralis'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
enum Action {
  Repay = 'Repay',
  Withdraw = 'Withdraw',
}
export default function BorrowItem({ item }: any) {
  const [dataBorrow, setDataBorrow] = useState(item)
  const [isExpand, setExpand] = useState(false)
  const [action, setAction] = useState(Action.Repay)
  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState(0)
  const [contractAsset, setContractAsset] = useState(null)
  const [contractBorrow, setContractBorrow] = useState(null)
  const [allowance, setAllowance] = useState(0)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [dataUserBorrow, setDataUserBorrow] = useState<any>()
  const [price, setPrice] = useState<any>({
    eth: 1800,
    btc: 28000,
    usdc: 1,
  })
  const { address, isConnected } = useAccount()
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()

  const getPrice = async () => {
    setPrice({
      eth: (await getPriceToken('ETH')) || 1800,
      btc: (await getPriceToken('BTC')) || 28000,
      usdc: (await getPriceToken('USDC')) || 1,
    })
  }

  const initContract = async () => {
    try {
      const dataABIAsset = await Moralis.Cloud.run('getAbi', {
        name: item?.name_ABI_asset,
      })
      if (dataABIAsset?.abi) {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
          JSON.parse(dataABIAsset?.abi),
          dataABIAsset?.address
        )
        setContractAsset(contract)
      }

      const dataABIBorrow = await Moralis.Cloud.run('getAbi', {
        name: item?.name_ABI_borrow,
      })
      if (dataABIBorrow?.abi) {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
          JSON.parse(dataABIBorrow?.abi),
          dataABIBorrow?.address
        )
        if (contract) {
          let data = await contract.methods.borrowInfoMap(address).call({
            from: address,
          })
          setDataUserBorrow({
            supplied: Moralis.Units.FromWei(Number(data.supplied), 8),
            borrowed: Moralis.Units.FromWei(Number(data.borrowed), 6),
          })
        }
        setContractBorrow(contract)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getAllowance = async () => {
    try {
      if (contractAsset && contractBorrow) {
        const allowance = await contractAsset.methods
          .allowance(address, contractBorrow._address)
          .call({
            from: address,
          })
        setAllowance(allowance / 10 ** dataBorrow.decimals_asset || 0)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onApprove = async () => {
    try {
      setButtonLoading(true)
      await contractAsset.methods
        .approve(
          contractBorrow._address,
          Web3.utils.toWei(Number(inputValue).toFixed(2), 'ether')
        )
        .send({
          from: address,
        })
      toast.success('Approve Successful')
      await getAllowance()
    } catch (e) {
      toast.error('Approve Failed')
      console.log(e)
    } finally {
      setButtonLoading(false)
    }
  }

  const onRepay = async () => {
    console.log(Web3.utils.toWei(Number(inputValue).toFixed(2), 'mwei'))
    try {
      setButtonLoading(true)
      await contractBorrow.methods
        .repay(Web3.utils.toWei(Number(inputValue).toFixed(2), 'mwei'))
        .send({
          from: address,
        })
      toast.success('Repay Successful')
    } catch (e) {
      console.log(e)
      toast.error('Repay Failed')
    } finally {
      setButtonLoading(false)
    }
  }

  useEffect(() => {
    getAllowance()
  }, [contractAsset, contractBorrow, inputValue])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
    getPrice()
  }, [])

  useEffect(() => {
    if (isWeb3Enabled) {
      initContract()
    } else enableWeb3()
  }, [isWeb3Enabled, address, isConnected])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])
  console.log('allowance', allowance)
  const isApproved = useMemo(
    () => inputValue < allowance,
    [allowance, inputValue]
  )

  const summaryInfo = (
    <div className="flex w-full text-center md:w-[400px] lg:w-[500px] xl:w-[600px]">
      <CurrencySwitch
        tokenSymbol={item.token}
        tokenValue={dataUserBorrow?.supplied || item.collateral}
        className="-my-4 w-1/4 space-y-1 py-4 font-larken"
        decimalScale={1}
        render={(value) => (
          <>
            <p className="mb-[12px] whitespace-nowrap text-[22px]">{value}</p>
            <p className="font-mona text-[14px] text-[#959595]">Collateral</p>
          </>
        )}
      />
      <CurrencySwitch
        tokenSymbol={item.token}
        tokenValue={
          dataUserBorrow?.borrowed / price[item.token.toLowerCase()] ||
          item.borrow
        }
        usdDefault
        className="-my-4 w-1/4 space-y-1 py-4 font-larken"
        decimalScale={1}
        render={(value) => (
          <>
            <p className="mb-[12px] text-[22px] leading-none">{value}</p>
            <p className="font-mona text-[14px] text-[#959595]">Borrowed</p>
          </>
        )}
      />
      <div className="w-1/4 space-y-1">
        <p className="whitespace-nowrap font-larken text-[22px]">{item.ltv}%</p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">
          Loan-to-value
        </p>
      </div>
      <div className="w-1/4 space-y-1">
        <p className="whitespace-nowrap font-larken text-[22px]">{item.apy}%</p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">Net APY</p>
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
      <div className="rounded-xl border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0">
        <div className="flex items-center px-[24px] py-[16px]">
          <div className="xlg:w-[calc(100%-600px-64px)] flex w-[calc(100%-64px)] items-center space-x-2 md:w-[calc(100%-400px-64px)] lg:w-[calc(100%-500px-64px)]">
            <img
              className="w-[54px]"
              src={`/icons/coin/${item.token.toLowerCase()}.png`}
              alt=""
            />
            <p className="font-larken text-[22px]">{item.label}</p>
            <AiOutlineEdit className="text-[22px]" />
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
              src="/icons/arrow-down.svg"
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
          <div className=" w-full md:w-[40%] lg:w-[50%] xl:w-[55%]">
            {/* <Chart /> */}
            <img src="/assets/pages/boost/chart.svg" alt="" />
          </div>
          <div className="w-full space-y-6 md:w-[60%] md:pl-[36px] lg:w-[50%] xl:w-[45%]">
            <div className="flex items-center justify-between">
              <p className="font-larken text-[24px]">{action} USDC</p>
              <div className="rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] via-[#161616]/40 to-[#0e0e0e]">
                {[Action.Repay, Action.Withdraw].map((item, i) => (
                  <button
                    className={
                      'w-[52px] py-[8px] text-[10px] leading-none xs:w-[80px] xs:text-[12px]' +
                      ` ${
                        action === item
                          ? 'rounded-md bg-[#171717]'
                          : 'text-[#959595]'
                      }`
                    }
                    onClick={() => setAction(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between rounded-xl border border-[#1A1A1A] bg-gradient-to-b from-[#161616] via-[#161616]/40 to-[#0e0e0e] p-[12px]">
              <NumericFormat
                className="w-[120px] bg-transparent"
                placeholder="Select amount"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
              />
              <div className="flex select-none justify-between space-x-1 text-[12px] text-[#959595] sm:text-[14px]">
                {[25, 50, 100].map((percent, i) => (
                  <div
                    className="cursor-pointer rounded-md bg-[#171717] px-[6px] py-[2px] transition active:scale-95 xs:px-[8px] xs:py-[4px]"
                    onClick={() =>
                      setInputValue((dataUserBorrow.borrowed * percent) / 100)
                    }
                    key={i}
                  >
                    {percent}%
                  </div>
                ))}
              </div>
            </div>
            <button
              className={`bg-gradient-primary w-full rounded-full py-[4px] uppercase transition-all duration-200 ${
                buttonLoading && 'cursor-not-allowed opacity-50'
              }`}
              disabled={buttonLoading}
              onClick={() => (isApproved ? onRepay() : onApprove())}
            >
              {isApproved ? action : 'Approve'}
            </button>
          </div>
        </div>
      </div>
    )
}
