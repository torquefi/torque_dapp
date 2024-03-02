import { IAuth } from '@/lib/redux/auth/auth'
import { IBorrowStore } from '@/lib/redux/slices/borrow'
import { IHomeStore } from '@/lib/redux/slices/home'
import { IthemeType } from '@/lib/redux/slices/theme'
import { IUsdPrice } from '@/lib/redux/slices/usdPrice'

export interface AppStore {
  usdPrice?: IUsdPrice
  auth?: IAuth
  borrow?: IBorrowStore
  theme?: IthemeType
  home?: IHomeStore
}
