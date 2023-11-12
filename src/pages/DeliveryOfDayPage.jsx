import React from 'react'
import { Button, CircularProgress, FormControl, Grid, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, tableCellClasses } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { ServiceGetPlan } from '../Services';
function DeliveryOfDayPage() {
    const [loading, setLoading] = useState(true);
    const [plan,setPlan] = useState([]);

    useEffect(() => {
        ServiceGetPlan("195021").then((res)=>{
            console.log(res);
        }); 
    }, [])

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    Filter
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Drawing No</TableCell>
                                    <TableCell>Req PD</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>P/O</TableCell>
                                    <TableCell>D/O</TableCell>
                                    <TableCell>Vender</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    loading ? <TableRow>
                                        <TableCell colSpan={15} className='text-center'>
                                            <Stack spacing={1} alignItems={'center'}>
                                                <CircularProgress />
                                                <Typography variant='span'>กำลังโหลดข้อมูล  . . . </Typography>
                                            </Stack>
                                        </TableCell>
                                    </TableRow> : (data.length ? data.map((item) => {
                                        return <StyledTableRow >
                                            <TableCell className='text-center font-semibold'>{dayjs(item.date).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell className='text-center font-semibold'>{item.part}</TableCell>
                                            <TableCell className='text-center'>{master[item.part].partCm}</TableCell>
                                            <TableCell className='text-left pl-3'>{master[item.part].partDesc}</TableCell>
                                            <TableCell className='text-center'>20230802001</TableCell>
                                            <TableCell className='text-center font-semibold'>{dayjs(item.date).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell className='text-center'>09:00</TableCell>
                                            <TableCell className='text-center'>W1</TableCell>
                                            <TableCell className='text-center'>PART SUPPLY</TableCell>
                                            <TableCell className='text-right font-semibold'><NumericFormat displayType='text' thousandSeparator="," value={master[item.part].partQtyBox} decimalScale={2} /></TableCell>
                                            <TableCell className='text-center'>{master[item.part].partUnit}</TableCell>
                                            <TableCell className='text-right font-semibold text-green-500'><NumericFormat displayType='text' thousandSeparator="," value={item.doPlan} decimalScale={2} /></TableCell>
                                            <TableCell className='text-center'>-</TableCell>
                                            <TableCell className='text-right font-semibold text-red-500'><NumericFormat displayType='text' thousandSeparator="," value={item.doPlan} decimalScale={2} /></TableCell>
                                            <TableCell className='text-center'><div className='bg-[#ff9800] text-white rounded-lg px-3 py-1'>Pending</div></TableCell>
                                        </StyledTableRow>
                                    }) : <TableRow><TableCell colSpan={15} className='text-center'>ไม่พบข้อมูล</TableCell></TableRow>)
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    )
}

export default DeliveryOfDayPage