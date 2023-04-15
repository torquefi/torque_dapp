import { Chart } from '@/components/common/Chart'
import CurrencySwitch from '@/components/common/CurrencySwitch'
import { getPriceToken } from '@/components/common/InputCurrencySwitch'
import SkeletonDefault from '@/components/skeleton'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { AutowidthInput } from 'react-autowidth-input'
import { AiOutlineCheck, AiOutlineEdit } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
enum Action {
  Repay = 'Repay',
  Withdraw = 'Withdraw',
}

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export default function BorrowItem({ item }: any) {
  const borrowTime = useSelector((store: AppStore) => store.dataUser)

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
  const [label, setLabel] = useState(item?.label)
  const [isEdit, setEdit] = useState(false)
  const [borrowRate, setBorrowRate] = useState(1359200263)
  const refLabelInput = useRef<HTMLInputElement>(null)
  const { address, isConnected } = useAccount()
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()

  const borrowAPR = useMemo(
    () =>
      Number(Moralis.Units.FromWei(borrowRate, 18)) * SECONDS_PER_YEAR * 100,
    [borrowRate]
  )

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
            supplied: Moralis.Units.FromWei(data.supplied, item.decimals_asset),
            borrowed: Moralis.Units.FromWei(data.borrowed, item.decimals_USDC),
          })
        }
        setContractBorrow(contract)
      }

      const dataABICompound = await Moralis.Cloud.run('getAbi', {
        name: 'compound_abi',
      })
      if (dataABICompound?.abi) {
        const web3 = new Web3('https://rpc.ankr.com/eth')
        const contract = new web3.eth.Contract(
          JSON.parse(dataABICompound?.abi),
          dataABICompound?.address
        )
        if (contract) {
          let utilization = await contract.methods.getUtilization().call({
            from: address,
          })
          let borrowRate = await contract.methods
            .getBorrowRate(utilization)
            .call({
              from: address,
            })
          setBorrowRate(borrowRate)
        }
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
    try {
      setButtonLoading(true)
      if (!isApproved) {
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
      }
      await contractBorrow.methods
        .repay(Web3.utils.toWei(Number(inputValue).toFixed(2), 'mwei'))
        .send({
          from: address,
        })
      toast.success('Repay Successful')
      initContract()
    } catch (e) {
      console.log(e)
      toast.error('Repay Failed')
    } finally {
      setButtonLoading(false)
    }
  }

  const getDataNameBorrow = async () => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })
    setLabel(data[`${item.data_key}`] || 'Vault')
  }

  const updateDataNameBorrow = async (name: string) => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })

    data[`${item.data_key}`] = name
    data[`address`] = address
    console.log(data)
    await Moralis.Cloud.run('updateDataBorrowUser', {
      ...data,
    })
      .then(() => {
        getDataNameBorrow()
        toast.success('Update name successful')
      })
      .catch(() => {
        toast.error('Update name failed')
      })
  }

  useEffect(() => {
    getAllowance()
  }, [contractAsset, contractBorrow, inputValue])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
    getPrice()
  }, [])

  useEffect(() => {
    initContract()
    getDataNameBorrow()
  }, [isWeb3Enabled, address, isConnected, borrowTime])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const isApproved = useMemo(
    () => inputValue < allowance,
    [allowance, inputValue]
  )

  useEffect(() => {
    if (isEdit && refLabelInput.current) {
      refLabelInput.current.focus()
    }
  }, [isEdit])

  const summaryInfo = (
    <div className="flex w-full text-center md:w-[400px] lg:w-[500px] xl:w-[600px]">
      <CurrencySwitch
        tokenSymbol={item.token}
        tokenValue={dataUserBorrow?.supplied || item.collateral}
        className="-my-4 w-1/4 space-y-1 py-4 font-larken"
        decimalScale={2}
        render={(value) => (
          <>
            <p className="mb-[12px] whitespace-nowrap text-[22px]">{value}</p>
            <p className="font-mona text-[14px] text-[#959595]">Collateral</p>
          </>
        )}
      />
      <CurrencySwitch
        tokenSymbol={'USDC'}
        tokenValue={dataUserBorrow?.borrowed || item.borrow}
        usdDefault
        className="-my-4 w-1/4 space-y-1 py-4 font-larken"
        decimalScale={2}
        render={(value) => (
          <>
            <p className="mb-[12px] text-[22px] leading-none">{value}</p>
            <p className="font-mona text-[14px] text-[#959595]">Borrowed</p>
          </>
        )}
      />
      <div className="w-1/4 space-y-1">
        <p className="whitespace-nowrap font-larken text-[22px]">
          {(
            (dataUserBorrow?.borrowed /
              (dataUserBorrow?.supplied *
                price[`${item.token.toLowerCase()}`])) *
              100 || 0
          ).toFixed(2)}
          %
        </p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">
          Loan-to-value
        </p>
      </div>
      <div className="w-1/4 space-y-1">
        <p className="whitespace-nowrap font-larken text-[22px]">
          {borrowAPR.toFixed(2)}%
        </p>
        <p className="whitespace-nowrap text-[14px] text-[#959595]">Net APR</p>
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
          <div className="xlg:w-[calc(100%-600px-64px)] flex w-[calc(100%-64px)] items-center space-x-2 font-larken text-[22px] md:w-[calc(100%-400px-64px)] lg:w-[calc(100%-500px-64px)]">
            {!isEdit && (
              <div
                className="flex cursor-pointer items-center text-[22px]"
                onClick={() => setEdit(!isEdit)}
              >
                <img
                  className="mr-2 w-[54px]"
                  src={`/icons/coin/${item.token.toLowerCase()}.png`}
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
                  src={`/icons/coin/${item.token.toLowerCase()}.png`}
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
                      getDataNameBorrow()
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
            <img src="/assets/pages/boost/chart.svg" alt="" />
          </div>
          <div className="w-full space-y-6 md:w-[60%] md:pl-[36px] lg:w-[50%] xl:w-[45%]">
            <div className="flex items-center justify-between">
              <p className="font-larken text-[24px]">
                {action} {action == Action.Repay ? 'USDC' : item.token}
              </p>
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
                value={inputValue || null}
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
              className={`bg-gradient-primary flex w-full items-center justify-center rounded-full py-[4px] uppercase transition-all duration-200 ${
                buttonLoading && 'cursor-not-allowed opacity-50'
              }`}
              disabled={buttonLoading}
              onClick={() => onRepay()}
            >
              {buttonLoading && <LoadingCircle />}
              {action}
            </button>
          </div>
        </div>
      </div>
    )
}
