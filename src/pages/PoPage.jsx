import { Button, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs';
import { GET_PO } from '../Services/poService';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import axios from 'axios';
function PoPage() {
    const [supplierSelected, setSupplierSelected] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [filterType, setFilterType] = useState('desc');
    const [filterPdLt, setFilterPdLt] = useState(3);
    const [loadingData, setLoadingData] = useState(true);
    const [data, setData] = useState([]);
    const selectStyle = {
        height: '1.75rem',
        color: 'white',
        fontSize: '14px',
        lineHeight: 2,
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4effca60'
        },
        '& .MuiSvgIcon-root': {
            color: '#4effca'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4effca',
        },
        "&:hover": {
            "&& fieldset": {
                border: "1px solid #4effca50"
            }
        }
    }
    const [themeSys, setThemeSys] = useState(true);
    var once = false;
    function StockInHouseVal(props) {
        return <div className='flex justify-end items-center gap-2'>
            <div>
                {
                    props.percent >= 95 && props.percent <= 110 ? <Typography className='text-green-600 font-semibold'> ({props.percent}%)</Typography> : <Typography className='text-red-500 font-semibold'>({props.percent}%)</Typography>
                }
                <NumericFormat value={props.val} displayType='text' thousandSeparator="," className='text-2xl' />
            </div>
        </div>
    }

    const handleGetData = async () => {
        setLoadingData(true);
        const data = await GET_PO({ vender: supplierSelected, startDate: dayjs().format('YYYYMMDD'), endDate: dayjs().add(filterPdLt * 7, 'day').format('YYYYMMDD'), sort: filterType });
        setData(data);
        setLoadingData(false);
    }

    function getListSupplier() {
        return new Promise(resolve => {
            axios.get(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/getSupplier').then((res) => {
                setSupplier(res.data);
                if (supplierSelected == '') {
                    setSupplierSelected(res.data[0].vender)
                }
                resolve(res.data[0].vender)
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    useEffect(() => {
        if (!once) {
            async function getData() {
                // dispatch({ type: 'SET_VENDER', payload: await GetVenders() });
                const supplier = await getListSupplier();
                const data = await GET_PO({ vender: supplier, startDate: dayjs().format('YYYYMMDD'), endDate: dayjs().add(7, 'day').format('YYYYMMDD') });
                setData(data);
                setLoadingData(false);
            }
            getData()
            once = true;
        }
    }, [])
    return (
        <div className='po-page w-full flex'>
            <div className={`overflow-hidden w-full  p-6  ${themeSys ? 'night' : 'light'}`}>
                <div className='flex flex-col w-full h-full box-content'>
                    <div className='flex gap-2 box-filter line-b'>
                        <span className='text-[1rem] text-mtr'>FILTER</span>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label" className='text-[#4effca]'>SUPPLIER</InputLabel>
                            <Select label="SUPPLIER" value={supplierSelected} onChange={(event) => setSupplierSelected(event.target.value)} sx={selectStyle}>
                                {
                                    supplier.map((item, index) => (
                                        <MenuItem value={item.vender} key={index}>{item.venderName} ({item.vender})</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label" className='text-[#4effca]'>View</InputLabel>
                            <Select label="View" value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={selectStyle}>
                                <MenuItem value={'desc'}>PO มากเกิน</MenuItem>
                                <MenuItem value={'asc'}>PO ไม่พอ</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label" className='text-[#4effca]'>PD PLAN</InputLabel>
                            <Select label="PD PLAN" value={filterPdLt} onChange={(e) => setFilterPdLt(e.target.value)} sx={selectStyle}>
                                <MenuItem value={1}>1 Week</MenuItem>
                                <MenuItem value={2}>2 Week</MenuItem>
                                <MenuItem value={3}>3 Week</MenuItem>
                                <MenuItem value={4}>4 Week</MenuItem>
                            </Select>
                        </FormControl>
                        {/* <Button variant='contained' className='min-w-[100px]' onClick={handleGetData}><SearchIcon />Search</Button> */}
                        <div className={`bg-[#4effca] text-[#080b0f] w-fit rounded-[8px] px-[8px] pt-[0px] pb-[4px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] duration-300 shadow-mtr w-fit`} onClick={handleGetData}>
                            <Stack alignItems={'center'} direction={'row'}>
                                <ElectricBoltIcon className='text-[.75vw] mr-1' />
                                <span className='text-center'>ค้นหา</span>
                            </Stack>
                        </div>
                    </div>
                    <div className='h-full w-full text-center p-6'>
                        <div className='flex w-full h-full'>
                            <TableContainer component={Paper}>
                                <Table size='small' className='tbContent' >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>DRAWING NO.</TableCell>
                                            <TableCell>CM</TableCell>
                                            <TableCell>DESCRIPTION</TableCell>
                                            <TableCell>QTY/BOX</TableCell>
                                            <TableCell>UNIT</TableCell>
                                            <TableCell className='font-semibold bg-blue-200'>PERIOD PLAN</TableCell>
                                            <TableCell className='py-3 font-semibold text-center bg-blue-200'>REQUIRE PLAN</TableCell>
                                            <TableCell className='font-semibold text-center '>P/S STOCK</TableCell>
                                            <TableCell className='font-semibold text-center bg-yellow-200'>PO BAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            loadingData ? <TableRow><TableCell colSpan={9}><div className='flex flex-col p-3 justify-center items-center gap-2'><CircularProgress /><span>กำลังโหลดข้อมูล . . .</span></div></TableCell></TableRow> : (
                                                data.length ? data.map((item, index) => {
                                                    return <TableRow key={index}>
                                                        <TableCell className='font-semibold'>{item.PARTNO} </TableCell>
                                                        <TableCell className='font-semibold'>{item.CM}</TableCell>
                                                        <TableCell className='font-semibold'>{(typeof item.PARTNAME != 'undefined' && item.PARTNAME != "null" && item.PARTNAME != null) ? item.PARTNAME : 'PACKAGING'}</TableCell>
                                                        <TableCell className='font-semibold text-right'>{(typeof item.BOX_QTY != 'undefined' && item.BOX_QTY != null) ? <NumericFormat value={item.BOX_QTY} displayType='text' className='text-[14px]' thousandSeparator="," /> : '-'}</TableCell>
                                                        <TableCell className='font-semibold'>{typeof item.UNIT != 'undefined' ? item.UNIT : '-'}</TableCell>
                                                        <TableCell className='font-semibold text-center bg-blue-50'>{dayjs(item.PERIOD_START).format('DD/MM/YYYY')} - {dayjs(item.PERIOD_END).format('DD/MM/YYYY')}</TableCell>
                                                        <TableCell className='text-right font-semibold bg-blue-50'><NumericFormat value={item.PLAN_QTY} displayType='text' className='text-3xl' thousandSeparator="," /></TableCell>
                                                        <TableCell className='text-right font-semibold '><StockInHouseVal percent={item.STOCK_PERCENT} val={item.STOCK} /></TableCell>
                                                        <TableCell className='text-right font-semibold bg-yellow-100'><StockInHouseVal percent={item.PO_PERCENT} val={item.PO} /></TableCell>
                                                    </TableRow>
                                                }) : <TableRow><TableCell colSpan={9} className='text-center p-3'>ไม่พบข้อมูล</TableCell></TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PoPage