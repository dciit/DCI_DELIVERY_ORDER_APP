import { Button, CircularProgress, FormControl, Grid, IconButton, InputBase, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, tableCellClasses } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ServiceGetPlan, ServiceGetSupplier } from '../Services';
import axios from 'axios';
import dayjs from 'dayjs';
import { NumericFormat } from 'react-number-format';
import SearchIcon from '@mui/icons-material/Search';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { useDispatch } from 'react-redux';
import moment from 'moment';
import ExportToExcel from '../components/ExportToExcel';
function SupplierPage() {
    const headers = [
        'D/O Date', 'Drawing No', 'Cm', 'Decription', 'D/O NO', 'DEL.DATE', 'TIME', 'W/H NO', 'DEL.PLACE', 'QTY/BOX', 'UNIT', 'D/O QTY', 'R/C QTY', 'REMAIN', 'STATUS'
    ]
    const [sDateFilter, setSDateFilter] = useState(moment().format('YYYY-MM-DD'));
    const [fDateFilter, setFDateFilter] = useState(moment().add(13, 'days').format('YYYY-MM-DD'));
    const [supplierSelected, setSupplierSelected] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [master, setMaster] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const dispatch = useDispatch();
    const [dataDefault, setDataDefault] = useState([]);
    const [themeSys, setThemeSys] = useState(true);
    const reducer = useSelector(state => state.mainReducer);
    const [textSearch, setTextSearch] = useState('');
    const [running, setRunning] = useState('');
    const [buyer, setBuyer] = useState(reducer.id);
    const filterData = (search) => {
        setTextSearch(search);
        const filteredRows = dataDefault.filter((row) => {
            return row.date.toLowerCase().includes(search.toLowerCase()) || row.part.toLowerCase().includes(search.toLowerCase()) || row.partDesc.toLowerCase().includes(search.toLowerCase())
        });
        if (search.length) {
            setSupplierData(filteredRows);
        } else {
            setSupplierData(dataDefault)
        }
    }
    function getListSupplier() {
        return new Promise(resolve => {
            axios.get(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/getSupplier/all').then((res) => {
                var vdSelect = res.data.map((item, index) => (
                    { value: item.VD_CODE, label: (item.VD_DESC + ' (' + item.VD_CODE + ')') }
                ));
                vdSelect = vdSelect.filter(function (el) {
                    return el.value != '' && el.value != null
                })
                vdSelect = reducer.typeAccount == 'supplier' ? vdSelect.filter(item => item.value == reducer.id) : vdSelect;
                setSupplier(vdSelect);
                if (reducer.filter.supplier.vender == '' || reducer.filter.supplier.vender != reducer.id) {
                    dispatch({ type: 'SUPPLIER_PAGE_SET_FILTER', payload: vdSelect[0] })
                }
                resolve(vdSelect[0].value)
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    function getPlan() {
        setLoadingData(true);
        ServiceGetPlan(reducer.filter.supplier.vender.value).then((res) => {
            var sDate = moment(moment(sDateFilter).format('YYYYMMDD')).format('YYYYMMDD');
            var fDate = moment(moment(fDateFilter).format('YYYYMMDD')).format('YYYYMMDD');
            var dataIsShow = res.data.data.filter(x => {
                return moment(x.date).isBetween(sDate, fDate, null, '[]');
            });
            var NewData = dataIsShow.sort((a, b) => (a.date > b.date) ? 1 : -1).filter(item => {
                if (res.data.master != null) {
                    item.partDesc = res.data.master[item.part].partDesc
                }
                item.date = moment(item.date, 'YYYYMMDD').format('DD/MM/YYYY');
                return item.doPlan > 0
            });
            setRunning(res.data.runningCode)
            setDataDefault(NewData);
            setSupplierData(NewData);
            setMaster(res.data.master);
            setLoadingData(false);
            console.log(dataIsShow.length)

        }).catch((err) => {
            console.log(err)
            setMaster(null);
            setLoadingData(false);
        })
    }
    const handleSearch = () => {
        setTextSearch('');
        getPlan();
    }
    var once = false;
    useEffect(() => {
        async function getData() {
            const supplier = await getListSupplier();
            await getPlan(supplier);
        }
        if (!once) {
            getData();
            once = true;
        }
    }, [])

    return (
        <div className='supplier-page w-full flex'>
            <div className={`overflow-hidden w-full p-6  ${themeSys ? 'night' : 'light'}`}>
                <div className='flex flex-col w-full h-full box-content'>
                    <div className='flex gap-2 box-filter line-b'>
                        <Stack direction={'row'} gap={2} justifyContent={'space-between'}>
                            <Stack direction={'row'} alignItems={'center'} gap={1}>
                                <AirportShuttleIcon className='text-md text-[#4effca]' />
                                <FormControl fullWidth>
                                    <Select options={supplier} className='w-full' value={reducer.filter.supplier.vender} defaultValue={reducer.filter.supplier.vender} onChange={(e) => {
                                        setSupplierSelected(e);
                                        dispatch({
                                            type: 'SUPPLIER_PAGE_SET_FILTER', payload: e
                                        })
                                    }} />
                                </FormControl>
                            </Stack>
                            <Stack direction={'row'} alignItems={'center'} gap={1}>
                                <Typography className='text-mtr'>วันที่</Typography>
                                <input type="date" className='rounded-lg px-3 h-full' value={sDateFilter} onChange={(e) => setSDateFilter(e.target.value)} />
                                <Typography className='text-mtr'> - </Typography>
                                <input type="date" className='rounded-lg px-3 h-full' value={fDateFilter} onChange={(e) => setFDateFilter(e.target.value)} />
                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker size sx={{
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
                                        }} />
                                    </DemoContainer>
                                </LocalizationProvider> */}
                            </Stack>
                        </Stack>
                        <div className={`bg-[#4effca] text-[#080b0f] w-fit rounded-[8px] px-[8px] pt-[0px] pb-[4px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] duration-300 shadow-mtr`} onClick={handleSearch}>
                            <Stack alignItems={'center'} direction={'row'}>
                                <ElectricBoltIcon className='text-[.75vw] mr-1' />
                                <span className='text-center'>ค้นหา</span>
                            </Stack>
                        </div>
                    </div>
                    <div className='h-full w-full text-center p-6'>
                        <div className='flex w-full h-full flex-col items-start gap-2 pb-[2em]'>
                            <div className='flex w-full justify-between items-center tag-search'>
                                <Typography className='text-white '>รายการจัดส่ง</Typography>
                                <Stack direction={'row'} gap={1} alignItems={'center'}>
                                    <ExportToExcel data={dataDefault} buyer={buyer} vd={reducer.filter.supplier.vender.value} rn={running} />
                                    <Paper
                                        component="form"
                                        sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', width: 250 }}
                                    >
                                        <InputBase
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="ค้นหาสิ่งที่คุณต้องการ"
                                            inputProps={{ 'aria-label': 'search google maps' }}
                                            value={textSearch}
                                            onChange={(e) => filterData(e.target.value)}
                                        />
                                        <IconButton type="button" sx={{ p: '0px' }} aria-label="search">
                                            <SearchIcon />
                                        </IconButton>
                                    </Paper>
                                </Stack>
                            </div>
                            <TableContainer component={Paper} className='h-fit'>
                                <Table size='small' id="tbContent">
                                    <TableHead>
                                        <TableRow>
                                            {
                                                headers.map((header, index) => (
                                                    <TableCell key={index} >{header.toUpperCase()}</TableCell>
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
                                            </TableRow> : (supplierData.length ? supplierData.map((item, index) => {
                                                return master != null ? <TableRow key={index}>
                                                    <TableCell className='text-center font-semibold'>{item.date}</TableCell>
                                                    <TableCell className='text-center font-semibold'>{item.part}</TableCell>
                                                    <TableCell className='text-center'>{master[item.part]?.partCm}</TableCell>
                                                    <TableCell className='text-left pl-3'>{master[item.part].partDesc}</TableCell>
                                                    <TableCell className='text-center'>-</TableCell>
                                                    <TableCell className='text-center font-semibold'>{item.date}</TableCell>
                                                    <TableCell className='text-center'>09:00</TableCell>
                                                    <TableCell className='text-center'>W1</TableCell>
                                                    <TableCell className='text-center'>PART SUPPLY</TableCell>
                                                    <TableCell className='text-right font-semibold'><NumericFormat displayType='text' thousandSeparator="," value={master[item.part].partQtyBox} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'>{master[item.part].partUnit}</TableCell>
                                                    <TableCell className='text-right font-semibold text-green-600'><NumericFormat displayType='text' thousandSeparator="," value={item.doPlan} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'>-</TableCell>
                                                    <TableCell className='text-right font-semibold text-red-500'><NumericFormat displayType='text' thousandSeparator="," value={item.doPlan} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'><div className='bg-[#ff9800] text-white rounded-lg px-3 py-1'>Pending</div></TableCell>
                                                </TableRow> :
                                                    <TableRow key={index}>
                                                        <TableCell className='text-center font-semibold'>{item.part}</TableCell>
                                                        <TableCell colSpan={15} className='text-center font-semibold'>ไม่พบ Part Master</TableCell>
                                                    </TableRow>
                                            }) : <TableRow><TableCell colSpan={15} className='text-center'>ไม่พบข้อมูล</TableCell></TableRow>)
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

export default SupplierPage