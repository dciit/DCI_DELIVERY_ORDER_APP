import React, { Fragment, useEffect, useState } from 'react'
import '../App.css'
import { Box, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Stack, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, IconButton, InputBase, Typography, FormGroup, FormControlLabel, Checkbox, FormLabel, Grid, TextField, List, ListItemButton, ListItemIcon, Collapse, ListItemText, tableCellClasses, Snackbar, Alert, LinearProgress, Badge, Tooltip } from '@mui/material'
import { API_GET_BUYER, API_GET_DO, API_GET_SUPPLIER_BY_BUYER, API_GET_VENDER_MASTERS, API_RUN_DO, APIGetVenderMaster } from '../Services'
import moment from 'moment/moment'
import LoginPage from '../components/LoginPage'
import { useDispatch, useSelector } from 'react-redux'
import DiamondIcon from '@mui/icons-material/Diamond';
import { TableVirtuoso } from 'react-virtuoso';
// import DialogRunDO from '../components/DialogRunDO'
import ExportToExcel from '../components/ExportToExcel'
import PartComponent from '../components/PartComponent'
import CloseIcon from '@mui/icons-material/Close';
import { NumericFormat } from 'react-number-format'
import DialogFilter from '../components/DialogFilter'
import DialogEditDO from '../components/dialog.edit.do'
import CHECK_PRIVILEGE from '../Method'
import DialogViewPlan from '../components/dialog.view.plan'
import DialogHistoryDO from '../components/dialog.history.do'
import { ToastContainer } from 'react-toastify'
import { Button, Card, Input, Select, Space } from 'antd'
import { FilterOutlined, SearchOutlined, LockOutlined } from '@ant-design/icons'
// import { ContentPasteSearch } from '@mui/icons-material'
import { Popover } from "antd";
import DialogDOWarningPage from '../components/dialog.warning.do'
// import ColumnGroup from 'antd/es/table/ColumnGroup'
function DOPage() {
    let prodLead = 0;

    const [planSelected, setPlanSelected] = useState({});
    const [openViewPlan, setOpenViewPlan] = useState(false);
    const [loading, setLoading] = useState(true);
    // const [openApprDo, setOpenApprDo] = useState(false);
    // const [disabledBtnApprDo, setDisabledBtnApprDo] = useState(false);
    // const [msgWaitApprDo, setMsgWaitApprDo] = useState('กรุณารอสักครู่ . . .');
    const [RunningCode, setRunningCode] = useState('-');
    // const [showBtnRunDo, setShowBtnRunDo] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);
    const [openEditDOVal, setOpenEditDOVal] = useState(false);
    const [dataEditDO, setDataEditDO] = useState({});
    const reducer = useSelector(state => state.mainReducer);
    let VdMasters = reducer.venderMaster;
    const dispatch = useDispatch();
    // const [runcode, setRunCode] = useState('');
    // const [buyer, setBuyer] = useState([]);
    // const [loadingRunDO, setLoadingRunDO] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    var startDate = moment().add(-7, 'days').format('YYYY-MM-DD');
    var endDate = moment().add(9, 'days').format('YYYY-MM-DD');
    var fixDate = moment().add(2, 'days');
    var runDate = moment(fixDate.add(1, 'days')).add(7, 'days')
    const [once, setOnce] = useState(false);
    const [themeSys, setThemeSys] = useState(true); // True is Night , Flase is Light
    const [DOResult, setDOResult] = useState();
    const [DOResoure, setDOResoure] = useState([]);
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
    // const [venderSelected, setVenderSelected] = useState([]);
    const reduxPrivilege = useSelector(state => state.mainReducer.privilege);
    const redux = useSelector(state => state.mainReducer);
    const warningStockPayload = useSelector(state => state.warningStockStateReducer.warningStockState);
    const [paramDialogHistory, setParamDialogHistory] = useState({});
    const [openDialogHistory, setOpenDialogHistory] = useState(false);
    const [search, setSearch] = useState('');
    const [vdMstr, setVdMstr] = useState([]);
    const hiddenPartNoPlan = redux?.hiddenPartNoPlan != undefined ? redux.hiddenPartNoPlan : true;
    const dayCurrent = moment().subtract(8, 'hours')
    const [fixDateAPI, setfixDateAPI] = useState([])
    // const [dciHoliday, setdciHoliday] = useState([])
    const [LastFixDateAPI, setLastFixDateAPI] = useState("")
    // const [openWarning,setOpenWarning] = useState(typeAccout == "employee" ? warningStockPayload.isShowModal : false)
    const [openWarning, setOpenWarning] = useState(false)
    const [Datas, setDatas] = useState({});
    useEffect(() => {
        if (!once) {
            init();
            setOnce(true);

        }
    }, [once]);
    async function init() {
        await initVdMstr();
    }

    const initVdMstr = async () => {
        let RESVdMstr = await APIGetVenderMaster();
        setVdMstr(RESVdMstr);
    }
    useEffect(() => {
        if (vdMstr.length > 0) {
            initBuyer();
        }
    }, [vdMstr])

    useEffect(() => {
        if (buyers.length) {
            initContent();
        }
    }, [buyers])

    async function initBuyer() {
        var RESBuyers = await API_GET_BUYER();
        setBuyers(RESBuyers);
    }
    useEffect(() => {
        if (loading == false) {
            let elBox = document.getElementsByClassName('box-content');
            let boxWidth = 0;
            if (typeof elBox[0] != 'undefined') {
                if (typeof elBox[0].offsetWidth != 'undefined') {
                    boxWidth = elBox[0].offsetWidth;
                }
            }
            let elTb = document.getElementById('tbNew');
            elTb.scrollLeft = boxWidth > 0 ? (boxWidth / 2) : boxWidth;
            setTimeout(() => {

                setSearch(warningStockPayload.partNo)
                dispatch({ type: 'ADJ_WARNING_STOCK_RESET' });

            }, 1500);
        }
    }, [loading])
    useEffect(() => {
        if (Object.keys(dataEditDO).length) {
            if (CHECK_PRIVILEGE(reduxPrivilege, empcode, 'DO', 'DO', 'DVCD', 'EDIT', redux.dvcd).length) {
                setOpenEditDOVal(true);
            } else {
                alert('คุณไม่มีสิทธิในการแก้ไขข้อมูล กรุณาติดต่อ IT (เบียร์ 611)');
            }
        }
    }, [dataEditDO])


    useEffect(() => {
        let filterData = [];
        try {
            filterData = DOResoure.filter((item) => {
                return item.part.toLowerCase().includes(search.toLowerCase())
            })
            setDOResult([...filterData])
        } catch (e) {
            setDOResult(DOResoure);
        }

    }, [search])

    // async function handleOpenEditDO(row, ymd, doVal) {
    //     setDataEditDO({
    //         ymd: ymd,
    //         partno: row.part,
    //         doVal: doVal,
    //         runningCode: RunningCode
    //     })
    // }


    async function initContent() {
        // setSearch('')
        setLoading(true);
        let reduxSupplier = typeof reducer.supplier != 'undefined' ? reducer.supplier : '';

        if (reduxSupplier == '' && warningStockPayload.isRoute != true) {
            reduxSupplier = vdMstr[0]?.vdCode;
            dispatch({ type: 'SET_SUPPLIER', payload: reduxSupplier });
        }
        let vdCode = reducer.typeAccount == 'supplier' ? reducer.id : reduxSupplier;

        vdCode = warningStockPayload.isRoute == true ? warningStockPayload.vdcode : vdCode;
        await setSupplierSelected(vdCode)
        const initPlan = await API_GET_DO(buyerSelected, vdCode, startDate, endDate, hiddenPartNoPlan);
        setDatas(initPlan);
    }
    useEffect(() => {
        if (Object.keys(Datas).length > 0) {
            setLoading(false);
            setRunningCode(Datas.nbr);
            if (search.trim().length > 0) {
                setData(Datas.data.filter(item => item.partNo.toLowerCase().includes(search.toLowerCase())))
                setfixDateAPI(Datas.fixDateYMD)
                setLastFixDateAPI(Datas.fixDateYMD[Datas.fixDateYMD.length - 1])
                // setdciHoliday(Datas.dciHoliday)
            } else {
                setData(Datas.data);
                setfixDateAPI(Datas.fixDateYMD)
                setLastFixDateAPI(Datas.fixDateYMD[Datas.fixDateYMD.length - 1])
                // setdciHoliday(Datas.dciHoliday)
                dispatch({ type: 'SET_FIX_DATE', payload: Datas.fixDateYMD });
            }
            setVenderDelivery(Datas.venderDelivery);
            FN_INIT_DATA(Datas.data);
            dispatch({ type: 'SET_PART_MASTER', payload: Datas.partMaster })
            dispatch({ type: 'SET_VENDER_MASTER', payload: Datas.venderMaster });
            setColumns(FN_SET_COLUMN(Datas.venderSelected));
        }
    }, [Datas])
    useEffect(() => {
        if (supplierSelected != '') {
            dispatch({ type: 'SET_SUPPLIER', payload: supplierSelected });
        }
    }, [supplierSelected])
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
    function FN_INIT_DATA(data) {
        if (typeof data == 'undefined') {
            data = data;
        }
        let DATA_FORMAT = [];
        // let PART_REF = data[0].partNo;
        let PLAN = [];
        let DO = [];
        let STOCK = [];
        let DOACT = [];
        let PICKLIST = [];
        let PO = [];
        let PO_FIFO = [];
        let BOX = [];  // ***** UPDATE 2025/01/28 *****
        let PALLET = []; // ***** UPDATE 2025/01/28 *****
        // let loop = 0;
        new Set(data.map(n => n.partNo)).forEach(part => {
            let filterData = data.filter(o => o.partNo == part);
            let length = filterData.length;
            filterData.forEach((item, iData) => {
                PLAN.push({ date: item.date, value: item.plan, prev: item.planPrev, changePlan: item.changePlan, historyDevPlanQTY: item.historyDevPlanQTY });
                PICKLIST.push({ date: item.date, value: item.pickList });
                DO.push({ date: item.date, value: item.do });
                STOCK.push({ date: item.date, value: item.stock });
                DOACT.push({ date: item.date, value: item.doAct });
                PO.push({ date: item.date, value: item.po });
                PO_FIFO.push({ date: item.date, value: item.pofifo })
                BOX.push({ date: item.date, value: item.box });  // ***** UPDATE 2025/01/28 *****
                PALLET.push({ date: item.date, value: item.pallet })
                if (iData == length - 1) {
                    let filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'plan')).length;
                    if (filter && item.partNo != "TOTAL") {
                        DATA_FORMAT.push({
                            key: typeAccout == 'supplier' ? false : true,
                            vdCode: item.vdCode,
                            vdName: item.vdName,
                            vender: item.vender,
                            part: part,
                            classs: 'planVal',
                            name: 'plan',
                            data: PLAN
                        });
                    }


                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'pickList')).length;
                    if (filter && item.partNo != "TOTAL") {
                        DATA_FORMAT.push({
                            key: false,
                            part: part,
                            classs: 'pickList',
                            name: 'pickList',
                            data: PICKLIST
                        });
                    }

                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'do')).length;

                    if (filter && item.partNo != "TOTAL") {
                        DATA_FORMAT.push({
                            key: typeAccout == 'supplier' ? true : false,
                            part: part,
                            classs: 'doVal',
                            name: 'do',
                            data: DO,
                            vender: item.vender,
                        });
                    }
                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'stock')).length;
                    if (filter && item.partNo != "TOTAL") {
                        DATA_FORMAT.push({
                            key: false,
                            part: part,
                            classs: 'stockSimVal',
                            name: 'stock',
                            data: STOCK
                        });
                    }
                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'doAct')).length;
                    if (filter && item.partNo != "TOTAL") {
                        DATA_FORMAT.push({
                            key: false,
                            part: part,
                            classs: 'doAct',
                            name: 'doAct',
                            data: DOACT
                        });
                    }
                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'po')).length;
                    if (filter && item.partNo != "TOTAL") {
                        DATA_FORMAT.push({
                            key: false,
                            part: part,
                            classs: 'poVal',
                            name: 'po',
                            data: PO
                        });
                    }
                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'pofifo')).length;
                    if (filter && item.partNo != "TOTAL") {
                        DATA_FORMAT.push({
                            key: false,
                            part: part,
                            classs: 'poFifo',
                            name: 'pofifo',
                            data: PO_FIFO
                        });
                    }



                    // ***** UPDATE 2025/01/28 *****
                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'box')).length;
                    if (filter && item.partNo == "TOTAL") {
                        DATA_FORMAT.push({
                            key: true,
                            vdCode: item.vdCode,
                            vdName: item.vdName,
                            vender: item.vender,
                            part: part,
                            classs: 'box',
                            name: 'box',
                            data: BOX
                        });
                    }

                    // ***** UPDATE 2025/01/28 *****
                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'box')).length;
                    if (filter && item.partNo !== "TOTAL") {
                        DATA_FORMAT.push({
                            key: false,
                            part: part,
                            classs: 'box',
                            name: 'box',
                            data: BOX
                        });
                    }


                    // ***** UPDATE 2025/01/28 *****
                    filter = Object.keys(reducer?.filters?.filter(i => i.checked == true && i.name == 'box')).length;

                    if (filter && item.partNo == "TOTAL") {
                        DATA_FORMAT.push({
                            key: false,
                            part: part,
                            classs: 'pallet',
                            name: 'pallet',
                            data: PALLET
                        });
                    }



                    DATA_FORMAT.push({
                        key: false,
                        part: part,
                        classs: 'line',
                        name: 'line',
                        data: STOCK
                    });
                    PLAN = [];
                    DO = [];
                    STOCK = [];
                    DOACT = [];
                    PICKLIST = [];
                    PO = [];
                    PO_FIFO = [];
                    BOX = []; // ***** UPDATE 2025/01/28 *****
                    PALLET = []; // ***** UPDATE 2025/01/28 *****

                }
            })

        })
        setDOResult(DATA_FORMAT);
        setDOResoure(DATA_FORMAT);
        // console.log(DATA_FORMAT)
        return DATA_FORMAT;
    }
    function FN_SET_COLUMN(vdMaster) {
        var column = [];
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
        //console.log(column)
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
        // let ThisDay = moment();
        //let IsFixDay = (date.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
        let IsRun = (date.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
        var dtLoop = moment(item.date);
        var dtNow = moment().subtract(8, 'hours');
        let IsFixDay = fixDateAPI.includes(dtLoop.format('YYYY-MM-DD')) ? true : false;
        // let isdciHoliday = (dciHoliday.includes(dtLoop.format('YYYYMMDD'))) ? false : true;
        // console.log('this date : ' + ThisDay.format('YYYY-MM-DD'));
        // console.log('fix date : ' + fixDate.format('YYYY-MM-DD'));
        // console.log('run date : ' + fixDate.format('YYYY-MM-DD'));


        let isGradient = false;
        // let isDayAfterAfternoon = true;  // หลังบ่าย 3 ของวันสุด้ทายในช่วง FIX
        // if (moment(dateLoop).add(1, 'days').format('YYYYMMDD') == fixDate.format('YYYYMMDD')) {
        //     if (moment().format('HH:mm:ss') < moment(`${fixDate.format('YYYYMMDD')} 150100`).format('HH:mm:ss')) {
        //         isDayAfterAfternoon = false;
        //     }
        // }
        if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
            if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 22:00:00')) {
                isGradient = true;
            }
        }
        let part = row.part;
        let _vdCode = row.vender

        // [24/02/2025] PEERAPONG
        let is_not_delivery = false;
        let str_dt_loop = moment(dateLoop).format('YYYY-MM-DD');
        try {
            if (Datas.list_holiday.includes(str_dt_loop) || Datas.list_no_delivery_in_fixed.includes(str_dt_loop)) {
                is_not_delivery = false;
            } else {
                is_not_delivery = true;
            }
        } catch (e) {
            console.log(e.message)
        }
        // [24/02/2025] PEERAPONG

        // let CanEdit = (IsFixDay == true && IsHolidayOfVender == true && typeAccout == 'employee');
        let CanEdit = ((((moment(dtLoop).format('YYYY-MM-DD')) >= (moment(dayCurrent).format('YYYY-MM-DD'))) && ((moment(dtLoop).format('YYYY-MM-DD')) <= (moment(LastFixDateAPI).format('YYYY-MM-DD')))) && IsHolidayOfVender == true && typeAccout == 'employee');
        var res = <td className={`px-1 w-[150px]  transition-all duration-300 hover:cursor-pointer text-white ${IsHoliday && 'isHoliday'} ${IsHolidayOfVender && 'IsHolidayOfVender'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? ' ' : ''}`} onClick={() => CanEdit == true ? handleHistory(part, date.format('YYYYMMDD'), val, prodLead, _vdCode) : false}>
            {

                is_not_delivery == false ? <Tooltip title='Supplier ไม่ได้ระบุให้ส่งวันนี้'>
                    <div className='flex flex-col items-center justify-center animate-pulse'>
                        <CloseIcon className='text-red-500' /><span className='text-red-500 text-[10px] opacity-80'>[No Delivery]</span>
                    </div>
                </Tooltip> : (
                    val > 0 ? <div className='px-[4px] py-[2px] flex items-center justify-center gap-1 bg-[#0fae76] text-white rounded-md drop-shadow-lg cursor-pointer select-none hover:scale-105 duration-300 transition-all' style={{ border: `${(((moment(dtLoop).format('YYYY-MM-DD')) >= (moment(dayCurrent).format('YYYY-MM-DD'))) && ((moment(dtLoop).format('YYYY-MM-DD')) <= (moment(LastFixDateAPI).format('YYYY-MM-DD')))) ? '2px' : '0px'} solid red` }}>
                        {/* val > 0 ? <div className='px-[4px] py-[2px] flex items-center justify-center gap-1 bg-[#0fae76] text-white rounded-md drop-shadow-lg cursor-pointer select-none hover:scale-105 duration-300 transition-all' style={{ border: `${(IsFixDay) ? '2px' : '0px'} solid red` }}> */}

                        {/* {(IsFixDay) && <LockOutlined />} */}
                        {(((moment(dtLoop).format('YYYY-MM-DD')) >= (moment(dayCurrent).format('YYYY-MM-DD'))) && ((moment(dtLoop).format('YYYY-MM-DD')) <= (moment(LastFixDateAPI).format('YYYY-MM-DD')))) && <LockOutlined />}

                        <span>{val.toLocaleString('en')}  </span>
                    </div> : ''
                )

            }
        </td>;
        return res;
    }
    function handleHistory(part, logToDate, doVal, prodlead, _vdCode) {
        setParamDialogHistory({
            part: part, date: logToDate, do: doVal, prodLead: prodlead, vdCode: _vdCode
        })
    }
    useEffect(() => {
        try {
            if (Object.keys(paramDialogHistory).length > 0) {
                setOpenDialogHistory(true);
            }
        } catch (e) {
            alert(e.message)
        }
    }, [paramDialogHistory])
    useEffect(() => {
        if (openDialogHistory == false) {
            setParamDialogHistory({});
        }
    }, [openDialogHistory])

    const content = (n16, historyDev) => (
        <div>
            <p>แผน Distribute : {historyDev.toLocaleString('en-US')}</p>
            <p>แผนปัจจุบัน (N16) : {n16.toLocaleString('en-US')}</p>

        </div>
    );
    function VIEW_PLAN(row, item) {
        let historyPlanDevQTY = item.historyDevPlanQTY
        let part = row.part;
        let val = item.value;
        let prev = typeof item.prev != 'undefined' ? item.prev : val;
        let PlanIsDiff = false;
        if (val != prev) {
            PlanIsDiff = true;
        }
        let date = moment(item.date);
        let ThisDay = moment();
        let IsHoliday = ['SAT', 'SUN'].includes(date.format('ddd').toUpperCase());
        //let IsFixDay = (date.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
        let IsRun = (date.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
        var dtLoop = moment(item.date);
        var dtNow = moment()
        let isGradient = false;
        let IsFixDay = fixDateAPI.includes(dtLoop.format('YYYY-MM-DD')) ? true : false;


        if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
            if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 22:00:00')) {
                isGradient = true;
            }
        }

        var res = <td className={`w-[150px] text-white ${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? ' ' : ''}`}>

            {item.changePlan &&
                <Popover content={content(val, historyPlanDevQTY)}>
                    <Button className='w-20 text-[14px] bg-[#369495] text-white'>เปลี่ยนแผน !</Button>
                </Popover>
            }
            <br />
            {
                val > 0 ? (val != prev ?

                    '' :
                    <NumericFormat className={`font-['Inter'] font-semibold drop-shadow-md cursor-pointer ${row.classs}`} displayType='text'
                        allowLeadingZeros thousandSeparator="," value={!PlanIsDiff ? val : 999}
                        decimalScale={2} onClick={() => handleShowPlan(dtLoop.format('YYYYMMDD'), part)} />)
                    : (val == 0 ? <span className={` ${item.changePlan && 'text-blue-500 font-semibold'}`}>0</span> : <span className='text-red-500 font-semibold'>{val}</span>)
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
        //let IsFixDay = (date.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
        let IsRun = (date.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
        var dtLoop = moment(item.date);
        var dtNow = moment()
        let isGradient = false;
        let ymdLoop = dtLoop.format('YYYYMMDD');
        let part = row.part;
        let type = row.name;
        let IsFixDay = fixDateAPI.includes(dtLoop.format('YYYY-MM-DD')) ? true : false;

        if (ymdLoop == dtNow.add('days', prodLead).format('YYYYMMDD')) {
            if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 22:00:00')) {
                isGradient = true;
            }
        }
        let ymdNow = moment().format('YYYYMMDD');
        let nStockPervDay = 0;
        if (ymdLoop == ymdNow) {
            let dataGetStock8AM = data.filter(o => moment(o.date).format('YYYYMMDD') == ymdNow && o.partNo == part);
            if (Object.keys(dataGetStock8AM).length) {
                nStockPervDay = (val + dataGetStock8AM[0].plan) - dataGetStock8AM[0].do;
            }
        }
        var res = <td className={`w-[150px]  text-white ${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? ' ' : ''}`}>
            {
                (date.format('YYYYMMDD') == ThisDay.format('YYYYMMDD') && type == 'stock') ? <Stack px={1}>
                    <span className={`${val < 0 ? 'text-red-500' : row.classs} font-bold `}> {val.toLocaleString('en')}</span>
                    <Stack direction={'row'} className='text-[12px] cursor-pointer text-center rounded-md bg-orange-600 px-1 py-1  font-semibold tracking-wider' justifyContent={'center'} >
                        <span>STOCK  :&nbsp;</span>
                        <span>{nStockPervDay.toLocaleString('en')}</span>
                    </Stack>
                </Stack> : (
                    val > 0 ? (val != prev ? <Badge color={`${val > prev ? 'success' : 'error'}`} className={`buget-do cursor-pointer ${row.classs}`} badgeContent={`${val > prev ? '+' : '-'}${val > prev ? (val - prev) : (prev - val)}`} max={9999}>
                        {val}
                    </Badge> : <NumericFormat className={`font-['Inter'] font-semibold  cursor-pointer ${row.classs}`} displayType='text' allowLeadingZeros thousandSeparator="," value={!PlanIsDiff ? val : 999} decimalScale={2} />) : (val == 0 ? '' : <span className='text-red-500 font-semibold'>{Math.round(val * 100) / 100}</span>)
                )
            }
        </td>;
        return res;
    }
    function VIEW_PO_FIFO(row, item) {
        let val = item.value;
        let prev = typeof item.prev != 'undefined' ? item.prev : val;
        // let PlanIsDiff = false;
        if (val != prev) {
            PlanIsDiff = true;
        }
        let date = moment(item.date);
        let ThisDay = moment().subtract(8, 'hours');
        let IsHoliday = ['SAT', 'SUN'].includes(date.format('ddd').toUpperCase());
        //let IsFixDay = (date.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
        let IsRun = (date.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && date.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
        var dtLoop = moment(item.date);
        var dtNow = moment()
        let isGradient = false;
        let ymdLoop = dtLoop.format('YYYYMMDD');
        let IsFixDay = fixDateAPI.includes(dtLoop.format('YYYY-MM-DD')) ? true : false;
        // let part = row.part;
        // let type = row.name;
        if (ymdLoop == dtNow.add('days', prodLead).format('YYYYMMDD')) {
            if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 22:00:00')) {
                isGradient = true;
            }
        }
        // let ymdNow = moment().format('YYYYMMDD');
        // let nStockPervDay = 0;
        // if (ymdLoop == ymdNow) {
        //     let dataGetStock8AM = data.filter(o => moment(o.date).format('YYYYMMDD') == ymdNow && o.partNo == part);
        //     if (Object.keys(dataGetStock8AM).length) {
        //         nStockPervDay = (val + dataGetStock8AM[0].plan) - dataGetStock8AM[0].do;
        //     }
        // }

        var res = <td className={`w-[150px]  text-white ${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? ' ' : ''}`}>
            {
                (ThisDay.format('YYYYMMDD') == date.format('YYYYMMDD') && val == 0) ? <span className='text-red-500 text-[10px]'>[PO FIFO is not available.]</span> : <NumericFormat className={`font-['Inter'] font-semibold  cursor-pointer ${val > 0 ? row.classs : 'text-red-500'}`} displayType='text' thousandSeparator="," value={val != 0 ? val : '0'} decimalScale={2} />
            }
        </td>;
        return res;
    }
    const handleShowPlan = (date, part) => {
        let planSelect = data.filter(o => moment(o.date).format('YYYYMMDD') == date && o.partNo == part);
        if (Object.keys(planSelect).length > 0) {
            setPlanSelected(planSelect);
            setOpenViewPlan(true);
        } else {
            alert('ไม่พบข้อมูลแผนการผลิต ติดต่อเบียร์ IT 611')
        }
    }
    async function FN_CHANGE_BUYER(empcode) {
        setBuyerSelected(empcode);
        setSuppliers(await API_GET_SUPPLIER_BY_BUYER({ code: empcode }))
    }
    // async function confirmApprDo(careHistory = true) {
    //     setLoadingRunDO(true);
    //     Distribution();
    // }
    // function Distribution() {
    //     API_RUN_DO(reducer.id).then((res) => {
    //         try {
    //             if (res.nbr != "" && typeof res.nbr != 'undefined') {
    //                 setRunningCode(res.nbr);
    //             }
    //             setMsgWaitApprDo('ออกแผน Delivery Order สำเร็จแล้ว');
    //             setShowBtnRunDo(true);
    //             setOpenSnackBar(true);
    //             setOpenApprDo(false);
    //             location.reload();
    //             setDisabledBtnApprDo(false);
    //             setLoadingRunDO(false);
    //         } catch (e) {
    //             setDisabledBtnApprDo(false);
    //             setMsgWaitApprDo('ไม่สามารถออกแผน Delivery Order ได้ กรุณาติดต่อทีมงาน IT (เบียร์ 250)');
    //             setLoadingRunDO(false);
    //         }
    //     })
    // }
    return (
        <>
            {
                reducer.login ? <div className={`overflow-hidden w-full  h-[100%] p-3`}>
                    <div className='pl-3 pr-6 py-3 border rounded-t-sm bg-white h-[100%]'>
                        <div className='flex gap-[16px]'>
                            {
                                reducer.typeAccount == 'employee' &&
                                <div className='flex flex-row gap-[8px] justify-center items-center'>
                                    <div className='color-mtr font-bold flex-nowrap'>Buyer</div>
                                    <Select showSearch className='w-full' value={buyerSelected} onChange={(e) => FN_CHANGE_BUYER(e)} options={buyers.map((item) => { return { label: item.fullname, value: item.empcode } })} optionRender={(option) => (
                                        <div >
                                            <span role="img" >{`${option.data.label} (${option.key})`}</span>
                                        </div>
                                    )}></Select>
                                </div>
                            }
                            <div className='flex flex-row items-center gap-[8px]'>
                                <span className='color-mtr font-bold'>Supplier</span>
                                <Select showSearch className='w-full' value={supplierSelected} onChange={(e) => setSupplierSelected(e)} options={suppliers.map((item) => { return { label: item.vdname, value: item.vdcode } })} optionRender={(option) => (
                                    <div >
                                        <span role="img" >{`${option.label} (${option.key})`}</span>
                                    </div>
                                )}></Select>
                            </div>
                            <Button type='primary' onClick={() => initContent(supplierSelected)} icon={<SearchOutlined />} loading={loading}>ค้นหา</Button>
                        </div>
                        <div className='bg-white text-[#ffffffc7] pl-3 py-2 font-thin flex   line-b'>
                            <div className='flex items-center gap-2 w-[40%] md:w-[50%] lg:w-[40%]'>
                                <DiamondIcon className='text-[#5c5fc8] ' />
                                <span className='text-[#5b5b5b]'>&nbsp;D/O Distribute : </span>
                                <span className='text-[#5c5fc8] font-semibold tracking-wider'>{RunningCode != '' ? RunningCode : '-'}</span>
                            </div>
                            <div className='w-[40%]  md:w-[25%] lg:w-[40%]'>
                                {
                                    moment() < moment(moment().format('YYYY-MM-DD 22:00:00')) &&
                                    <div className='text-[#5f5f5f] flex items-center gap-3 h-full border px-6 justify-center rounded-md bg-red-50  ' style={{ border: '1px solid #ef444435' }}>
                                        <span class="relative flex h-3 w-3">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/30 opacity-75"></span>
                                            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                        <span className='text-red-500 font-semibold'>ระบบจะคำนวณยอด D/O ใหม่ เวลา 08:00 น. ของทุกวัน</span>
                                    </div>
                                }
                            </div>
                            <div className='w-[40%]  md:w-[25%] flex justify-end items-center gap-1'>
                                <Button onClick={() => setOpenFilter(true)} icon={<FilterOutlined />}>Filter</Button>
                                <ExportToExcel data={data} buyer={buyerSelected} vd={supplierSelected} rn={RunningCode} />
                            </div>

                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-6 h-4 bg-red-500 rounded-sm shadow-md'></div>
                                    <span>Fixed Day</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-6 h-4 bg-green-600 rounded-sm shadow-md'></div>
                                    <span>Forecast Day</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-6 h-4 bg-black rounded-sm shadow-md'></div>
                                    <span>Holiday</span>
                                </div>
                            </div>
                            <div className='flex justify-end items-center pb-3 pt-1 gap-2'>
                                <small>ค้นหา : </small>
                                <Input placeholder='ค้นหาด้วย Part Name' className='w-fit' onChange={(e) => setSearch(e.target.value)} value={search} allowClear={true} />
                            </div>
                        </div>
                        <div className='flex w-full h-[95%] flex-col box-content border shadow-md'>

                            <div className={`h-[95%] w-full text-center`}  >
                                {
                                    loading ? <div className='flex flex-col justify-center items-center h-full loading'><CircularProgress style={{ color: '#5c5fc8' }} /><span className=' mt-3'>กำลังโหลดข้อมูล . . .</span></div>
                                        : <TableVirtuoso
                                            id='tbNew'
                                            className={`${themeSys ? 'night' : 'light'} h-[95%]`}
                                            overscan={DOResult?.length}
                                            totalCount={DOResult?.length}
                                            data={DOResult}
                                            fixedHeaderContent={() => {
                                                let rnd = Math.floor(Math.random() * 1000000000);
                                                return <>
                                                    <tr key={rnd}>
                                                        <td rowSpan={4} className='stuck w-[400px] bg-white'>
                                                            <div className='flex justify-around'>
                                                                <span>DRAWING NO.</span>
                                                                <span>{moment(startDate).format('MMM').toUpperCase()}</span>
                                                            </div>
                                                        </td>
                                                        {
                                                            columns.map((column, i) => {
                                                                let ymdLoop = moment(column.label).format('YYYYMMDD');
                                                                let ymdNow = moment().format('YYYYMMDD');
                                                                if (ymdLoop == ymdNow) {
                                                                    column.width = '140px';
                                                                }
                                                                var oVdMstr = vdMstr.filter(o => o.vdCode == supplierSelected);
                                                                prodLead = 0;
                                                                if (oVdMstr.length > 0) {
                                                                    prodLead = oVdMstr[0].vdProdLead - 1;
                                                                }
                                                                fixDate = moment().add(prodLead, 'days');
                                                                runDate = moment(fixDate.add(1, 'days')).add(7, 'days');
                                                                // let ThisDay = moment();
                                                                let LoopDay = moment(column.date);
                                                                // let IsHoliday = ['SAT', 'SUN'].includes(moment(column.date).format('ddd').toUpperCase());

                                                                // let IsFixDay = (LoopDay.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && LoopDay.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
                                                                // let IsRun = (LoopDay.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && LoopDay.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
                                                                var _ThStartMonth = "";
                                                                var dtLoop = moment(column.date);
                                                                // var dtNow = moment()
                                                                // let IsFixDay = fixDateAPI.includes(LoopDay.format('YYYY-MM-DD')) ? true : false;
                                                                if (moment(column.date).format('DD') == "01") {
                                                                    _ThStartMonth = <TableCell rowSpan={2} className='text-center bg-white w-[200px] start-[200px] text-[1.5rem] stuck text-white thMonth' style={{ width: column.width, padding: 0, height: column.height, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0 !important' }}>{moment(column.date).format('MMM').toUpperCase()}</TableCell>
                                                                }
                                                                // let isGradient = false;
                                                                // if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
                                                                //     if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 22:00:00')) {
                                                                //         isGradient = true;
                                                                //     }
                                                                // }

                                                                // UPDATE CODE PEERAPONG [24/02/2025]
                                                                let strDtLoop = dtLoop.format('YYYY-MM-DD');
                                                                let startFixed = Datas.startFixed;
                                                                let endFixed = Datas.endFixed;
                                                                let list_delivery_in_fixed = Datas.list_delivery_in_fixed;
                                                                let list_no_delivery_in_fixed = Datas.list_no_delivery_in_fixed;
                                                                let list_holiday = Datas.list_holiday;
                                                                let style = '';
                                                                if (dtLoop > moment(endFixed)) {
                                                                    if (list_holiday.includes(dtLoop.format('YYYY-MM-DD'))) {
                                                                        style = 'bg-black/60 text-white';
                                                                    } else {
                                                                        style = 'bg-[#0fae76] text-white';
                                                                    }
                                                                } else {
                                                                    if (list_delivery_in_fixed.includes(strDtLoop)) {
                                                                        style = 'bg-red-500 text-white';
                                                                    }
                                                                    if (list_no_delivery_in_fixed.includes(strDtLoop)) {
                                                                        style = 'bg-black/60 text-white';
                                                                    }
                                                                    if (dtLoop < moment(startFixed)) {
                                                                        style = 'bg-[#D3D3D3]/40 text-black';
                                                                    }
                                                                }
                                                                // UPDATE CODE PEERAPONG [24/02/2025]


                                                                return <>
                                                                    {/* ${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? ' bg-red-500 text-white' : ''} */}
                                                                    {_ThStartMonth}
                                                                    <TableCell
                                                                        className={`  uppercase ${style}`}
                                                                        key={i}
                                                                        align={column.numeric || false ? 'center' : 'center'}
                                                                        style={{ width: column.width, padding: 0, height: column.height, maxWidth: '140px' }}
                                                                    >
                                                                        {
                                                                            column.type == 'day' && `${moment(column.label).format('ddd')}`
                                                                        }
                                                                    </TableCell></>
                                                            })
                                                        }

                                                    </tr>
                                                    <tr>
                                                        {
                                                            columns.map((column, i) => {
                                                                // let ThisDay = moment();
                                                                let LoopDay = moment(column.date);

                                                                // UPDATE CODE PEERAPONG [24/02/2025]
                                                                let strDtLoop = LoopDay.format('YYYY-MM-DD');
                                                                let startFixed = Datas.startFixed;
                                                                let endFixed = Datas.endFixed;
                                                                let list_delivery_in_fixed = Datas.list_delivery_in_fixed;
                                                                let list_no_delivery_in_fixed = Datas.list_no_delivery_in_fixed;
                                                                let list_holiday = Datas.list_holiday;
                                                                let style = '';
                                                                if (LoopDay > moment(endFixed)) {
                                                                    if (list_holiday.includes(strDtLoop)) {
                                                                        style = 'bg-black/60 text-white';
                                                                    } else {
                                                                        style = 'bg-[#0fae76] text-white';
                                                                    }
                                                                } else {
                                                                    if (list_delivery_in_fixed.includes(strDtLoop)) {
                                                                        style = 'bg-red-500 text-white';
                                                                    }
                                                                    if (list_no_delivery_in_fixed.includes(strDtLoop)) {
                                                                        style = 'bg-black/60 text-white';
                                                                    }
                                                                    if (LoopDay < moment(startFixed)) {
                                                                        style = 'bg-[#D3D3D3]/40 text-black';
                                                                    }
                                                                }
                                                                // let is_forecast = LoopDay > moment(endDate)
                                                                // // UPDATE CODE PEERAPONG [24/02/2025]


                                                                // let IsHoliday = ['SAT', 'SUN'].includes(moment(column.date).format('ddd').toUpperCase());
                                                                // // let IsFixDay = (LoopDay.format('YYYY-MM-DD') >= ThisDay.format('YYYY-MM-DD') && LoopDay.format('YYYY-MM-DD') < fixDate.format('YYYY-MM-DD')) ? true : false;
                                                                // let IsFixDay = fixDateAPI.includes(LoopDay.format('YYYY-MM-DD')) ? true : false;
                                                                // let IsRun = (LoopDay.format('YYYY-MM-DD') >= fixDate.format('YYYY-MM-DD') && LoopDay.format('YYYY-MM-DD') < runDate.format('YYYY-MM-DD')) ? true : false;
                                                                // var dtLoop = moment(column.date);
                                                                // var dtNow = moment()
                                                                // let isGradient = false;
                                                                // if (dtLoop.format('YYYYMMDD') == dtNow.add('days', prodLead).format('YYYYMMDD')) {
                                                                //     if (moment().format('YYYYMMDD HH:mm:ss') < moment().format('YYYYMMDD 22:00:00')) {
                                                                //         isGradient = true;
                                                                //     }
                                                                // }
                                                                // let isdciHoliday = (dciHoliday.includes(dtLoop.format('YYYYMMDD'))) ? false : true;
                                                                let toDay = moment(column.label).format('YYYYMMDD') == dayCurrent.format('YYYYMMDD');
                                                                return <TableCell
                                                                    // className={`${IsHoliday && 'isHoliday'} ${(IsFixDay && !IsHoliday && !isGradient) && 'isFix'} ${(IsRun && !IsHoliday) && 'isRun'} ${isGradient ? ' bg-red-500 text-white' : ''}`}
                                                                    className={`${style}`}
                                                                    key={i}
                                                                    align={column.numeric || false ? 'center' : 'center'}
                                                                    style={{ width: column.width, padding: 0, height: column.height }}
                                                                >
                                                                    {
                                                                        column.type == 'day' && <div className='flex items-center justify-center gap-1 '>
                                                                            <span>{moment(column.label).format('D')}</span>
                                                                            <div className='flex items-center justify-center'>{toDay ? <div className='text-yellow-400  font-semibold tracking-wider px-[4px] py-[2px]' >[ Today ]</div> : ''}</div>
                                                                        </div>
                                                                    }
                                                                </TableCell>
                                                            })
                                                        }
                                                    </tr>
                                                </>
                                            }}
                                            itemContent={(index, item) => {
                                                let title = '';
                                                if (item.name == 'plan' && item.part !== 'TOTAL') {
                                                    title = <span className={`title ${item.name}`}>Prod Plan (Plan * BOM)</span>;
                                                } else if (item.name == 'do' && item.part !== 'TOTAL') {
                                                    title = <span className={`title ${item.name}`}>D/O Plan</span>;
                                                } else if (item.name == 'stock' && item.part !== 'TOTAL') {
                                                    title = <span className={`title ${item.name}`}>P/S Stock Simulate</span>;
                                                } else if (item.name == 'pickList' && item.part !== 'TOTAL') {
                                                    title = <span className={`title ${item.name}`}>Picklist</span>;
                                                } else if (item.name == 'doAct' && item.part !== 'TOTAL') {
                                                    title = <span className={`title ${item.name}`}>D/O Act.</span>;
                                                } else if (item.name == 'po' && item.part !== 'TOTAL') {
                                                    title = <span className={`title ${item.name}`}>PO</span>;
                                                } else if (item.name == 'pofifo' && item.part !== 'TOTAL') {
                                                    title = <span className={`title ${item.name}`}>PO BALANCE</span>;
                                                } else if (item.name == 'box') {
                                                    title = <span className={`title ${item.name}`}>BOX</span>;
                                                } else if (item.name == 'pallet' && item.part == 'TOTAL') {
                                                    title = <span className={`title ${item.name}`}>PALLET</span>;
                                                }
                                                if (item.data.length) {
                                                    return <Fragment key={`${item.classs}-${index} `}>
                                                        <td className={`${item.name == 'line' && 'td-line'} stuck ${item.key ? 'z-50' : ''}`}>
                                                            <Stack direction={'row'} className='w-[400px]'>
                                                                <PartComponent part={item} master={reduxPartMaster} vdCode={item.vdCode} vdName={item.vdName} partNo={item.part} />
                                                                <div className={`box-title text-right w-[200px] bg-white`}>
                                                                    {title}
                                                                </div>
                                                            </Stack>
                                                        </td>
                                                        {
                                                            item.name != 'line' ? item.data.map((o, index) => {
                                                                let view = '';
                                                                if (item.name == 'plan' && item.part !== 'TOTAL') {
                                                                    view = VIEW_PLAN(item, o, index)
                                                                } else if (item.name == 'do' && item.part !== 'TOTAL') {
                                                                    view = VIEW_DO(item, o, o.date);
                                                                } else if (item.name == 'stock' && item.part !== 'TOTAL') {
                                                                    view = VIEW_COMMON(item, o, index);
                                                                } else if (item.name == 'pickList' && item.part !== 'TOTAL') {
                                                                    view = VIEW_COMMON(item, o, index);
                                                                } else if (item.name == 'doAct' && item.part !== 'TOTAL') {
                                                                    view = VIEW_COMMON(item, o, index);
                                                                } else if (item.name == 'po' && item.part !== 'TOTAL') {
                                                                    view = VIEW_COMMON(item, o, index);
                                                                } else if (item.name == 'pofifo' && item.part !== 'TOTAL') {
                                                                    view = VIEW_PO_FIFO(item, o, index);
                                                                } else if (item.name == 'box') {
                                                                    view = VIEW_COMMON(item, o, index);
                                                                }
                                                                else if (item.name == 'pallet') {
                                                                    view = VIEW_COMMON(item, o, index);
                                                                }

                                                                let isStartMonth = false;
                                                                if (moment(o.date).format('DD') == "01") {
                                                                    isStartMonth = true;
                                                                }
                                                                return isStartMonth == true ? <><td></td>{view}</> : view;
                                                            }) : <td colSpan={30} className='td-line h-[20px]'></td>
                                                        }
                                                    </ Fragment>
                                                }

                                            }}
                                        />
                                }
                            </div >
                        </div>
                        {/* <DialogRunDO handle={() => confirmApprDo(true)} open={openApprDo} close={setOpenApprDo} loading={loadingRunDO} setLoading={setLoadingRunDO} /> */}
                        <DialogDOWarningPage open={openWarning} close={setOpenWarning} />
                        <DialogFilter open={openFilter} close={setOpenFilter} refresh={FN_INIT_DATA} />
                        <DialogEditDO open={openEditDOVal} close={setOpenEditDOVal} data={dataEditDO} dataDO={DOResult} setDataDO={setDOResult} />
                        <DialogViewPlan open={openViewPlan} close={setOpenViewPlan} data={planSelected} setPlan={setPlanSelected} />
                        <Snackbar autoHideDuration={6000} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
                            <Alert onClose={() => setOpenSnackBar(false)} severity="success">
                                ออกแผน Delivery Order สำเร็จแล้ว
                            </Alert>
                        </Snackbar>

                        <DialogHistoryDO open={openDialogHistory} close={setOpenDialogHistory} param={paramDialogHistory} runningCode={RunningCode} data={DOResult} setData={setDOResult} loadDO={initContent} />
                        <ToastContainer autoClose={2000} />
                    </div>
                </div > : <LoginPage />
            }
        </>
    )
}

export default DOPage
