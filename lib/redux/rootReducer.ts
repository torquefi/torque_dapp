import usdPriceReducer from './slices/usdPrice'
import authReducer from './auth/auth'
import borrowReducer from './auth/borrow'

const rootReducer = {
  usdPrice: usdPriceReducer,
  auth: authReducer,
  borrow: borrowReducer,
}

export default rootReducer
