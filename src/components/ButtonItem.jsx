import { Stack } from '@mui/material';
import React from 'react'
export default function ButtonItem(props) {
    const { classs, label, handle, handleKey, icon, test = '4effca', color = '080b0f' } = props;
    return (
        <div className={`select-none bg-[#${test}] text-[#${color}] rounded-[8px] px-[8px] pt-[0px] pb-[4px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105  duration-300 shadow-mtr w-fit  hover:animate-pulse ${classs}`} onClick={() => handle(handleKey)}>
            <Stack alignItems={'center'} direction={'row'}>
                {icon}
                <span className='text-center'>{label}</span>
            </Stack>
        </div>
    )
}
