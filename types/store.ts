import { IAuth } from '@/lib/redux/auth/auth'
import { IBorrow } from '@/lib/redux/auth/borrow'
import { IUsdPrice } from '@/lib/redux/slices/usdPrice'

export interface AppStore {
  usdPrice?: IUsdPrice
  auth?: IAuth
  borrow?: IBorrow
}
