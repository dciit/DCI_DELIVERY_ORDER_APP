import { Button, CircularProgress, FormControl, Grid, IconButton, InputBase, MenuItem, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, tableCellClasses } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { API_GET_DO, API_GET_SUPPLIER_BY_BUYER, ServiceGetPlan, ServiceGetSupplier } from '../Services';
import { NumericFormat } from 'react-number-format';
import SearchIcon from '@mui/icons-material/Search';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import moment from 'moment';
// import ExportToExcel from '../components/ExportToExcel';
function SupplierPage() {
    const headers = [
        'D/O Date', 'Drawing No', 'Cm', 'Decription', 'D/O NO', 'DEL.DATE', 'TIME', 'W/H NO', 'DEL.PLACE', 'QTY/BOX', 'UNIT', 'D/O QTY', 'R/C QTY', 'REMAIN', 'STATUS'
    ]
    const [sDateFilter, setSDateFilter] = useState(moment().format('YYYY-MM-DD'));
    const [fDateFilter, setFDateFilter] = useState(moment().format('YYYY-MM-DD'));
    const [supplierSelected, setSupplierSelected] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [master, setMaster] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [dataDefault, setDataDefault] = useState([]);
    const [themeSys, setThemeSys] = useState(true);
    const reducer = useSelector(state => state.mainReducer);
    const [textSearch, setTextSearch] = useState('');
    // const [running, setRunning] = useState('');
    // const [buyer, setBuyer] = useState(reducer.id);
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
    // function getListSupplier() {
    //     return new Promise(resolve => {
    //         axios.get(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/getSupplier/all').then((res) => {
    //             var vdSelect = res.data.map((item, index) => (
    //                 { value: item.VD_CODE, label: (item.VD_DESC + ' (' + item.VD_CODE + ')') }
    //             ));
    //             vdSelect = vdSelect.filter(function (el) {
    //                 return el.value != '' && el.value != null
    //             })
    //             vdSelect = reducer.typeAccount == 'supplier' ? vdSelect.filter(item => item.value == reducer.id) : vdSelect;
    //             setSupplier(vdSelect);
    //             if (reducer.filter.supplier.vender == '' || reducer.filter.supplier.vender != reducer.id) {
    //                 dispatch({ type: 'SUPPLIER_PAGE_SET_FILTER', payload: vdSelect[0] })
    //             }
    //             resolve(vdSelect[0].value)
    //         }).catch((error) => {
    //             console.log(error)
    //         })
    //     })
    // }

    // function getPlan() {
    // setLoadingData(true);
    // ServiceGetPlan(reducer.filter.supplier.vender.value).then((res) => {
    //     var sDate = moment(moment(sDateFilter).format('YYYYMMDD')).format('YYYYMMDD');
    //     var fDate = moment(moment(fDateFilter).format('YYYYMMDD')).format('YYYYMMDD');
    //     var dataIsShow = res.data.data.filter(x => {
    //         return moment(x.date).isBetween(sDate, fDate, null, '[]');
    //     });
    //     var NewData = dataIsShow.sort((a, b) => (a.date > b.date) ? 1 : -1).filter(item => {
    //         if (res.data.master != null) {
    //             item.partDesc = res.data.master[item.part].partDesc
    //         }
    //         item.date = moment(item.date, 'YYYYMMDD').format('DD/MM/YYYY');
    //         return item.doPlan > 0
    //     });
    //     setRunning(res.data.runningCode)
    //     setDataDefault(NewData);
    //     setSupplierData(NewData);
    //     setMaster(res.data.master);
    //     setLoadingData(false);
    // }).catch((err) => {
    //     console.log(err)
    //     setMaster(null);
    //     setLoadingData(false);
    // })
    // }
    const handleSearch = () => {
        setLoadingData(true);
        setTextSearch('');
        init();
    }
    useEffect(() => {
        init();
    }, [])

    async function init() {
        const getDO = await initDO();
        setSupplierData(getDO);
        await initSupplier();
        setLoadingData(false);
    }

    async function initDO() {
        const res = await API_GET_DO('41256', typeof supplierSelected.value ? supplierSelected.value : supplierSelected, sDateFilter, fDateFilter);
        setMaster(res.partMaster);
        res.data.sort(function(a, b) {
            return moment(a.date) - moment(b.date);
        });
        let filterByDate = res.data.filter((v, i) => {
            return moment(v.date).isBetween(sDateFilter, fDateFilter, 'days', '[]');
        });
        return filterByDate
    }

    async function initSupplier() {
        const supplier = await API_GET_SUPPLIER_BY_BUYER({ code: '41256' });
        if (supplier?.length && supplierSelected == '') {
            let firstSupplier = supplier[0];
            setSupplierSelected({ value: firstSupplier.vdcode, label: firstSupplier.vdname });
        }
        let sups = supplier.map((vSup, iSup) => {
            return {
                value: vSup.vdcode,
                label: vSup.vdname
            }
        });
        setSupplier(sups);
    }
    return (
        <div className='supplier-page w-full flex'>
            <div className={`overflow-hidden w-full p-6  ${themeSys ? 'night' : 'light'}`}>
                <div className='flex flex-col w-full h-full box-content'>
                    <div className='flex gap-2 box-filter line-b'>
                        <Stack direction={'row'} gap={2} justifyContent={'space-between'}>
                            <Stack direction={'row'} alignItems={'center'} gap={1}>
                                <AirportShuttleIcon className='text-md text-[#4effca]' />
                                <FormControl fullWidth>
                                    {
                                        !loadingData ? <Select options={supplier} className='w-auto' value={supplierSelected} onChange={(e) => {
                                            setSupplierSelected(e);
                                        }} /> : <Skeleton
                                            sx={{ bgcolor: 'grey.900', borderRadius: '4px' }}
                                            variant="rectangular"
                                            width={350}
                                            height={38}
                                        />
                                    }

                                </FormControl>
                            </Stack>
                            <Stack direction={'row'} alignItems={'center'} gap={1}>
                                <Typography className='text-mtr'>วันที่</Typography>
                                <input type="date" className='rounded-lg px-3 h-full' value={sDateFilter} onChange={(e) => setSDateFilter(e.target.value)} />
                                <Typography className='text-mtr'> - </Typography>
                                <input type="date" className='rounded-lg px-3 h-full' value={fDateFilter} onChange={(e) => setFDateFilter(e.target.value)} />
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
                                    {/* <ExportToExcel data={dataDefault} buyer={buyer} vd={reducer.filter.supplier.vender.value} rn={running} /> */}
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
                                                let partmaster = master.filter((vMaster, iMaster) => {
                                                    return vMaster.partno == item.partNo;
                                                })
                                                partmaster = partmaster[0];
                                                return Object.keys(partmaster).length > 0 ? ((parseFloat(item?.do) && parseFloat(item?.do)) > 0 && <TableRow key={index}>
                                                    <TableCell className='text-center font-semibold'>{moment(item?.date).format('DD/MM/YYYY')}</TableCell>
                                                    <TableCell className='text-center font-semibold'>{item?.partNo}</TableCell>
                                                    <TableCell className='text-center'>{partmaster?.cm}</TableCell>
                                                    <TableCell className='text-left pl-3'>{partmaster?.description}</TableCell>
                                                    <TableCell className='text-center'>-</TableCell>
                                                    <TableCell className='text-center font-semibold'>{moment(item?.date).format('DD/MM/YYYY')}</TableCell>
                                                    <TableCell className='text-center'>09:00</TableCell>
                                                    <TableCell className='text-center'>W1</TableCell>
                                                    <TableCell className='text-center'>PART SUPPLY</TableCell>
                                                    <TableCell className='text-right font-semibold'><NumericFormat displayType='text' thousandSeparator="," value={partmaster.boxQty} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'>{partmaster.unit}</TableCell>
                                                    <TableCell className='text-right font-semibold text-green-600'><NumericFormat displayType='text' thousandSeparator="," value={item.plan} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'>-</TableCell>
                                                    <TableCell className='text-right font-semibold text-red-500'><NumericFormat displayType='text' thousandSeparator="," value={item.do} decimalScale={2} /></TableCell>
                                                    <TableCell className='text-center'><div className='bg-[#ff9800] text-white rounded-lg px-3 py-1'>Pending</div></TableCell>
                                                </TableRow>) :
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