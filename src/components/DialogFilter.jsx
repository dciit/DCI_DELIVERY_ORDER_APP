import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { Checkbox } from 'antd';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
function DialogFilter(props) {
    const { open, close, refresh } = props;
    const dispatch = useDispatch();
    const reducer = useSelector(state => state.mainReducer);
    const hiddenPartNoPlan = reducer?.hiddenPartNoPlan != undefined ? reducer.hiddenPartNoPlan : true;
    const FN_UPDATE_FILTER = (e, name) => {
        dispatch({ type: 'UPDATE_FILTER', checked: e.checked, name: name });
        refresh();
    }
    return (
        <Dialog open={open} onClose={() => close(false)} fullWidth maxWidth={'sm'}>
            <DialogTitle>กรองข้อมูล</DialogTitle>
            <DialogContent dividers>
                <div className='flex flex-col gap-2'>
                    <Checkbox checked={hiddenPartNoPlan} onChange={(e) => {
                        dispatch({ type: 'SET_HIDDEN_PART_NO_PLAN', payload: e.target.checked })
                    }}>ปิดการแสดงรายการที่ไม่แผนการผลิต</Checkbox>
                    {
                        reducer.filters?.map((item, index) => {
                            return <Checkbox key={index} checked={item.checked} value={item.name} onChange={(e) => FN_UPDATE_FILTER(e.target, item.name)} className='uppercase'>{item.name}</Checkbox>
                        })
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => close(false)} >ปิดหน้าต่าง</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogFilter