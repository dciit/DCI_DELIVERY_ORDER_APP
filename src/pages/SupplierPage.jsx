import { CircularProgress, FormControl, Grid, IconButton, InputBase, MenuItem, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, tableCellClasses } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { API_GET_DO, API_GET_SUPPLIER_BY_BUYER, ServiceGetPlan, ServiceGetSupplier } from '../Services';
import { NumericFormat } from 'react-number-format';
import SearchIcon from '@mui/icons-material/Search';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { useSelector } from 'react-redux';
import moment from 'moment';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { Button, DatePicker, Select } from 'antd';
import { ExportOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
function SupplierPage() {
    const tableRef = useRef(null);
    const headers = ['Part', 'Cm', 'Decription', 'DEL.DATE', 'TIME', 'W/H NO', 'DEL.PLACE', 'QTY/BOX', 'UNIT', 'D/O QTY', 'PO (Recomment)', 'R/C QTY', 'REMAIN', 'STATUS'
    ]
    const [sDateFilter, setSDateFilter] = useState(moment().format('YYYY-MM-DD'));
    const [fDateFilter, setFDateFilter] = useState(moment().format('YYYY-MM-DD'));
    const [supplierSelected, setSupplierSelected] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [master, setMaster] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    // const [listPO, setListPO] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [dataDefault, setDataDefault] = useState([]);
    const reducer = useSelector(state => state.mainReducer);
    const [textSearch, setTextSearch] = useState('');
    let rData = [];
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
    const handleSearch = () => {
        setLoadingData(true);
        setTextSearch('');
        init();
    }
    useEffect(() => {
        init();
    }, [])

    async function init() {
        await initSupplier();
    }
    useEffect(() => {
        if (supplier.length > 0) {
            loadListDO();
        }
    }, [supplier])

    async function loadListDO() {
        let supplierFilter = supplierSelected == '' ? supplier[0].value : supplierSelected;
        const res = await API_GET_DO('41256', supplierFilter, sDateFilter, fDateFilter);
        setMaster(res.partMaster);
        setDataDefault(res.data);
        res.data.sort(function (a, b) {
            return moment(a.date) - moment(b.date);
        });
        let filterByDate = res.data.filter((v, i) => {
            return moment(v.date).isBetween(sDateFilter, fDateFilter, 'days', '[]');
        });
        // setListPO(res.listPO);
        if (typeof filterByDate == 'object' && Object.keys(filterByDate).length) {
            filterByDate.map((oData, iData) => {
                let partno = oData.partNo;
                let doAct = oData.do;
                let reqPO = doAct;
                if (typeof filterByDate[iData].listpo == 'undefined') {
                    filterByDate[iData].listpo = [];
                }
                if (parseFloat(doAct) > 0) {
                    let oPOs = res.listPO.filter((oPO) => oPO.partno == partno);
                    oPOs.map((_, iPO) => {
                        if (typeof oPOs[iPO].status == 'undefined') {
                            oPOs[iPO].status = 'U';
                        }
                    });
                    oPOs.map((oPO, iPO) => {
                        let calPO = oPO.whblbqty - reqPO;
                        if (oPO.whblbqty > 0) {
                            if (calPO < 0 || calPO == 0) {
                                if (oPO.whblbqty <= reqPO) {
                                    reqPO -= oPOs[iPO].whblbqty;
                                    oPOs[iPO].whblbqty = 0;
                                    oPO.status = 'F';
                                    filterByDate[iData].listpo.push(`${oPO.pono}${oPO.itemno}`);
                                }
                            } else {
                                if (reqPO > 0) {
                                    oPOs[iPO].whblbqty -= reqPO;
                                    if (oPO.whblbqty > 0) {
                                        oPO.status = 'P';
                                        filterByDate[iData].listpo.push(`${oPO.pono}${oPO.itemno}`);
                                    }
                                    reqPO = 0;
                                }
                            }
                        }
                    });
                }
            })
        }
        setSupplierData(filterByDate.filter(x => x.do > 0));
    }
    useEffect(() => {
        setLoadingData(false);
    }, [supplierData])

    async function initSupplier() {
        let typeAccu = typeof reducer.typeAccount != 'undefined' ? reducer.typeAccount : '';
        let id = typeof reducer.id != 'undefined' ? reducer.id : '';
        const RESSuppliers = await API_GET_SUPPLIER_BY_BUYER({ code: '41256', refCode: typeAccu == 'supplier' ? id : '' });
        if (RESSuppliers?.length && supplierSelected == '') {
            setSupplierSelected(RESSuppliers[0].vdcode);
        }
        setSupplier(RESSuppliers);
    }
    return (
        <div className={`h-[100%] flex flex-col p-6 gap-3`}>
            <div className='flex-none flex  gap-2 box-filter line-b '>
                <Stack direction={'row'} gap={2} justifyContent={'space-between'}>
                    <div className='flex items-center gap-2'>
                        <span>Supplier  : </span>
                        <Select className='w-fit' options={supplier.map((o) => ({ value: o.vdcode, label: `${o.vdname} (${o.vdcode})` }))} value={supplierSelected} onChange={(e) => {
                            setSupplierSelected(e);
                        }} />
                    </div>
                </Stack>
                <div className='flex items-center gap-2'>
                    <span>วันที่ : </span>
                    <RangePicker
                        allowClear={false}
                        defaultValue={[dayjs(sDateFilter, dateFormat), dayjs(fDateFilter, dateFormat)]}
                        format={dateFormat}
                        onChange={(_, dateStrings) => {
                            setSDateFilter(dateStrings[0]);
                            setFDateFilter(dateStrings[1]);
                        }}
                    />
                </div>
                <Button type='primary' icon={<SearchOutlined />} onClick={handleSearch} disabled={loadingData}>ค้นหา</Button>
            </div>
            <div className='grow text-center bg-[#f6f6f6] flex flex-col gap-2'>
                <div className='flex-none flex w-full justify-between items-center tag-search'>
                    <div className='flex flex-row gap-2 select-none'>
                        <AirportShuttleIcon className='text-md text-primary' />
                        <Typography className='text-primary '>รายการจัดส่ง</Typography>
                    </div>
                    <Stack direction={'row'} gap={1} alignItems={'center'}>
                        {/* <ExportToExcel data={dataDefault} buyer={buyer} vd={supplierSelected?.value} rn={running} /> */}
                        <DownloadTableExcel
                            filename={`DO-${supplierSelected}`}
                            sheet="D/O"
                            currentTableRef={tableRef.current}
                        >
                            <Button type='primary' icon={<ExportOutlined />} disabled={loadingData}>Export</Button>
                        </DownloadTableExcel>
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
                <div className='grow overflow-auto max-h-[800px]'>
                    <TableContainer component={Paper}>
                        <Table size='small' id="tbContent" ref={tableRef} stickyHeader >
                            <TableHead>
                                <TableRow>
                                    <TableCell width={'100px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>Part</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>CM</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>Title</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>DEL.DATE</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>Time</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>W/H NO</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>DEL.PLACE</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>BOX</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>Unit</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>D/O Qty.</TableCell>
                                    <TableCell width={'125px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>PO rec.</TableCell>
                                    <TableCell width={'30px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>D/O Act.</TableCell>
                                    <TableCell width={'30px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>D/O Rem.</TableCell>
                                    <TableCell width={'40px'} className='bg-[#5c5fc8] text-white text-[12px] p-0 text-center border border-[#5c5fc8]'>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className='text-[12px]'>
                                {
                                    loadingData ? <TableRow>
                                        <TableCell colSpan={15} className='text-center'>
                                            <Stack spacing={1} alignItems={'center'}>
                                                <CircularProgress />
                                                <Typography variant='span'>กำลังโหลดข้อมูล  . . . </Typography>
                                            </Stack>
                                        </TableCell>
                                    </TableRow> : (supplierData.length ? supplierData.map((item, index) => {
                                        let partmaster = master.filter((vMaster) => {
                                            return vMaster.partno == item.partNo;
                                        });
                                        partmaster = partmaster[0];
                                        let partno = item?.partNo;
                                        let doVal = Number(item.do);
                                        let remainVal = doVal - Number((item.doAct != '' && item.doAct != '0') ? item.doAct : 0);
                                        return Object.keys(partmaster).length > 0 ? ((parseFloat(item?.do) && parseFloat(item?.do)) > 0 && <TableRow key={index}>
                                            <TableCell className='text-center align-top border     px-[8px] py-[4px] text-[12px] font-semibold text-primary'>{partno}</TableCell>
                                            <TableCell className='text-center border align-top    px-[8px] py-[4px] text-[12px]'>{partmaster?.cm}</TableCell>
                                            <TableCell className='text-left pl-3 border align-top text-[12px]'>{partmaster?.description}</TableCell>
                                            <TableCell className='text-center border  align-top   px-[8px] py-[4px] text-[12px] font-semibold text-primary'>{moment(item?.date).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell className='text-center border  align-top   px-[8px] py-[4px] text-[12px]'>09:00</TableCell>
                                            <TableCell className='text-center border  align-top   px-[8px] py-[4px] text-[12px]'>W1</TableCell>
                                            <TableCell className='text-center border  align-top   px-[8px] py-[4px] text-[12px]'>PART SUPPLY</TableCell>
                                            <TableCell className='text-right font-semibold p-0 pr-[8px] align-top '><NumericFormat displayType='text' thousandSeparator="," value={partmaster.boxQty} decimalScale={2} /></TableCell>
                                            <TableCell className='text-center border  align-top   px-[8px] py-[4px] text-[12px]'>{partmaster.unit}</TableCell>
                                            <TableCell className='text-right pr-2 font-semibold align-top text-[#5c5fc8]'><NumericFormat displayType='text' thousandSeparator="," value={item.do} decimalScale={2} /></TableCell>
                                            <TableCell className=' border px-[8px] py-[4px] text-[12px] '>
                                                {
                                                    (typeof item.listpo != 'undefined' && item.listpo.length) ? item.listpo.join(', ') : <span className='text-red-500'>**********</span>
                                                }
                                            </TableCell>
                                            <TableCell className={`text-center border align-top   px-[8px] py-[4px]   ${(item.doAct != '' && item.doAct != '0') ? 'text-[#009866]' : ''} font-semibold`}>{(item.doAct != '' && item.doAct != '0' ? Number(item.doAct).toLocaleString('en') : '-')}</TableCell>
                                            <TableCell className={`text-right align-top pr-2 font-semibold ${remainVal < 0 ? 'text-[#009866] bg-[#dffff4]' : 'text-red-500 bg-red-50'}`}>
                                                <span>{remainVal < 0 ? ` ${Math.abs(remainVal).toLocaleString('en')}` : remainVal.toLocaleString('en')}</span>
                                            </TableCell>
                                            <TableCell className='text-center border   px-[8px] py-[4px] text-[12px] bg-orange-400 text-white '>Wait</TableCell>
                                        </TableRow>) :
                                            <TableRow key={index}>
                                                <TableCell className='text-center border     px-[8px] py-[4px] text-[12px] font-semibold'>{item.part}</TableCell>
                                                <TableCell colSpan={15} className='text-center border    px-[8px] py-[4px] text-[12px] font-semibold'>ไม่พบ Part Master</TableCell>
                                            </TableRow>
                                    }) : <TableRow><TableCell colSpan={15} className='text-center border     px-[8px] py-[4px] text-[12px]'>ไม่พบข้อมูล</TableCell></TableRow>)
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    )
}
export default SupplierPage