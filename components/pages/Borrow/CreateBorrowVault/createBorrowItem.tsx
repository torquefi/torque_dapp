import NumberFormat from '@/components/common/NumberFormat'
import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch, {
  getPriceToken,
} from '@/components/common/InputCurrencySwitch'
import Popover from '@/components/common/Popover'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useMoralis } from 'react-moralis'
import Web3 from 'web3'
import { useAccount } from 'wagmi'
import { useDispatch } from 'react-redux'
import { updateborrowTime } from '@/lib/redux/auth/dataUser'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export default function CreateBorrowItem({ item }: any) {
  const [dataBorrow, setDataBorrow] = useState(item)
  const [isLoading, setIsLoading] = useState(true)
  const [contractAsset, setContractAsset] = useState(null)
  const [contractBorrow, setContractBorrow] = useState(null)
  const [allowance, setAllowance] = useState(0)
  const [borrowRate, setBorrowRate] = useState(1359200263)
  const [buttonLoading, setButtonLoading] = useState('')
  const [price, setPrice] = useState<any>({
    eth: 1800,
    btc: 28000,
    usdc: 1,
  })
  const { address, isConnected } = useAccount()
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()

  const dispatch = useDispatch()
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

  // const onApprove = async () => {
  //   try {
  //     setButtonLoading('true')
  //     await contractAsset.methods
  //       .approve(
  //         contractBorrow._address,
  //         Web3.utils.toWei(Number(dataBorrow.amount).toFixed(2), 'ether')
  //       )
  //       .send({
  //         from: address,
  //       })
  //     toast.success('Approve Successful')
  //     await getAllowance()
  //   } catch (e) {
  //     toast.error('Approve Failed')
  //   } finally {
  //     setButtonLoading('false')
  //   }
  // }

  const onBorrow = async () => {
    try {
      if (dataBorrow.amount <= 0) {
        toast.error('You must deposit BTC to borrow')
        return
      }
      if (dataBorrow.amountRecieve < 100) {
        toast.error('Can not borrow less than 100 USDC')
        return
      }
      setButtonLoading('APPROVING...')
      if (!isApproved) {
        await contractAsset.methods
          .approve(
            contractBorrow._address,
            Web3.utils.toWei(Number(dataBorrow.amount).toFixed(2), 'ether')
          )
          .send({
            from: address,
          })
        toast.success('Approve Successful')
      }
      setButtonLoading('BORROWING...')

      if (item.depositCoin == 'BTC') {
        await contractBorrow.methods
          .borrow(
            Moralis.Units.Token(
              Number(dataBorrow.amount).toFixed(9),
              item.decimals_asset
            ),
            Moralis.Units.Token(
              Number(dataBorrow.amountRecieve).toFixed(2),
              item.decimals_USDC
            )
          )
          .send({
            from: address,
          })
      } else if (item.depositCoin == 'ETH') {
        await contractBorrow.methods
          .borrow(
            Moralis.Units.Token(
              Number(dataBorrow.amountRecieve).toFixed(2),
              item.decimals_USDC
            )
          )
          .send({
            value: Moralis.Units.Token(
              Number(dataBorrow.amount).toFixed(9),
              item.decimals_asset
            ),
            from: address,
          })
      }
      dispatch(updateborrowTime(new Date().toISOString() as any))
      toast.success('Borrow Successful')
    } catch (e) {
      console.log(e)
      toast.error('Borrow Failed')
    } finally {
      setButtonLoading('')
    }
  }
  useEffect(() => {
    getAllowance()
  }, [dataBorrow, contractAsset, contractBorrow])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
    getPrice()
  }, [])

  useEffect(() => {
    initContract()
  }, [isWeb3Enabled, address, isConnected])

  const isApproved = useMemo(
    () => dataBorrow.amount < allowance,
    [allowance, dataBorrow]
  )
  console.log(dataBorrow.amountRecieve)
  return (
    <div
      className="dark:tex-white space-y-4 rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[16px] py-[24px] text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white xl:px-[32px]"
      key={dataBorrow.address_asset}
    >
      <div className="flex items-center">
        <img
          className="w-16 xs:w-20 lg:w-24"
          src={dataBorrow.coinIcon}
          alt=""
        />
        <div className="font-larken grow pb-2 text-[22px] leading-tight xs:text-[18px] lg:text-[26px]">
          Deposit {dataBorrow.depositCoin},<br /> Borrow {dataBorrow.borrowCoin}
        </div>
        <Popover
          trigger="hover"
          placement="bottom-right"
          className={`mt-[8px] w-[230px] border dark:border-[#1A1A1A] border-[#e5e7eb] bg-[#FCFAFF] text-center text-sm leading-tight dark:bg-[#161616]`}
          content="The projected TORQ rewards after 1 year of $1,000 borrowed"
        >
          <Link href="#" className="" target={'_blank'}>
            <div className="flex items-center rounded-full bg-[#AA5BFF] bg-opacity-20 p-1 text-[12px] xs:text-[14px]">
              <img
                src="/assets/t-logo-circle.svg"
                alt=""
                className="w-[24px] xs:w-[28px]"
              />
              <p className="mx-1 text-[#AA5BFF] xs:mx-2">
                +{dataBorrow.getTORQ} TORQ
              </p>
            </div>
          </Link>
        </Popover>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="font-larken flex h-[140px] flex-col items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
          <InputCurrencySwitch
            tokenSymbol={item?.depositCoin}
            tokenValue={Number(dataBorrow.amount)}
            className="w-full py-4 leading-none lg:py-6"
            subtitle="Collateral"
            usdDefault
            decimalScale={2}
            onChange={(e) => {
              dataBorrow.amount = e
              dataBorrow.amountRecieve = Math.round((e * 50) / 100)
              setDataBorrow({ ...dataBorrow })
            }}
          />
        </div>
        <div className="font-larken flex h-[140px] flex-col items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
          <InputCurrencySwitch
            tokenSymbol={'USDC'}
            tokenValue={Number(dataBorrow.amountRecieve)}
            tokenValueChange={Number(
              Math.round(
                (Number(
                  dataBorrow.amount *
                    price[`${dataBorrow.depositCoin.toLowerCase()}`]
                ) *
                  50) /
                  100
              )
            )}
            usdDefault
            decimalScale={2}
            className="w-full py-4 leading-none lg:py-6"
            subtitle="Borrowing"
            onChange={(e) => {
              dataBorrow.amountRecieve = e
              setDataBorrow({ ...dataBorrow })
            }}
          />
        </div>
      </div>
      <div className="flex justify-between text-[#959595]">
        <p>Loan provider</p>
        <Link href="https://compound.finance/" className="" target={'_blank'}>
          <img
            className="my-[-6px] w-[32px]"
            src="/icons/coin/comp.png"
            alt=""
          />
        </Link>
      </div>
      <div className="flex justify-between text-[#959595]">
        <p>Loan-to-value</p>
        <p>
          {'<'}
          {dataBorrow.loanToValue}%
        </p>
      </div>
      <div className="flex justify-between text-[#959595]">
        <p>Variable APR</p>
        <p>{borrowAPR.toFixed(2)}%</p>
      </div>
      <div className="flex justify-between text-[#959595]">
        <p>Liquidity</p>
        <p>$187.2m</p>
      </div>
      <button
        className={`bg-gradient-primary font-mona flex w-full items-center justify-center rounded-full py-[4px] uppercase text-white transition-all duration-200 ${
          (buttonLoading || !dataBorrow.amount) &&
          'cursor-not-allowed opacity-50'
        }`}
        disabled={buttonLoading != '' || !dataBorrow.amount}
        onClick={() => {
          if (
            dataBorrow.amountRecieve /
              (dataBorrow.amount *
                price[`${dataBorrow.depositCoin.toLowerCase()}`]) >
            dataBorrow.loanToValue / 100
          ) {
            toast.error(`Loan-to-value exceeds ${dataBorrow.loanToValue}%`)
          } else {
            onBorrow()
          }
        }}
      >
        {buttonLoading != '' && <LoadingCircle />}
        {buttonLoading != '' ? buttonLoading : 'Deposit and Borrow'}
      </button>
    </div>
  )
}
