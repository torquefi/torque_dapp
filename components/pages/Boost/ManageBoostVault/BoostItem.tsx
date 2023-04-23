import CurrencySwitch from '@/components/common/CurrencySwitch'
import { useEffect, useRef, useState } from 'react'
import { AutowidthInput } from 'react-autowidth-input'
import { AiOutlineCheck, AiOutlineEdit } from 'react-icons/ai'
import { useMoralis } from 'react-moralis'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

export function BoostItem({ item }: any) {
  const [theme, setTheme] = useState(null)
  const [dataBoostVault, setDataBoostVault] = useState(item)
  const [label, setLabel] = useState(item?.label)
  const [isEdit, setEdit] = useState(false)
  const { address, isConnected } = useAccount()
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()

  const refLabelInput = useRef<HTMLInputElement>(null)

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
  }, [isWeb3Enabled, address, isConnected])
  const summaryInfor = (item: any) => {
    return (
      <>
        <CurrencySwitch
          tokenSymbol={item?.token}
          tokenValue={item.deposited}
          usdDefault
          className="-my-4 flex h-full min-w-[100px] flex-col items-center justify-center gap-2 py-4"
          render={(value) => (
            <>
              <p className="text-[22px]">{value}</p>
              <div className="font-mona text-[14px] text-[#959595]">
                Deposited
              </div>
            </>
          )}
          decimalScale={1}
        />
        <CurrencySwitch
          tokenSymbol={item?.token}
          tokenValue={item.earnings}
          usdDefault
          className="-my-4 flex h-full min-w-[100px] flex-col items-center justify-center gap-2 py-4"
          decimalScale={1}
          render={(value) => (
            <>
              <p className="text-[22px]">{value}</p>
              <div className="font-mona text-[14px] text-[#959595]">
                Earnings
              </div>
            </>
          )}
        />
        <div className="flex min-w-[100px] flex-col items-center justify-center gap-2">
          <div className="text-[22px]">{item.APR}</div>
          <div className="font-mona text-[14px] text-[#959595]">
            Variable APR
          </div>
        </div>
      </>
    )
  }
  return (
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
          <img src="/assets/pages/boost/chart.svg" alt="" />
        </div>
        <div className="mt-10">
          <div className="text-[28px]">Withdraw ETH</div>
          <div className="mt-2 flex w-full items-center justify-between rounded-[12px] border bg-[#FCFAFF] px-2 py-4 dark:border-[#1A1A1A] dark:bg-[#161616]">
            <input
              type="number"
              className="font-mona w-full bg-none px-2 focus:outline-none"
              style={{ backgroundColor: 'transparent' }}
              placeholder="Select amount"
            />
            <div className="flex items-center gap-2">
              {[25, 50, 100].map((item: any) => (
                <button className="font-mona rounded bg-[#F4F4F4] px-2 py-1 text-sm text-[#959595] dark:bg-[#1A1A1A]">
                  {item}%
                </button>
              ))}
            </div>
          </div>
          <button
            className="font-mona mt-4 w-full rounded-full bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[16px] uppercase text-white transition-all duration-300 ease-linear hover:bg-gradient-to-t"
            onClick={() => toast.message('Coming soon')}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  )
}
