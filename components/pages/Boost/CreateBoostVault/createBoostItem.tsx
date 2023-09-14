import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import ConfirmDepositModal from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { updateborrowTime } from '@/lib/redux/auth/dataUser'
import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'

export function CreateBoostItem({ item }: any) {
  const [boostVault, setBoostVault] = useState(item)
  const [assetContract, setAssetContract] = useState(null)
  const [boostContract, setBoostContract] = useState(null)
  const [allowance, setAllowance] = useState(0)
  const [inputAmount, setInputAmount] = useState(0)
  const [decimal, setDecimal] = useState(0)
  const [btnLoading, setBtnLoading] = useState('')
  const { address, isConnected } = useAccount()
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()
  const [isOpenConfirmDeposit, setIsOpenConfirmDeposit] = useState(false)
  const dispatch = useDispatch()

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
        setAssetContract(contract)

        let decimal = await contract.methods.decimals().call({
          from: address,
        })
        setDecimal(decimal)
      }

      const dataABIBoost = await Moralis.Cloud.run('getAbi', {
        name: item?.boost_contract,
      })
      if (dataABIBoost?.abi) {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
          JSON.parse(dataABIBoost?.abi),
          dataABIBoost?.address
        )
        setBoostContract(contract)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getAllowance = async () => {
    try {
      if (assetContract) {
        const allowance = await assetContract.methods
          .allowance(address, boostContract._address)
          .call({
            from: address,
          })
        setAllowance(Number(Moralis.Units.FromWei(allowance, decimal)) || 0)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onDeposit = async () => {
    if (!isConnected) {
      setOpenConnectWalletModal(true)
      return
    }
    try {
      if (allowance < boostVault.amount && boostVault.token != 'ETH') {
        setBtnLoading('APPROVING...')
        await assetContract.methods
          .approve(
            boostContract._address,
            Moralis.Units.Token(boostVault.amount, decimal)
          )
          .send({
            from: address,
          })
      }
      setBtnLoading('DEPOSITING...')
      await boostContract.methods
        .deposit(
          assetContract._address,
          Moralis.Units.Token(boostVault.amount, decimal)
        )
        .send({
          from: address,
          value:
            boostVault.token == 'ETH'
              ? Moralis.Units.Token(boostVault.amount, decimal)
              : 0,
        })
      toast.success('Boost Successful')
      dispatch(updateborrowTime(new Date().getTime().toString() as any))
      setBtnLoading('')
    } catch (e) {
      setBtnLoading('')
      console.log(e)
    }
  }

  useEffect(() => {
    getAllowance()
  }, [assetContract, boostContract, address])

  useEffect(() => {
    initContract()
  }, [isWeb3Enabled, address, isConnected])

  const renderSubmitText = () => {
    if (!address) {
      return 'Connect Wallet'
    }
    return 'CONFIRM DEPOSIT'
  }
  const confirmDeposit = () => {
    setIsOpenConfirmDeposit(true)
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
              className="w-16 xs:w-20 lg:w-[84px] lg:h-[84px]"
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
              tokenSymbol={boostVault.token}
              tokenValue={Number(boostVault.amount)}
              className="w-full py-4 dark:text-white lg:py-6"
              decimalScale={2}
              usdDefault={true}
              subtitle="Deposit"
              onChange={(e) => {
                boostVault.amount = e
                setBoostVault({ ...boostVault })
              }}
            />
          </div>
          <div className="flex h-[110px] w-full flex-col items-center justify-center gap-3 rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  dark:border-[#1A1A1A]  dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <CurrencySwitch
              tokenSymbol={boostVault?.token}
              tokenValue={Number(boostVault.amount || 0) * boostVault.rate}
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
            0%
            {/* {item.APR}% */}
          </div>
        </div>
        <button
          className={`font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        ${(btnLoading != '' || boostVault.amount <= 0) &&
            'cursor-not-allowed opacity-50'
            }
        `}
          onClick={() => confirmDeposit()}
        >
          {btnLoading != '' ? btnLoading : renderSubmitText()}
        </button>
      </div>
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
      <ConfirmDepositModal symbol={item.token} contentCoin={{coin: `/icons/coin/${item.token.toLocaleLowerCase()}.png`, coinItem: "/assets/t-logo-circle.svg"}} contentButton={"Deposit & Earn"} openModal={isOpenConfirmDeposit} handleClose={() => setIsOpenConfirmDeposit(false)} handleAction={() => onDeposit()} />
    </>
  )
}
