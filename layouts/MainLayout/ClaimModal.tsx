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
        .getRewardConfig(borrowBtcContract.address, address)
        .call()
      console.log('response 1:>> ', borrowWbtcReward)
      const borrowWethReward = await rewardContract.methods
        .getRewardConfig(borrowEthContract.address, address)
        .call()
      console.log('response 2 :>> ', borrowWethReward)
      const boostWbtcReward = await rewardContract.methods
        .getRewardConfig(boostWbtcContract.address, address)
        .call()
      console.log('response 3 :>> ', boostWbtcReward)
      const boostWethReward = await rewardContract.methods
        .getRewardConfig(boostWethContract.address, address)
        .call()
      const tokenDecimal = await tokenContract.methods.decimals().call()
      console.log('response 4 :>> ', boostWethReward)
      const totalRewards = new BigNumber(borrowWbtcReward?.rewardAmount || 0)
        .plus(new BigNumber(borrowWethReward?.rewardAmount || 0))
        .plus(new BigNumber(boostWbtcReward?.rewardAmount || 0))
        .plus(new BigNumber(boostWethReward?.rewardAmount || 0))
        .toString()
      const rewards = new BigNumber(
        ethers.utils.formatUnits(totalRewards, tokenDecimal)
      ).toString()
      console.log('rewards :>> ', rewards)
      setRewards(rewards)
    } catch (error) {
      console.log('error1111 :>> ', error)
    }
  }

  useEffect(() => {
    if (rewardContract && address) {
      handleGetRewards()
    }
  }, [rewardContract])

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
      console.log('currentPair :>> ', currentPair)
    } catch (error) {
      console.error('LiquidityPool.getLiquidityPoolInfo.getPairData', error)
    }
  }

  useEffect(() => {
    handleGetTokenInfo()
  }, [])

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
      await tx.wait();
      handleClose()
      handleGetRewards()
    } catch (error) {
      console.log('error handleClaim reward :>> ', error)
    } finally {
      setLoading(false)
    }
  }

  const infos = [
    {
      title: `${toMetricUnits(Number(rewards) || 0)} TORQ`,
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
      <div className="grid h-auto w-full  grid-cols-2 gap-[12px] overflow-y-auto py-[18px]">
        {infos.map((item) => (
          <div className="flex h-[102px] flex-col items-center justify-center rounded-[12px] border border-[1px] border-[#1A1A1A] border-[#E6E6E6] bg-[#FCFCFC] from-[#161616] to-[#161616]/0 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b">
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
        className={`font-mona w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
         ${loading ? ' cursor-not-allowed text-[#eee]' : ' cursor-pointer'} `}
        onClick={handleClaim}
      >
        {loading && <LoadingCircle />}
        CLAIM TORQ
      </button>
    </Modal>
  )
}
