import { ExitToAppRounded } from '@mui/icons-material'
import PaidIcon from '@mui/icons-material/Paid';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Stack, Switch, Typography } from '@mui/material'
import { deepOrange, red } from '@mui/material/colors';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  useNavigate } from 'react-router-dom';
import '../css/Appbar.css'
import { persistor } from '../reducers/store'
function MainAppbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const reducer = useSelector(state => state.mainReducer);
    // let imageUrl = 'http://dcidmc.dci.daikin.co.jp/PICTURE/' + reducer.id + '.JPG';

    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    return (
        <div className='w-full h-[70px] bg-[#37393c]  text-[#ececec] shadow-lg flex justify-between'>
            <div className='flex items-center gap-0 pl-[16px]'>
                <PaidIcon className='text-[2vw] text-[#4effca] drop-shadow-lg' />
                <Stack className='select-none h-[93%] pl-[8px] gap-1' justifyContent={'center'} >
                    <Typography className='flex  gap-1 items-center text-[#4effca] sm:text-[2.5vw] md:text-[2vw] lg:text-[2.2vw] xl:text-[1.8vw] 2xl:text-[1.35vw]  transition-all duration-200 leading-none' variant="caption" >
                        DELIVERY ORDER
                    </Typography>
                    <Typography className='text-[#fff] text-md leading-none ' variant="caption" >
                        ระบบบริหารการสั่งซื้อ ...
                    </Typography>
                </Stack>
            </div>
            <div className='text-right'>
                <div className='w-fit h-full flex items-center gap-2 pr-3' >
                    {/* <div className=''>
                        <span>Theme</span>
                        <Switch {...label} defaultChecked />
                    </div> */}
                    <div className='flex items-center gap-2' onClick={() => {
                        if (confirm('คุณต้องการออกจากระบบ ใช่หรือไม่ ?')) {
                            window.localStorage.clear();
                            navigate('/')
                            persistor.purge();
                            dispatch({ type: 'INIT_LOGOUT', payload: { login: false, id: '', name: '',jwt:'' } })
                        }
                    }}>
                        <span >{reducer.name}</span>
                        <Avatar sx={{ bgcolor: deepOrange[500] }}>P</Avatar>
                    </div>

                </div>
            </div>
        </div>
        // <>
        //     <div>
        //         <div className='flex items-center justify-between px-[2rem] py-[.5rem] bg-[#1d1d1d]' >
        //             <div className='text-[1rem] lg:text-[1.5rem] xl:text-[2rem] text-white'>DELIVERY ORDER</div>
        //             <div className='flex items-center gap-2'>
        //                 <span className='text-white'>{reducer?.name}</span>
        //                 <Avatar alt="Remy Sharp" src={imageUrl} />
        //                 <IconButton style={{ background: red[400] }} onClick={() => setOpenDialogLogout(true)}><ExitToAppRounded className='' /></IconButton>
        //             </div>
        //         </div >
        //         <div>
        //             <Stack direction={'row'} className='bg-[#dddddd]'>
        //                 {/* <MenuLink text = 'Monitor Plan'  /> */}
        //                 <div className='flex items-center'>
        //                     <Button onClick={() => navigate(VITE_PATH + '/plan')}>D/O Monitor</Button>
        //                     <div>|</div>
        //                 </div>
        //                 <div className='flex items-center'>
        //                     <Button onClick={() => navigate(VITE_PATH + '/supplier')}>Suppiler Delivery Monitor</Button>
        //                     <div>|</div>
        //                 </div>
        //                 <div className='flex items-center'>
        //                     <Button onClick={() => navigate(VITE_PATH + '/part')}>Stock Warning</Button>
        //                     <div>|</div>
        //                 </div>
        //                 <div className='flex items-center'>
        //                     <Button onClick={() => navigate(VITE_PATH + '/po')}>P/O Warning</Button>
        //                     <div>|</div>
        //                 </div>
        //                 <div className='flex items-center'>
        //                     <Button onClick={() => navigate(VITE_PATH + '/delivery')}>จัดส่งวันนี้</Button>
        //                 </div>
        //                 {/* <Button onClick={()=>navigate( VITE_PATH + '/stock')}>Stock Monitor</Button> */}
        //             </Stack>
        //         </div>

        //     </div>
        //     <Dialog open={openDialogLogout} onClose={handleCloseLogout}>
        //         <DialogTitle>ออกจากระบบ</DialogTitle>
        //         <DialogContent>
        //             <DialogContentText>
        //                 คุณต้องการออกจากระบบ ใช่หรือไม่ ?
        //             </DialogContentText>
        //         </DialogContent>
        //         <DialogActions>
        //             <Button onClick={handleCloseLogout}>ปิดหน้าต่าง</Button>
        //             <Button onClick={() => handleLogout()} variant='contained'>ยืนยัน</Button>
        //         </DialogActions>
        //     </Dialog>
        // </>
    )
}

export default MainAppbar