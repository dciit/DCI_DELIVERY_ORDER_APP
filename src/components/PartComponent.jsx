import { Stack, Typography } from '@mui/material'
import { React, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
function PartComponent(props) {
    const { master, part, vdCode, vdName ,partNo } = props;
    const venderMaster = useSelector(state => state.mainReducer.venderMaster);
    const [venderName, setVenderName] = useState('');
    const [partDetail, setPartDetail] = useState({});
    const warningStockPayload = useSelector(state => state.warningStockStateReducer.warningStockState);
    const dispatch = useDispatch();
    
    useEffect(() => {

        let item = master.filter(item => item.partno == part.part);
        let itemVender = venderMaster.filter(item => item.vdCode == part.vender);
        if (Object.keys(itemVender).length && part?.key) {
            setVenderName(itemVender[0].vdDesc);
        }
        if (Object.keys(item).length) {
         
            setPartDetail(item[0]);
        }

   

    }, [part]);
    return (
        <div className='w-[200px] bg-white '>
            {
                (part?.key ) && <Stack className='box-part-detail absolute ' alignItems={'start'} pl={2} pt={1}>
                    <Stack direction={'row'} gap={1}  >
                        <div className="flex flex-row gap-1 ">
                    
                            <span className={`text-[#5c5fc8] font-bold font-['Inter'] ${partNo == "TOTAL" && "text-3xl text-green-500 font-bold"}`}>{partNo}</span>
                            <span className=" text-[#5c5fc8] font-semibold font-['Inter']">{partDetail?.cm}</span>
                        </div>
                        <Typography className='unitVal'>{partDetail?.unit}</Typography>
                    </Stack>
                    <Typography className='partDesc text-[12px]'>{partDetail?.description}</Typography>
                    {partNo != "TOTAL" &&    
                    <>
                    <Stack direction={'row'} gap={1} className="text-[12px] font-['Inter']">
                        <span className='text-[14px]'> PD.LT </span>
                        <span className="boxVal text-[14px] font-semibold font-['Inter']">{partDetail?.pdlt}</span>
                        <span className='text-[14px]'> BOX </span>
                        <span className="boxVal text-[14px]  font-semibold font-['Inter']">{partDetail?.boxQty}</span>
                        <span className='text-[14px]'> MIN </span>
                        <span className='minVal text-[14px]'>{partDetail?.boxMin}</span>
                        <span className='text-[14px]'> MAX </span>
                        <span className='maxVal text-[14px]'>{partDetail?.boxMax != 99999 ? partDetail?.boxMax : '-'}</span>
                    </Stack>
                
                    <Typography className='text-[12px] vender-name'>{vdName} </Typography>
                    </>
                }
                </Stack>
            }
        </div>
    )
}

export default PartComponent