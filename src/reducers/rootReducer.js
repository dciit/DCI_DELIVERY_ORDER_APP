import {combineReducers} from 'redux'
import MainReducer from './mainReducer'
import fixDateReducer from './fixDateReducer'
import warningStockReducer from './warningStockReducer'

const rootReducer = combineReducers({
  mainReducer:MainReducer,
  fixDateStateReducer:fixDateReducer,
  warningStockStateReducer:warningStockReducer
})

export default rootReducer