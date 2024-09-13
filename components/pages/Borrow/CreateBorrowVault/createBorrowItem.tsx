import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { ConfirmDepositModal } from '@/components/common/Modal/ConfirmDepositModal'
import Popover from '@/components/common/Popover'
import { toMetricUnits } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { IBorrowInfo } from '../types'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import { RPC_PROVIDER } from '@/constants/networks'

interface CreateBorrowItemProps {
  item: IBorrowInfo
  setIsFetchBorrowLoading?: any
}

export default function CreateBorrowItem({
  item,
  setIsFetchBorrowLoading,
}: CreateBorrowItemProps) {
  const web3 = new Web3(Web3.givenProvider)

  const [dataBorrow, setDataBorrow] = useState(item)
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState(0)
  const [amountReceive, setAmountReceive] = useState(0)
  const [buttonLoading, setButtonLoading] = useState('')
  const { address, isConnected } = useAccount()
  const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
    useState(false)
  const [aprBorrow, setAprBorrow] = useState('')
  const [amountRaw, setAmountRaw] = useState(0)
  const [amountReceiveRaw, setAmountReceiveRaw] = useState(0)
  const [isUsdBorrowToken, setIsUsdBorrowToken] = useState(true)
  const [isUsdDepositToken, setIsUsdDepositToken] = useState(true)
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const isUsdcBorrowed = item.borrowTokenSymbol === 'USDC'
  const isUsdtBorrowed = item.borrowTokenSymbol === 'USDT'

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)

  const userAddressContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.userAddressContractInfo?.abi),
      item?.userAddressContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.userAddressContractInfo])

  const userAddressReadContract = useMemo(() => {
    const web3 = new Web3(RPC_PROVIDER)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.userAddressContractInfo?.abi),
      item?.userAddressContractInfo?.address
    )
    return contract
  }, [item.userAddressContractInfo])

  const tokenBorrowContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.tokenBorrowContractInfo?.abi),
      item?.tokenBorrowContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.tokenContractInfo])

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.tokenContractInfo?.abi),
      item?.tokenContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.tokenContractInfo])

  const borrowContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.borrowContractInfo?.abi),
      item?.borrowContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.borrowContractInfo])

  const handleGetApr = async () => {
    try {
      const response = await userAddressReadContract.methods.getApr().call()
      setAprBorrow(web3.utils.fromWei(response.toString(), 'ether'))
    } catch (error) {
      console.log('error get apr :>> ', error)
    }
  }

  useEffect(() => {
    if (userAddressReadContract) {
      handleGetApr()
    }
  }, [userAddressReadContract])

  const handleConfirmDeposit = async () => {
    if (!isConnected) {
      setOpenConnectWalletModal(true)
      return
    }
    setOpenConfirmDepositModal(true)
  }

  const onBorrow = async () => {
    if (amount <= 0) {
      toast.error(`You must supply ${item.depositTokenSymbol} to borrow`)
      return
    }
    try {
      setIsLoading(true)
      if (!isUsdcBorrowed && !isUsdtBorrowed) {
        const web3 = new Web3(Web3.givenProvider)
        const oldBorrowContract = new web3.eth.Contract(
          JSON.parse(item?.oldBorrowContractInfo?.abi),
          item?.oldBorrowContractInfo?.address
        )

        if (item.depositTokenSymbol == 'WBTC') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(address)
          const tokenDepositDecimals = await tokenContract.methods
            .decimals()
            .call()
          const borrow = Number(
            new BigNumber(Number(amount).toFixed(tokenDepositDecimals))
              .multipliedBy(10 ** tokenDepositDecimals)
              .toString()
          )
          const usdcBorrowAmount = await oldBorrowContract.methods
            .getBorrowableUsdc(borrow)
            .call()
          const newUsdcBorrowAmount = new BigNumber(usdcBorrowAmount)
            .multipliedBy(0.98)
            .toFixed(0)
            .toString()

          const tokenBorrowDecimal = await tokenBorrowContract.methods
            .decimals()
            .call()
          console.log('tokenDecimal :>> ', tokenBorrowDecimal)
          console.log('amountReceive :>> ', amountReceive)

          let tusdBorrowAmount = '0'
          if (amountReceive) {
            tusdBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
                tokenBorrowDecimal
              )
              .toString()
          }

          const tokenContract1 = new ethers.Contract(
            item?.tokenContractInfo?.address,
            item?.tokenContractInfo?.abi,
            signer
          )

          const userAddressContract = await borrowContract.methods
            .userContract(address)
            .call()
          if (
            userAddressContract === '0x0000000000000000000000000000000000000000'
          ) {
            const allowance = await tokenContract.methods
              .allowance(address, item.borrowContractInfo.address)
              .call()
            console.log('allowance :>> ', allowance)

            if (
              new BigNumber(allowance).lte(new BigNumber('0')) ||
              new BigNumber(allowance).lte(new BigNumber(borrow?.toString()))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                borrow.toString()
              )
              await tx.wait()
            }
          } else {
            const allowanceUserContract = await tokenContract.methods
              .allowance(address, userAddressContract)
              .call()
            console.log('allowanceUserContract :>> ', allowanceUserContract)
            if (
              new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
              new BigNumber(allowanceUserContract).lte(
                new BigNumber(borrow?.toString())
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                borrow.toString()
              )
              await tx.wait()
            }
          }

          const borrowContract2 = new ethers.Contract(
            item?.borrowContractInfo?.address,
            item?.borrowContractInfo?.abi,
            signer
          )

          console.log(
            'params borrow:>> ',
            borrow.toString(),
            newUsdcBorrowAmount,
            tusdBorrowAmount
          )

          const tx = await borrowContract2.callBorrow(
            borrow.toString(),
            newUsdcBorrowAmount,
            tusdBorrowAmount
          )
          await tx.wait()
          toast.success('Borrow Successful')
          setOpenConfirmDepositModal(false)
          setIsLoading(false)
          setIsFetchBorrowLoading &&
            setIsFetchBorrowLoading((prev: any) => !prev)
        }

        if (item.depositTokenSymbol == 'WETH') {
          const tokenDepositDecimals = await tokenContract.methods
            .decimals()
            .call()
          const borrow = Number(
            new BigNumber(Number(amount).toFixed(tokenDepositDecimals))
              .multipliedBy(10 ** tokenDepositDecimals)
              .toString()
          )
          console.log('borrow :>> ', borrow)
          const usdcBorrowAmount = await oldBorrowContract.methods
            .getBorrowableUsdc(borrow)
            .call()

          const newUsdcBorrowAmount = new BigNumber(usdcBorrowAmount)
            .multipliedBy(0.98)
            .toFixed(0)
            .toString()

          const tokenBorrowDecimal = await tokenBorrowContract.methods
            .decimals()
            .call()

          let tusdBorrowAmount = '0'

          if (amountReceive) {
            tusdBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
                tokenBorrowDecimal
              )
              .toString()
          }

          console.log(
            'params :>> ',
            borrow.toString(),
            newUsdcBorrowAmount,
            tusdBorrowAmount
          )

          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(address)

          const tokenContract1 = new ethers.Contract(
            item?.tokenContractInfo?.address,
            item?.tokenContractInfo?.abi,
            signer
          )

          const userAddressContract = await borrowContract.methods
            .userContract(address)
            .call()

          console.log('userAddressContract :>> ', userAddressContract)

          if (
            userAddressContract === '0x0000000000000000000000000000000000000000'
          ) {
            const allowance = await tokenContract.methods
              .allowance(address, item.borrowContractInfo.address)
              .call()
            console.log('allowance :>> ', allowance)
            if (
              new BigNumber(allowance).lte(new BigNumber('0')) ||
              new BigNumber(allowance).lte(new BigNumber(borrow?.toString()))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                borrow.toString()
              )
              await tx.wait()
            }
          } else {
            const allowanceUserContract = await tokenContract.methods
              .allowance(address, userAddressContract)
              .call()
            console.log('allowanceUserContract :>> ', allowanceUserContract)
            if (
              new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
              new BigNumber(allowanceUserContract).lte(
                new BigNumber(borrow?.toString())
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                borrow.toString()
              )
              await tx.wait()
            }
          }

          const borrowContract2 = new ethers.Contract(
            item?.borrowContractInfo?.address,
            item?.borrowContractInfo?.abi,
            signer
          )

          const tx = await borrowContract2.callBorrow(
            borrow.toString(),
            newUsdcBorrowAmount,
            tusdBorrowAmount,
            {
              gasLimit: '50000',
            }
          )
          await tx.wait()
          toast.success('Borrow Successful')
          setOpenConfirmDepositModal(false)
          setIsLoading(false)
          setIsFetchBorrowLoading &&
            setIsFetchBorrowLoading((prev: any) => !prev)
        }
      } else if (isUsdtBorrowed) {
        if (item.depositTokenSymbol == 'WBTC') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(address)
          const tokenDepositDecimals = await tokenContract.methods
            .decimals()
            .call()
          const borrow = Number(
            new BigNumber(Number(amount).toFixed(tokenDepositDecimals))
              .multipliedBy(10 ** tokenDepositDecimals)
              .toString()
          )

          const tokenBorrowDecimal = await tokenBorrowContract.methods
            .decimals()
            .call()
          console.log('tokenDecimal :>> ', tokenBorrowDecimal)
          console.log('amountReceive :>> ', amountReceive)

          let usdtBorrowAmount = '0'
          if (amountReceive) {
            usdtBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
                tokenBorrowDecimal
              )
              .toString()
          }

          const tokenContract1 = new ethers.Contract(
            item?.tokenContractInfo?.address,
            item?.tokenContractInfo?.abi,
            signer
          )

          const userAddressContract = await borrowContract.methods
            .userContract(address)
            .call()
          if (
            userAddressContract === '0x0000000000000000000000000000000000000000'
          ) {
            const allowance = await tokenContract.methods
              .allowance(address, item.borrowContractInfo.address)
              .call()
            console.log('allowance :>> ', allowance)

            if (
              new BigNumber(allowance).lte(new BigNumber('0')) ||
              new BigNumber(allowance).lte(new BigNumber(borrow?.toString()))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                borrow.toString()
              )
              await tx.wait()
            }
          } else {
            const allowanceUserContract = await tokenContract.methods
              .allowance(address, userAddressContract)
              .call()
            console.log('allowanceUserContract :>> ', allowanceUserContract)
            if (
              new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
              new BigNumber(allowanceUserContract).lte(
                new BigNumber(borrow?.toString())
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                borrow.toString()
              )
              await tx.wait()
            }
          }

          const borrowContract2 = new ethers.Contract(
            item?.borrowContractInfo?.address,
            item?.borrowContractInfo?.abi,
            signer
          )

          console.log('params borrow:>> ', borrow.toString(), usdtBorrowAmount)

          const tx = await borrowContract2.callBorrow(
            borrow.toString(),
            usdtBorrowAmount,
            {
              gasLimit: '500000',
            }
          )
          await tx.wait()
          toast.success('Borrow Successful')
          setOpenConfirmDepositModal(false)
          setIsLoading(false)
          setIsFetchBorrowLoading &&
            setIsFetchBorrowLoading((prev: any) => !prev)
        }

        if (item.depositTokenSymbol == 'WETH') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(address)
          const tokenDepositDecimals = await tokenContract.methods
            .decimals()
            .call()
          const borrow = Number(
            new BigNumber(Number(amount).toFixed(tokenDepositDecimals))
              .multipliedBy(10 ** tokenDepositDecimals)
              .toString()
          )

          const tokenBorrowDecimal = await tokenBorrowContract.methods
            .decimals()
            .call()
          console.log('tokenDecimal :>> ', tokenBorrowDecimal)
          console.log('amountReceive :>> ', amountReceive)

          let usdtBorrowAmount = '0'
          console.log('amountReceive :>> ', amountReceive)
          if (amountReceive) {
            usdtBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
                tokenBorrowDecimal
              )
              .toString()
          }
          console.log('usdtBorrowAmount :>> ', usdtBorrowAmount)

          const tokenContract1 = new ethers.Contract(
            item?.tokenContractInfo?.address,
            item?.tokenContractInfo?.abi,
            signer
          )

          const userAddressContract = await borrowContract.methods
            .userContract(address)
            .call()
          if (
            userAddressContract === '0x0000000000000000000000000000000000000000'
          ) {
            const allowance = await tokenContract.methods
              .allowance(address, item.borrowContractInfo.address)
              .call()
            console.log('allowance :>> ', allowance)
            console.log('usdtBorrowAmount :>> ', usdtBorrowAmount)
            console.log('userAddressContract :>> ', userAddressContract)

            if (
              new BigNumber(allowance).lte(new BigNumber('0')) ||
              new BigNumber(allowance).lte(new BigNumber(borrow.toString()))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                borrow.toString()
              )
              await tx.wait()
            }
          } else {
            const allowanceUserContract = await tokenContract.methods
              .allowance(address, userAddressContract)
              .call()
            console.log('allowanceUserContract :>> ', allowanceUserContract)
            if (
              new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
              new BigNumber(allowanceUserContract).lte(
                new BigNumber(borrow.toString())
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                borrow.toString()
              )
              await tx.wait()
            }
          }

          const borrowContract2 = new ethers.Contract(
            item?.borrowContractInfo?.address,
            item?.borrowContractInfo?.abi,
            signer
          )

          console.log('params borrow:>> ', borrow.toString(), usdtBorrowAmount)

          const tx = await borrowContract2.callBorrow(
            borrow.toString(),
            usdtBorrowAmount
          )
          await tx.wait()
          toast.success('Borrow Successful')
          setOpenConfirmDepositModal(false)
          setIsLoading(false)
          setIsFetchBorrowLoading &&
            setIsFetchBorrowLoading((prev: any) => !prev)
        }
      } else {
        if (item.depositTokenSymbol == 'WBTC') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(address)
          const tokenDepositDecimals = await tokenContract.methods
            .decimals()
            .call()
          const borrow = Number(
            new BigNumber(Number(amount).toFixed(tokenDepositDecimals))
              .multipliedBy(10 ** tokenDepositDecimals)
              .toString()
          )

          const tokenBorrowDecimal = await tokenBorrowContract.methods
            .decimals()
            .call()
          console.log('tokenDecimal :>> ', tokenBorrowDecimal)
          console.log('amountReceive :>> ', amountReceive)

          let usdtBorrowAmount = '0'
          if (amountReceive) {
            usdtBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
                tokenBorrowDecimal
              )
              .toString()
          }

          const tokenContract1 = new ethers.Contract(
            item?.tokenContractInfo?.address,
            item?.tokenContractInfo?.abi,
            signer
          )

          const userAddressContract = await borrowContract.methods
            .userContract(address)
            .call()
          if (
            userAddressContract === '0x0000000000000000000000000000000000000000'
          ) {
            const allowance = await tokenContract.methods
              .allowance(address, item.borrowContractInfo.address)
              .call()
            console.log('allowance :>> ', allowance)

            if (
              new BigNumber(allowance).lte(new BigNumber('0')) ||
              new BigNumber(allowance).lte(new BigNumber(borrow?.toString()))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                borrow.toString()
              )
              await tx.wait()
            }
          } else {
            const allowanceUserContract = await tokenContract.methods
              .allowance(address, userAddressContract)
              .call()
            console.log('allowanceUserContract :>> ', allowanceUserContract)
            if (
              new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
              new BigNumber(allowanceUserContract).lte(
                new BigNumber(borrow?.toString())
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                borrow.toString()
              )
              await tx.wait()
            }
          }

          const borrowContract2 = new ethers.Contract(
            item?.borrowContractInfo?.address,
            item?.borrowContractInfo?.abi,
            signer
          )

          console.log('params borrow:>> ', borrow.toString(), usdtBorrowAmount)

          const tx = await borrowContract2.callBorrow(
            borrow.toString(),
            usdtBorrowAmount
          )
          await tx.wait()
          toast.success('Borrow Successful')
          setOpenConfirmDepositModal(false)
          setIsLoading(false)
          setIsFetchBorrowLoading &&
            setIsFetchBorrowLoading((prev: any) => !prev)
        }

        if (item.depositTokenSymbol == 'WETH') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(address)
          const tokenDepositDecimals = await tokenContract.methods
            .decimals()
            .call()
          const borrow = Number(
            new BigNumber(Number(amount).toFixed(tokenDepositDecimals))
              .multipliedBy(10 ** tokenDepositDecimals)
              .toString()
          )

          const tokenBorrowDecimal = await tokenBorrowContract.methods
            .decimals()
            .call()
          console.log('tokenDecimal :>> ', tokenBorrowDecimal)
          console.log('amountReceive :>> ', amountReceive)

          let usdtBorrowAmount = '0'
          if (amountReceive) {
            usdtBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceive).toFixed(tokenBorrowDecimal).toString(),
                tokenBorrowDecimal
              )
              .toString()
          }

          const tokenContract1 = new ethers.Contract(
            item?.tokenContractInfo?.address,
            item?.tokenContractInfo?.abi,
            signer
          )

          const userAddressContract = await borrowContract.methods
            .userContract(address)
            .call()
          if (
            userAddressContract === '0x0000000000000000000000000000000000000000'
          ) {
            const allowance = await tokenContract.methods
              .allowance(address, item.borrowContractInfo.address)
              .call()
            console.log('allowance :>> ', allowance)

            if (
              new BigNumber(allowance).lte(new BigNumber('0')) ||
              new BigNumber(allowance).lte(
                new BigNumber(new BigNumber(borrow?.toString()))
              )
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                borrow.toString()
              )
              await tx.wait()
            }
          } else {
            const allowanceUserContract = await tokenContract.methods
              .allowance(address, userAddressContract)
              .call()
            console.log('allowanceUserContract :>> ', allowanceUserContract)
            if (
              new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
              new BigNumber(allowanceUserContract).lte(
                new BigNumber(usdtBorrowAmount)
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                borrow.toString()
              )
              await tx.wait()
            }
          }

          const borrowContract2 = new ethers.Contract(
            item?.borrowContractInfo?.address,
            item?.borrowContractInfo?.abi,
            signer
          )

          console.log('params borrow:>> ', borrow.toString(), usdtBorrowAmount)

          const tx = await borrowContract2.callBorrow(
            borrow.toString(),
            usdtBorrowAmount
          )
          await tx.wait()
          toast.success('Borrow Successful')
          setOpenConfirmDepositModal(false)
          setIsLoading(false)
          setIsFetchBorrowLoading &&
            setIsFetchBorrowLoading((prev: any) => !prev)
        }
      }
    } catch (e) {
      console.log('CreateBorrowItem.onBorrow', e)
      toast.error('Borrow Failed')
    } finally {
      setIsLoading(false)
    }
  }

  const renderSubmitText = () => {
    if (!address) {
      return 'Connect Wallet'
    }
    return 'Confirm Borrow'
  }

  return (
    <>
      <div
        className="rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-5 pt-3 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white xl:px-[32px]"
        key={dataBorrow.depositTokenSymbol}
      >
        <div className="flex w-full items-center justify-between">
          <div className="ml-[-12px] flex w-full items-center">
            <div className="relative flex justify-center -space-x-14">
              <img
                className="w-[72px] md:w-24"
                src={dataBorrow.depositTokenIcon}
                alt=""
              />
              <img
                className="z-1 absolute bottom-3 right-3 w-[18px] rounded-xl object-cover shadow-md md:bottom-4 md:right-4 md:w-[24px]"
                alt="img"
                src={dataBorrow.borrowRowTokenIcon}
              />
            </div>
            <div className="font-rogan ml-[-6px] mt-[-4px] text-[20px] leading-tight text-[#030303] dark:text-white md:text-[22px] lg:text-[26px]">
              Supply {dataBorrow.depositTokenSymbol},<br /> Borrow{' '}
              {dataBorrow.borrowTokenSymbol}
            </div>
          </div>
          <div className="mt-[8px] flex w-[210px] flex-col items-end justify-end text-center text-sm leading-tight">
            <Popover
              trigger="hover"
              placement="bottom-right"
              className={`mt-[8px] w-[200px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#161616]`}
              content="The projected TORQ rewards after 1 year of $1,000 supplied and 70% borrowed."
            >
              <div className="flex cursor-pointer items-center rounded-full bg-[#AA5BFF] bg-opacity-20 p-1 text-[12px] xs:text-[14px]">
                <img
                  src="/assets/t-logo-circle.png"
                  alt="torq"
                  className="w-[18px] md:w-[22px]"
                />
                <div className="font-rogan-regular mx-1 uppercase text-[#AA5BFF] xs:mx-2">
                  +{Number(item.bonus).toLocaleString()}% TORQ
                </div>
              </div>
            </Popover>
            <Popover
              trigger="hover"
              placement="bottom-right"
              className={`mt-[8px] w-[200px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#161616]`}
              content="The projected ARB rewards after 1 year of $1,000 supplied and 70% borrowed."
            >
              <div className="mt-2 flex cursor-pointer items-center rounded-full bg-[#00BFFF] bg-opacity-20 p-1 text-[12px] xs:text-[14px]">
                <img
                  src="icons/coin/arb.png"
                  alt="arb"
                  className="w-[18px] md:w-[22px]"
                />
                <div className="font-rogan-regular mx-1 uppercase text-[#00BFFF] xs:mx-2">
                  +
                  {item.arbBonus === 0
                    ? '0.00'
                    : Number(item.arbBonus) % 1 === 0
                    ? `${Number(item.arbBonus).toLocaleString(undefined, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}`
                    : Number(item.arbBonus).toLocaleString(undefined, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                  % ARB
                </div>
              </div>
            </Popover>
          </div>
        </div>
        <div className="font-rogan mb-1 mt-1 grid grid-cols-2 gap-4">
          <div className="flex w-full items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0  dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={item?.depositTokenSymbol}
              tokenValue={Number(amount)}
              className="w-full py-4 text-[#030303] dark:text-white lg:py-6"
              subtitle="Your Supply"
              usdDefault
              decimalScale={5}
              onChange={(tokenValue, rawValue) => {
                setAmount(tokenValue)
                setAmountRaw(rawValue)
                setAmountReceive(
                  tokenValue *
                    usdPrice?.[
                      `${dataBorrow.depositTokenSymbol.toLowerCase()}`
                    ] *
                    (dataBorrow.loanToValue / 120)
                )
              }}
              onSetShowUsd={setIsUsdDepositToken}
            />
          </div>
          <div className="font-rogan flex h-[110px] flex-col items-center justify-center rounded-md border bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b lg:h-[140px]">
            <InputCurrencySwitch
              tokenSymbol={item.borrowTokenSymbol}
              tokenValueChange={Number(amountReceive)}
              usdDefault
              decimalScale={5}
              className="w-full py-4 text-[#030303] dark:text-white"
              subtitle="Your Borrow"
              onChange={(tokenValue, rawValue) => {
                setAmountReceive(tokenValue)
                setAmountReceiveRaw(rawValue)
              }}
              onSetShowUsd={setIsUsdBorrowToken}
            />
          </div>
        </div>
        <div className="flex items-center justify-between py-4 text-[#959595]">
          <div className="flex items-center justify-center">
            <div>{item.multiLoan ? 'Loan providers' : 'Loan provider'}</div>
            <Popover
              trigger="hover"
              placement="top-left"
              className={`font-rogan-regular z-100 mt-[8px] w-[200px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
              content="Create a self-service line of credit by depositing collateral."
            >
              <button className="ml-[5px] mt-[7px]">
                <img
                  src="/assets/pages/vote/ic-info.svg"
                  alt="info icon"
                  className="w-[13px]"
                />
              </button>
            </Popover>
          </div>
          <div className="flex items-center">
            <Link
              href={'https://compound.finance/'}
              className={item.borrowTokenIcon ? 'translate-x-3' : ''}
              target={'_blank'}
            >
              <img
                src={'/icons/coin/compound.svg'}
                alt="Compound"
                className="w-[24px]"
              />
            </Link>
            {item.borrowTokenIcon && (
              <Link
                href={'https://tusd.torque.fi/'}
                className=""
                target={'_blank'}
              >
                <img
                  src={item.borrowTokenIcon}
                  alt={item.borrowTokenSymbol}
                  className="w-[24px]"
                />
              </Link>
            )}
          </div>
        </div>
        <div className="flex justify-between text-[#959595]">
          <div className="flex items-center justify-center">
            <div>Loan-to-value</div>
            <Popover
              trigger="hover"
              placement="top-left"
              className={`font-rogan-regular z-100 mt-[8px] w-[210px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
              content="Max value of the loan you can take out against your collateral."
            >
              <button className="ml-[5px] mt-[7px]">
                <img
                  src="/assets/pages/vote/ic-info.svg"
                  alt="info icon"
                  className="w-[13px]"
                />
              </button>
            </Popover>
          </div>
          <p>
            {'<'}
            {item?.loanToValue}%
          </p>
        </div>
        <div className="flex justify-between py-[14px] text-[#959595]">
          <div className="flex items-center justify-center">
            <div>Variable APR</div>
            <Popover
              trigger="hover"
              placement="top-left"
              className={`font-rogan-regular z-100 mt-[8px] w-[210px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
              content="An interest rate determined by supply and demand of the asset."
            >
              <button className="ml-[5px] mt-[7px]">
                <img
                  src="/assets/pages/vote/ic-info.svg"
                  alt="info icon"
                  className="w-[13px]"
                />
              </button>
            </Popover>
          </div>
          <p>
            {!aprBorrow
              ? '-0.00%'
              : (-Number(aprBorrow) * 100).toFixed(2) + '%'}
          </p>
        </div>
        <div className="flex justify-between text-[#959595]">
          <div className="flex items-center justify-center">
            <div>Liquidity</div>
            <Popover
              trigger="hover"
              placement="top-left"
              className={`font-rogan-regular z-100 mt-[8px] w-[210px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
              content="Available amount of borrowing power in the market at this time."
            >
              <button className="ml-[5px] mt-[7px]">
                <img
                  src="/assets/pages/vote/ic-info.svg"
                  alt="info icon"
                  className="w-[13px]"
                />
              </button>
            </Popover>
          </div>
          <p>
            {!item?.liquidity ? '0.00%' : '$' + toMetricUnits(item?.liquidity)}
          </p>
        </div>
        <button
          className={`font-rogan-regular mt-4 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all ${
            buttonLoading !== '' ||
            (isConnected && (amount <= 0 || amountReceive <= 0))
              ? 'transition-ease cursor-not-allowed opacity-60 duration-100 ease-linear'
              : 'hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]'
          }`}
          disabled={
            buttonLoading !== '' ||
            (isConnected && (amount <= 0 || amountReceive <= 0))
          }
          onClick={() => {
            if (!isConnected) {
              handleConfirmDeposit()
              return
            }
            if (amount <= 0 || amountReceive <= 0) {
              toast.error('Please add Your Supply input')
              return
            }
            if (
              amountReceive /
                (amount *
                  usdPrice?.[
                    `${dataBorrow.depositTokenSymbol.toLowerCase()}`
                  ]) >
              item?.loanToValue
            ) {
              toast.error(`Loan-to-value exceeds ${item?.loanToValue}%`)
            } else {
              handleConfirmDeposit()
            }
          }}
        >
          {buttonLoading !== '' && <LoadingCircle />}
          {buttonLoading !== '' ? buttonLoading : renderSubmitText()}
        </button>
      </div>
      <ConfirmDepositModal
        open={isOpenConfirmDepositModal}
        handleClose={() => setOpenConfirmDepositModal(false)}
        confirmButtonText="Supply & Borrow"
        onConfirm={() => onBorrow()}
        loading={isLoading}
        coinFrom={{
          amount: amountRaw,
          icon: `/icons/coin/${item.depositTokenSymbol.toLocaleLowerCase()}.png`,
          symbol: item.depositTokenSymbol,
          isUsd: isUsdDepositToken,
        }}
        coinTo={{
          amount: amountReceiveRaw,
          icon:
            item.borrowTokenSymbol === 'TUSD'
              ? `/icons/coin/${item.borrowTokenSymbol.toLocaleLowerCase()}.png`
              : `/icons/coin/${item.borrowTokenSymbol.toLocaleLowerCase()}.svg`,
          symbol: item.borrowTokenSymbol,
          isUsd: isUsdBorrowToken,
        }}
        details={[
          {
            label: 'Loan-to-value',
            value: `<${item?.loanToValue}%`,
          },
          {
            label: 'Variable APR',
            value: !aprBorrow
              ? '-0.00%'
              : -(Number(aprBorrow) * 100).toFixed(2) + '%',
          },
        ]}
      />

      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
    </>
  )
}
