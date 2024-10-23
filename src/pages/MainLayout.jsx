import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import LoginPage from '../components/LoginPage';
import { Link, Outlet } from 'react-router-dom';
import MainAppbar from '../components/AppBarComponent';
import NavBarComponent from '../components/NavBarComponent';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Breadcrumbs, Typography } from '@mui/material';
function MainLayout() {
  const reducer = useSelector(state => state.mainReducer);
  return (
    <div className='h-full mainLayout'>
      {
        reducer.login ? <>
          <MainAppbar />
          <div className='flex h-[95%]'>
            <NavBarComponent />
            <div className='flex flex-col w-full bg-[#f5f5f5] h-[100%]'>
              <Outlet />
            </div>
          </div>
        </> : <LoginPage />
      }
    </div>
  )
}

export default MainLayout