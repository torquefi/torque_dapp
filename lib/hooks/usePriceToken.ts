import { torqContract, wethContract } from '@/constants/contracts'
import { AppStore } from '@/types/store'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Web3 from 'web3'

const pairContract = '0x429e563259958c3179d096a078f9571c8a5cd538'

const rpc = 'https://arbitrum.llamarpc.com'

export const useGetPriceTorqueToken = () => {
  const usdPrice = useSelector((store: AppStore) => store.usdPrice?.price)
  const nativePrice = usdPrice['WETH']

  const [nativeInPool, setNativeInPool] = useState('0')
  const [totalTorqueInPool, setTotalTorqueInPool] = useState('0')
  const tokenPrice = new BigNumber(nativeInPool || 0)
    .dividedBy(new BigNumber(totalTorqueInPool || 1))
    .multipliedBy(nativePrice)
    .toString()

  const tokenContract = useMemo(() => {
    const web3 = new Web3(rpc)
    const contract = new web3.eth.Contract(
      JSON.parse(torqContract.abi),
      torqContract.address
    )
    return contract
  }, [Web3.givenProvider, torqContract])

  const nativeContract = useMemo(() => {
    const web3 = new Web3(rpc)
    const contract = new web3.eth.Contract(
      JSON.parse(wethContract.abi),
      wethContract.address
    )
    return contract
  }, [Web3.givenProvider, wethContract])

  const handleGetBalanceInPool = async () => {
    try {
      const tokenInPool = await tokenContract.methods
        .balanceOf(pairContract)
        .call()
      const nativeInPool = await nativeContract.methods
        .balanceOf(pairContract)
        .call()
      setTotalTorqueInPool(tokenInPool)
      setNativeInPool(nativeInPool)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  useEffect(() => {
    handleGetBalanceInPool()
    let id = setInterval(handleGetBalanceInPool, 60 * 1000)
    return () => clearInterval(id)
  }, [tokenContract])

  return {
    torquePrice: tokenPrice,
  }
}
