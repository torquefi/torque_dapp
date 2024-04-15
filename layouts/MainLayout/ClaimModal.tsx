import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { AppStore } from '@/types/store'
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/react'
import { useEffect, useMemo, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useAccount, useConnect } from 'wagmi'
import { rewardsContract, torqContract } from '@/constants/contracts'
import { pairContract } from '@/lib/hooks/usePriceToken'
import { NumericFormat } from 'react-number-format'
import { toMetricUnits } from '@/lib/helpers/number'
import Link from 'next/link'
import Web3 from 'web3'
import {
  borrowBtcContract,
  borrowEthContract,
  tokenTusdContract,
} from '@/components/pages/Borrow/constants/contract'
import {
  boostWbtcContract,
  boostWethContract,
} from '@/components/pages/Boost/constants/contracts'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import { toast } from 'sonner'

interface ClaimModalProps {
  openModal: boolean
  handleClose: () => void
}

export default function ClaimModal({
  openModal,
  handleClose,
}: ClaimModalProps) {
  const [currentPair, setCurrentPair] = useState<any>({})
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { address } = useAccount()
  const [rewards, setRewards] = useState('0')
  const [loading, setLoading] = useState(false)

  const rewardContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(rewardsContract?.abi),
      rewardsContract?.address
    )
    return contract
  }, [Web3.givenProvider, rewardsContract])

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(tokenTusdContract?.abi),
      tokenTusdContract?.address
    )
    return contract
  }, [Web3.givenProvider, rewardsContract])

  const handleGetRewards = async () => {
    try {
      const borrowWbtcReward = await rewardContract.methods
        ._calculateReward(borrowBtcContract.address, address)
        .call()
      const borrowWethReward = await rewardContract.methods
        ._calculateReward(borrowEthContract.address, address)
        .call()
      const boostWbtcReward = await rewardContract.methods
        ._calculateReward(boostWbtcContract.address, address)
        .call()
      const boostWethReward = await rewardContract.methods
        ._calculateReward(boostWethContract.address, address)
        .call()
      const tokenDecimal = await tokenContract.methods.decimals().call()
      const totalRewards = new BigNumber(borrowWbtcReward || 0)
        .plus(new BigNumber(borrowWethReward || 0))
        .plus(new BigNumber(boostWbtcReward || 0))
        .plus(new BigNumber(boostWethReward || 0))
        .toString()
      const rewards = new BigNumber(
        ethers.utils.formatUnits(totalRewards, tokenDecimal)
      ).toString()
      setRewards(rewards)
    } catch (error) {
      console.log('error1111 :>> ', error)
    }
  }

  useEffect(() => {
    if (rewardContract && address) {
      handleGetRewards()
    }
  }, [rewardContract, openModal])

  const handleGetTokenInfo = async () => {
    try {
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${torqContract?.address}`
      )
      const pairs = response?.data?.pairs || []
      const currentPair = pairs.find(
        (pair: any) =>
          pair.pairAddress?.toLowerCase() === pairContract?.toLowerCase()
      )
      setCurrentPair(currentPair)
    } catch (error) {
      console.error('LiquidityPool.getLiquidityPoolInfo.getPairData', error)
    }
  }

  useEffect(() => {
    handleGetTokenInfo()
  }, [openModal])

  const handleClaim = async () => {
    if (!address) {
      return
    }
    setLoading(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner(address)
      const rewardContract = new ethers.Contract(
        rewardsContract?.address,
        JSON.parse(rewardsContract?.abi),
        signer
      )
      const tx = await rewardContract.claimReward([
        borrowBtcContract.address,
        borrowEthContract.address,
        boostWbtcContract.address,
        boostWethContract.address,
      ])
      console.log('tx :>> ', tx)
      await tx.wait()
      handleClose()
      handleGetRewards()
      toast.success('Claim Successfully')
    } catch (error) {
      console.log('error handleClaim reward :>> ', error)
      toast.success('Claim Failed')
    } finally {
      setLoading(false)
    }
  }

  const infos = [
    {
      // title: (
      //   <NumericFormat
      //     displayType="text"
      //     value={rewards}
      //     thousandSeparator
      //     suffix=" TORQ"
      //     decimalScale={2}
      //   />
      // ),
      // title: `${toMetricUnits(Number(rewards) || 0)} TORQ`,
      title:
        Number(rewards) >= 1000 ? (
          `${toMetricUnits(Number(rewards) || 0)} TORQ`
        ) : (
          <NumericFormat displayType='text' value={rewards} decimalScale={2} suffix=' TORQ' />
        ),
      content: 'Claimable',
    },
    {
      title: `$${toMetricUnits(
        Number(
          new BigNumber(rewards || 0)
            .multipliedBy(currentPair?.priceUsd || 0)
            .toString()
        ) || 0
      )}`,
      content: 'Dollar value',
    },
    {
      title: (
        <NumericFormat
          value={currentPair?.priceUsd || 0}
          displayType="text"
          decimalScale={2}
          prefix="$"
        />
      ),
      content: 'Current price',
    },
    {
      title: `$${toMetricUnits((currentPair?.fdv || 0) / 9.35)}`,
      content: 'Market cap',
    },
  ]

  return (
    <Modal
      className="w-full max-w-[420px]  bg-[#FCFAFF] p-[10px] dark:bg-[#030303]"
      open={openModal}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between">
        <div className="font-larken text-[18px] text-[22px] text-[#030303] dark:text-white">
          Rewards
        </div>
        <AiOutlineClose
          className=" cursor-pointer text-[#030303] dark:text-[#ffff]"
          onClick={handleClose}
        />
      </div>
      <div
        className={
          `mt-2 hidden h-[1px] w-full md:block` +
          `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
          }`
        }
      ></div>
      <div className="grid h-auto w-full grid-cols-2 gap-[12px] overflow-y-auto py-[18px]">
        {infos.map((item, i) => (
          <div key={i} className="flex h-[98px] pt-[6px] flex-col items-center justify-center rounded-[12px] border border-[1px] border-[#1A1A1A] border-[#E6E6E6] bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
            <div className="font-larken text-[24px] text-[#404040] dark:text-white">
              {item.title}
            </div>
            <div className="mt-1 text-[15px] text-[#959595]">
              {item?.content}
            </div>
          </div>
        ))}
      </div>
      <button
        className={`font-mona w-full text-[14px] rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
         ${loading || !Number(rewards) ? ' cursor-not-allowed text-[#eee]' : ' cursor-pointer'} `}
        onClick={handleClaim}
        disabled={loading || !Number(rewards)}
      >
        {loading && <LoadingCircle />}
        CLAIM TORQ
      </button>
      {/* <button
          className="font-mona hover:shadow-lg mt-2 w-full rounded-full border border-[#AA5BFF] bg-transparent py-1 text-center text-[14px] uppercase text-[#AA5BFF] transition-all"
          onClick={() => window.open('https://bit.ly/torque-uniswap', '_blank', 'noopener,noreferrer')}
          >
            acquire torq
      </button> */}
    </Modal>
  )
}
