import NumberFormat from '@/components/common/NumberFormat'
import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch, {
  getPriceToken,
} from '@/components/common/InputCurrencySwitch'
import Popover from '@/components/common/Popover'
import SkeletonDefault from '@/components/skeleton'
import { floorFraction } from '@/lib/helpers/number'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useMoralis } from 'react-moralis'
import Web3 from 'web3'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'

export default function CreateBorrowItem({ item }: any) {
  const [dataBorrow, setDataBorrow] = useState(item)
  const [isLoading, setIsLoading] = useState(true)
  const [contractAsset, setContractAsset] = useState(null)
  const [contractBorrow, setContractBorrow] = useState(null)
  const [allowance, setAllowance] = useState(0)
  const [buttonLoading, setButtonLoading] = useState(false)
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
          Web3.utils.toWei(Number(dataBorrow.amount).toFixed(2), 'ether')
        )
        .send({
          from: address,
        })
      toast.success('Approve Successful')
      await getAllowance()
    } catch (e) {
      toast.error('Approve Failed')
    } finally {
      setButtonLoading(false)
    }
  }

  const onBorrow = async () => {
    try {
      if (dataBorrow.amount <= 0) {
        toast.error('You must deposit BTC to borrow')
        return
      }
      if (dataBorrow.amountRecieve * price['btc'] <= 1000) {
        toast.error('You just borrow more $1,000')
        return
      }
      setButtonLoading(true)
      await contractBorrow.methods
        .borrow(
          Web3.utils.toWei(Number(dataBorrow.amount / 10).toFixed(9), 'gwei'),
          Web3.utils.toWei(
            Number(
              dataBorrow.amountRecieve *
                price[`${dataBorrow.depositCoin.toLowerCase()}`]
            ).toFixed(2),
            'mwei'
          )
        )
        .send({
          from: address,
        })
      toast.success('Borrow Successful')
    } catch (e) {
      console.log(e)
      toast.error('Borrow Failed')
    } finally {
      setButtonLoading(false)
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
    if (isWeb3Enabled) {
      initContract()
    } else enableWeb3()
  }, [isWeb3Enabled, address, isConnected])

  const isApproved = useMemo(
    () => dataBorrow.amount < allowance,
    [allowance, dataBorrow]
  )

  if (isLoading)
    return (
      <div className="" key={dataBorrow.address_asset}>
        <SkeletonDefault height={'50vh'} width={'100%'} />
      </div>
    )
  else
    return (
      <div
        className="space-y-4 rounded-xl border border-[#1A1A1A] bg-gradient-to-br from-[#0d0d0d] to-[#0d0d0d]/0 px-[16px] py-[24px] xl:px-[32px]"
        key={dataBorrow.address_asset}
      >
        <div className="flex items-center">
          <img
            className="w-16 xs:w-20 lg:w-24"
            src={dataBorrow.coinIcon}
            alt=""
          />
          <div className="grow pb-2 font-larken text-[22px] leading-tight xs:text-[18px] lg:text-[26px]">
            Deposit {dataBorrow.depositCoin},<br /> Borrow{' '}
            {dataBorrow.borrowCoin}
          </div>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`mt-[8px] w-[230px] bg-[#161616] text-center text-sm leading-tight`}
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
          <div className="flex h-[140px] flex-col items-center justify-center rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0 font-larken">
            <InputCurrencySwitch
              tokenSymbol={item?.depositCoin}
              tokenValue={Number(dataBorrow.amount)}
              usdDefault
              className="w-full py-4 leading-none lg:py-6"
              subtitle="Collateral"
              onChange={(e) => {
                dataBorrow.amount = e
                dataBorrow.amountRecieve = (e * 50) / 100
                setDataBorrow({ ...dataBorrow })
              }}
            />
          </div>
          <div className="flex h-[140px] flex-col items-center justify-center rounded-md border border-[#1A1A1A] bg-gradient-to-b from-[#161616] to-[#161616]/0 font-larken">
            <InputCurrencySwitch
              tokenSymbol={item?.depositCoin}
              tokenValue={Number(dataBorrow.amountRecieve)}
              tokenValueChange={Number((dataBorrow.amount * 50) / 100)}
              usdDefault
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
          <p>Variable APY</p>
          <p>-1.16%</p>
        </div>
        <div className="flex justify-between text-[#959595]">
          <p>Liquidity</p>
          <p>$187.2m</p>
        </div>
        <button
          className={`bg-gradient-primary w-full rounded-full py-[4px] font-mona uppercase transition-all duration-200 ${
            buttonLoading && 'cursor-not-allowed opacity-50'
          }`}
          disabled={buttonLoading}
          onClick={() => {
            if (
              dataBorrow.amountRecieve / dataBorrow.amount >
              dataBorrow.loanToValue / 100
            ) {
              toast.error(`Loan-to-value exceeds ${dataBorrow.loanToValue}%`)
            } else {
              if (!isApproved) onApprove()
              else onBorrow()
            }
          }}
        >
          {isApproved ? 'Deposit and Borrow' : 'Approve'}
        </button>
      </div>
    )
}
