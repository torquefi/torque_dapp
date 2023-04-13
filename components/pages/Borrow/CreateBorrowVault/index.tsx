import NumberFormat from '@/components/common/NumberFormat'
import CurrencySwitch from '@/components/common/CurrencySwitch'
import InputCurrencySwitch from '@/components/common/InputCurrencySwitch'
import Popover from '@/components/common/Popover'
import SkeletonDefault from '@/components/skeleton'
import { floorFraction } from '@/lib/helpers/number'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import CreateBorrowItem from './createBorrowItem'

export default function CreateBorrowVault() {
  const [dataBorrow, setDataBorrow] = useState(fakeBorrow)

  return (
    <div className="space-y-[24px]">
      <h3 className="font-larken text-[24px]">Create Borrow Vault</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {fakeBorrow.map((item, i) => (
          <CreateBorrowItem item={item} />
        ))}
      </div>
    </div>
  )
}

const fakeBorrow = [
  {
    coinIcon: '/icons/coin/btc.png',
    depositCoin: 'BTC',
    borrowCoin: 'USDC',
    loanToValue: 70,
    getTORQ: 28,
    amount: 0,
    amountRecieve: 0,
    address_asset: '0xAAD4992D949f9214458594dF92B44165Fb84dC19',
    name_ABI_asset: 'wbtc_abi',
    decimals_asset: 8,
    name_ABI_borrow: 'borrow_wbtc_abi',
  },
  {
    coinIcon: '/icons/coin/eth.png',
    depositCoin: 'ETH',
    borrowCoin: 'USDC',
    loanToValue: 83,
    getTORQ: 32,
    amount: 0,
    amountRecieve: 0,
    address_asset: '0x42a71137C09AE83D8d05974960fd607d40033499',
    name_ABI_asset: 'eth_abi',
    decimals_asset: 18,
    name_ABI_borrow: 'borrow_eth_abi',
  },
]
