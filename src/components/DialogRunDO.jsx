import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
function DialogRunDO(props) {
    const { handle, open = false, close, loading, setLoading } = props;
    const cancel = () => {
        close();
        setLoading(false);
    }
    return (
        <Dialog open={open} className='select-none' >
            <DialogTitle id="alert-dialog-title">
                {"คุณต้องการออกแผน Delivery Order ใช่หรือไม่ ?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;กรุณาตรวจสอบข้อมูลของระบบที่แสดงให้คุณเห็น หากมั่นใจและต้องการออกแผน Delivery Order สามารถกดปุ่ม ยืนยัน
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} disabled={loading}>ปิดหน้าต่าง</Button>
                <LoadingButton loading={loading} loadingPosition='start' startIcon={<CheckIcon />} variant='contained' onClick={handle}>ยืนยัน</LoadingButton>
            </DialogActions>
        </Dialog>

    )
}

export default DialogRunDO