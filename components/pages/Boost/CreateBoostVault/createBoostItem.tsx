import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { updateborrowTime } from '@/lib/redux/auth/dataUser'
import { AppStore } from '@/types/store'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'

export function CreateBoostItem({ item }: any) {
  const { address, isConnected } = useAccount()
  const [btnLoading, setBtnLoading] = useState(false)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
    useState(false)
  const [amount, setAmount] = useState<number>(0)
  const [balance, setBalance] = useState('0')

  const theme = useSelector((store: AppStore) => store.theme.theme)

  const dispatch = useDispatch()

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.tokenContractInfo?.abi),
      item?.tokenContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item?.symbol])

  const boostContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.boostContractInfo?.abi),
      item?.boostContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item?.symbol])

  const getAllowance = async () => {
    try {
      const allowanceToken = await tokenContract.methods
        .allowance(address, item?.boostContractInfo?.address)
        .call()
      const decimals = await tokenContract.methods.decimals().call()
      const allowance = ethers.utils
        .formatUnits(allowanceToken, decimals)
        .toString()

      return allowance
    } catch (error) {
      console.log('Staking.DepositModal.handleGetAllowance', error)
      return 0
    }
  }



  const getBalance = async () => {
    if (tokenContract && address) {
      try {
        const balance = await tokenContract.methods.balanceOf(address).call()
        const decimals = await tokenContract.methods.decimals().call()
        const tokenAmount = ethers.utils
          .formatUnits(balance?.toString(), decimals)
          .toString()
        setBalance(tokenAmount)
      } catch (error) {
        console.log('error :>> ', error);
        setBalance('0')
      }

    }
  }

  useEffect(() => {
    getBalance()
  }, [tokenContract, address])

  const handleConfirmDeposit = () => {
    if (!isConnected) {
      setOpenConnectWalletModal(true)
      return
    }
    if (!isConnected) {
      return toast.error('You need connect your wallet first')
    }
    if (!+amount) {
      return toast.error('You must input amount to deposit')
    }
    setOpenConfirmDepositModal(true)
  }


  const onDeposit = async () => {
    const allowance = await getAllowance()
    try {
      if (+allowance < +amount) {
        setBtnLoading(true)

        await tokenContract.methods
          .approve(
            item?.boostContractInfo?.address,
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

          )
          .send({
            from: address,
          })
      }

      setBtnLoading(true)

      const decimals = await tokenContract.methods.decimals().call()
      const tokenAmount = ethers.utils
        .parseUnits(amount?.toString(), decimals)
        .toString()

      console.log('amount :>> ', amount);
      console.log('item?.tokenContractInfo?.address :>> ', item?.tokenContractInfo?.address);
      console.log('tokenAmount :>> ', tokenAmount);

      await boostContract.methods
        .deposit(
          item?.tokenContractInfo?.address,
          tokenAmount
        )
        .send({
          from: address,
          value:
            item?.token === 'ETH'
              ? tokenAmount
              : 0,
        })
      toast.success('Boost Successful')
      dispatch(updateborrowTime(new Date().getTime().toString() as any))
      setBtnLoading(false)
      setOpenConfirmDepositModal(false)
    } catch (e) {
      setBtnLoading(false)
      console.log(e)
    }
  }

  const renderSubmitText = () => {
    if (!address) {
      return 'Connect Wallet'
    }
    return 'Confirm Deposit'
  }
  return (
    <>
      <div
        className={
          `rounded-[12px] border border-[#E6E6E6] bg-[#ffffff]  px-3 py-6 text-[#404040] dark:border-[#1A1A1A]  dark:text-white lg:px-8` +
          `  ${theme === 'light' ? ' bg-[#FCFAFF]' : 'bg-overview'}`
        }
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <img
              src={`/icons/coin/${item.token.toLocaleLowerCase()}.png`}
              alt=""
              className="w-16 xs:w-20 lg:h-[84px] lg:w-[84px]"
            />
            <div className="font-larken grow pb-2 text-[22px] leading-tight xs:text-[18px] sm:text-[22px] lg:text-[26px]">
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
                  src="/assets/t-logo-circle.svg"
                  alt=""
                  className="w-[24px] xs:w-[28px]"
                />

                <div className="font-mona mx-1 uppercase text-[#AA5BFF] xs:mx-2">
                  +{item.bonus_TORQ} TORQ
                </div>
              </div>
            </Link>
          </Popover>
        </div>
        <div className="font-larken mt-4 grid grid-cols-2 gap-4">
          <div className="flex h-[110px] w-full flex-col items-center justify-center gap-3 rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  dark:border-[#1A1A1A]  dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={item?.token}
              tokenValue={+amount}
              className="w-full py-4 dark:text-white lg:py-6"
              decimalScale={2}
              usdDefault
              subtitle="Deposit"
              onChange={(e) => {
                setAmount(e)
              }}
            />
          </div>
          <div className="flex h-[110px] w-full flex-col items-center justify-center gap-3 rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  dark:border-[#1A1A1A]  dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <CurrencySwitch
              tokenSymbol={item?.token}
              tokenValue={Number(amount || 0) * item?.rate}
              usdDefault
              className="w-full space-y-2 py-6 lg:py-[31px]"
              decimalScale={2}
              render={(value) => (
                <>
                  <p className="text-[32px] leading-none">{value}</p>
                  <div className="font-mona text-[16px] text-[#959595]">
                    3-Year Value
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <div className="font-mona flex w-full items-center justify-between py-3 text-[16px] text-[#959595]">
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
          <div className="">
            {item.APR}%
          </div>
        </div>
        <button
          className={`font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
          ${btnLoading
              ? 'cursor-not-allowed text-[#eee]'
              : 'cursor-pointer '
            }
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
          amount: amount,
          icon: `/icons/coin/${item.token.toLocaleLowerCase()}.png`,
          symbol: item.token,
        }}
        coinTo={{
          amount: amount,
          icon: `/icons/coin/${item.token.toLocaleLowerCase()}.png`,
          symbol: 't' + item.token,
        }}
        details={[
          {
            label: 'Wallet balance',
            value: balance + ' ' + item?.token,
          },
          {
            label: 'Exchange rate',
            value: `1 ${item?.token} = 1 t${item?.token}`,
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
