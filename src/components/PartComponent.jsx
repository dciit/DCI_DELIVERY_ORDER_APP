import { Stack, Typography } from '@mui/material'
import { React, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
function PartComponent(props) {
    const { master, part } = props;
    const venderMaster = useSelector(state => state.mainReducer.venderMaster);
    const [venderName, setVenderName] = useState('');
    const [partDetail, setPartDetail] = useState({});
    useEffect(() => {
        let item = master.filter(item => item.partno == part.part);
        let itemVender = venderMaster.filter(item => item.vdCode == part.vender);
        if (Object.keys(itemVender).length && part?.key) {
            setVenderName(itemVender[0].vdDesc);
        }
        if (Object.keys(item).length) {
            setPartDetail(item[0]);
        }
    }, []);
    return (
        <div className='w-[200px]'>
            {
                part?.key && <Stack className='box-part-detail absolute ' alignItems={'start'} pl={2} pt={1}>
                    <Stack direction={'row'} gap={1}>
                        <Typography className='partVal'>{partDetail?.partno}</Typography>
                        <Typography className='unitVal'>{partDetail?.unit}</Typography>
                    </Stack>
                    <Typography className='partDesc text-[12px]'>{partDetail?.description}</Typography>
                    <Stack direction={'row'} gap={1} className='text-[12px]'>
                        <Typography className='text-[12px]'> PD.LT </Typography>
                        <Typography className='boxVal text-[12px]'>{partDetail?.pdlt}</Typography>
                        <Typography className='text-[12px]'> BOX </Typography>
                        <Typography className='boxVal text-[12px]'>{partDetail?.boxQty}</Typography>
                        <Typography className='text-[12px]'> MIN </Typography>
                        <Typography className='minVal text-[12px]'>{partDetail?.boxMin}</Typography>
                        <Typography className='text-[12px]'> MAX </Typography>
                        <Typography className='maxVal text-[12px]'>{partDetail?.boxMax != 99999 ? partDetail?.boxMax : '-'}</Typography>
                    </Stack>
                    <Typography className='text-[12px] vender-name'>{venderName}</Typography>
                </Stack>
            }
        </div>
    )
}

export default PartComponent