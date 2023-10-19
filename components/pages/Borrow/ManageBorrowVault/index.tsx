import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import BorrowItem from './BorrowItem'
import { EmptyBorrow } from './EmptyBorrow'

export default function ManageBorrowVault() {
  const { address, isConnected } = useAccount()
  const [dataBorrow, setDataBorrow] = useState(DATA_BORROW)
  const [isSkeletonLoading, setSkeletonLoading] = useState(true)
  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()

  const getBorrowData = async (item: (typeof DATA_BORROW)[0]) => {
    if (!isConnected || !address) {
      return item
    }
    try {
      const dataABIBorrow = await Moralis.Cloud.run('getAbi', {
        name: item?.name_ABI_borrow,
      })
      if (dataABIBorrow?.abi) {
        const web3 = new Web3(Web3.givenProvider)
        const contract = new web3.eth.Contract(
          JSON.parse(dataABIBorrow?.abi),
          dataABIBorrow?.address
        )
        if (contract) {
          let data = await contract.methods.borrowInfoMap(address).call({
            from: address,
          })
          // item.supplied = +Moralis.Units.FromWei(data.supplied, item.decimals_asset)
          item.borrowed = +Moralis.Units.FromWei(
            data.borrowed,
            item.decimals_usdc
          )
        }
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
      const dataBorrow = await Promise.all(DATA_BORROW?.map(getBorrowData))
      setDataBorrow(dataBorrow)
    } catch (error) {}
    setSkeletonLoading(false)
  }

  useEffect(() => {
    handleUpdateStakeData()
  }, [isConnected, address])

  const borrowDisplayed = dataBorrow.filter((item) => item?.borrowed > 0)

  if (!borrowDisplayed?.length) {
    return (
      <div className="space-y-[24px]">
        <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
          Manage Borrow Vaults
        </h3>

        <EmptyBorrow />
      </div>
    )
  }

  return (
    <div className="space-y-[24px]">
      <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
        Manage Borrow Vaults
      </h3>

      {borrowDisplayed.map((item, i) => (
        <BorrowItem key={i} item={item} />
      ))}
    </div>
  )
}

const DATA_BORROW = [
  {
    token: 'BTC',
    label: 'House',
    collateral: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    data_key: 'name_borrow_vault_1',
    address_asset: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    name_ABI_asset: 'usdc_abi',
    decimals_usdc: 6,
    decimals_asset: 8,
    name_ABI_borrow: 'borrow_wbtc_abi',
  },
  {
    token: 'ETH',
    label: 'Lambo',
    collateral: 0.0,
    borrowed: 0.0,
    ltv: 0.0,
    apy: 0.0,
    data_key: 'name_borrow_vault_2',
    address_asset: '0x2B9960680D91d7791e9a24aCFb03CE0d234cC708',
    name_ABI_asset: 'usg_abi',
    decimals_usdc: 6,
    decimals_asset: 18,
    name_ABI_borrow: 'borrow_eth_abi',
  },
]
