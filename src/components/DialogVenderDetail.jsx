import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Box, CircularProgress, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { ApiUpdateVenderSTD, ServiceGetListTimeSchedule, ServiceGetVenderMaster, ServiceUpdateDate, ServiceUpdateDay, ServiceUpdateVenderDetail } from '../Services'
import moment from 'moment'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Input } from 'antd'


function DialogVenderDetail(props) {
    const reducer = useSelector(state => state.mainReducer);
    const { open, setOpen, loading, setLoading, refresh, setOpenSnackBar, venderSelected, data, setData } = props;
    // const [listTimeSchedule, setListTimeSchedule] = useState();
    const [vender, setVender] = useState({});
    const [notify, setNotify] = useState({
        show: false,
        action: false,
        message: ''
    });
    const UpdateDate = (day, checked) => {
        ServiceUpdateDate({ vender: vender.vdCode, date: day, check: checked }).then((res) => {
            // refresh(vender.VD_CODE, false);
            fetchVenderData();
        })
    }
    function IsCheckedDay(index) {
        return vender != null ? vender['vd' + index] : '';
    }
    function IsCheckDate(index) {
        return vender != null ? vender['vdDay' + index] : '';
    }
    const UpdateDay = (day, checked) => {
        ServiceUpdateDay({ vender: vender.vdCode, day: day, check: checked }).then((res) => {
            fetchVenderData();
        })
    }
    const handleUpdateVenderSTD = async () => {
        // ServiceUpdateVenderDetail({ min: vender.vdMinDelivery, max: vender.vdMaxDelivery, round: vender.vdRound, vender: vender?.vdCode, timeSchedule: vender.vdTimeScheduleDelivery }).then((res) => {
        let res = await ApiUpdateVenderSTD({ min: vender.vdMinDelivery, max: vender.vdMaxDelivery, timesech: vender.vdTimeScheduleDelivery, round: vender.vdRound, vender: vender?.vdCode, vdBoxPeriod: vender.vdBoxPeriod, vdProdLead: vender.vdProdLead });
        var redrawData = data;
        var IndexOfVenders = redrawData.map(x => x.vdCode).indexOf(vender.vdCode);
        if (IndexOfVenders != -1) {
            redrawData[IndexOfVenders] = vender;
            setData(redrawData);
        }
        if (res.update > 0) {
            setNotify({ show: true, action: true, message: 'บันทึกข้อมูลสําเร็จ' });
        } else {
            setNotify({ show: true, action: false, message: ('เกิดข้อผิดพลาดระหว่างการบันทึกข้อมูล เนื่องจาก : ' + res.message) });
        }
    }
    // async function fetchListTimeSchedule() {
    //     const res = await ServiceGetListTimeSchedule();
    //     setListTimeSchedule(res);
    // }
    async function fetchVenderData() {
        const res = await ServiceGetVenderMaster(venderSelected);
        if (res != null) {
            setVender(res)
            setLoading(false)
        }
    }
    useEffect(() => {
        if (open) {
            fetchVenderData();
            // fetchListTimeSchedule();
        }
    }, [open])

    useEffect(() => {
        if (Object.keys(vender).length) {
            setNotify({ show: false, message: '', action: true })
        }
    }, [vender])

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth={'md'}>
            <DialogTitle >
                แก้ไขข้อมูลร้านค้า
            </DialogTitle>
            <DialogContent dividers>
                {
                    loading ? <div className='flex flex-col gap-2 items-center justify-center h-[200px]'><CircularProgress /><span>กำลังโหลดข้อมูลร้านค้า</span></div> :
                        <Grid container spacing={2}>

                            <div className='grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3 p-6 w-full'>
                                {
                                    notify.show == true && <div className={`border rounded-md p-3 pl-4 ${notify.action == true ? 'bg-green-50 border-green-600 text-green-700' : 'bg-red-100 border-red-400 text-red-600'}  flex flex-row  items-center gap-2`} onClick={() => {
                                        setNotify({ ...notify, show: false });
                                    }}>

                                        {
                                            notify.action == true ? <CheckCircleIcon /> : <ErrorOutlineIcon />
                                        }
                                        <small>{`${notify.message} (${moment().format('DD/MM/YYYY HH:mm:ss')})`}</small>
                                    </div>
                                }
                                <div className='grid grid-cols-4 gap-2 mb-3'>

                                    <div className='col-span-1 flex flex-col gap-1'>
                                        <div className='text-[14px] col-span-2  pr-2 items-center  flex'>Supplier Code</div>
                                        <Input value={`${vender?.vdCode}`} readOnly={true} />
                                        {/* <input type='text' readOnly className='col-span-2 rounded-md w-full border-gray-400 focus:border-blue-500 border-2 transition-all duration-300 focus:outline-none px-3 py-1 ' value={`${vender?.vdCode}`} /> */}
                                    </div>
                                    <div className='col-span-3 flex flex-col gap-1'>
                                        <div className='text-[14px] col-span-2  pr-2 items-center  flex'>Supplier Name</div>
                                        <Input value={`${vender?.vdDesc}`} readOnly={true} />
                                        {/* <input type='text' readOnly className='col-span-2 rounded-md w-full border-gray-400 focus:border-blue-500 border-2 transition-all duration-300 focus:outline-none px-3 py-1 ' value={`${vender?.vdDesc}`} /> */}
                                    </div>
                                </div>
                                <div className='sm:col-span-1 lg:col-span-1 grid grid-cols-4 gap-1'>
                                    <div className='text-[14px] col-span-2 text-end pr-2 items-start justify-end flex'>ขั้นต่ำในการส่ง (Minimum Delivery)</div>
                                    <div className='col-span-2 flex flex-col justify-end items-center gap-1'>
                                        <Input value={vender?.vdMinDelivery}
                                            onChange={(e) => {
                                                setVender({ ...vender, vdMinDelivery: e.target.value })
                                            }} />
                                        <div className=' gap-3 w-full flex justify-end'>
                                            <div className='flex  items-center gap-1'>
                                                <input type="radio" id="css" name="vdBoxPeriod" value="CSS" checked={(vender?.vdBoxPeriod != undefined && vender?.vdBoxPeriod == false) ? true : false} onChange={(e) => { setVender({ ...vender, vdBoxPeriod: false }) }} />
                                                <label for="css">ส่งตามจำนวน</label>
                                            </div>
                                            <div className='flex  items-center gap-1'>
                                                <input type="radio" id="javascript" name="vdBoxPeriod" value="JavaScript" checked={(vender?.vdBoxPeriod != undefined && vender?.vdBoxPeriod == true) ? true : false} onChange={(e) => { setVender({ ...vender, vdBoxPeriod: true }) }} />
                                                <label for="javascript">ส่งตาม Pallet</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='sm:col-span-1 lg:col-span-1 grid  grid-cols-4  gap-1'>
                                    <div className='text-[14px] col-span-2 text-end pr-2 items-center justify-end flex'>สูงสุดในการส่ง (Maximum Delivery) </div>
                                    <Input type='number' className='col-span-2' value={vender?.vdMaxDelivery}
                                        onChange={(e) => {
                                            setVender({ ...vender, vdMaxDelivery: e.target.value })
                                        }} />
                                </div>
                                <div className='sm:col-span-1 lg:col-span-1 grid  grid-cols-4 gap-1'>
                                    <div className='text-[14px] col-span-2 text-end pr-2 items-center justify-end flex'>จำนวนวัน ล็อค จำนวนการสั่งซื้อ (Fixed) </div>
                                    <Input type='number' min={0} max={7} className=' col-span-2' value={vender?.vdProdLead}
                                        onChange={(e) => {
                                            setVender({ ...vender, vdProdLead: e.target.value })
                                        }} />
                                </div>
                                <div className='sm:col-span-1 lg:col-span-1 grid  grid-cols-4 gap-1'>
                                    <div className='text-[14px] col-span-2 text-end pr-2 items-center justify-end flex'>ช่วงเวลาในการจัดส่ง </div>
                                    <Input
                                        value={vender?.vdTimeScheduleDelivery || "00:00:00"}
                                        placeholder='ชั่วโมง:นาที:วินาที'
                                        maxLength={8}
                                        onChange={(e) => {
                                            setVender({ ...vender, vdTimeScheduleDelivery: e.target.value })
                                        }}
                                    />
                                </div>
                            </div>
                            <Grid item xs={12}>
                                ปฎิทินการจัดส่ง
                            </Grid>
                            {/* <Grid item xs={12} className='pl-12'>
                                <Typography className='mb-2'>รอบจัดส่ง (WH)</Typography>
                                <Select value={vender.vdTimeScheduleDelivery == null ? '-' : vender.vdTimeScheduleDelivery} fullWidth size='small' onChange={(e) => {
                                    setVender({ ...vender, vdTimeScheduleDelivery: e.target.value })
                                }}>
                                    <MenuItem value={'-'}>-- ไม่มีการระบุ --</MenuItem>
                                    {
                                        listTimeSchedule?.map((item) => (
                                            <MenuItem value={item.code}>{item.code.substring(0, 5)} - {moment(item.code, 'HH.mm.ss').add(item.refCode, 'minutes').format('HH:mm')}</MenuItem>
                                        ))
                                    }
                                </Select>
                                {
                                    (vender.vdTimeScheduleDelivery == '' || vender.vdTimeScheduleDelivery == '-' || vender.vdTimeScheduleDelivery == null) && <Box p={1}>
                                        <Typography className='text-red-500'>- กรุณาเลือกรอบเวลาการเข้าส่ง (WH)</Typography>
                                    </Box>
                                }
                            </Grid> */}
                            <Grid item xs={12} className='pl-12'>
                                <Typography className='mb-2'>วันที่ต้องการให้จัดส่ง (สัปดาห์)</Typography>
                                <TableContainer component={Paper}>
                                    <Table size='small'>
                                        <TableBody>
                                            {
                                                reducer.dayOfWeek.map((item, index) => {
                                                    var isChecked = IsCheckedDay(item);
                                                    return <TableCell>
                                                        <div className='w-full text-center'>
                                                            <div className={`${isChecked ? 'bg-green-500' : 'bg-red-400'} rounded-full  h-[30px] flex items-center justify-center cursor-pointer select-none hover:animate-pulse font-semibold`} onClick={() => UpdateDay(item, !isChecked)}>
                                                                {item.toUpperCase()}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} className='pl-12'>
                                <Typography className='mb-2'>เฉพาะวันที่</Typography>
                                <TableContainer component={Paper}>
                                    <Table size='small'>
                                        <TableBody>
                                            {
                                                [0, 10, 20].map((i, ind) => {
                                                    return <>
                                                        <TableRow>
                                                            {
                                                                [...Array(10)].map((item, index) => {
                                                                    var day = i + (index + 1);
                                                                    var isChecked = IsCheckDate(day);
                                                                    return <TableCell className='text-center'>
                                                                        <div className={`${isChecked ? 'bg-green-400' : 'bg-red-400'} rounded-full w-[30px] h-[30px] flex items-center justify-center cursor-pointer select-none hover:animate-pulse font-semibold`} onClick={() => UpdateDate(day, !isChecked)}>
                                                                            {day}
                                                                        </div>
                                                                    </TableCell>
                                                                })
                                                            }
                                                        </TableRow>
                                                    </>
                                                })
                                            }
                                            <TableRow>
                                                <TableCell className='text-center'>
                                                    <div className={`${IsCheckDate(31) ? 'bg-green-400' : 'bg-red-400'} rounded-full w-[30px] h-[30px] flex items-center justify-center cursor-pointer select-none hover:animate-pulse font-semibold`} onClick={() => UpdateDate(31)}>
                                                        {31}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
                <Button type='primary' className={`${loading && 'hidden'}`} onClick={() => handleUpdateVenderSTD()}>บันทึก</Button>
            </DialogActions>
        </Dialog >
    )
}
export default DialogVenderDetail