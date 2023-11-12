import React, { useEffect, useState } from 'react'
import '../App.css'
import { Box, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button, Select, Stack, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, IconButton, InputBase, Typography, FormGroup, FormControlLabel, Checkbox, FormLabel, Grid, TextField, List, ListItemButton, ListItemIcon, Collapse, ListItemText, tableCellClasses, Snackbar, Alert } from '@mui/material'
import { ServiceGetBuyer, ServiceGetHisrtoryById, ServiceGetListSupplier, ServiceGetPlan, ServiceGetSupplier, ServiceJWT, ServiceRunDo, UPDATE_DO } from '../Services'
import moment from 'moment/moment'
import LoginPage from '../components/LoginPage'
import { useDispatch, useSelector } from 'react-redux'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import CheckBoxFilter from '../components/CheckBoxFilter'
import DiamondIcon from '@mui/icons-material/Diamond';
import { TableVirtuoso } from 'react-virtuoso';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import CheckIcon from '@mui/icons-material/Check';
import DOItem from '../components/DOItem';
import ButtonItem from '../components/ButtonItem';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import DialogRunDO from '../components/DialogRunDO'
import DialogRunDONew from '../components/DialogRunDONew'
import PartDetailComponent from '../components/PartDetail'
import ExplicitIcon from '@mui/icons-material/Explicit';
import ExportToExcel from '../components/ExportToExcel'
function PlanPage() {
    const [DATA_API, SET_DATA_API] = useState()
    const [columns, setColumns] = useState([]);
    const [master, setMaster] = useState([]);
    const [holiday, setHoliday] = useState([]);
    const [planDefault, setPlanDefault] = useState([]);
    const [ListSupplier, SetListSupplier] = useState([]);
    const [SupplierSelected, SetSupplierSelected] = useState('-');
    const [loading, setLoading] = useState(true);
    const [msgNoData, setMsgNoData] = useState(false);
    const [openApprDo, setOpenApprDo] = useState(false);
    const [openApprDoNew, setOpenApprDoNew] = useState(false);
    const [disabledBtnApprDo, setDisabledBtnApprDo] = useState(false);
    const [msgWaitApprDo, setMsgWaitApprDo] = useState('กรุณารอสักครู่ . . .');
    const [RunningCode, setRunningCode] = useState('-');
    const [showBtnRunDo, setShowBtnRunDo] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);
    const [openEditDOVal, setOpenEditDOVal] = useState(false);
    const reducer = useSelector(state => state.mainReducer);
    const dispatch = useDispatch();
    const [runcode, setRunCode] = useState('');
    const [buyer, setBuyer] = useState([]);
    const [buyerSelected, setBuyerSelected] = useState('41256');
    const [doEdit, setDoEdit] = useState(null);
    const [loadingConfEditDo, setLoadingConfEditDo] = useState(false);
    const [loadingRunDO, setLoadingRunDO] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [textAlarm, setTextAlarm] = useState('');
    var startDate = moment().add(-7, 'days').format('YYYY-MM-DD');
    // var endDate = moment().add(1, 'months').format('YYYY-MM-DD');
    var endDate = moment().add(13, 'days').format('YYYY-MM-DD');
    const checkMinMax = true;
    const [FirstTime, setFirstTime] = useState(true);
    const [themeSys, setThemeSys] = useState(true); // True is Night , Flase is Light

    useEffect(() => {
        if (FirstTime) {
            setShowBtnRunDo(true);
            GetSupplier(buyerSelected);
            // GetSupplier(buyerSelected);
            GetBuyer();
            // GetPlan(SupplierSelected);
            SetColDay();
            setFirstTime(false);
        }
    }, [reducer.login, openEditDOVal]);

    async function GetSupplier(buyer = '') {
        const listSupplier = await ServiceGetListSupplier(buyer);
        var suppliers = listSupplier;
        var selected = '-';
        if (reducer.typeAccount == 'supplier') {
            suppliers = listSupplier.filter(item => item.VD_CODE == reducer.id);
        }
        selected = suppliers[0]['VD_CODE'];
        SetSupplierSelected(selected)
        GetPlan(selected);
        SetListSupplier(suppliers)
    }

    function GetBuyer() {
        ServiceGetBuyer().then((res) => {
            setBuyer(res.data);
        })
    }

    const [dataNew, setDataNew] = useState([]);
    const [dataDefault, setDataDefault] = useState([]);
    function initPlan(param) {
        var data = param.data.data;
        var master = param.data.master;
        var partMstr = Object.keys(master);
        var partNew = [];
        partMstr.forEach(element => {
            var plan = [];
            var doPlan = [];
            var stock = [];
            var picklist = [];
            var prodUse = [];
            var po = [];
            var stockVal = [];
            var doAct = [];
            var wip = [];
            var partno = '';
            var vender = '';
            data.filter(item => item.part == element).forEach(el => {
                plan.push({ date: el.date, value: el.plan, id: el.id, newplan: el.planNow });
                picklist.push({ date: el.date, value: el.picklist, id: el.id });
                prodUse.push({ date: el.date, value: 0, id: el.id });
                doPlan.push({ date: el.date, value: el.doPlan, id: el.id });
                doAct.push({ date: el.date, value: el.doAct, id: el.id });
                stockVal.push({ date: el.date, value: el.stock, id: el.id });
                wip.push({ date: el.date, value: 0, id: el.id });
                po.push({ date: el.date, value: el.po, id: el.id, short: el.poshort });
                stock.push({ date: el.date, value: el.stockSim, id: el.id });
                partno = el.part;
                vender = el.vdCode;
            });
            if (partno != "") {

                if (reducer.titles.filter(title => title.index == 1)[0].checked) {
                    partNew.push({ index: 1, partno: partno, data: plan, class: 'planVal', vender: vender });
                }
                if (reducer.titles.filter(title => title.index == 2)[0].checked) {
                    partNew.push({ index: 2, partno: partno, data: picklist, class: 'pickList' });
                }
                if (reducer.titles.filter(title => title.index == 3)[0].checked) {
                    partNew.push({ index: 3, partno: partno, data: prodUse, class: 'prodUse' });
                }
                if (reducer.titles.filter(title => title.index == 4)[0].checked) {
                    partNew.push({ index: 4, partno: partno, data: doPlan, class: 'doVal' });
                }
                if (reducer.titles.filter(title => title.index == 5)[0].checked) {
                    partNew.push({ index: 5, partno: partno, data: doAct, class: 'doAct' });
                }
                if (reducer.titles.filter(title => title.index == 6)[0].checked) {
                    partNew.push({ index: 6, partno: partno, data: stock, class: 'stockSimVal' });
                }
                if (reducer.titles.filter(title => title.index == 7)[0].checked) {
                    partNew.push({ index: 7, partno: partno, data: po, class: 'poVal' });
                }
                if (reducer.titles.filter(title => title.index == 8)[0].checked) {
                    partNew.push({ index: 8, partno: partno, data: po, class: 'poVal' });
                }
                if (reducer.titles.filter(title => title.index == 9)[0].checked) {
                    partNew.push({ index: 9, partno: partno, data: stockVal, class: 'stockVal' });
                }
                partNew.push({ index: 0, partno: partno, data: stock, class: 'empty' });
            }
        });
        setDataNew(partNew);
    }
    function GetPlan(SupplierCode) {
        SupplierCode = (SupplierCode != "" && typeof SupplierCode != 'undefined' && SupplierCode != '-') ? SupplierCode : SupplierSelected;
        SetSupplierSelected(SupplierCode);
        setLoading(true);
        setMsgNoData(false);
        ServiceGetPlan(SupplierCode, buyerSelected == 'empty' ? '' : buyerSelected, '', '', checkMinMax, reducer.filter.plan.caldowhenstockminus).then((res) => {
            setDataDefault(res.data.data);
            setRunCode(res.data.runningCode);
            setLoading(false);
            setHoliday(res.data.holiday.map(el => el.code));
            setRunningCode(res.data.runningCode != '' ? res.data.runningCode : '-');
            if (Object.keys(res.data.data).length) {
                setMaster(res.data.master);
                initPlan(res);
                SET_DATA_API(res);
                setPlanDefault(res.data.data);
                dispatch({ type: 'INIT_PLAN', payload: res.data.data })
            } else {
                setMsgNoData(true);
                setPlanDefault([]);
                setPlan([]);
            }
        }).catch((error) => {
            setLoading(false);
            setMsgNoData(true);
        });
    }
    function SetColDay() {
        var column = [];
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
        setColumns(column);
    }
    const handleConfirmEdit = (partno) => {
        if (doEdit.doEdit < 0) {
            doEdit.doEdit = 0;
            setDoEdit(doEdit);
            return false;
        }
        setLoadingConfEditDo(true);
        doEdit.doPlan = doEdit.doEdit;
        async function CALL_UPDATE_DO() {
            const res = await UPDATE_DO({ id: doEdit.id, partNo: doEdit.partNo, doEdit: parseFloat(doEdit.doEdit), empCode: reducer.id });
            if (res.status) {
                ServiceGetPlan(SupplierSelected, buyerSelected == 'empty' ? '' : buyerSelected, '', '', checkMinMax).then((res) => {
                    setLoadingConfEditDo(false);
                    setOpenEditDOVal(false);
                });
            } else {
                setTextAlarm('* ' + res.message);
                setLoadingConfEditDo(false);
            }

        }
        CALL_UPDATE_DO();
    }

    const handleEditDo = (historyId) => {
        ServiceGetHisrtoryById(historyId).then((res) => {
            var res = res.data;
            if (typeof res.doEdit == 'undefined') {
                res['doEdit'] = 0;
            }
            res.doEdit = res.doVal;
            var vdDetail = ListSupplier.filter(item => item.vender == res.vdCode);
            var partDetail = master[res.partno]
            if (Object.keys(vdDetail).length) {
                vdDetail = vdDetail[0];
            }
            setDoEdit({ ...res, ...vdDetail, ...partDetail });
            setLoadingConfEditDo(false);
            setOpenEditDOVal(true);
        })
    }
    function isHoliday(days) {
        return moment(days, 'YYYY-MM-DD').format('ddd');
    }
    function styleDay(column) {
        var diff = moment(column.date).diff(moment().format('YYYY-MM-DD'), 'days');
        if (diff == 0) {
            return 'today';
        } else if (diff > 0 && diff <= 6) {
            return 'fix';
        } else if (diff > 6 && diff < 14) {
            return 'do';
        } else {
            return column.label;
        }
    }

    function ApprDo(careHistory = true) {
        ServiceRunDo({ plan: planDefault, master: master, careHistory: careHistory }).then((res) => {
            try {
                if (res.status == 200) {
                    if (res.data.runningCode != "" && typeof res.data.runningCode != 'undefined') {
                        setRunningCode(res.data.runningCode);
                    }
                    setMsgWaitApprDo('ออกแผน Delivery Order สำเร็จแล้ว');
                    setShowBtnRunDo(true);
                    setOpenSnackBar(true);
                    setOpenApprDo(false);
                    location.reload();
                } else {
                    setMsgWaitApprDo('ไม่สามารถออกแผน Delivery Order ได้ กรุณาติดต่อทีมงาน IT (เบียร์ 250)');
                }
                setDisabledBtnApprDo(false);
                setLoadingRunDO(false);
            } catch (e) {
                setDisabledBtnApprDo(false);
                setMsgWaitApprDo('ไม่สามารถออกแผน Delivery Order ได้ กรุณาติดต่อทีมงาน IT (เบียร์ 250)');
                setLoadingRunDO(false);
            }
        })
    }
    const confirmApprDo = (careHistory = true) => {
        setLoadingRunDO(true);
        ApprDo(careHistory);
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
                                            size='small'
                                            value={buyerSelected}
                                            onChange={(e) => {
                                                setBuyerSelected(e.target.value);
                                                GetSupplier(e.target.value);
                                            }}
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
                                            {/* <MenuItem value='empty'>-</MenuItem> */}
                                            {
                                                buyer.map((item, index) => (
                                                    <MenuItem key={index} value={item.CODE}>{item.NAME} ({item.CODE})</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </>
                            }
                            <span className='color-mtr'>SUPPLIER</span>
                            <FormControl fullWidth className=' py-2 px-2'>
                                <Select
                                    inputProps={{ readOnly: loading }}
                                    size='small'
                                    value={SupplierSelected}
                                    onChange={(e) => SetSupplierSelected(e.target.value)}
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
                                        reducer.typeAccount == 'employee' && <MenuItem value='-'>--- ALL ---</MenuItem>
                                    }
                                    {
                                        ListSupplier.map((sp) => {
                                            return <MenuItem value={sp.VD_CODE} key={sp.VD_CODE}>{sp.VD_DESC} ({sp.VD_CODE})</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <ButtonItem handle={GetPlan} handleKey={SupplierSelected} label='ค้นหา' icon={<SearchIcon className='md:text-[1.5vw] lg:text-[1vw]  mr-1' />} />
                        </Grid>
                    </Grid>
                    <div className='bg-[#181818] text-[#ffffffc7] pl-3 py-2 font-thin flex justify-between line-b'>
                        <div className='flex items-center gap-2'>
                            <DiamondIcon className='text-yellow-300 ' />
                            <span>&nbsp;D/O RUNNING : </span>
                            <span className='text-[#4effca]'>{RunningCode != '' ? RunningCode : '-'}</span>
                            {
                                reducer.privilege.some(item => (item.refCode == 'BTN_RUN_DO' && item.note == 'true')) && <ButtonItem classs='animate-bounce' handle={setOpenApprDo} handleKey={true} icon={<ElectricBoltIcon className='md:text-[1.5vw] lg:text-[1vw] mr-1' />} label='ออกแผน (แก้ไข)' />
                            }
                        </div>
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
                            <ExportToExcel data={dataDefault} buyer={buyerSelected} vd={SupplierSelected} rn={RunningCode} />
                        </Stack>
                    </div>
                    <div className='flex w-full h-[95%] box-content'>
                        <div className={`h-[95%] w-full text-center pl-6`}>
                            {
                                loading ? <div className='flex flex-col justify-center items-center h-full loading'><CircularProgress style={{ color: '#4effca' }} /><span className=' mt-3'>กำลังโหลดข้อมูล . . .</span></div> : <>
                                    {
                                        msgNoData ? <div className=' h-full flex items-center justify-center text-not-found'>ไม่พบข้อมูลการผลิต . . . </div> :
                                            <>
                                                <TableVirtuoso
                                                    id='tbNew'
                                                    className={`${themeSys ? 'night' : 'light'}`}
                                                    overscan={dataNew.length}
                                                    totalCount={dataNew.length}
                                                    data={dataNew}
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
                                                                        var _ThStartMonth = "";
                                                                        if (moment(column.date).format('DD') == "01") {
                                                                            _ThStartMonth = <TableCell rowSpan={2} className='text-center w-[200px] start-[200px] text-[1.5rem] stuck text-white thMonth' style={{ width: column.width, padding: 0, height: column.height, borderRight: '1px solid #e0e0e0 !important' }}>{moment(column.date).format('MMM').toUpperCase()}</TableCell>
                                                                        }
                                                                        return <>
                                                                            {_ThStartMonth}
                                                                            <TableCell
                                                                                className={`${isHoliday(column.label)} ${styleDay(column)} `}
                                                                                key={i}
                                                                                variant="head"
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
                                                                    columns.map((column, i) => (
                                                                        <TableCell
                                                                            className={`${isHoliday(column.label)} ${styleDay(column)}`}
                                                                            key={i}
                                                                            align={column.numeric || false ? 'center' : 'center'}
                                                                            style={{ width: column.width, padding: 0, height: column.height }}
                                                                        >
                                                                            {
                                                                                column.type == 'day' && moment(column.label).format('D')
                                                                            }
                                                                        </TableCell>
                                                                    ))
                                                                }
                                                            </tr>
                                                        </>
                                                    )}
                                                    itemContent={(index, item) => {
                                                        return <>
                                                            {
                                                                item.index != 0 ? (
                                                                    <>
                                                                        {
                                                                            reducer.titles.filter((title) => title.index == item.index)[0].checked &&
                                                                            <>
                                                                                <td className={`stuck ${(item.index - 1 == 0) ? 'z-50' : 'z-0'}`}>
                                                                                    <div className={`${reducer.typeAccount != 'employee' && 'h-[3em]'} `}>
                                                                                        <PartDetailComponent item={item} master={master} suppliers={ListSupplier} />
                                                                                    </div>
                                                                                </td>
                                                                                {
                                                                                    item.data.map((data, index) => {
                                                                                        var delivery = true;
                                                                                        var part = item.partno;
                                                                                        if (part != '') {
                                                                                            if (typeof master[part] != 'undefined') {
                                                                                                delivery = master[part]['vd' + dayjs(data.date).format('ddd')];
                                                                                            }
                                                                                        }
                                                                                        return <>
                                                                                            {
                                                                                                moment(data.date).format('DD') == '01' && <td className='tdBetweenMonth'></td>
                                                                                            }
                                                                                            {
                                                                                                <DOItem item={item} data={data} delivery={delivery} holiday={holiday} handle={reducer.typeAccount == 'employee' && handleEditDo} />
                                                                                            }
                                                                                        </>
                                                                                    })
                                                                                }
                                                                            </>
                                                                        }
                                                                    </>
                                                                ) : <td colSpan={41} className='p-0 divider part-divider'>&nbsp;</td>
                                                            }
                                                        </>
                                                    }}
                                                />
                                            </>
                                    }
                                </>
                            }
                        </div >
                    </div>
                    <DialogRunDO handle={() => confirmApprDo(true)} open={openApprDo} close={setOpenApprDo} loading={loadingRunDO} setLoading={setLoadingRunDO} />

                    <DialogRunDONew handle={() => confirmApprDo(false)} open={openApprDoNew} close={setOpenApprDoNew} loading={loadingRunDO} setLoading={setLoadingRunDO} />

                    <Dialog open={openFilter} fullWidth maxWidth={'sm'}>
                        <DialogTitle>กรองข้อมูล</DialogTitle>
                        <DialogContent dividers>
                            <CheckBoxFilter initPlan={initPlan} data={DATA_API} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenFilter(false)} >ปิดหน้าต่าง</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openEditDOVal} onClose={() => setOpenEditDOVal(loadingConfEditDo)} fullWidth maxWidth={'sm'}>
                        <DialogTitle>แก้ไขตัวเลข D/O</DialogTitle>
                        <DialogContent dividers>
                            {/* <TextField label='Supplier' focused size='small' value={editContent?.vdCode} inputProps={{ readOnly: true }} /> */}
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
                    </Dialog>
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

export default PlanPage
