import { createStore,applyMiddleware,compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import { persistStore,persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// Save state to localstorage auto  

const persistConfig = {
    key:'root',
    storage,
    // whitelist:['cartReducer']
}
const persistedReducer = persistReducer(persistConfig,rootReducer);
const middleware = [thunk]
const composeEnhancers =  typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middleware)))
let persistor = persistStore(store);
export { store,persistor}

// let store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middleware)))
// let store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)))
// let persistor = persistStore(store);
// export { store,persistor}
// export { store}