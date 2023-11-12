import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { Box, CircularProgress, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { ServiceGetListTimeSchedule, ServiceGetVenderMaster, ServiceUpdateDate, ServiceUpdateDay, ServiceUpdateVenderDetail } from '../Services'
import moment from 'moment'
function DialogVenderDetail(props) {
    const reducer = useSelector(state => state.mainReducer);
    const { open, setOpen, loading, setLoading, refresh, setOpenSnackBar, venderSelected, data, setData } = props;
    const [min, setMin] = useState();
    const [listTimeSchedule, setListTimeSchedule] = useState();
    const [vender, setVender] = useState();
    const [timeScheduleSelected, setTimeScheduleSelected] = useState();
    const UpdateDate = (day, checked) => {
        ServiceUpdateDate({ vender: vender.vdCode, date: day, check: checked }).then((res) => {
            // refresh(vender.VD_CODE, false);
            fetchVenderData();
        })
    }
    function IsCheckedDay(index) {
        return vender['vd' + index];
    }
    function IsCheckDate(index) {
        return vender['vdDay' + index];
    }
    const UpdateDay = (day, checked) => {
        ServiceUpdateDay({ vender: vender.vdCode, day: day, check: checked }).then((res) => {
            fetchVenderData();
        })
    }
    const SaveVenderDetail = () => {
        if (vender.vdTimeScheduleDelivery == '' || vender.vdTimeScheduleDelivery == '-' || vender.vdTimeScheduleDelivery == null) {
            return false;
        }
        ServiceUpdateVenderDetail({ min: vender.vdMinDelivery, max: vender.vdMaxDelivery, round: vender.vdRound, vender: vender?.vdCode, timeSchedule: vender.vdTimeScheduleDelivery }).then((res) => {
            console.log(res)
            var redrawData = data;
            var IndexOfVenders = redrawData.map(x => x.vdCode).indexOf(vender.vdCode);
            if (IndexOfVenders != -1) {
                redrawData[IndexOfVenders] = vender;
                setData(redrawData);
            }
            if (res.data.update > 0) {
                setOpenSnackBar(true)
            }
        });
    }
    async function fetchListTimeSchedule() {
        const res = await ServiceGetListTimeSchedule();
        setListTimeSchedule(res);
    }
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
            fetchListTimeSchedule();
        }
    }, [open])
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth={'md'}>
            <DialogTitle >
                แก้ไขข้อมูลร้านค้า
            </DialogTitle>
            <DialogContent dividers>
                {
                    loading ? <div className='flex flex-col gap-2 items-center justify-center h-[200px]'><CircularProgress /><span>กำลังโหลดข้อมูลร้านค้า</span></div> :
                        <Grid container spacing={2}>

                            <Grid item xs={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="ชื่อร้านค้า"
                                    value={vender?.vdDesc}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                    fullWidth
                                    focused
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="รหัสร้านค้า"
                                    value={vender?.vdCode}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                    fullWidth
                                    focused
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label><input type="checkbox" />  จำกัดกล่องในการส่ง</label>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type='number'
                                    id="standard-read-only-input"
                                    label="จัดส่งขั้นต่ำต่อรอบ"
                                    fullWidth
                                    focused
                                    color='error'
                                    value={vender?.vdMinDelivery}
                                    onChange={(e) => {
                                        setVender({ ...vender, vdMinDelivery: e.target.value })
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type='number'
                                    id="standard-read-only-input"
                                    label="จัดส่งสูงสุดต่อรอบ"
                                    fullWidth
                                    focused
                                    color='success'
                                    value={vender?.vdMaxDelivery}
                                    onChange={(e) => {
                                        setVender({ ...vender, vdMaxDelivery: e.target.value })
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type='number'
                                    id="standard-read-only-input"
                                    label="รอบการส่งต่อวัน"
                                    fullWidth
                                    focused
                                    value={vender?.vdRound}
                                    onChange={(e) => {
                                        setVender({ ...vender, vdRound: e.target.value })
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                ปฎิทินการจัดส่ง
                            </Grid>
                            <Grid item xs={12} className='pl-12'>
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
                            </Grid>
                            <Grid item xs={12} className='pl-12'>
                                <Typography className='mb-2'>ประจำวันที่</Typography>
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
                <Button variant='contained' className={`${loading && 'hidden'}`} onClick={() => SaveVenderDetail()}>บันทึก</Button>
            </DialogActions>
        </Dialog >
    )
}
export default DialogVenderDetail