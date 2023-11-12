import { Typography } from '@mui/material'
import React from 'react'

function NotFound() {
  return (
    <div className='p-3 items-center pt-20 px-24 pb-40 border-1 border-red-50'>
      <Typography variant='h1'>404</Typography>
      <Typography className='mb-3' variant='h5'>The page you are looking for does not exist.</Typography>
    </div>
  )
}

export default NotFound