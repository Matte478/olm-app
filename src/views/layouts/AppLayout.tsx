import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar, AppHeader } from '../components/index'

const DefaultLayout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true)

  const changeSidebarVisibility = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div>
      <AppSidebar visible={sidebarVisible} />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader changeSidebarVisibility={changeSidebarVisibility} />
        <div className="body flex-grow-1 px-3">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
