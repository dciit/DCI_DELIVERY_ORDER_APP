import { Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
function PartDetailComponent(props) {
    const reducer = useSelector(state => state.mainReducer);
    const { item, master, suppliers } = props;
    let index = item.index - 1;
    return <>

        {
            reducer.typeAccount == 'employee'
                ?
                <div className={`box-part-detail absolute text-left pl-[8px] pt-[4px] select-none`}>
                    <Stack direction={'row'} gap={1}>
                        <span className='partVal'>{index == 0 && item.partno} </span>
                        <span className='unitVal'>{index == 0 && master[item.partno]?.partUnit}</span>
                    </Stack>
                    {
                        index == 0 && <>
                            {
                                <Stack>
                                    <Stack>
                                        <span className='partDesc text-[12px]'>({index == 0 && master[item.partno]?.partDesc})</span>
                                    </Stack>
                                    <Stack direction={'row'} gap={1} className='text-[12px]'>
                                        <span> PD.LT </span>
                                        <span className='boxVal'>{master[item.partno]?.vdProdLeadtime}</span>
                                        <span> BOX </span>
                                        <span className='boxVal'>{master[item.partno]?.partQtyBox}</span>
                                        <span> MIN </span>
                                        <span className='minVal'>{master[item.partno]?.vdMinDelivery}</span>
                                        <span> MAX </span>
                                        <span className='maxVal'>{master[item.partno]?.vdMaxDelivery != 99999 ? master[item.partno]?.vdMaxDelivery : '-'}</span>
                                    </Stack>
                                </Stack>
                            }
                            <div className='text-[12px] vender-name'>
                                {
                                    Object.keys(suppliers.filter(vender => vender.VD_CODE == item.vender)).length ? (suppliers.filter(vender => vender.VD_CODE == item.vender)[0].VD_DESC) : item.vender
                                }
                            </div>
                        </>
                    }
                </div>
                :
                // index คือ ลำดับของ filter เช่น โหมด supplier จะแสดงข้อมูล part แค่รายการแรกของ parameter
                (index == 3 && <div className={`box-part-detail absolute text-left pl-[8px] pt-[4px] h-full flex items-center`}>
                    <div className='gap-1'>
                        <Stack direction={'row'} gap={1}>
                            <span className='partVal'>{item.partno} </span>
                            <span className='unitVal'>{master[item.partno]?.partUnit}</span>
                        </Stack>
                        <Stack direction={'row'} className='text-[12px] gap-1'>
                            <span> PD.LT </span>
                            <span className='boxVal'>{master[item.partno]?.vdProdLeadtime}</span>
                            <span> BOX </span>
                            <span className='boxVal'>{master[item.partno]?.partQtyBox}</span>
                            <span> MIN </span>
                            <span className='minVal'>{master[item.partno]?.vdMinDelivery}</span>
                            <span> MAX </span>
                            <span className='maxVal'>{master[item.partno]?.vdMaxDelivery != 99999 ? master[item.partno]?.vdMaxDelivery : '-'}</span>
                        </Stack>
                    </div>
                </div>)
        }
        <div></div>
        <div className={`box-title flex justify-end pr-2  ${reducer.typeAccount == 'supplier' && 'h-full flex items-center'}`}>
            <p className={`title ${item.class}`}>{reducer.titles[item.index - 1].label}</p>
        </div>
    </>
}
export default PartDetailComponent;