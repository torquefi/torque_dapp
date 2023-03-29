import { IAuth } from '@/lib/redux/auth/auth'
import { IUsdPrice } from '@/lib/redux/slices/usdPrice'

export interface AppStore {
  usdPrice?: IUsdPrice
  auth?: IAuth
}
