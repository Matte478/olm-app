import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

import App from './App'
import reportWebVitals from './reportWebVitals'
import AppStateProvider from './provider'
import './i18n'

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <CookiesProvider>
        <AppStateProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppStateProvider>
      </CookiesProvider>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
