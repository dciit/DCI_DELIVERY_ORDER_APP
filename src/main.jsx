import React from 'react'
import { Provider } from 'react-redux'
import { store } from './reducers/store'
import ReactDOM from 'react-dom/client'
import './index.css'
import Routers from './Routers'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Routers />
  </Provider>
)
