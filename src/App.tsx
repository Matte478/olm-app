import React from 'react'
import { useRoutes } from 'react-router-dom'
import './scss/style.scss'

import routes from './routes'

const App = () => {
  const routing = useRoutes(routes)

  return (
    <div className="wrapper">
      {routing}
    </div>
  )
}

export default App
