import {combineReducers} from 'redux'
import MainReducer from './mainReducer'
const rootReducer = combineReducers({
  mainReducer:MainReducer
})

export default rootReducer