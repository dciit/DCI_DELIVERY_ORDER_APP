import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { Card, CircularProgress, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save';
import { API_EDIT_DO, API_GET_LOG } from '../Services'
import moment from 'moment'
import { useSelector } from 'react-redux'
function DialogEditDO(props) {
    const reducer = useSelector(state => state.mainReducer);
    const { open, close, data, dataDO, setDataDO } = props;
    const [val, setVal] = useState(0);
    const [btnLoad, setBtnLoad] = useState(false);
    const [loadLog, setLoadLog] = useState(false);
    const [log, setLog] = useState([]);
    useEffect(() => {
        if (open) {
            setBtnLoad(false);
            init();
        }
    }, [open]);
    async function init() {
        let resLog = await API_GET_LOG(data);
        setLog(resLog);
        setVal(data.doVal);
    }
    async function handleSave() {

        if (val == '') {
            alert('กรุณาระบุตัวเลข D/O');
            setVal(data.doVal)
            return false;
        }
        let CurDT = moment();
        if (moment({ hour: 15, minute: 0, second: 0 }).isAfter(moment({ hour: CurDT.hour(), minute: CurDT.minute(), second: CurDT.second() }))) { // เวลาปัจจุบัน อยู่หลังบ่าย 3 แล้วหรือยัง ? ถ้าใช่ Day -1
            data.ymd = moment(data.ymd, 'YYYYMMDD').format('YYYYMMDD');
        }
        setBtnLoad(true);
        data.doPrev = data?.doVal;
        data.doVal = (val != '' && val != null) ? parseInt(val) : 0;
        data.empCode = reducer.id;
        console.log(data);
        let res = await API_EDIT_DO(data);
        if (res.status) {
            let dataOfResult = dataDO.filter((o => o.part == data.partno && o.name == 'do'));
            if (dataOfResult.length) {
                let indexOfResult = dataDO.findIndex((o => o.part == data.partno && o.name == 'do'))
                let oData = dataOfResult[0].data.map((o => o.date.substring(0, 10).replaceAll('-', '')));
                let indexData = oData.findIndex(o => o == data.ymd);
                if (indexOfResult != -1 && indexData != -1) {
                    dataDO[indexOfResult]['data'][indexData]['value'] = val;
                    setDataDO([...dataDO])
                }
            }
            close(false);
            setBtnLoad(false);
        } else {
            alert('ไม่สามารถแก้ไขข้อมูล D/O ได้ ติดต่อ IT (611 เบียร์)');
            setBtnLoad(false);
        }
    }
    return (
        <Dialog open={open} onClose={() => close(false)} fullWidth maxWidth='md' >
            <DialogTitle >
                EDIT D/O VALUE OF DAY
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    <Stack gap={2}>
                        <Typography>Information</Typography>
                        <Stack direction={'column'} gap={2}>
                            <TextField
                                disabled
                                label="Running Code"
                                defaultValue={data?.runningCode}
                                size='small'
                            />
                            <Stack direction={'row'} justifyContent={'center'} gap={2}  >
                                <TextField
                                    disabled
                                    label="Drawing NO."
                                    defaultValue={data?.partno}
                                    size='small'
                                    fullWidth
                                />
                                <TextField
                                    disabled
                                    label="YYYYMMDD"
                                    defaultValue={data?.ymd}
                                    size='small'
                                    fullWidth
                                />
                            </Stack>
                        </Stack>
                        <Divider />
                        <Stack gap={2}>
                            <Typography>Enter D/O Value</Typography>
                            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={3}>
                                <TextField label='D/O Previous' InputLabelProps={{
                                    shrink: true,
                                }} inputProps={{ readOnly: true }} className='w-full bg-red-50' size='small' value={data?.doVal} color='error' focused />
                                <KeyboardDoubleArrowRightIcon />
                                <TextField label='D/O Current' color="success" placeholder='Enter New D/O' focused InputLabelProps={{
                                    shrink: true,
                                }} className='w-full bg-green-50' size='small' value={val} onChange={(e) => setVal(e.target.value)} type='number' />
                            </Stack>
                        </Stack>
                        <Divider />

                        <Stack>
                            <Table className='w-full' size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='text-[12px]'>Running Code</TableCell>
                                        <TableCell className='text-[12px]'>Date Target</TableCell>
                                        <TableCell className='text-[12px]'>Drawing NO.</TableCell>
                                        <TableCell className='text-[12px]'>DO Current</TableCell>
                                        <TableCell className='text-[12px]'>DO Previous</TableCell>
                                        <TableCell className='text-[12px]'>DT Insert</TableCell>
                                        <TableCell className='text-[12px]'>DT Update</TableCell>
                                        <TableCell className='text-[12px]'>Update By</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        loadLog ? <Stack>
                                            <Typography>กำลังโหลดข้อมูล ...</Typography>
                                            <CircularProgress />
                                        </Stack> :
                                            log.length > 0 ?
                                                log.map((oLog, iLog) => {
                                                    return <TableRow key={iLog}>
                                                        <TableCell className='text-[12px]'>{oLog.runningCode}</TableCell>
                                                        <TableCell className='text-[12px]'>{oLog.dateVal}</TableCell>
                                                        <TableCell className='text-[12px]'>{oLog.partNo}</TableCell>
                                                        <TableCell className='text-[12px] text-red-500 font-semibold'>{oLog.prevDO}</TableCell>
                                                        <TableCell className='text-[12px] text-green-600 font-semibold'>{oLog.doVal}</TableCell>
                                                        <TableCell className='text-[12px]'>{moment(oLog.dtInsert).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                                                        <TableCell className='text-[12px]'>{moment(oLog.dtUpdate).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                                                        <TableCell className='text-[12px]'>{oLog.updateBy}</TableCell>
                                                    </TableRow>
                                                }) :
                                                <TableRow>
                                                    <TableCell colSpan={7} className='text-center'>ไม่พบประวัติ</TableCell>
                                                </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </Stack>
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    loading={btnLoad}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    size='small'
                    variant="contained"
                    onClick={() => handleSave()}  >
                    Save
                </LoadingButton>
                <Button onClick={() => close(false)} variant='outlined' size='small'>Close</Button>
            </DialogActions>
        </Dialog >
    )
}

export default DialogEditDO