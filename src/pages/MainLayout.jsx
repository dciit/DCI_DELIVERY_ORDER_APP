import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import LoginPage from '../components/LoginPage';
import { Outlet } from 'react-router-dom';
import MainAppbar from '../components/AppBarComponent';
import NavBarComponent from '../components/NavBarComponent';
function MainLayout() {
  const reducer = useSelector(state => state.mainReducer);
  return (
    <div className='h-full mainLayout'>
      {
        reducer.login ? <>
          <MainAppbar />
          <div className='flex h-[93%]'>
            <NavBarComponent />
            <Outlet />
          </div>
        </> : <LoginPage />
      }
    </div>
  )
}

export default MainLayout