import usdPriceReducer from './slices/usdPrice'
import authReducer from './auth/auth'
import borrowReducer from './slices/borrow'
import themeReducer from './slices/theme'
import tipsReducer from './slices/tips'

const rootReducer = {
  usdPrice: usdPriceReducer,
  auth: authReducer,
  borrow: borrowReducer,
  theme: themeReducer,
  tips: tipsReducer
}

export default rootReducer
