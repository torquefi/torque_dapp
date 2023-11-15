import NumberFormat from '@/components/common/NumberFormat'
import SkeletonDefault from '@/components/skeleton'
import {
  boostContract,
  ethContract,
  usgContract,
} from '@/constants/boostContract'
import { AppStore } from '@/types/store'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import {
  borrowBtcContractInfo,
  borrowEthContractInfo,
} from '../Borrow/constants/contract'

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

  const [netAPY, setNetAPY] = useState('')
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const getInfor = async () => {
    //Boost
    // const tokenBoostContract = new web3.eth.Contract(
    //   JSON.parse(boostContract.abi),
    //   boostContract.address
    // )
    // let boostEth = await tokenBoostContract.methods
    //   .totalStack(ethContract.address)
    //   .call({
    //     from: address,
    //   })
    // let boostUsd = await tokenBoostContract.methods
    //   .totalStack(usgContract.address)
    //   .call({
    //     from: address,
    //   })

    // const idEth = await tokenBoostContract.methods
    //   .addressToPid(ethContract.address)
    //   .call({
    //     from: address,
    //   })
    // const idUsd = await tokenBoostContract.methods
    //   .addressToPid(usgContract.address)
    //   .call({
    //     from: address,
    //   })
    // let infoUserEth = await tokenBoostContract.methods
    //   .userInfo(address, idEth)
    //   .call({
    //     from: address,
    //   })
    // let infoUserUsd = await tokenBoostContract.methods
    //   .userInfo(address, idUsd)
    //   .call({
    //     from: address,
    //   })

    // const yourSupplyUser =
    //   Number(infoUserEth['amount']) + Number(infoUserUsd['amount'])
    // setYourSupply(web3.utils.fromWei(yourSupplyUser.toString(), 'ether'))
    // const supply = Number(boostEth) + Number(boostUsd)
    // setTotalSupply(web3.utils.fromWei(supply.toString(), 'ether'))

    //Borrow

    const contractBorrowBTC = new web3.eth.Contract(
      JSON.parse(borrowBtcContractInfo?.abi),
      borrowBtcContractInfo?.address
    )
    let dataBorrowBTC = await contractBorrowBTC.methods
      .borrowInfoMap(address)
      .call({
        from: address,
      })
    const aprBorrowBTC = await contractBorrowBTC.methods.getApr().call({
      from: address,
    })
    setNetAPY(web3.utils.fromWei(aprBorrowBTC.toString(), 'ether'))
    const borrowedBTC = dataBorrowBTC.borrowed
    const yourBorrowUsd = await contractBorrowBTC.methods
      .getBorrowable(borrowedBTC)
      .call({
        from: address,
      })
    const totalBorrowUsd = await contractBorrowBTC.methods.totalBorrow().call({
      from: address,
    })
    setTotalBorrow(web3.utils.fromWei(totalBorrowUsd.toString(), 'ether'))
    setYourBorrow(web3.utils.fromWei(yourBorrowUsd.toString(), 'ether'))
  }

  useEffect(() => {
    getInfor()
  }, [])
  if (isLoading) {
    return (
      <div className="">
        <SkeletonDefault height={'40vh'} width={'100%'} />
      </div>
    )
  }

  return (
    <div className="relative mt-[80px] flex w-full flex-wrap items-center justify-center rounded-t-[10px] border-[1px] from-[#25252566] pt-[80px] dark:border-[#1A1A1A] dark:bg-gradient-to-br md:mt-0 md:pt-0">
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Total Supply</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            value={totalSupply || 0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="text-[15px] text-[#959595]">Total Borrow</div>
          <NumberFormat
            className="font-larken text-[28px] text-[#404040] dark:text-white"
            displayType="text"
            thousandSeparator
            value={totalBorrow || 0}
            decimalScale={2}
            fixedDecimalScale
            prefix={'$'}
          />
        </div>
      </div>
      <div
        className={
          `gradient-border hidden h-[1px] w-full md:block ` +
          `${theme === 'dark' ? `gradient-border` : `gradient-border-white`}`
        }
      ></div>
      <div className="h-[100px] w-full md:h-[160px] md:w-[50%]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
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
        <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
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
      <div className="bottom-[12px] flex w-full items-center justify-between p-2 pt-[32px] md:absolute md:pt-0">
        <div className="space-y-1 leading-tight text-[#404040] dark:text-white">
          <div className="text-[12px] text-[#959595]">Borrow Used</div>
          <NumberFormat
            className="font-larken text-[16px]"
            displayType="text"
            thousandSeparator
            value={0}
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
            value={78}
            decimalScale={2}
            fixedDecimalScale
            suffix={'%'}
          />
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden bg-[#d7d7d7] dark:bg-[#1F1F1F]">
        <div
          style={{ width: '0%' }}
          className="h-full rounded-full bg-gradient-to-r from-[#C38BFF] to-[#AA5BFF] text-center text-white shadow-none"
        ></div>
      </div>
      <div className="z-100000 absolute top-[-80px] h-[160px] w-[160px] rounded-full border-2 border-[#E6E6E6] bg-white p-2 dark:border-[#25252566] dark:bg-[#1A1A1A] md:top-auto">
        <div className="h-full w-full rounded-full border-4 border-[#C38BFF] dark:bg-[#0D0D0D66]">
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
            <div className="text-[14px] text-[#959595]">NET APY</div>
            <NumberFormat
              className="font-larken text-[28px] text-[#404040] dark:text-white"
              displayType="text"
              thousandSeparator
              value={netAPY || 0}
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
