import PaidIcon from '@mui/icons-material/Paid';
import { Avatar, Stack, Switch, Typography } from '@mui/material'
import { deepOrange, red } from '@mui/material/colors';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../css/Appbar.css'
import { persistor } from '../reducers/store'
import { emptyCache } from '../Method';
function MainAppbar() {
    const dispatch = useDispatch();
    const redx = useSelector(state => state.mainReducer);
    const VERSION = import.meta.env.VITE_VERSION;
    return (
        // 4effca
        <div id='toolbar' className='w-full h-[50px] bg-[#ebebeb] flex justify-between border-b border-[#ddd] shadow-md'>
            <div className='flex items-center gap-0 pl-[16px] text-[#5c5fc8] '>
                <PaidIcon className='text-[2vw] ' />
                <Stack className='select-none h-[93%] pl-[8px] gap-1' justifyContent={'center'} >
                    <Typography className='flex  gap-1 items-center sm:text-[2.5vw] md:text-[2vw] lg:text-[2.2vw] xl:text-[1.8vw] 2xl:text-[1.35vw]  transition-all duration-200 leading-none' variant="caption" >
                        DELIVERY ORDER SYSTEM
                    </Typography>
                </Stack>
            </div>
            <div className='text-right'>
                <div className='w-fit h-full flex items-center gap-2 pr-3' >
                    <div className='flex items-center gap-2' onClick={() => {
                        if (confirm('คุณต้องการออกจากระบบ ใช่หรือไม่ ?')) {
                            localStorage.clear();
                            emptyCache();
                            persistor.purge();
                            dispatch({ type: 'RESET', payload: { version: VERSION } });
                            location.reload();
                        }
                    }}>
                        <span >{redx.name}</span>
                        <Avatar sx={{ width: 30, height: 30 }} src={`https://scm.dci.co.th/pic/${redx.id}.JPG`} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MainAppbar