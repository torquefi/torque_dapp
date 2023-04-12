import BorrowItem from './BorrowItem'

export default function ManageBorrowVault() {
  return (
    <div className="space-y-[24px]">
      <h3 className="font-larken text-[24px]">Manage Borrow Vault</h3>

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
    collateral: 0.00,
    borrow: 0.00,
    ltv: 0.00,
    apy: 0.00,
    address_asset: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    name_ABI_asset: 'usdc_abi',
    decimals_asset: 6,
    name_ABI_borrow: 'borrow_wbtc_abi',
  },
  {
    token: 'ETH',
    label: 'Lambo',
    collateral: 0.00,
    borrow: 0.00,
    ltv: 0.00,
    apy: 0.00,
    address_asset: '',
    name_ABI_asset: '',
    decimals_asset: 6,
    name_ABI_borrow: '',
  },
]
