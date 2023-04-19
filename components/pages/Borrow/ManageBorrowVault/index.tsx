import BorrowItem from './BorrowItem'

export default function ManageBorrowVault() {
  return (
    <div className="space-y-[24px]">
      <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
        Manage Borrow Vault
      </h3>

      {DATA_BORROW.map((item, i) => (
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
    borrow: 0.0,
    ltv: 0.0,
    apy: 0.0,
    data_key: 'name_borrow_vault_1',
    address_asset: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    name_ABI_asset: 'usdc_abi',
    decimals_USDC: 6,
    decimals_asset: 8,
    name_ABI_borrow: 'borrow_wbtc_abi',
  },
  {
    token: 'ETH',
    label: 'Lambo',
    collateral: 0.0,
    borrow: 0.0,
    ltv: 0.0,
    apy: 0.0,
    data_key: 'name_borrow_vault_2',
    address_asset: '0x42a71137C09AE83D8d05974960fd607d40033499',
    name_ABI_asset: 'usdc_abi',
    decimals_USDC: 6,
    decimals_asset: 18,
    name_ABI_borrow: 'borrow_eth_abi',
  },
]
