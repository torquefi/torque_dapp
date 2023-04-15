import usdPriceReducer from './slices/usdPrice'
import authReducer from './auth/auth'
import borrowReducer from './auth/dataUser'

const rootReducer = {
  usdPrice: usdPriceReducer,
  auth: authReducer,
  borrow: borrowReducer,
}

export default rootReducer
