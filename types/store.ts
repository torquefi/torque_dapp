import { IAuth } from '@/lib/redux/auth/auth'
import { IDataUser } from '@/lib/redux/auth/dataUser'
import { IUsdPrice } from '@/lib/redux/slices/usdPrice'

export interface AppStore {
  usdPrice?: IUsdPrice
  auth?: IAuth
  dataUser?: IDataUser
}
