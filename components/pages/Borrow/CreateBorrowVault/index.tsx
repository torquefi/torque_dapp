import { useState } from 'react'
import CreateBorrowItem from './createBorrowItem'

export default function CreateBorrowVault() {
  const [dataBorrow, setDataBorrow] = useState(fakeBorrow)

  return (
    <div className="space-y-[24px] ">
      <h3 className="font-larken text-[24px] text-[#404040] dark:text-white">
        Create Borrow Vault
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {fakeBorrow.map((item, i) => (
          <CreateBorrowItem item={item} key={i} />
        ))}
      </div>
    </div>
  )
}

const fakeBorrow = [
  {
    coinIcon: '/icons/coin/btc.png',
    depositCoin: 'BTC',
    borrowCoin: 'USG',
    loanToValue: 70,
    getTORQ: 28,
    amount: 0,
    amountRecieve: 0,
    address_asset: '0xAAD4992D949f9214458594dF92B44165Fb84dC19',
    name_ABI_asset: 'wbtc_abi',
    decimals_asset: 8,
    name_ABI_borrow: 'borrow_wbtc_abi',
    decimals_USG: 18,
    loan_provider: '/icons/coin/torq.svg',
    link_loan: '',
  },
  {
    coinIcon: '/icons/coin/eth.png',
    depositCoin: 'ETH',
    borrowCoin: 'USG',
    loanToValue: 78,
    getTORQ: 32,
    amount: 0,
    amountRecieve: 0,
    address_asset: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
    name_ABI_asset: 'eth_abi',
    decimals_asset: 18,
    name_ABI_borrow: 'borrow_eth_abi',
    decimals_USG: 18,
    loan_provider: '/icons/coin/torq.svg',
    link_loan: '',
  },
]
