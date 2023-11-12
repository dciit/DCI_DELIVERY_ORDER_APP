import { Checkbox, Divider, FormControlLabel, FormGroup, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function CheckBoxFilter(props) {
    const { initPlan, data, master } = props;
    const dispatch = useDispatch();
    const reducer = useSelector(state => state.mainReducer);
    const onChangeFilter = (e, name) => {
        dispatch({ type: 'CHECKED_FILTER', checked: e.checked, name: name });
        initPlan(data);
    }
    return (
        <>
            <FormGroup>
                {
                    reducer.titles?.map((item, index) => (
                        <FormControlLabel key={index} control={<Checkbox checked={item.checked} value={item.name} onChange={(e) => onChangeFilter(e.target, item.name)} />} label={item.label} disabled={item.disabled} />
                    ))
                }

            </FormGroup>
        </>
    )
}

export default CheckBoxFilter