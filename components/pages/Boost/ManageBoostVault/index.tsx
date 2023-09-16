import SkeletonDefault from '@/components/skeleton'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import { BoostItem } from './BoostItem'
import { EmptyBoost } from './EmptyBoost'

export function ManageBoostVault() {
  const { address, isConnected } = useAccount()
  const [dataBoost, setDataBoost] = useState(DATA_BOOST_VAULT)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()

  const getBorrowData = async (item: (typeof DATA_BOOST_VAULT)[0]) => {
    if (!isConnected || !address) {
      return item
    }
    try {
      const dataABIAsset = await Moralis.Cloud.run('getAbi', {
        name: item?.name_ABI_asset,
      })
      let decimal = 18
      if (dataABIAsset?.abi) {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
          JSON.parse(dataABIAsset?.abi),
          dataABIAsset?.address
        )

        decimal = await contract.methods.decimals().call({
          from: address,
        })
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

        let id = await contract.methods
          .addressToPid(dataABIAsset.address)
          .call({
            from: address,
          })

        let infoUser = await contract.methods.userInfo(address, id).call({
          from: address,
        })
        item.deposited = +Moralis.Units.FromWei(
          `${infoUser['amount']}`,
          decimal
        )
        item.earnings = +Moralis.Units.FromWei(`${infoUser['reward']}`, decimal)
      }

      return item
    } catch (error) {
      console.log('ManageStaking.handleGetStakeData', error)
      return item
    }
  }

  const handleUpdateStakeData = async () => {
    setSkeletonLoading(true)
    try {
      const dataBoost = await Promise.all(DATA_BOOST_VAULT?.map(getBorrowData))
      setDataBoost(dataBoost)
    } catch (error) {}
    setSkeletonLoading(false)
  }

  useEffect(() => {
    handleUpdateStakeData()
  }, [isConnected, address])

  const boostDisplayed = dataBoost.filter((item) => item?.deposited > 0)

  if (isSkeletonLoading) {
    return (
      <div className="font-larken dark-text-white mt-[36px] text-[#464646]">
        <div className="">
          <SkeletonDefault height={'5vh'} width={'20%'} />
        </div>
        {DATA_BOOST_VAULT.map((item) => (
          <div className="mt-[24px]">
            <SkeletonDefault height={'20vh'} width={'100%'} />
          </div>
        ))}
      </div>
    )
  }

  if (!boostDisplayed?.length) {
    return (
      <div className="font-larken dark-text-white mt-[36px] text-[#464646]">
        <div className="text-[24px] dark:text-white">Manage Boost Vaults</div>
        <EmptyBoost />
      </div>
    )
  }

  return (
    <div className="font-larken dark-text-white mt-[36px] text-[#464646]">
      <div className="text-[24px] dark:text-white">Manage Boost Vaults</div>
      {boostDisplayed.map((item) => (
        <div className="">
          <BoostItem item={item} />
        </div>
      ))}
    </div>
  )
}
const DATA_BOOST_VAULT = [
  {
    token: 'ETH',
    label: 'Vault #1',
    deposited: 0.0,
    earnings: 0.0,
    APR: '0.00%',
    isOpen: false,
    amount: 0,
    data_key: 'name_boost_vault_1',
    boost_contract: 'boost_abi',
    name_ABI_asset: 'weth_abi',
    decimals_asset: 18,
  },
  {
    token: 'USG',
    label: 'Vault #2',
    deposited: 158130,
    earnings: 142271,
    APR: '0.00%',
    isOpen: false,
    amount: 0,
    data_key: 'name_boost_vault_2',
    boost_contract: 'boost_abi',
    name_ABI_asset: 'USGt_abi',
    decimals_asset: 9,
  },
]
