import NumberFormat from '@/components/common/NumberFormat'
import SkeletonDefault from '@/components/skeleton'
// import {
//   boostBtcContract,
//   boostEtherContract,
//   boostTorqContract,
//   boostCompContract,
// } from '@/constants/contracts'
import { AppStore } from '@/types/store'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContract,
  borrowEthContract,
} from '../Borrow/constants/contract'
import BigNumber from 'bignumber.js'
import { useContract } from '@/constants/utils'

const DEFAULT_WALLET = '0xf74929eC9Ad8972AAFADe614978deE9A2A6eD189'

const HomePageFilter = () => {
  const web3 = new Web3(Web3.givenProvider)
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [totalSupply, setTotalSupply] = useState('')
  const [yourSupply, setYourSupply] = useState('')
  const [totalBorrow, setTotalBorrow] = useState('')
  const [yourBorrow, setYourBorrow] = useState('')
  const [calculateBorrow, setcalculateBorrow] = useState(0)
  const [ltv, setltv] = useState('')
  const [netAPY, setNetAPY] = useState('')
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const getInfor = async () => {
    const contractBorrowBTC = useContract(
      JSON.parse(borrowBtcContract?.abi),
      borrowBtcContract?.address
    )
    const contractBorrowETH = useContract(
      JSON.parse(borrowEthContract?.abi),
      borrowEthContract?.address
    )
    const ltvETH = await contractBorrowETH.methods.getCollateralFactor().call({
      from: address,
    })
    setltv(web3.utils.fromWei(ltvETH.toString(), 'ether'))
    if (address && isConnected) {
      let dataBorrowBTC = await contractBorrowBTC.methods
        .borrowInfoMap(address)
        .call({
          from: address,
        })
      let dataBorrowETH = await contractBorrowETH.methods
        .borrowInfoMap(address)
        .call({
          from: address,
        })
      const aprBorrowBTC = await contractBorrowBTC.methods.getApr().call({
        from: address,
      })
      const yourSuppliBTC = dataBorrowBTC.supplied
      const yourBorrowedyBTC = new BigNumber(dataBorrowBTC.borrowed)
        .div(10 ** 6)
        .toNumber()
      const yourSuppliETH = dataBorrowETH.supplied
      const yourBorrowedyETH = new BigNumber(dataBorrowETH.borrowed)
        .div(10 ** 6)
        .toNumber()

      const yourSuppliBTC_USD = await contractBorrowBTC.methods
        .getBorrowable(yourSuppliBTC, address)
        .call({
          from: address,
        })
      const yourSuppliETH_USD = await contractBorrowETH.methods
        .getBorrowable(yourSuppliETH, address)
        .call({
          from: address,
        })
      if (yourBorrowedyBTC > 0 || yourBorrowedyETH > 0) {
        const yourTotalSupply = web3.utils.fromWei(
          new BigNumber(yourSuppliBTC_USD).plus(yourSuppliETH_USD).toString(),
          'ether'
        )
        const yourTotalBorrow = new BigNumber(yourBorrowedyBTC)
          .plus(yourBorrowedyETH)
          .toString()
        const calculate = new BigNumber(yourTotalBorrow)
          .div(yourTotalSupply)
          .multipliedBy(
            Number(web3.utils.fromWei(ltvETH.toString(), 'ether')) * 100
          )
          .toFixed(2)
        setcalculateBorrow(Number(calculate))
        setYourSupply(yourTotalSupply)
        setYourBorrow(yourTotalBorrow)
      }

      if (yourBorrowedyBTC > 0) {
        setNetAPY(web3.utils.fromWei(aprBorrowBTC.toString(), 'ether'))
      }
    }
    const totalBorrowBTC = await contractBorrowBTC.methods.totalBorrow().call({
      from: address,
    })
    const totalBorrowETH = await contractBorrowETH.methods.totalBorrow().call({
      from: address,
    })

    const totalSupplyBTC = await contractBorrowBTC.methods
      .totalSupplied()
      .call({
        from: address,
      })
    const totalSuppliBTC_USD = await contractBorrowBTC.methods
      .getBorrowable(totalSupplyBTC, address || DEFAULT_WALLET)
      .call({
        from: address,
      })
    const totalSupplyETH = await contractBorrowETH.methods
      .totalSupplied()
      .call({
        from: address,
      })
    const totalSuppliETH_USD = await contractBorrowETH.methods
      .getBorrowable(totalSupplyETH, address || DEFAULT_WALLET)
      .call({
        from: address,
      })
    setTotalBorrow(
      web3.utils.fromWei(
        new BigNumber(totalBorrowBTC).plus(totalBorrowETH).toString(),
        'ether'
      )
    )
    setTotalSupply(
      web3.utils.fromWei(
        new BigNumber(totalSuppliBTC_USD).plus(totalSuppliETH_USD).toString(),
        'ether'
      )
    )
  }

  useEffect(() => {
    getInfor()
  }, [address, isConnected])
  if (isLoading) {
    return (
      <div className="mt-2">
        <SkeletonDefault height={'40vh'} width={'100%'} />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-transparent relative mt-[80px] flex w-full flex-wrap items-center justify-center rounded-t-[10px] border-[1px] from-[#25252566] pt-[80px] dark:border-[#1A1A1A] dark:bg-gradient-to-br md:mt-0 md:pt-0">
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="text-[15px] text-[#959595]">Total Supply</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            // value={totalSupply || 0}
            value={0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="text-[15px] text-[#959595]">Total Borrow</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            // value={totalBorrow || 0}
            value={0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div
        className={
          `hidden h-[1px] w-full md:block ` +
          `${theme === 'light' ? `bg-gradient-divider-light` : `bg-gradient-divider`}`
        }
      ></div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="text-[15px] text-[#959595]">Your Supply</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            value={yourSupply || 0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="text-[15px] text-[#959595]">Your Borrow</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            value={yourBorrow || 0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="bottom-[0px] flex w-full items-center justify-between p-[8px] md:p-[12px] md:absolute md:pt-0">
        <div className="space-y-1 leading-tight text-[#404040] dark:text-white">
          <div className="text-[12px] text-[#959595]">Borrow Used</div>
          <NumberFormat
            className="font-larken text-[16px]"
            displayType="text"
            thousandSeparator
            value={calculateBorrow}
            decimalScale={2}
            fixedDecimalScale
            suffix={'%'}
          />
        </div>
        <div className="space-y-1 text-right leading-tight text-[#404040] dark:text-white">
          <div className="text-[12px] text-[#959595]">Borrow Max</div>
          <NumberFormat
            className="font-larken text-[16px]"
            displayType="text"
            thousandSeparator
            // value={Number(ltv) * 100}
            value={78}
            decimalScale={2}
            fixedDecimalScale
            suffix={'%'}
          />
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden bg-[#F7F7F7] dark:bg-[#1F1F1F]">
        <div
          style={{ width: `${calculateBorrow}%` }}
          className="h-full rounded-full bg-gradient-to-r from-[#C38BFF] to-[#AA5BFF] text-center text-white shadow-none"
        ></div>
      </div>
      <div className="z-100000 absolute top-[-80px] h-[160px] w-[160px] rounded-full border-2 border-[#E6E6E6] bg-white p-2 dark:border-[#25252566] dark:bg-[#1A1A1A] md:top-auto">
        <div className="h-full w-full rounded-full border-4 border-[#C38BFF] dark:bg-[#0D0D0D66]">
          <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
            <div className="text-[14px] text-[#959595]">NET APY</div>
            <NumberFormat
              className="font-larken text-[28px] text-[#404040] dark:text-white"
              displayType="text"
              thousandSeparator
              value={-Number(netAPY) * 100 || 0}
              decimalScale={2}
              fixedDecimalScale
              suffix={'%'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePageFilter
