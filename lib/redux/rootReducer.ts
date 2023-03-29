import usdPriceReducer from './slices/usdPrice'
import authReducer from './auth/auth'

const rootReducer = {
  usdPrice: usdPriceReducer,
  auth: authReducer,
}

export default rootReducer
