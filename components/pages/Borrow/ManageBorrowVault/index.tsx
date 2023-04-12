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
    label: 'Vault #1',
    collateral: 0.0,
    borrow: 0.0,
    ltv: 0.0,
    apy: 0.0,
    address_asset: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    name_ABI_asset: 'usdc_abi',
    decimals_asset: 6,
    name_ABI_borrow: 'borrow_wbtc_abi',
  },
  {
    token: 'ETH',
    label: 'Vault #2',
    collateral: 0.0,
    borrow: 0.0,
    ltv: 0.0,
    apy: 0.0,
    address_asset: '',
    name_ABI_asset: '',
    decimals_asset: 6,
    name_ABI_borrow: '',
  },
]
