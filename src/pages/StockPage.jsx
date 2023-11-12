import { Button, ButtonGroup, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import axios from 'axios';
import { GET_STOCK, ServiceGetPlan } from '../Services';
import dayjs from 'dayjs';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { makeStyles } from '@mui/styles';
function PartPage() {
    const [supplierSelected, setSupplierSelected] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [filterType, setFilterType] = useState('stock-more');
    const [filterPdLt, setFilterPdLt] = useState(1);
    const [loadingData, setLoadingData] = useState(true);
    const [master, setMaster] = useState([]);
    const [data, setData] = useState([]);
    const [dataDefault, setDataDefault] = useState([]);
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

    function StockInHouseVal(props) {
        var percent = ((props.stock / props.usage) * 100).toFixed(2);
        if (props.usage == 0) {
            percent = 0;
        }
        return <div className='flex justify-end items-center gap-2'>
            <div>
                {
                    percent > 100 ? <Typography className='text-red-500 font-semibold'>({percent}%)</Typography> : <Typography className='text-green-600 font-semibold'>({percent}%)</Typography>
                }
                <NumericFormat value={props.stock} displayType='text' thousandSeparator="," className='text-2xl' />
            </div>
        </div>
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
    function getPlan(supplier = '') {
        var planBuff = {}
        var dtNow = dayjs().format('YYYYMMDD');
        var dtTo = dayjs(dtNow).add(filterPdLt, 'day').format('YYYYMMDD');
        setLoadingData(true);
        ServiceGetPlan(supplier).then((res) => {
            console.log(res.data)
            setDataDefault(res.data.data);
            var masterBuff = res.data.master;
            var dtLoop = dayjs();
            var dataBuff = (res.data.data).filter(item => {
                dtLoop = dayjs(item.date).format('YYYYMMDD');
                var stock = 0;
                if (typeof planBuff[item.part] == 'undefined') {
                    planBuff[item.part] = {
                        stock: 0,
                        plan: 0,
                        desc: masterBuff[item.part]?.partDesc,
                        cm: masterBuff[item.part]?.partCm,
                        unit: masterBuff[item.part]?.partUnit,
                        code: item.part,
                        boxQty: masterBuff[item.part]?.partQtyBox,
                        period: dayjs(dtNow).format('DD/MM/YYYY') + ' - ' + dayjs(dtTo).format('DD/MM/YYYY')
                    };
                }
                if (dtLoop == dtNow) {
                    stock = item.stock;
                    planBuff[item.part]['stock'] = stock;
                }
                if (dtLoop >= dtNow && dtLoop <= dtTo) {
                    planBuff[item.part]['plan'] = planBuff[item.part]['plan'] + parseFloat(item.plan);
                }
                return dtLoop >= dtNow && dtLoop <= dtTo;
            })
            var dataFinal = [];
            Object.keys(planBuff).forEach(element => {
                let percent = ((planBuff[element].stock / planBuff[element].plan) * 100).toFixed(2);
                if (planBuff[element].plan == 0) {
                    percent = 100;
                }
                planBuff[element]['percent'] = percent;
                dataFinal.push(planBuff[element])
            });
            if (filterType == 'stock-more') {
                dataFinal = dataFinal.sort((a, b) => (parseFloat(a.percent) > parseFloat(b.percent)) ? -1 : 1);
            } else {
                dataFinal = dataFinal.sort((a, b) => (parseFloat(a.percent) > parseFloat(b.percent)) ? 1 : -1);
            }
            setData(dataFinal);
            setMaster(res.data.master)
            setLoadingData(false);
        })
    }
    const handleChangeSupplier = event => {
        setSupplierSelected(event.target.value);
    }
    const handleChangeFilterType = event => {
        setFilterType(event.target.value);
    }
    const handleChangeFilterPdLt = event => {
        setFilterPdLt(event.target.value);
        var planBuff = {}
        var dtLoop = dayjs();
        var dtNow = dayjs().format('YYYYMMDD');
        var dtTo = dayjs(dtNow).add(event.target.value, 'day').format('YYYYMMDD');
        (res.data.data).filter(item => {
            dtLoop = dayjs(item.date).format('YYYYMMDD');
            var stock = 0;
            if (typeof planBuff[item.part] == 'undefined') {
                planBuff[item.part] = {
                    stock: 0,
                    plan: 0,
                    desc: master[item.part].partDesc,
                    cm: master[item.part].partCm,
                    unit: master[item.part].partUnit,
                    code: item.part,
                    boxQty: master[item.part]?.partQtyBox,
                    period: dayjs(dtNow).format('DD/MM/YYYY') + ' - ' + dayjs(dtTo).format('DD/MM/YYYY')
                };
            }
            if (dtLoop == dtNow) {
                stock = item.stock;
                planBuff[item.part]['stock'] = stock;
            }
            if (dtLoop >= dtNow && dtLoop <= dtTo) {
                planBuff[item.part]['plan'] = planBuff[item.part]['plan'] + parseFloat(item.plan);
            }
            return dtLoop >= dtNow && dtLoop <= dtTo;
        })
        var dataFinal = [];
        Object.keys(planBuff).forEach(element => {
            dataFinal.push(planBuff[element])
        });
        setData(dataFinal);
    }
    const handleGetData = () => {
        getPlan(supplierSelected);
    }
    const [themeSys, setThemeSys] = useState(true);
    const tbStyle = makeStyles({
        table: {
            "& .MuiTableCell-root": {
                border: '1px solid black'
            }
        }
    })
    var once = false;
    useEffect(() => {
        async function getData() {
            const supplier = await getListSupplier();
            const data = await GET_STOCK({ vender: supplier, startDate: dayjs().format('YYYYMMDD'), endDate: dayjs().add(7, 'day').format('YYYYMMDD') });
            setData(data);
            setLoadingData(false);
        }
        if (!once) {
            getData();
            once = true;
        }
    }, [])

    return (
        <div className='stock-page w-full flex'>
            <div className={`overflow-hidden w-full p-6  ${themeSys ? 'night' : 'light'}`}>
                <div className='flex flex-col w-full h-full box-content'>
                    <div className='flex gap-2 box-filter line-b'>
                        <span className='text-[1rem] text-mtr'>FILTER</span>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label">SUPPLIER</InputLabel>
                            <Select label="SUPPLIER" value={supplierSelected} onChange={handleChangeSupplier} sx={selectStyle}>
                                {
                                    supplier.map((item, index) => (
                                        <MenuItem value={item.vender} key={item.vender}>{item.venderName} ({item.vender})</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label">View</InputLabel>
                            <Select label="View" value={filterType} onChange={handleChangeFilterType} sx={selectStyle}>
                                <MenuItem value={'stock-more'}>Stock มาก</MenuItem>
                                <MenuItem value={'stock-less'}>Stock น้อย</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size='small' focused>
                            <InputLabel id="demo-simple-select-label">PD/LT</InputLabel>
                            <Select label="PD/LT" value={filterPdLt} onChange={handleChangeFilterPdLt} sx={selectStyle}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                            </Select>
                        </FormControl>
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
                                <Table size='small' className={`tbContent tbBorder`}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='font-semibold text-center'>DRAWING NO.</TableCell>
                                            <TableCell className='font-semibold text-center'>CM</TableCell>
                                            <TableCell className='font-semibold text-center'>DESCRIPTION</TableCell>
                                            <TableCell className='font-semibold text-center '>QTY/BOX</TableCell>
                                            <TableCell className='font-semibold text-center'>UNIT</TableCell>
                                            <TableCell className='font-semibold text-center bg-blue-200'>PERIOD PLAN</TableCell>
                                            <TableCell className='py-3 font-semibold text-center bg-blue-200'>REQUIRE PLAN</TableCell>
                                            <TableCell className='font-semibold text-center bg-yellow-200'>P/S STOCK</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            loadingData ? <TableRow><TableCell colSpan={8}><div className='flex flex-col p-3 justify-center items-center gap-2'><CircularProgress /><span>กำลังโหลดข้อมูล . . .</span></div></TableCell></TableRow> : (
                                                data.length ? data.map((item, index) => {
                                                    return <TableRow key={index}>
                                                        <TableCell className='font-semibold'>{item.PARTNO} </TableCell>
                                                        <TableCell className='font-semibold'>{item.CM}</TableCell>
                                                        <TableCell className='font-semibold'>{item.PARTNAME != null ? item.PARTNAME : 'PACKAGING'}</TableCell>
                                                        <TableCell className='font-semibold text-right'>{typeof item.BOX_QTY != 'undefined' ? <NumericFormat value={item.BOX_QTY} displayType='text' className='text-[14px]' thousandSeparator="," /> : '-'}</TableCell>
                                                        <TableCell className='font-semibold'>{typeof item.UNIT != 'undefined' ? item.UNIT : '-'}</TableCell>
                                                        <TableCell className='font-semibold text-center bg-blue-50'>{dayjs(item.PERIOD_START).format('DD/MM/YYYY')} - {dayjs(item.PERIOD_END).format('DD/MM/YYYY')} </TableCell>
                                                        <TableCell className='text-right font-semibold bg-blue-50'><NumericFormat value={item.PLAN_QTY} displayType='text' className='text-3xl' thousandSeparator="," /></TableCell>
                                                        <TableCell className='text-right font-semibold bg-yellow-100'><StockInHouseVal usage={item.PLAN_QTY} stock={item.STOCK} /></TableCell>
                                                    </TableRow>
                                                }) : <TableRow><TableCell colSpan={8} className='text-center p-3'>ไม่พบข้อมูล</TableCell></TableRow>
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

export default PartPage