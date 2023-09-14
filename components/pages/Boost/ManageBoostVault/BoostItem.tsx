import CurrencySwitch from '@/components/common/CurrencySwitch'
import { VaultChart } from '@/components/common/VaultChart'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { AppStore } from '@/types/store'
import { useEffect, useRef, useState } from 'react'
import { AutowidthInput } from 'react-autowidth-input'
import { AiOutlineCheck, AiOutlineEdit } from 'react-icons/ai'
import { useMoralis } from 'react-moralis'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'

export function BoostItem({ item }: any) {
  const [theme, setTheme] = useState(null)
  const [dataBoostVault, setDataBoostVault] = useState(item)
  const [assetContract, setAssetContract] = useState(null)
  const [boostContract, setBoostContract] = useState(null)
  const [allowance, setAllowance] = useState(0)
  const [label, setLabel] = useState(item?.label)
  const [isEdit, setEdit] = useState(false)
  const [decimal, setDecimal] = useState(0)
  const [btnLoading, setBtnLoading] = useState('')
  const [deposited, setDeposited] = useState(0)
  const [earned, setEarned] = useState(0)
  const { address, isConnected } = useAccount()
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()
  const borrowTime = useSelector((store: AppStore) => store)
  const refLabelInput = useRef<HTMLInputElement>(null)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const initContract = async () => {
    try {
      var decimal
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

        decimal = await contract.methods.decimals().call({
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

        let id = await contract.methods
          .addressToPid(dataABIAsset.address)
          .call({
            from: address,
          })

        let infoUser = await contract.methods.userInfo(address, id).call({
          from: address,
        })
        setDeposited(
          Number(Moralis.Units.FromWei(`${infoUser['amount']}`, decimal))
        )
        setEarned(
          Number(Moralis.Units.FromWei(`${infoUser['reward']}`, decimal))
        )
      }
    } catch (e) {
      console.log(e)
    }
  }
  const onWithdraw = async () => {
    if (!isConnected) {
      setOpenConnectWalletModal(true)
      return
    }
    try {
      setBtnLoading('WITHDRAWING...')
      await boostContract.methods
        .withdraw(
          assetContract._address,
          Moralis.Units.Token(dataBoostVault.amount, decimal)
        )
        .send({
          from: address,
          value:
            dataBoostVault.token == 'ETH'
              ? Moralis.Units.Token(dataBoostVault.amount, decimal)
              : 0,
        })
      toast.success('Withdraw Successful')
      await initContract()
      setBtnLoading('')
    } catch (e) {
      toast.error('Withdraw Failed')
      setBtnLoading('')
      console.log(e)
    }
  }
  const getDataNameBoost = async () => {
    const data = await Moralis.Cloud.run('getDataBorrowUser', {
      address: address,
    })
    setLabel(data[`${item.data_key}`] || item?.label)
  }
  const updateDataNameBoost = async (name: string) => {
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
        getDataNameBoost()
        toast.success('Update name successful')
      })
      .catch(() => {
        toast.error('Update name failed')
      })
  }

  useEffect(() => {
    if (isEdit && refLabelInput.current) {
      refLabelInput.current.focus()
    }
  }, [isEdit])

  useEffect(() => {
    setTheme(
      typeof window !== 'undefined'
        ? window.localStorage.getItem('theme')
        : null
    )
  }, [typeof window !== 'undefined'])
  useEffect(() => {
    getDataNameBoost()
    initContract()
  }, [isWeb3Enabled, address, isConnected, borrowTime])

  const summaryInfor = (item: any) => {
    return (
      <div className="flex w-full items-center justify-between">
        <CurrencySwitch
          tokenSymbol={item?.token}
          tokenValue={deposited}
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
          decimalScale={2}
        />
        <CurrencySwitch
          tokenSymbol={item?.token}
          tokenValue={earned}
          usdDefault
          className="-my-4 flex h-full min-w-[130px] flex-col items-center justify-center gap-2 py-4"
          decimalScale={2}
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
          <div className="text-[22px]">{item.APR}</div>
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
    return 'Withdraw'
  }
  return (
    <>
      <div className="dark-text-[#000] mt-[24px] grid w-full rounded-[12px] border border-[#E6E6E6] bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[24px] py-[20px] text-[#464646] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
        <div className="grid w-full grid-cols-2">
          <div className="xlg:w-[calc(100%-600px-64px)] font-larken flex w-[calc(100%-64px)] items-center space-x-2 text-[22px] md:w-[calc(100%-400px-64px)] lg:w-[calc(100%-500px-64px)]">
            {!isEdit && (
              <div
                className="flex min-w-max cursor-pointer items-center text-[22px]"
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
                      updateDataNameBoost(label)
                      setEdit(!isEdit)
                    }}
                  />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-14">
            <div className="hidden items-center justify-between gap-14 lg:flex">
              {summaryInfor(item)}
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                className=""
                onClick={() => {
                  item.isOpen = !item.isOpen
                  setDataBoostVault({ ...dataBoostVault })
                }}
              >
                <img
                  className={
                    'w-[18px] text-[#000] transition-all' +
                    ` ${item.isOpen ? 'rotate-180' : ''}`
                  }
                  // src="/icons/arrow-down.svg"
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
          className={`grid grid-cols-1 gap-8 overflow-hidden transition-all duration-300 lg:grid-cols-2 ${
            item.isOpen
              ? 'max-h-[1000px] py-[16px] ease-in'
              : 'max-h-0 py-0 opacity-0 ease-out'
          }`}
        >
          <div className="flex items-center justify-between gap-4 lg:hidden">
            {summaryInfor(item)}
          </div>
          <div className="">
            {/* <Chart /> */}
            {/* <img src="/assets/pages/boost/chart.svg" alt="" /> */}
            <VaultChart
              label="Boost Apr"
              percent={+item.APR?.replace('%', '')}
              value={49510000}
            />
          </div>
          <div className="mt-10">
            <div className="text-[28px]">Withdraw ETH</div>
            <div className="mt-2 flex w-full items-center justify-between rounded-[12px] border bg-[#FCFAFF] px-2 py-4 dark:border-[#1A1A1A] dark:bg-[#161616]">
              <input
                type="number"
                className="font-mona w-full bg-none px-2 focus:outline-none"
                style={{ backgroundColor: 'transparent' }}
                value={dataBoostVault.amount}
                placeholder="Select amount"
                onChange={(e) => {
                  dataBoostVault.amount = e.target.value
                  setDataBoostVault({ ...dataBoostVault })
                }}
              />
              <div className="flex items-center gap-2">
                {[25, 50, 100].map((item: any, i) => (
                  <button
                    key={i}
                    className="font-mona rounded bg-[#F4F4F4] px-2 py-1 text-sm text-[#959595] dark:bg-[#1A1A1A]"
                    onClick={() => {
                      dataBoostVault.amount = (item * deposited) / 100
                      setDataBoostVault({ ...dataBoostVault })
                    }}
                  >
                    {item}%
                  </button>
                ))}
              </div>
            </div>
            <button
              className={`font-mona mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
            ${btnLoading != '' && 'cursor-not-allowed opacity-70'}
            `}
              disabled={btnLoading != ''}
              onClick={() => onWithdraw()}
            >
              {btnLoading != '' ? btnLoading : renderSubmitText()}
            </button>
          </div>
        </div>
      </div>
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
    </>
  )
}
