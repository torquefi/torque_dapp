import { toMetricUnits } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { borrowBtcContract, borrowEthContract } from '../constants/contract'
import { IBorrowInfo } from '../types'
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal'
import SwapModal from '@/components/common/Modal/SwapModal'
interface CreateRowBorrowItemProps {
  item: IBorrowInfo
  setIsFetchBorrowLoading?: any
}

export default function CreateRowBorrowItem({
  item,
  setIsFetchBorrowLoading,
}: CreateRowBorrowItemProps) {
  const web3 = new Web3(Web3.givenProvider)
  const [dataBorrow, setDataBorrow] = useState(item)
  const [isLoading, setIsLoading] = useState(true)
  const { address, isConnected } = useAccount()
  const [isOpenConfirmDepositModal, setOpenConfirmDepositModal] =
    useState(false)
  const [amountRaw, setAmountRaw] = useState('')
  const [aprBorrow, setAprBorrow] = useState('')
  const [openSwapModal, setOpenSwapModal] = useState(false)
  const [amountReceiveRaw, setAmountReceiveRaw] = useState('')
  const [totalSupplied, setTotalSupplied] = useState('')
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false)
  const [tokenHover, setTokenHover] = useState('')
  const usdPrice: any = useSelector((store: AppStore) => store.usdPrice?.price)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const isUsdcBorrowed = item.borrowTokenSymbol === 'USDC'

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

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

  const userAddressContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(item?.userAddressContractInfo?.abi),
      item?.userAddressContractInfo?.address
    )
    return contract
  }, [Web3.givenProvider, item.userAddressContractInfo])

  const handleGetApr = async () => {
    try {
      const response = await userAddressContract.methods.getApr().call()
      setAprBorrow(web3.utils.fromWei(response.toString(), 'ether'))
    } catch (error) {
      console.log('error get apr :>> ', error)
    }
  }

  useEffect(() => {
    if (userAddressContract) {
      handleGetApr()
    }
  }, [userAddressContract])

  const handleGetTotalSupply = async () => {
    if (!borrowContract || !tokenContract) {
      return
    }
    try {
      const totalSupply = await borrowContract.methods.totalSupplied().call()
      const tokenDecimal = await tokenContract.methods.decimals().call()

      const totalSupplied = new BigNumber(
        ethers.utils.formatUnits(totalSupply, tokenDecimal).toString()
      )
        .multipliedBy(
          new BigNumber(
            usdPrice?.[`${dataBorrow.depositTokenSymbol.toLowerCase()}`] || 0
          )
        )
        .toString()
      setTotalSupplied(totalSupplied)
    } catch (error) {
      console.log('handleGetTotalSupply error :>> ', error)
    }
  }

  useEffect(() => {
    handleGetTotalSupply()
  }, [borrowContract, tokenContract, usdPrice])

  const onBorrow = async () => {
    if (Number(amountRaw) <= 0) {
      toast.error(`You must supply ${item.depositTokenSymbol} to borrow`)
      return
    }
    try {
      setIsLoading(true)
      if (!isUsdcBorrowed) {
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
            new BigNumber(Number(amountRaw).toFixed(tokenDepositDecimals))
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
          console.log('amountReceiveRaw :>> ', amountReceiveRaw)

          let tusdBorrowAmount = '0'
          if (amountReceiveRaw) {
            tusdBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceiveRaw).toFixed(tokenBorrowDecimal).toString(),
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
              new BigNumber(allowance).lte(new BigNumber(tusdBorrowAmount))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
              )
              await tx.wait()
            }
          } else {
            const allowanceUserContract = await tokenContract.methods
              .allowance(address, userAddressContract)
              .call()
            if (
              new BigNumber(allowanceUserContract).lte(new BigNumber('0')) ||
              new BigNumber(allowanceUserContract).lte(
                new BigNumber(tusdBorrowAmount)
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
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
            new BigNumber(Number(amountRaw).toFixed(tokenDepositDecimals))
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

          if (amountReceiveRaw) {
            tusdBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceiveRaw).toFixed(tokenBorrowDecimal).toString(),
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
              new BigNumber(allowance).lte(new BigNumber(tusdBorrowAmount))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
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
                new BigNumber(tusdBorrowAmount)
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
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
            tusdBorrowAmount
          )
          await tx.wait()
          toast.success('Borrow Successful')
          setOpenConfirmDepositModal(false)
          setIsLoading(false)
          setIsFetchBorrowLoading &&
            setIsFetchBorrowLoading((prev: any) => !prev)
        }
      }
      else {
        if (item.depositTokenSymbol == 'WBTC') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(address)
          const tokenDepositDecimals = await tokenContract.methods
            .decimals()
            .call()
          const borrow = Number(
            new BigNumber(Number(amountReceiveRaw).toFixed(tokenDepositDecimals))
              .multipliedBy(10 ** tokenDepositDecimals)
              .toString()
          )

          const tokenBorrowDecimal = await tokenBorrowContract.methods
            .decimals()
            .call()
          console.log('tokenDecimal :>> ', tokenBorrowDecimal)
          console.log('amountReceiveRaw :>> ', amountReceiveRaw)

          let usdcBorrowAmount = '0'
          if (amountReceiveRaw) {
            usdcBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceiveRaw).toFixed(tokenBorrowDecimal).toString(),
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
              new BigNumber(allowance).lte(new BigNumber(usdcBorrowAmount))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
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
                new BigNumber(usdcBorrowAmount)
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
              )
              await tx.wait()
            }
          }

          const borrowContract2 = new ethers.Contract(
            item?.borrowContractInfo?.address,
            item?.borrowContractInfo?.abi,
            signer
          )

          console.log('params borrow:>> ', borrow.toString(), usdcBorrowAmount)

          const tx = await borrowContract2.callBorrow(
            borrow.toString(),
            usdcBorrowAmount,
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

        if (item.depositTokenSymbol == 'WETH') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(address)
          const tokenDepositDecimals = await tokenContract.methods
            .decimals()
            .call()
          const borrow = Number(
            new BigNumber(Number(amountReceiveRaw).toFixed(tokenDepositDecimals))
              .multipliedBy(10 ** tokenDepositDecimals)
              .toString()
          )

          const tokenBorrowDecimal = await tokenBorrowContract.methods
            .decimals()
            .call()
          console.log('tokenDecimal :>> ', tokenBorrowDecimal)
          console.log('amountReceiveRaw :>> ', amountReceiveRaw)

          let usdcBorrowAmount = '0'
          if (amountReceiveRaw) {
            usdcBorrowAmount = ethers.utils
              .parseUnits(
                Number(amountReceiveRaw).toFixed(tokenBorrowDecimal).toString(),
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
              new BigNumber(allowance).lte(new BigNumber(usdcBorrowAmount))
            ) {
              const tx = await tokenContract1.approve(
                item?.borrowContractInfo?.address,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
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
                new BigNumber(usdcBorrowAmount)
              )
            ) {
              const tx = await tokenContract1.approve(
                userAddressContract,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
              )
              await tx.wait()
            }
          }

          const borrowContract2 = new ethers.Contract(
            item?.borrowContractInfo?.address,
            item?.borrowContractInfo?.abi,
            signer
          )

          console.log('params borrow:>> ', borrow.toString(), usdcBorrowAmount)

          const tx = await borrowContract2.callBorrow(
            borrow.toString(),
            usdcBorrowAmount,
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
      }
      // dispatch(updateborrowTime(new Date().getTime() as any))
    } catch (e) {
      console.log('CreateBorrowItem.onBorrow', e)
      toast.error('Borrow Failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeAmountRow = (value: string) => {
    setAmountRaw(value)
    setAmountReceiveRaw(
      (
        Number(value || 0) *
        usdPrice?.[`${dataBorrow.depositTokenSymbol.toLowerCase()}`] *
        (dataBorrow.loanToValue / 140)
      )?.toString()
    )
  }

  return (
    <>
      <tr
        key={dataBorrow.depositTokenSymbol}
        onClick={() => {
          setAmountRaw('')
          setAmountReceiveRaw('')
          setOpenSwapModal(true)
        }}
        className={`relative cursor-pointer ${
          dataBorrow.depositTokenSymbol === tokenHover
            ? 'bg-[#f9f9f9] dark:bg-[#141414]'
            : ''
        }`}
        onMouseOver={() => setTokenHover(dataBorrow.depositTokenSymbol)}
        onMouseLeave={() => setTokenHover('')}
      >
        <td className="w-[16%] py-[6px]">
          <div className="mt-1 inline-flex items-center">
            <img
              className="mr-[8px] w-[24px]"
              src={`/icons/coin/${item.depositTokenSymbol.toLowerCase()}.svg`}
              alt="Asset icon"
            />
            <div className="inline-flex flex-1 flex-col">
              <p className="text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white">
                {item?.depositTokenSymbol?.toUpperCase()}
              </p>
            </div>
          </div>
        </td>
        <td className="w-[16%] py-[6px]">
          <div className="mt-1 inline-flex items-center">
            <img
              className="mr-[6px] w-[24px]"
              src={item.borrowRowTokenIcon}
              alt=""
            />
            <p className="text-[16px] font-[500] tracking-[0em] text-[#030303] dark:text-white">
              {item?.borrowTokenSymbol?.toUpperCase()}
            </p>
          </div>
        </td>
        <td className="w-[13%] py-[6px]">
          <div className="inline-flex flex-none flex-col items-center gap-[4px]">
            <p className="text-[16px] font-[400] tracking-[0em] text-[#030303] dark:text-white">
              {'<'}
              {item?.loanToValue}%
            </p>
          </div>
        </td>
        <td className="w-[13%] py-[6px]">
          <div className="inline-flex flex-none flex-col items-center gap-[4px]">
            <p className="text-[16px] font-[400] tracking-[0em] text-[#030303] dark:text-white">
              {!aprBorrow
                ? '-0.00%'
                : (-Number(aprBorrow) * 100).toFixed(2) + '%'}
            </p>
          </div>
        </td>
        <td className="w-[14%] py-[6px]">
          <div className="inline-flex flex-none flex-col items-center gap-[4px]">
            <p className="text-[16px] font-[400] lowercase tracking-[0em] text-[#030303] dark:text-white">
              {!item?.liquidity
                ? '0.00%'
                : '$' + toMetricUnits(item?.liquidity)}
            </p>
          </div>
        </td>
        <td className="w-[14%] py-[6px]">
          <div className="inline-flex flex-none flex-col items-center gap-[4px]">
            <div className="flex items-center gap-[6px]">
              <img
                src="/assets/t-logo-circle.png"
                alt="TORQ icon"
                className="w-[18px]"
              />
              <div className="pt-[1px] text-[16px] font-[400] tracking-[0em] text-[#030303] dark:text-white">
                {Number(item.bonus).toLocaleString()}
              </div>
            </div>
          </div>
        </td>
        <td className="w-[14%] py-[6px]">
          <span className="pt-[1px text-[16px] font-[400] tracking-[0em] text-[#030303] dark:text-white">
            {!Number(totalSupplied)
              ? '$0.00'
              : '$' + toMetricUnits(Number(totalSupplied))}
          </span>
        </td>
        <div
          className={
            `absolute left-0 h-[1px] w-full ` +
            `
      ${
        theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
      }`
          }
        ></div>
      </tr>

      <SwapModal
        open={openSwapModal}
        handleClose={() => {
          setOpenSwapModal(false)
          setAmountRaw('')
          setAmountReceiveRaw('')
        }}
        coinFrom={{
          amount: amountRaw,
          symbol: item.depositTokenSymbol,
          icon: `/icons/coin/${item.depositTokenSymbol.toLocaleLowerCase()}.png`,
        }}
        coinTo={{
          amount: amountReceiveRaw,
          icon: `/icons/coin/${item.borrowTokenSymbol.toLocaleLowerCase()}.png`,
          symbol: item.borrowTokenSymbol,
        }}
        setAmountRaw={handleChangeAmountRow}
        setAmountReceiveRaw={setAmountReceiveRaw}
        onCreateVault={() => {
          onBorrow()
        }}
        loading={isLoading}
      />

      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
    </>
  )
}