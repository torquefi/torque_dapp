import InputCurrencySwitch, {
  getPriceToken,
} from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { toMetricUnits } from '@/lib/helpers/number'
import { updateborrowTime } from '@/lib/redux/slices/borrow'
import { Contract, ContractInterface, ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { IBorrowInfo } from '../types'
import { borrowETH_Arb_ABI } from '@/constants/abi'
import { borrowETH_Arb } from '@/constants/borrowContract'
import { btc_ether_CoinContract } from '@/constants/contracts'

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365

interface CreateBorrowItemProps {
  item: IBorrowInfo
}

export default function CreateBorrowItem({ item }: CreateBorrowItemProps) {
  const [dataBorrow, setDataBorrow] = useState(item)
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState(0)
  const [amountReceive, setAmountReceive] = useState(0)
  const [contractAsset, setContractAsset] = useState(null)
  const [contractBorrowETH, setContractBorrowETH] = useState<any>(null)
  const [contractBorrowBTC, setContractBorrowBTC] = useState<any>(null)
  const [contractBTC, setContractBTC] = useState<any>(null)
  const [addressBaseAsset, setAddressBaseAsset] = useState(null)

  const [allowance, setAllowance] = useState(0)
  const [balance, setBalance] = useState(0)
  const [borrowRate, setBorrowRate] = useState(1359200263)
  const [buttonLoading, setButtonLoading] = useState('')

  const [price, setPrice] = useState<any>({
    eth: 1800,
    btc: 28000,
    USD: 1,
  })
  const { address, isConnected } = useAccount()
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
    useState(false)

  const dispatch = useDispatch()

  const borrowAPR = useMemo(
    () =>
      Number(Moralis.Units.FromWei(item?.borrowRate, 18)) *
      SECONDS_PER_YEAR *
      100,
    [item?.borrowRate]
  )

  const getPrice = async () => {
    setPrice({
      eth: (await getPriceToken('ETH')) || 1800,
      btc: (await getPriceToken('BTC')) || 28000,
      USD: (await getPriceToken('USD')) || 1,
    })
  }

  const initContract = async () => {
    try {
      let web3 = new Web3('https://arbitrum-goerli.publicnode.com')
      let contractBorrowETH = new web3.eth.Contract(
        JSON.parse(borrowETH_Arb?.abi),
        borrowETH_Arb?.address
      )

      if (contractBorrowETH) {
        // let utilization = await contractBorrowETH.methods
        //   .getUtilization()
        //   .call({
        //     from: address,
        //   })
        // let borrowRate = await contractBorrowETH.methods
        //   .getBorrowRate(utilization)
        //   .call({
        //     from: address,
        //   })
        // setBorrowRate(borrowRate)
        setContractBorrowETH(contractBorrowETH)
      }

      web3 = new Web3('https://ethereum-goerli.publicnode.com')
      let contractBorrowBTC = new web3.eth.Contract(
        JSON.parse(borrowETH_Arb?.abi),
        borrowETH_Arb?.address
      )
      if (contractBorrowBTC) {
        setContractBorrowBTC(contractBorrowBTC)
      }
      console.log('initContract============>')
      let contractBTC = new web3.eth.Contract(
        JSON.parse(btc_ether_CoinContract?.abi),
        btc_ether_CoinContract?.address
      )
      if (contractBTC) {
        setContractBTC(contractBTC)
      }
      console.log('contractBTC=>>>', contractBTC)
    } catch (e) {
      console.log(e)
    }
  }

  const getAllowance = async () => {
    try {
      if (contractBTC && contractBorrowBTC) {
        const allowance = await contractBTC.methods
          .allowance(address, contractBorrowBTC?.address)
          .call({
            from: address,
          })
        setAllowance(allowance / 10 ** dataBorrow.depositTokenDecimal || 0)
      }
    } catch (e) {
      console.log('CreateBorrowItem.getAllowance', e)
    }
  }

  const updateBalance = async () => {
    try {
      if (item.tokenContract && item.borrowContractInfo) {
        const balance = await item.tokenContract.methods
          .balanceOf(address)
          .call({ from: address })
        setBalance(
          ethers?.utils
            .parseUnits(balance, dataBorrow.depositTokenDecimal)
            .toNumber()
        )
      }
    } catch (e) {
      console.log('CreateBorrowItem.updateBalance', e)
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

  async function getMintable(balance: any) {
    try {
      const dataABIEngine = await Moralis.Cloud.run('getAbi', {
        name: 'engine_USD_abi',
      })
      if (dataABIEngine?.abi) {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
          JSON.parse(dataABIEngine?.abi),
          dataABIEngine?.address
        ) as any

        let mintable = await contract.methods
          .getMintableUSD(
            '0x8fb1e3fc51f3b789ded7557e680551d93ea9d892',
            address,
            balance
          )
          .call()
        console.log('mintable', mintable)
        return mintable[0]
      }
      return 0
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
        toast.error('You must deposit BTC to borrow')
        return
      }
      if (amountReceive < 1) {
        toast.error('Can not borrow less than 1 USD')
        return
      }
      setButtonLoading('APPROVING...')
      if (!isApproved && item.depositTokenSymbol == 'BTC') {
        await contractBTC.methods
          .approve(
            item?.borrowContractInfo?.address,
            Web3.utils.toWei(Number(amount).toFixed(2), 'ether')
          )
          .send({
            from: address,
          })
        toast.success('Approve Successful')
      }
      setButtonLoading('BORROWING...')

      if (item.depositTokenSymbol == 'BTC') {
        await contractBorrowBTC.methods
          .borrow(
            Moralis.Units.Token(
              Number(amount).toFixed(9),
              item.depositTokenDecimal
            ),
            Moralis.Units.Token(
              Number(amountReceive).toFixed(2),
              item.borrowTokenDecimal
            )
          )
          .send({
            from: address,
          })
      } else if (item.depositTokenSymbol == 'ETH') {
        let mintableUSD = await getMintable(
          Moralis.Units.Token(Number(amountReceive).toFixed(2), 6)
        )
        console.log('mintableUSD', mintableUSD)

        if (mintableUSD == 0) {
          toast.error('Borrow failed. Please try again')
          return
        }

        console.log(
          Moralis.Units.Token(Number(amountReceive).toFixed(2), 6),
          mintableUSD
        )

        await contractBorrowETH.methods
          .borrow(
            Moralis.Units.Token(Number(amountReceive).toFixed(2), 6),
            mintableUSD
          )
          .send({
            value: Moralis.Units.Token(
              Number(amount).toFixed(9),
              item.depositTokenDecimal
            ),
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
    getAllowance()
    updateBalance()
  }, [dataBorrow, item?.tokenContract, item?.borrowContract])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
    getPrice()
  }, [])

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
        className="dark:tex-white space-y-4 rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[16px] py-[24px] text-[#404040] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white xl:px-[32px]"
        key={dataBorrow.depositTokenSymbol}
      >
        <div className="flex items-center">
          <img
            className="w-16 xs:w-20 lg:w-24"
            src={dataBorrow.depositTokenIcon}
            alt=""
          />
          <div className="font-larken grow pb-2 text-[22px] leading-tight xs:text-[18px] lg:text-[26px]">
            Deposit {dataBorrow.depositTokenSymbol},<br /> Borrow{' '}
            {dataBorrow.borrowTokenSymbol}
          </div>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#FCFAFF] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#161616]`}
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
                  +0.00 TORQ
                </p>
              </div>
            </Link>
          </Popover>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="font-larken flex h-[100px] flex-col items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={item?.depositTokenSymbol}
              tokenValue={Number(amount)}
              className="w-full py-4 leading-none lg:py-6"
              subtitle="Collateral"
              usdDefault
              decimalScale={2}
              onChange={(e) => {
                setAmount(e)
                setAmountReceive(Math.round((e * 50) / 100))
              }}
            />
          </div>
          <div className="font-larken flex h-[100px] flex-col items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={'USD'}
              tokenValue={Number(amountReceive)}
              tokenValueChange={Number(
                Math.round(
                  (Number(
                    amount *
                      price[`${dataBorrow.depositTokenSymbol.toLowerCase()}`]
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
                setAmountReceive(e)
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-[#959595]">
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
              href={'https://www.usd.farm/'}
              className=""
              target={'_blank'}
            >
              <img
                src={'/icons/coin/usd-1.png'}
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
            {dataBorrow.loanToValue}%
          </p>
        </div>
        <div className="flex justify-between text-[#959595]">
          <p>Variable APR</p>
          <p>{!borrowAPR ? '--' : '-' + borrowAPR.toFixed(2) + '%'}</p>
        </div>
        <div className="flex justify-between text-[#959595]">
          <p>Liquidity</p>
          <p>
            {!item?.liquidity ? '--' : '$' + toMetricUnits(item?.liquidity)}
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
              dataBorrow.loanToValue / 100
            ) {
              toast.error(`Loan-to-value exceeds ${dataBorrow.loanToValue}%`)
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
          symbol: 't' + item.borrowTokenSymbol,
        }}
        details={[
          {
            label: 'Loan-to-value',
            value: `<${dataBorrow.loanToValue}%`,
          },
          {
            label: 'Variable APR',
            value: `-${borrowAPR.toFixed(2)}%`,
          },
        ]}
      />
    </>
  )
}
