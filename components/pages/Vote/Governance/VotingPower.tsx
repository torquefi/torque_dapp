import React, { useEffect, useMemo, useState } from 'react'
import { DelegateModal } from './DelegateModal'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import Popover from '@/components/common/Popover'
import { torqContract, wethContract } from '@/constants/contracts'
import Web3 from 'web3'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { NumericFormat } from 'react-number-format'
import BigNumber from 'bignumber.js'
import { useGetPriceTorqueToken } from '@/lib/hooks/usePriceToken'

export const VotingPower = () => {
  const [openDelegateModal, setOpenDelegateModal] = useState(false)
  const { address } = useAccount()
  const { torquePrice } = useGetPriceTorqueToken()

  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [torqueBalance, setTorqueBalance] = useState('1')

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(torqContract.abi),
      torqContract.address
    )
    return contract
  }, [Web3.givenProvider, torqContract])

  const handleGetTorqueBalance = async () => {
    if (!tokenContract || !address) {
      return
    }
    try {
      const balance = await tokenContract.methods.balanceOf(address).call()
      const decimals = await tokenContract.methods.decimals().call()
      setTorqueBalance(ethers.utils.formatUnits(balance, decimals).toString())
    } catch (error) {
      console.log('error get usdc balance:>> ', error)
    }
  }

  useEffect(() => {
    handleGetTorqueBalance()
  }, [address, tokenContract])

  return (
    <>
      <div className="ml-0 ml-4 mr-2 mt-6 h-full w-full rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 py-[12px] pb-[20px] pt-[16px] text-[#404040] md:ml-4 md:mr-0 md:mt-0 lg:max-w-[40%] xl:px-[32px] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white dark:text-white">
        <div className="flex items-center justify-between">
          <h2 className="font-larken text-[24px] font-[400] leading-[40px]">
            Vote Power
          </h2>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`font-mona mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
            content="Direct Torque by delegating votes to yourself or an aligned entity."
          >
            <button>
              <img src="/assets/pages/vote/ic-info.svg" alt="information" />
            </button>
          </Popover>
        </div>
        <div
          className={
            `mb-2 mt-2 hidden h-[1px] w-full md:block` +
            `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
            }`
          }
        ></div>
        <div className="mb-2 grid h-auto w-full grid-cols-2 gap-4 overflow-y-auto py-2">
          <div className="flex h-[102px] flex-col items-center justify-center  rounded-[8px] rounded-md  border border-[1px] border-[#1A1A1A] border-[#E6E6E6] bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
            <div className="font-larken mt-1 text-[24px] text-[#404040] dark:text-white">
              <NumericFormat
                value={address ? torqueBalance || '0' : '0'}
                displayType="text"
                thousandSeparator
                decimalScale={4}
              />
            </div>
            {/* TODO: replace hardcode with dynamic value */}
            <div className="mt-1 text-[15px] text-[#959595]">Your Power</div>
          </div>
          <div className="flex h-[102px] flex-col items-center justify-center rounded-[8px] rounded-md  border border-[1px] border-[#1A1A1A] border-[#E6E6E6] bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
            <div className="font-larken mt-1 text-[24px] text-[#404040] dark:text-white">
              <NumericFormat
                value={
                  address
                    ? new BigNumber(torqueBalance || 0)
                      .multipliedBy(new BigNumber(torquePrice || 0))
                      .toString()
                    : '0'
                }
                displayType="text"
                thousandSeparator
                decimalScale={4}
                prefix="$"
              />
            </div>
            {/* TODO: replace hardcode with dynamic value */}
            <div className="mt-1 text-[15px] text-[#959595]">Your Value</div>
          </div>
        </div>
        <div className="flex flex-col">
          <button
            onClick={() => setOpenDelegateModal(true)}
            className={`font-mona w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
          `}
          >
            Delegate votes
          </button>
          <Link
            href="https://bit.ly/torq-uniswap"
            target="_blank"
            className="font-mona mt-2 w-full rounded-full border border-[#AA5BFF] bg-transparent py-1 text-center uppercase text-[#AA5BFF] transition-all"
          >
            acquire torq
          </Link>
        </div>
      </div>
      <DelegateModal
        openModal={openDelegateModal}
        handleClose={() => setOpenDelegateModal(false)}
        balance={torqueBalance}
      />
    </>
  )
}
