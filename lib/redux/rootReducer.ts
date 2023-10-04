import usdPriceReducer from './slices/usdPrice'
import authReducer from './auth/auth'
import borrowReducer from './slices/borrow'
import themeReducer from './slices/theme'

const rootReducer = {
  usdPrice: usdPriceReducer,
  auth: authReducer,
  borrow: borrowReducer,
  theme: themeReducer
}

export default rootReducer
