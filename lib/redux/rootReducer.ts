import authReducer from './auth/auth'
import borrowReducer from './slices/borrow'
import homeReducer from './slices/home'
import themeReducer from './slices/theme'
import tipsReducer from './slices/tips'
import usdPriceReducer from './slices/usdPrice'
import layoutReducer from './slices/layout'
import boostReducer from './slices/boost'

const rootReducer = {
  usdPrice: usdPriceReducer,
  auth: authReducer,
  borrow: borrowReducer,
  theme: themeReducer,
  tips: tipsReducer,
  home: homeReducer,
  layout: layoutReducer,
  boost: boostReducer
}

export default rootReducer
