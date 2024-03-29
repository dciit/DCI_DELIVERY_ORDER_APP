import React, { useEffect, useState } from 'react'
import '../App.css'
import { Box, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button, Select, Stack, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, IconButton, InputBase, Typography, FormGroup, FormControlLabel, Checkbox, FormLabel, Grid, TextField, List, ListItemButton, ListItemIcon, Collapse, ListItemText, tableCellClasses, Snackbar, Alert, LinearProgress, Badge } from '@mui/material'
import { API_GET_BUYER, API_GET_DO, API_GET_SUPPLIER_BY_BUYER, API_GET_VENDER_MASTERS, API_RUN_DO } from '../Services'
import moment from 'moment/moment'
import LoginPage from '../components/LoginPage'
import { useDispatch, useSelector } from 'react-redux'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import DiamondIcon from '@mui/icons-material/Diamond';
import { TableVirtuoso } from 'react-virtuoso';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import CheckIcon from '@mui/icons-material/Check';
import ButtonItem from '../components/ButtonItem';
import DialogRunDO from '../components/DialogRunDO'
import ExportToExcel from '../components/ExportToExcel'
import PartComponent from '../components/PartComponent'
import CloseIcon from '@mui/icons-material/Close';
import { NumericFormat } from 'react-number-format'
import DialogFilter from '../components/DialogFilter'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import DialogEditDO from '../components/dialog.edit.do'
import { API_PRIVILEGE } from '../ServiceHR'
import CHECK_PRIVILEGE from '../Method'
function DOPage() {
    let prodLead = 0;
    const [loading, setLoading] = useState(true);
    const [openApprDo, setOpenApprDo] = useState(false);
    const [disabledBtnApprDo, setDisabledBtnApprDo] = useState(false);
    const [msgWaitApprDo, setMsgWaitApprDo] = useState('กรุณารอสักครู่ . . .');
    const [RunningCode, setRunningCode] = useState('-');
    const [showBtnRunDo, setShowBtnRunDo] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);
    const [openEditDOVal, setOpenEditDOVal] = useState(false);
    const [dataEditDO, setDataEditDO] = useState({});
    const reducer = useSelector(state => state.mainReducer);
    let VdMasters = reducer.venderMaster;
    const dispatch = useDispatch();
    // const [runcode, setRunCode] = useState('');
    // const [buyer, setBuyer] = useState([]);
    const [loadingRunDO, setLoadingRunDO] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    var startDate = moment().add(-7, 'days').format('YYYY-MM-DD');
    var endDate = moment().add(9, 'days').format('YYYY-MM-DD');
    var fixDate = moment().add(2, 'days');
    var runDate = moment(fixDate.add(1, 'days')).add(7, 'days')
    const [once, setOnce] = useState(false);
    const [themeSys, setThemeSys] = useState(true); // True is Night , Flase is Light
    const [DOResult, setDOResult] = useState();
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [buyerSelected, setBuyerSelected] = useState('41256');
    const [suppliers, setSuppliers] = useState([]);
    const [supplierSelected, setSupplierSelected] = useState('');
    const [venderDelivery, setVenderDelivery] = useState({});
    const reduxPartMaster = useSelector(state => state.mainReducer.partMaster);
    const typeAccout = useSelector(state => state.mainReducer?.typeAccount);
    const empcode = useSelector(state => state.mainReducer.id);
    const [venderSelected, setVenderSelected] = useState([]);
    const reduxPrivilege = useSelector(state => state.mainReducer.privilege);
    const redux = useSelector(state => state.mainReducer);
    useEffect(() => {
        if (!once) {
            init();
            setOnce(true);
        }
    }, [once]);
    useEffect(() => {
        if (Object.keys(dataEditDO).length) {
            if (CHECK_PRIVILEGE(reduxPrivilege, empcode, 'DO', 'DO', 'DVCD', 'EDIT', redux.dvcd).length) {
                setOpenEditDOVal(true);
            } else {
                alert('คุณไม่มีสิทธิในการแก้ไขข้อมูล กรุณาติดต่อ IT (เบียร์ 611)');
            }
        }
    }, [dataEditDO])
    async function init() {
        await initBuyer();
        await initContent();
    }

    async function handleOpenEditDO(row, ymd, doVal) {
        setDataEditDO({
            ymd: ymd,
            partno: row.part,
            doVal: doVal,
            runningCode: RunningCode
        })
    }

    async function initContent() {
        setLoading(true);
        const initPlan = await FN_INIT_PLAN(buyerSelected, supplierSelected);
        setLoading(false);
        setVenderSelected(initPlan);
        setRunningCode(initPlan.nbr);
        setData(initPlan.data);
        setVenderDelivery(initPlan.venderDelivery);
        await FN_INIT_DATA(initPlan.data);
        dispatch({ type: 'SET_PART_MASTER', payload: initPlan.partMaster })
        dispatch({ type: 'SET_VENDER_MASTER', payload: initPlan.venderMaster });
        setColumns(await FN_SET_COLUMN(initPlan.venderSelected));
    }

    // useEffect(() => {
    // if (typeof DOResult != 'undefined' && Object.keys(DOResult).length) {
    //     console.log('effect ')
    //     console.log(DOResult)
    // }
    // }, [DOResult])

    async function initBuyer() {
        var initBuyer = await API_GET_BUYER();
        setBuyers(initBuyer);
    }

    useEffect(() => {
        if (buyers.length) {
            initSupplier();
        }
    }, [buyers]);

    useEffect(() => {
        if (Object.keys(suppliers).length && supplierSelected == '') {
            setSupplierSelected(suppliers[0]?.vdcode)
        }
    }, [suppliers]);

    async function initSupplier() {
        const listSuppliers = await API_GET_SUPPLIER_BY_BUYER({ code: buyerSelected });
        if (reducer.typeAccount == 'supplier') {
            setSuppliers(listSuppliers.filter((v) => (v.vdcode == reducer.id)));
        } else {
            setSuppliers(listSuppliers);
        }
    }

    async function FN_INIT_PLAN(buyer, vd) {
        const res = await API_GET_DO(buyer, vd, startDate, endDate);
        return res;
    }
    function FN_INIT_DATA(API_DATA) {
        if (typeof API_DATA == 'undefined') {
            API_DATA = data;
        }
        let DATA_FORMAT = [];
        let PART_REF = API_DATA[0].partNo;
        let PLAN = [];
        let DO = [];
        let STOCK = [];
        let DOACT = [];
        let PICKLIST = [];
        let PO = [];
        let loop = 0;
        API_DATA.map((item, index) => {
            let PART = item.partNo;
            if (PART_REF != PART || ([...new Set(API_DATA.map(item => item.partNo))].length == 1) && index == (Object.keys(API_DATA).length) - 1) {
                let filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'plan')).length;
                if (filter) {
                    DATA_FORMAT.push({
                        key: typeAccout == 'supplier' ? false : true,
                        vender: item.vender,
                        part: PART_REF,
                        classs: 'planVal',
                        name: 'plan',
                        data: PLAN
                    });
                }
                filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'pickList')).length;
                if (filter) {
                    DATA_FORMAT.push({
                        key: false,
                        part: PART_REF,
                        classs: 'pickList',
                        name: 'pickList',
                        data: PICKLIST
                    });
                }
                filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'do')).length;
                if (filter) {
                    DATA_FORMAT.push({
                        key: typeAccout == 'supplier' ? true : false,
                        part: PART_REF,
                        classs: 'doVal',
                        name: 'do',
                        data: DO,
                        vender: item.vender,
                    });
                }
                filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'stock')).length;
                if (filter) {
                    DATA_FORMAT.push({
                        key: false,
                        part: PART_REF,
                        classs: 'stockSimVal',
                        name: 'stock',
                        data: STOCK
                    });
                }
                filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'doAct')).length;
                if (filter) {
                    DATA_FORMAT.push({
                        key: false,
                        part: PART_REF,
                        classs: 'doAct',
                        name: 'doAct',
                        data: DOACT
                    });
                }
                filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'po')).length;
                if (filter) {
                    DATA_FORMAT.push({
                        key: false,
                        part: PART_REF,
                        classs: 'poVal',
                        name: 'po',
                        data: PO
                    });
                }
                DATA_FORMAT.push({
                    key: false,
                    part: PART_REF,
                    classs: 'line',
                    name: 'line',
                    data: STOCK
                });
                PART_REF = PART;
                PLAN = [];
                DO = [];
                STOCK = [];
                DOACT = [];
                PICKLIST = [];
                PO = [];
            }
            if (moment(item.date).format('DD') == '01') {
                PLAN.push({ date: item.date, value: 0, prev: 0 });
                PICKLIST.push({ date: item.date, value: 0 });
                DO.push({ date: item.date, value: 0 });
                STOCK.push({ date: item.date, value: 0 });
                DOACT.push({ date: item.date, value: 0 });
                PO.push({ date: item.date, value: 0 });
            }
            PLAN.push({ date: item.date, value: item.plan, prev: item.planPrev });
            PICKLIST.push({ date: item.date, value: item.pickList });
            DO.push({ date: item.date, value: item.do });
            STOCK.push({ date: item.date, value: item.stock });
            DOACT.push({ date: item.date, value: item.doAct });
            PO.push({ date: item.date, value: item.po });
            loop++;
        });
        setDOResult(DATA_FORMAT);
        return DATA_FORMAT;
    }
    function FN_SET_COLUMN(vdMaster) {
        var column = [];
        // console.log(vdMaster)
        prodLead = vdMaster[0].vdProdLead - 1;
        endDate = moment().add((prodLead + 7), 'days').format('YYYY-MM-DD');
        var sDate = moment(startDate);
        var fDate = moment(endDate);
        while (!sDate.isSame(fDate)) {
            column.push({
                label: sDate.format('YYYY-MM-DD'),
                date: sDate.format('YYYY-MM-DD'),
                width: 85,
                height: 40,
                type: 'day',
                numeric: false
            });
            sDate.add(1, 'day');
        }
        column.push({
            label: sDate.format('YYYY-MM-DD'),
            date: sDate.format('YYYY-MM-DD'),
            width: 85,
            height: 40,
            type: 'day',
            numeric: false
        });
        return column;
    }
    function VIEW_DO(row, item, dateLoop) {
        prodLead = VdMasters[0].vdProdLead - 1;
        fixDate = moment().add(prodLead, 'days');
        runDate = moment(fixDate.add(1, 'days')).add(7, 'days')
        let val = item.value;
        let date = moment(item.date);
        let vender = row.vender;
        let shortDay = date.format('ddd').toUpperCase();
        let vdDelivery = typeof venderDelivery[vender] != 'undefined' ? venderDelivery[vender] : null;
        let IsHolidayOfVender = (vdDelivery != null && typeof vdDelivery[shortDay] != 'undefined') ? vdDelivery[shortDay] : false;
        let IsHoliday = ['SAT', 'SUN'].includes(shortDay);
        let ThisDay = moment();
        let IsFixDay = (date.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
        let IsRun = (date.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
        var dtLoop = moment(item.date);
        var dtNow = moment()
        let isGradient = false;
        let isDayAfterAfternoon = true;  // หลังบ่าย 3 ของวันสุด้ทายในช่วง FIX
        if (moment(dateLoop).add(1, 'days').format('YYYYMMDD') == fixDate.format('YYYYMMDD')) {
            if (moment().format('HH:mm:ss') < moment(`${fixDate.format('YYYYMMDD')} 150100`).format('HH:mm:ss')) {
                isDayAfterAfternoon = false;
            }
        }
        if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
            if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 15:01:00')) {
                isGradient = true;
            }
        }
        // console.log(IsFixDay, isDayAfterAfternoon)
        var res = <td className={`w-[150px] text-white ${IsHoliday && 'isHoliday'} ${IsHolidayOfVender && 'IsHolidayOfVender'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? 'gradientTbody' : ''}`}>
            {
                val > 0 ? <h2 class="doLineHorizontal"><NumericFormat className={`cursor-pointer ${row.classs}`} displayType='text' allowLeadingZeros thousandSeparator="," value={val} decimalScale={2} onClick={() => (IsFixDay && isDayAfterAfternoon) ? handleOpenEditDO(row, date.format('YYYYMMDD'), val) : (IsFixDay && !isDayAfterAfternoon ? alert('ไม่สามารถแก้ไขได้ ต้องรอหลัง 15:00 ') : false)} /></h2> : (IsHolidayOfVender ? <h2 class="doLineHorizontal" onClick={() => (IsFixDay && isDayAfterAfternoon) ? handleOpenEditDO(row, date.format('YYYYMMDD'), val) : (IsFixDay && !isDayAfterAfternoon ? alert('ไม่สามารถแก้ไขได้ ต้องรอหลัง 15:00 ') : false)}>&nbsp;</h2> : <CloseIcon className={`text-red-500`} />)
            }
        </td>;
        return res;
    }
    function VIEW_PLAN(row, item) {
        let val = item.value;
        let prev = typeof item.prev != 'undefined' ? item.prev : val;
        let PlanIsDiff = false;
        if (val != prev) {
            PlanIsDiff = true;
        }
        let date = moment(item.date);
        let ThisDay = moment();
        let IsHoliday = ['SAT', 'SUN'].includes(date.format('ddd').toUpperCase());
        let IsFixDay = (date.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
        let IsRun = (date.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
        var dtLoop = moment(item.date);
        var dtNow = moment()
        let isGradient = false;
        if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
            if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 15:01:00')) {
                isGradient = true;
            }
        }
        var res = <td className={`w-[150px] text-white ${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? 'gradientTbody' : ''}`}>
            {
                val > 0 ? (val != prev ? <Badge color={`${val > prev ? 'success' : 'error'}`} className={`buget-do cursor-pointer ${row.classs}`} badgeContent={`${val > prev ? '+' : '-'}${val > prev ? (val - prev) : (prev - val)}`} max={9999}>
                    {val}
                </Badge> : <NumericFormat className={`cursor-pointer ${row.classs}`} displayType='text' allowLeadingZeros thousandSeparator="," value={!PlanIsDiff ? val : 999} decimalScale={2} />) : (val == 0 ? '' : <span className='text-red-500 font-semibold'>{val}</span>)
            }
        </td>;
        return res;
    }

    function VIEW_COMMON(row, item) {
        let val = item.value;
        let prev = typeof item.prev != 'undefined' ? item.prev : val;
        let PlanIsDiff = false;
        if (val != prev) {
            PlanIsDiff = true;
        }
        let date = moment(item.date);
        let ThisDay = moment();
        let IsHoliday = ['SAT', 'SUN'].includes(date.format('ddd').toUpperCase());
        let IsFixDay = (date.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
        let IsRun = (date.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
        var dtLoop = moment(item.date);
        var dtNow = moment()
        let isGradient = false;
        if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
            if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 15:01:00')) {
                isGradient = true;
            }
        }
        var res = <td className={`w-[150px] text-white ${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? 'gradientTbody' : ''}`}>
            {
                val > 0 ? (val != prev ? <Badge color={`${val > prev ? 'success' : 'error'}`} className={`buget-do cursor-pointer ${row.classs}`} badgeContent={`${val > prev ? '+' : '-'}${val > prev ? (val - prev) : (prev - val)}`} max={9999}>
                    {val}
                </Badge> : <NumericFormat className={`cursor-pointer ${row.classs}`} displayType='text' allowLeadingZeros thousandSeparator="," value={!PlanIsDiff ? val : 999} decimalScale={2} />) : (val == 0 ? '' : <span className='text-red-500 font-semibold'>{val}</span>)
            }
        </td>;
        return res;
    }
    async function FN_CHANGE_BUYER(empcode) {
        setBuyerSelected(empcode);
        setSuppliers(await API_GET_SUPPLIER_BY_BUYER({ code: empcode }))
    }
    async function confirmApprDo(careHistory = true) {
        setLoadingRunDO(true);
        ApprDo(careHistory);
    }
    function ApprDo(careHistory = true) {
        // API_RUN_DO({ empcode: reducer.id }).then((res) => {
        API_RUN_DO(reducer.id).then((res) => {
            try {
                if (res.nbr != "" && typeof res.nbr != 'undefined') {
                    setRunningCode(res.nbr);
                }
                setMsgWaitApprDo('ออกแผน Delivery Order สำเร็จแล้ว');
                setShowBtnRunDo(true);
                setOpenSnackBar(true);
                setOpenApprDo(false);
                location.reload();
                setDisabledBtnApprDo(false);
                setLoadingRunDO(false);
            } catch (e) {
                console.log(e)
                setDisabledBtnApprDo(false);
                setMsgWaitApprDo('ไม่สามารถออกแผน Delivery Order ได้ กรุณาติดต่อทีมงาน IT (เบียร์ 250)');
                setLoadingRunDO(false);
            }
        })
    }
    return (
        <>
            {
                reducer.login ? <div className={`overflow-hidden w-full  p-6 ${themeSys ? 'night' : 'light'}`}>
                    <Grid container className='sm:h-auto bg-[#181818]  pl-4 line-b'>
                        <Grid item xs={12} className='flex items-center'>
                            {
                                reducer.typeAccount == 'employee' &&
                                <>
                                    <span className='color-mtr'>BUYER</span>
                                    <FormControl fullWidth className=' py-2 px-2 '>
                                        <Select
                                            inputProps={{ readOnly: true }}
                                            size='small'
                                            value={buyerSelected}
                                            onChange={(e) => FN_CHANGE_BUYER(e.target.value)}
                                            sx={{
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
                                            }}
                                        >
                                            {
                                                buyers.map((item, index) => {
                                                    return <MenuItem key={index} value={item.empcode}>({item.empcode}) {item.fullname}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </>
                            }
                            <span className='color-mtr'>SUPPLIER</span>
                            <FormControl fullWidth className=' py-2 px-2'>
                                <Select
                                    // inputProps={{ readOnly: loading }}
                                    size='small'
                                    value={supplierSelected}
                                    onChange={(e) => setSupplierSelected(e.target.value)}
                                    sx={{
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
                                    }}
                                >
                                    {
                                        suppliers.map((item, index) => {
                                            return <MenuItem value={item.vdcode} key={index}>{item.vdname} ({item.vdcode})</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <ButtonItem handle={initContent} handleKey={supplierSelected} label='ค้นหา' icon={<SearchIcon className='md:text-[1.5vw] lg:text-[1vw]  mr-1' />} />
                        </Grid>
                    </Grid>
                    <div className='bg-[#181818] text-[#ffffffc7] pl-3 py-2 font-thin flex   line-b'>
                        <div className='flex items-center gap-2 w-[40%] md:w-[50%] lg:w-[40%]'>
                            <DiamondIcon className='text-yellow-300 ' />
                            <span>&nbsp;D/O RUNNING : </span>
                            <span className='text-[#4effca]'>{RunningCode != '' ? RunningCode : '-'}</span>
                            {
                                CHECK_PRIVILEGE(reduxPrivilege, empcode, 'DO', 'DO', 'USER', 'RUNDO', redux.id).length > 0 && <ButtonItem classs='animate-bounce' handle={setOpenApprDo} handleKey={true} icon={<ElectricBoltIcon className='md:text-[1.5vw] lg:text-[1vw] mr-1' />} label='ออกแผน (แก้ไข)' />
                            }
                        </div>
                        <div className='w-[40%]  md:w-[25%] lg:w-[40%]'>
                            {
                                moment() < moment(moment().format('YYYY-MM-DD 15:01:00')) ?
                                    <div className='bg-[#181818] text-center'>
                                        <Typography className='text-white' variant='caption'>WAIT 3PM RUN D/O</Typography>
                                        <LinearProgress className='h-[15px]' />
                                    </div> : ''
                            }
                        </div>
                        <div className='w-[40%]  md:w-[25%] flex justify-end items-center'>
                            <Stack direction={'row'} gap={1}>
                                {
                                    reducer.privilege.some(item => (item.refCode == 'FILTER_DO' && item.note == 'true')) &&
                                    <div>
                                        <div className={`bg-[#4effca] text-[#080b0f] w-fit rounded-[8px] px-[8px] pt-[0px] pb-[4px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] shadow-mtr`} onClick={() => {
                                            setOpenFilter(true);
                                        }}>
                                            <Stack alignItems={'center'} direction={'row'}>
                                                <FilterAltOffOutlinedIcon className='md:text-[1.5vw] lg:text-[1vw] mr-1' />
                                                <span className='text-center'>กรองข้อมูล</span>
                                            </Stack>
                                        </div>
                                    </div>
                                }
                                <ExportToExcel data={data} buyer={buyerSelected} vd={supplierSelected} rn={RunningCode} />
                            </Stack>
                        </div>
                    </div>

                    <div className='flex w-full h-[95%] box-content'>
                        <div className={`h-[95%] w-full text-center pl-6`}>
                            {
                                loading ? <div className='flex flex-col justify-center items-center h-full loading'><CircularProgress style={{ color: '#4effca' }} /><span className=' mt-3'>กำลังโหลดข้อมูล . . .</span></div>
                                    : <TableVirtuoso
                                        id='tbNew'
                                        className={`${themeSys ? 'night' : 'light'}`}
                                        overscan={DOResult?.length}
                                        totalCount={DOResult?.length}
                                        data={DOResult}
                                        fixedHeaderContent={(key, index) => (
                                            <>
                                                <tr key={index}>
                                                    <td rowSpan={4} className='stuck w-[400px]'>
                                                        <div className='flex justify-around'>
                                                            <span>DRAWING NO.</span>
                                                            <span>{moment(startDate).format('MMM').toUpperCase()}</span>
                                                        </div>
                                                    </td>
                                                    {
                                                        columns.map((column, i) => {
                                                            prodLead = VdMasters[0].vdProdLead - 1;
                                                            fixDate = moment().add(prodLead, 'days');
                                                            runDate = moment(fixDate.add(1, 'days')).add(7, 'days');
                                                            let ThisDay = moment();
                                                            let LoopDay = moment(column.date);
                                                            let IsHoliday = ['SAT', 'SUN'].includes(moment(column.date).format('ddd').toUpperCase());
                                                            let IsFixDay = (LoopDay.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && LoopDay.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
                                                            let IsRun = (LoopDay.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && LoopDay.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
                                                            var _ThStartMonth = "";
                                                            var dtLoop = moment(column.date);
                                                            var dtNow = moment()
                                                            if (moment(column.date).format('DD') == "01") {
                                                                _ThStartMonth = <TableCell rowSpan={2} className='text-center w-[200px] start-[200px] text-[1.5rem] stuck text-white thMonth' style={{ width: column.width, padding: 0, height: column.height, borderRight: '1px solid #e0e0e0 !important' }}>{moment(column.date).format('MMM').toUpperCase()}</TableCell>
                                                            }
                                                            let isGradient = false;
                                                            if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
                                                                if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 15:01:00')) {
                                                                    isGradient = true;
                                                                }
                                                            }
                                                            return <>
                                                                {_ThStartMonth}
                                                                <TableCell
                                                                    className={`${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? 'gradient' : ''}`}
                                                                    key={i}
                                                                    align={column.numeric || false ? 'center' : 'center'}
                                                                    style={{ width: column.width, padding: 0, height: column.height, maxWidth: '75px' }}
                                                                >
                                                                    {
                                                                        column.type == 'day' && moment(column.label).format('ddd')
                                                                    }
                                                                </TableCell></>
                                                        })
                                                    }

                                                </tr>
                                                <tr>
                                                    {
                                                        columns.map((column, i) => {
                                                            let ThisDay = moment();
                                                            let LoopDay = moment(column.date);
                                                            let IsHoliday = ['SAT', 'SUN'].includes(moment(column.date).format('ddd').toUpperCase());
                                                            let IsFixDay = (LoopDay.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && LoopDay.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
                                                            let IsRun = (LoopDay.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && LoopDay.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
                                                            var dtLoop = moment(column.date);
                                                            var dtNow = moment()
                                                            let isGradient = false;
                                                            if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
                                                                if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 15:01:00')) {
                                                                    isGradient = true;
                                                                }
                                                            }
                                                            return <TableCell
                                                                className={`${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? 'gradient' : ''}`}
                                                                key={i}
                                                                align={column.numeric || false ? 'center' : 'center'}
                                                                style={{ width: column.width, padding: 0, height: column.height }}
                                                            >
                                                                {
                                                                    column.type == 'day' && moment(column.label).format('D')
                                                                }
                                                            </TableCell>
                                                        })
                                                    }
                                                </tr>
                                            </>
                                        )}
                                        itemContent={(index, item) => {
                                            let title = '';
                                            if (item.name == 'plan') {
                                                title = <span class={`title ${item.name}`}>Prod Plan (Plan * BOM)</span>;
                                            } else if (item.name == 'do') {
                                                title = <span class={`title ${item.name}`}>D/O Plan</span>;
                                            } else if (item.name == 'stock') {
                                                title = <span class={`title ${item.name}`}>P/S Stock Simulate</span>;
                                            } else if (item.name == 'pickList') {
                                                title = <span class={`title ${item.name}`}>Picklist</span>;
                                            } else if (item.name == 'doAct') {
                                                title = <span class={`title ${item.name}`}>D/O Act.</span>;
                                            } else if (item.name == 'po') {
                                                title = <span class={`title ${item.name}`}>PO</span>;
                                            }
                                            if (item.data.length) {
                                                return <>
                                                    <td className={`${item.name == 'line' && 'td-line'} stuck ${item.key ? 'z-50' : ''}`}>
                                                        <Stack direction={'row'} className='w-[400px]'>
                                                            <PartComponent part={item} master={reduxPartMaster} />
                                                            <div className={`box-title text-right w-[200px]`}>
                                                                {title}
                                                            </div>
                                                        </Stack>
                                                    </td>

                                                    {
                                                        item.name != 'line' ? item.data.map((i, index) => {
                                                            let view = '';
                                                            if (item.name == 'plan') {
                                                                view = VIEW_PLAN(item, i, index)
                                                            } else if (item.name == 'do') {
                                                                view = VIEW_DO(item, i, i.date);
                                                            } else if (item.name == 'stock') {
                                                                view = VIEW_COMMON(item, i, index);
                                                            } else if (item.name == 'pickList') {
                                                                view = VIEW_COMMON(item, i, index);
                                                            } else if (item.name == 'doAct') {
                                                                view = VIEW_COMMON(item, i, index);
                                                            } else if (item.name == 'po') {
                                                                view = VIEW_COMMON(item, i, index);
                                                            }
                                                            return view;
                                                        }) : <td colSpan={30} className='td-line h-[20px]'></td>
                                                    }
                                                </>
                                            }

                                        }}
                                    />
                            }
                        </div >
                    </div>
                    <DialogRunDO handle={() => confirmApprDo(true)} open={openApprDo} close={setOpenApprDo} loading={loadingRunDO} setLoading={setLoadingRunDO} />
                    <DialogFilter open={openFilter} close={setOpenFilter} refresh={FN_INIT_DATA} />
                    <DialogEditDO open={openEditDOVal} close={setOpenEditDOVal} data={dataEditDO} dataDO={DOResult} setDataDO={setDOResult} />
                    {/* <Dialog open={openEditDOVal} onClose={() => setOpenEditDOVal(loadingConfEditDo)} fullWidth maxWidth={'sm'}>
                        <DialogTitle>แก้ไขตัวเลข D/O</DialogTitle>
                        <DialogContent dividers>
                            <div className='py-2'>
                                <p>ID : {doEdit?.id}</p>
                                <p>ร้านค้า : {doEdit?.venderName} ({doEdit?.vender})</p>
                                <p>จำนวนต่อกล่อง : {doEdit?.partQtyBox}</p>
                                <p>จำนวนขั้นต่ำที่ร้านค้าส่งของ : {doEdit?.vdMinDelivery}</p>
                                <p>จำนวนสูงสุดที่ร้านค้าส่งของ : {doEdit?.vdMaxDelivery < 99999 ? doEdit?.vdMaxDelivery : '-'}</p>
                                <p>หน่วย : {doEdit?.partUnit}</p>
                                <p>จำนวนกล่องสำหรับขนส่ง : {doEdit?.doVal / doEdit?.partQtyBox}</p>
                                <p>จำนวนเดิมที่ระบบออก D/O : {doEdit?.doVal}</p>
                            </div>
                            <TextField
                                size="small"
                                type="text"
                                label="จำนวน D/O ที่กำลังแก้ไข" value={doEdit?.doEdit} onChange={(e) => {
                                    setDoEdit({ ...doEdit, doEdit: e.target.value })
                                }} autoFocus focused fullWidth />
                            <div>
                                <span className='text-red-500'>{textAlarm}</span>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setTextAlarm('');
                                setLoadingConfEditDo(false);
                                setOpenEditDOVal(false)
                            }}>ปิดหน้าต่าง</Button>
                            <LoadingButton loading={loadingConfEditDo} loadingPosition='start' startIcon={<CheckIcon />} variant='contained' onClick={(e) => handleConfirmEdit(doEdit.partno)}>บันทึก</LoadingButton>
                        </DialogActions>
                    </Dialog> */}
                    <Snackbar autoHideDuration={6000} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
                        <Alert onClose={() => setOpenSnackBar(false)} severity="success">
                            ออกแผน Delivery Order สำเร็จแล้ว
                        </Alert>
                    </Snackbar>
                </div > : <LoginPage />
            }
        </>
    )
}

export default DOPage
