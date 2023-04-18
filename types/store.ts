import { IAuth } from '@/lib/redux/auth/auth'
import { IDataUser } from '@/lib/redux/auth/dataUser'
import { IthemeType } from '@/lib/redux/slices/theme'
import { IUsdPrice } from '@/lib/redux/slices/usdPrice'

export interface AppStore {
  usdPrice?: IUsdPrice
  auth?: IAuth
  dataUser?: IDataUser
  theme?: IthemeType
}
