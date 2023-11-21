import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
function DialogFilter(props) {
    const { open, close, refresh } = props;
    const dispatch = useDispatch();
    const reducer = useSelector(state => state.mainReducer);
    const FN_UPDATE_FILTER = (e, name) => {
        dispatch({ type: 'UPDATE_FILTER', checked: e.checked, name: name });
        refresh();
    }
    return (
        <Dialog open={open} fullWidth maxWidth={'sm'}>
            <DialogTitle>กรองข้อมูล</DialogTitle>
            <DialogContent dividers>
                <FormGroup>
                    {
                        reducer.filters?.map((item, index) => (
                            <FormControlLabel key={index} control={<Checkbox checked={item.checked} value={item.name} onChange={(e) => FN_UPDATE_FILTER(e.target, item.name)} />} label={item.label} disabled={item.disabled} />
                        ))
                    }
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => close(false)} >ปิดหน้าต่าง</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogFilter