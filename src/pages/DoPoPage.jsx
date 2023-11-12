import { Button, CircularProgress, FormControl, Grid, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, tableCellClasses } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ServiceGetPlan, ServiceGetSupplier } from '../Services';
import axios from 'axios';
import dayjs from 'dayjs';
import { NumericFormat } from 'react-number-format';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
function DoPoPage() {
    const headers = [
        'D/O Date', 'Drawing No', 'Cm', 'Decription', 'D/O NO', 'DEL.DATE', 'TIME', 'W/H NO', 'DEL.PLACE', 'UNIT', 'D/O QTY', 'R/C QTY', 'REMAIN', 'STATUS', 'QTY/BOX'
    ]
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    const [supplierSelected, setSupplierSelected] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [master, setMaster] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    function getListSupplier() {
        return new Promise(resolve => {
            axios.get(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/getSupplier').then((res) => {
                setSupplier(res.data);
                if (supplierSelected == '') {
                    setSupplierSelected(res.data[0].vender)
                }
                resolve(res.data)
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    function getPlan(supplier = '') {
        setLoadingData(true);
        ServiceGetPlan(supplier).then((res) => {
            console.log(res.data.data)
            setSupplierData((res.data.data).sort((a, b) => (a.date > b.date) ? 1 : -1).filter(item => {
                return item.doPlan > 0 && item.po == 0
            }));
            setMaster(res.data.master);
            setLoadingData(false);
        })
    }

    const handleSupplier = async event => {
        await setSupplierSelected(event.target.value);
        // getPlan(event.target.value);
    }
    const handleSearch = () => {
        getPlan(supplierSelected);
    }
    var once = false;
    useEffect(() => {
        async function getData() {
            await getListSupplier();
            await getPlan(supplierSelected);
        }
        if (!once) {
            getData();
            once = true;
        }
    }, [])

    return (
        <Grid container>
            <Grid item xs={12} className='px-6 pt-3 pb-0'>
                <Typography variant='h3'>D/O PO</Typography>
            </Grid>
            <Grid item xs={12} p={3}>
                <div className='flex gap-2'>
                    <FormControl fullWidth>
                        <Select
                            size='small'
                            value={supplierSelected}
                            onChange={handleSupplier}
                            sx={{
                                height: '2.5rem',
                            }}
                        >
                            {
                                supplier.map((sp) => {
                                    return <MenuItem value={sp.vender} key={sp.vender}>{sp.venderName} ({sp.vender})</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <Button variant='contained' onClick={handleSearch}><SearchIcon />&nbsp;Search</Button>
                </div>
            </Grid>
            <Grid item xs={12} className='px-6'>
                <TableContainer component={Paper}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                {
                                    headers.map((header, index) => (
                                        <StyledTableCell key={index} className='text-center'>{header.toUpperCase()}</StyledTableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loadingData ? <TableRow>
                                    <TableCell colSpan={15} className='text-center'>
                                        <Stack spacing={1} alignItems={'center'}>
                                            <CircularProgress />
                                            <Typography variant='span'>กำลังโหลดข้อมูล  . . . </Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow> : (supplierData.length ? supplierData.map((item) => {
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
                                        <TableCell className='text-center'>{master[item.part].partUnit}</TableCell>
                                        <TableCell className='text-right font-semibold text-green-500'><NumericFormat displayType='text' thousandSeparator="," value={item.doPlan} decimalScale={2} /></TableCell>
                                        <TableCell className='text-right'>-</TableCell>
                                        <TableCell className='text-right font-semibold text-red-500'><NumericFormat displayType='text' thousandSeparator="," value={item.doPlan} decimalScale={2} /></TableCell>
                                        <TableCell className='text-center'>-</TableCell>
                                        <TableCell className='text-right'><NumericFormat displayType='text' thousandSeparator="," value={master[item.part].partQtyBox} decimalScale={2} /></TableCell>
                                    </StyledTableRow>
                                }) : <TableRow><TableCell colSpan={15} className='text-center'>ไม่พบข้อมูล</TableCell></TableRow>)
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}

export default DoPoPage