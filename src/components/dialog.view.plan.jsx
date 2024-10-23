import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { API_VIEW_HISTORY_PLAN } from '../Services'
import moment from 'moment'

function DialogViewPlan(props) {
    const { open, close, data, setPlan } = props;
    const [content, setContent] = useState([]);
    useEffect(() => {
        if (open == true) {
            init();
        } else {
            setPlan({});
        }
    }, [open]);
    async function init() {
        let res = await API_VIEW_HISTORY_PLAN({
            date: moment(data[0].date).format('YYYYMMDD'),
            part: data[0].partNo
        });
        if (typeof res != 'undefined' && Object.keys(res).length) {
            setContent(res);
        }
    }
    return (
        <Dialog open={open} onClose={() => close()} fullWidth maxWidth='sm'>
            <DialogTitle >
                ประวัติการเปลี่ยนแปลงของแผนการผลิต
            </DialogTitle>
            <DialogContent dividers>
                <table className='w-full border-collapse'>
                    <thead>
                        <tr>
                            <th className='border capitalize' width='15%'>Running</th>
                            <th className='border capitalize' width='15%'>Version</th>
                            <th className='border capitalize' width='30%'>date (DD/MM/YYYY)</th>
                            <th className='border capitalize' width='40%'>plan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            content.length == 0 ? <tr>
                                <td colSpan={4} className='border text-center' >ไม่พบข้อมูล</td>
                            </tr> : (
                                content.map((oContent, iContent) => {
                                    console.log(oContent)
                                    return <tr key={iContent} className={`${iContent == 0 && 'bg-blue-50'}`}>
                                        <td className='border text-center'>{oContent.runningCode}</td>
                                        <td className='border text-center'>{oContent.rev}</td>
                                        <td className='border text-center'>{moment(oContent.dateVal).format('DD/MM/YYYY')}</td>
                                        <td className={`border  ${iContent == 0 && ' text-blue-700  font-bold'} text-right pr-3`}>{oContent.planVal.toLocaleString('en')} {iContent == 0 && `(ปัจจุบัน)`}</td>
                                    </tr>
                                })
                            )
                        }
                    </tbody>
                </table>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => close()}>ปิดหน้าต่าง</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogViewPlan