import React, { useEffect, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { LoadingButton } from '@mui/lab'
import { API_CALENDAR_GET_BY_DATE, API_CALENDAR_INSERT, API_CALENDAR_DEL } from '../Services'
import { CircularProgress } from '@mui/material'
import { contact } from '../constant'
function DialogEditCalendar(props) {
    const { open, close, date, setDate } = props;
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState(false);
    const [loadInit, setLoadInit] = useState(true);
    // const [load, setDateDetail] = useState(null);
    const [message, setMessage] = useState('');
    const refTitle = useRef();
    const [detail, setDetail] = useState(null);
    const handleEditCalendar = async () => {
        setLoad(true)
        if (title.trim().length == 0) {
            refTitle.current.focus();
            setMessage('* กรุณาระบุรายละเอียด')
            setLoad(false);
            return false;
        }
        let apiCalenderInsert = await API_CALENDAR_INSERT({ code: date, description: title });
        if (apiCalenderInsert.status == true) {
            setDate(null);
            close(false);
            setLoad(false);
        } else {
            alert('ไม่สามารถบันทึกได้ ติดต่อ เบียร์ IT (250)');
            setLoad(false)
            return false;
        }
    }
    useEffect(() => {
        setDetail(null)
        if (open == true) {
            setLoadInit(true);
            setTitle('');
            if (refTitle.current != undefined) {
                refTitle.current.focus();
            }
            init();
        }
    }, [open]);
    const init = async () => {
        let apiGetHoliday = await API_CALENDAR_GET_BY_DATE(date);
        if (apiGetHoliday != null && typeof apiGetHoliday.description != 'undefined') {
            setTitle(apiGetHoliday.description);
            setDetail(apiGetHoliday);
        } else {
            setTitle('');
        }
        setLoadInit(false);
    }
    useEffect(() => {
        if (title.length > 0) {
            setMessage('')
        }
    }, [title]);
    const handleDel = async () => {
        let apiDel = await API_CALENDAR_DEL(date);
        if (apiDel.status == true) {
            close(false);
        } else {
            alert(`ไม่สามารถลบได้ ${contact}`)
        }
    }
    return (
        <Dialog open={open} onClose={() => close(false)} fullWidth maxWidth='sm'>
            <DialogTitle  >
                <div className='flex gap-2 flex-row items-center'>
                    <div className='rounded-full bg-[#5c5fc8] text-[#fff]  w-[36px] h-[36px] flex items-center justify-center'>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: '20px' }} />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[18px]'>Calendar Management</span>
                        <span className='text-[12px] text-[#939393]'>แก้ไขข้อมูลวันหยุดปฎิทิน</span>
                    </div>
                </div>
            </DialogTitle>
            {
                loadInit == true ? <div className='flex flex-col items-center gap-2'>
                    <CircularProgress />
                    <span>กำลังโหลดข้อมูล</span>
                </div> :
                    <DialogContent dividers>
                        <div className='px-6 py-3'>
                            <div className='flex flex-row gap-3 items-center'>
                                <CalendarMonthOutlinedIcon className='text-[#9e9e9e]' />
                                <input type='text' placeholder='กรุณากรอกรายละเอียด' className='placeholder-gray-400   border-primary focus:outline-none  w-full  text-primary font-semibold  bg-[#f1f1f1] rounded-[4px] px-3 py-1' readOnly={true} value={date} />
                            </div>
                        </div>
                        <div className='px-6 py-3'>
                            <div className='flex flex-row gap-3 items-center'>
                                <CreateOutlinedIcon className='text-[#9e9e9e]' />
                                <input ref={refTitle} type='text' placeholder='กรุณากรอกรายละเอียด' className='placeholder-gray-400 focus:border-b-[1px] border-primary focus:outline-none placeholder-opacity-100 w-full   bg-[#f1f1f1] rounded-[4px] px-2 py-1 text-primary' value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
                            </div>
                        </div>
                        {
                            message.length > 0 && <div className='px-6 py-3 text-[14px] text-red-400 bg-red-50 rounded-md border border-red-100'>
                                {message}
                            </div>
                        }
                    </DialogContent>
            }
            <DialogActions>
                {
                    detail != null &&  <Button variant='contained' color='error' onClick={handleDel}>ลบ</Button>
                }
                <Button variant='outlined' className='outline-none border-primary text-primary' onClick={() => close(false)}>ปิดหน้าต่าง</Button>
                <LoadingButton variant='contained' className=' ' onClick={handleEditCalendar} loading={load} startIcon={<CreateOutlinedIcon />} loadingPosition='start'>  <span>{load ? 'กำลังบันทึก' : 'บันทึก'}</span></LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default DialogEditCalendar