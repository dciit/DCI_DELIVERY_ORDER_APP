import { Alert, Button, ButtonGroup, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputBase, InputLabel, MenuItem, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Backdrop } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { selectStyle } from '../Styleds';
import { useDispatch, useSelector } from 'react-redux';
import { GetVenderDetail, ServiceGetPartDetail, ServiceGetSupplier, ServiceUpdateMasterPart, ServiceVender, getMaster } from '../Services';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DialogVenderDetail from '../components/DialogVenderDetail';
import Select from 'react-select'
function MasterPage() {
    const [listType, setListType] = useState([{
        value: 'part', label: 'PART'
    }, {
        value: 'vender', label: 'VENDER'
    }])
    const [typeSelected, setTypeSelected] = useState(listType[0]);
    const [filterContent, setFilterContent] = useState({
        data: [],
        selected: '',
        vender: ''
    });
    const [data, setData] = useState([]);
    const [dataDefault, setDataDefault] = useState([]);
    const [loading, setLoading] = useState(true);
    const [effect, setEffect] = useState(true);
    const [openVenderDetail, setOpenVenderDetail] = useState(false);
    const [openDialogPartDetail, setOpenDialogPartDetail] = useState(false);
    const [venderSelected, setVenderSelected] = useState('');
    const [vender, setVender] = useState([]);
    const [listVender, setListVender] = useState([]);
    const [partDetail, setPartDetail] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [loadingVenderDetail, setLoadingVenderDetail] = useState(true);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const reducer = useSelector(state => state.mainReducer);
    const dispatch = useDispatch();
    var once = false;

    useEffect(() => {
        if (!once) {
            async function getData() {
                setLoading(true);
                if (typeSelected.value == 'part') {
                    const venders = await ServiceGetSupplier("all");

                    var vdSelect = venders.data.map((item, index) => (
                        // { value: item.VD_CODE, label: (item.VD_DESC + ' (' + item.VD_CODE + ')') }
                        { value: item.vdCode, label: (item.vdDesc + ' (' + item.vdCode + ')') }
                    ));
                    vdSelect = vdSelect.filter(function (el) {
                        return el.value != '' && el.value != null
                    })
                    setListVender(vdSelect);
                    if (Object.keys(vdSelect).length && reducer.filter.master.vender == '') {
                        setFilterContent({ ...filterContent, vender: vdSelect[0] })
                        reducer.filter.master.vender = vdSelect[0]
                    }
                    const content = await getMaster({ type: typeSelected.value, vender: reducer.filter.master.vender.value });
                    setData(content);
                    setDataDefault(content);
                    setLoading(false);
                } else {
                    // const content = await ServiceVender();
                    const content = await ServiceGetSupplier("all");
                    setData(content.data);
                    setDataDefault(content.data);
                    setLoading(false);
                }
            }
            getData();
            once = true;
        }
    }, [effect]);

    useEffect(()=>{
        console.log('effect data');
        console.log(data)
    },[data])

    const filterData = (search) => {
        const filteredRows = dataDefault.filter((row) => {
            if (typeSelected.value == 'vender') {
                return row.vdDesc.toLowerCase().includes(event.target.value.toLowerCase()) || row.vdCode.toLowerCase().includes(event.target.value.toLowerCase()) || (row.vdMinDelivery +'').includes(event.target.value.toLowerCase()) || (row.vdMaxDelivery+'').includes(event.target.value.toLowerCase())
            } else {
                return row.partno.toLowerCase().includes(event.target.value.toLowerCase()) || row.description.toLowerCase().includes(event.target.value.toLowerCase()) || row.vdCode.toLowerCase().includes(event.target.value.toLowerCase())
            }
        });
        if (search.length) {
            setData(filteredRows);
        } else {
            setData(dataDefault)
        }
    }
    const dialogVenderDetail = (vdcode, loading = true) => {
        setVenderSelected(vdcode);
        setOpenVenderDetail(true);
    }

    const handleOpenDialogPartDetail = (part) => {
        setOpenBackdrop(true);
        async function getPartDetail() {
            const content = await ServiceGetPartDetail({ part: part });
            setPartDetail(content);
            setOpenBackdrop(false);
        }
        getPartDetail();
        setOpenDialogPartDetail(true);
    }

    const handleMasterPartUpdate = () => {
        ServiceUpdateMasterPart(partDetail).then((res) => {
            setEffect(!effect);
            setOpenDialogPartDetail(false);
        })
    }
    return (
        <div className='stock-page w-full flex'>
            <div className={`overflow-hidden w-full p-6  ${reducer?.theme ? 'night' : 'light'}`}>
                <div className='flex flex-col w-full h-full box-content'>
                    <div className='flex gap-2 box-filter line-b'>
                        <div className='flex items-center gap-2 flex-1'>
                            <span className='color-mtr'>TYPE</span>
                            <Select options={listType} className='w-full' defaultValue={typeSelected} onChange={(e) => {
                                setTypeSelected(e);
                                setEffect(!effect)
                            }} />
                        </div>
                        {
                            typeSelected.value == 'part' && <div className='flex items-center flex-1 gap-2'>
                                <span className='color-mtr'>VENDER</span>
                                <Select options={listVender} className='w-full' value={reducer.filter.master.vender} defaultValue={venderSelected} onChange={(e) => {
                                    setVenderSelected(e);
                                    dispatch({
                                        type: 'MASTER_SET_FILTER', payload: { vender: e }
                                    })
                                    setEffect(!effect);
                                }} />
                            </div>
                        }
                    </div>
                    <div className='h-full w-full text-center p-6'>
                        <div className='flex w-full h-full flex-col items-start gap-2 pb-[2em]'>
                            <div className='flex w-full justify-between items-center tag-search'>
                                <Typography className='text-white '>ระบบจัดการข้อมูล</Typography>
                                <Paper
                                    component="form"
                                    sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', width: 250 }}
                                >
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="ค้นหาสิ่งที่คุณต้องการ"
                                        inputProps={{ 'aria-label': 'search google maps' }}
                                        onChange={(e) => filterData(e.target.value)}
                                    />
                                    <IconButton type="button" sx={{ p: '0px' }} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </div>
                            <TableContainer component={Paper} className='h-fit'>
                                <Table size='small' id="tbContent">
                                    <TableHead>
                                        <TableRow>
                                            {
                                                typeSelected.value == 'vender' ? <>
                                                    <TableCell className='text-center'>#</TableCell>
                                                    <TableCell className='text-center'>รหัส</TableCell>
                                                    <TableCell className='text-center'>ชื่อ</TableCell>
                                                    <TableCell className='text-right'>Prod Lead (D)</TableCell>
                                                    <TableCell className='text-center'>รอบต่อวัน</TableCell>
                                                    <TableCell className='text-center'>จัดส่งขั้นต่ำ (กล่อง)</TableCell>
                                                    <TableCell className='text-center'>จัดส่งสูงสุด (กล่อง)</TableCell>
                                                    <TableCell className='text-center'>เครื่องมือ</TableCell>
                                                </> :
                                                    <>
                                                        <TableCell className='text-center'>CODE</TableCell>
                                                        <TableCell className='text-center'>NAME</TableCell>
                                                        <TableCell className='text-center'>UNIT</TableCell>
                                                        <TableCell className='text-center'>PDLT</TableCell>
                                                        <TableCell className='text-center'>BOX QTY</TableCell>
                                                        <TableCell className='text-center'>BOX MIN</TableCell>
                                                        <TableCell className='text-center'>BOX MAX</TableCell>
                                                        <TableCell className='text-center'>VENDER</TableCell>
                                                        <TableCell className='text-center'>#</TableCell>
                                                    </>
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            loading ? <TableRow><TableCell colSpan={typeSelected.value == 'vender' ? 6 : 9} className='text-center'><CircularProgress /></TableCell></TableRow> : (
                                                data.length ? data.map((item, index) => {
                                                    return typeSelected.value == 'vender' ? <TableRow key={index}>
                                                        <TableCell className='text-center'>{index + 1}</TableCell>
                                                        <TableCell className='text-center'>{item?.vdCode}</TableCell>
                                                        <TableCell>{item?.vdDesc}</TableCell>
                                                        <TableCell className='text-right font-bold text-orange-600 bg-orange-100'>{`${item?.vdProdLead}`}</TableCell>
                                                        <TableCell className='text-right font-bold text-blue-600 bg-blue-100'>{item?.vdRound}</TableCell>
                                                        <TableCell className='text-right text-red-500 font-bold bg-red-100'>{item?.vdMinDelivery}</TableCell>
                                                        <TableCell className='text-right text-green-600 font-bold bg-green-100'>{item?.vdMaxDelivery}</TableCell>
                                                        <TableCell className='text-center'><div className='flex gap-1 justify-center'><Button variant='contained' size='small' onClick={() => dialogVenderDetail(item?.vdCode)}><SearchIcon /> แก้ไข</Button></div></TableCell>
                                                    </TableRow> :
                                                        <TableRow key={index} className='tdMaster'>
                                                            <TableCell className='text-left pl-4 font-bold'>{item?.partno}  {item?.cm}</TableCell>
                                                            <TableCell>{item?.description}</TableCell>
                                                            <TableCell className='text-center font-bold'>{item?.unit}</TableCell>
                                                            <TableCell className='text-right font-bold text-orange-600 bg-orange-100'>{item?.pdlt}</TableCell>
                                                            <TableCell className='text-right font-bold text-blue-700 bg-blue-100'>{item?.boxQty}</TableCell>
                                                            <TableCell className='text-right font-bold text-red-500 bg-red-100'>{item?.boxMin}</TableCell>
                                                            <TableCell className='text-right font-bold text-green-600 bg-green-100'>{item?.boxMax}</TableCell>
                                                            <TableCell className='text-right font-bold'>{item?.vdCode}</TableCell>
                                                            <TableCell className='text-center'><div className='flex gap-1 justify-center'><Button variant='contained' size='small' onClick={() => handleOpenDialogPartDetail(item?.partno)}><SearchIcon /> แก้ไข</Button></div></TableCell>
                                                        </TableRow>
                                                }) :
                                                    <TableRow><TableCell colSpan={typeSelected.value == 'vender' ? 6 : 8} className='text-center'>ไม่พบข้อมูลที่คุณค้นหา</TableCell></TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className='flex justify-end w-full text-white'>
                                DataCount : {dataDefault.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DialogVenderDetail open={openVenderDetail} venderSelected={venderSelected} setOpen={setOpenVenderDetail} data={data} loading={loadingVenderDetail} setLoading={setLoadingVenderDetail} refresh={dialogVenderDetail} setData={setData} setOpenSnackBar={setOpenSnackBar} />
            <Snackbar autoHideDuration={1500} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
                <Alert onClose={() => setOpenSnackBar(false)} severity="success">
                    บันทึกข้อมูลเรียบร้อยแล้ว
                </Alert>
            </Snackbar>
            <Dialog open={openDialogPartDetail} onClose={() => setOpenDialogPartDetail(false)} fullWidth maxWidth={'sm'}>
                <DialogTitle >
                    แก้ไขข้อมูล
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                id="standard-read-only-input"
                                label="PART"
                                value={partDetail?.partno}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                focused
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="standard-read-only-input"
                                label="NAME"
                                value={partDetail?.description}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                fullWidth
                                focused
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='number'
                                id="standard-read-only-input"
                                label="PRODUCTION LEADTIME/DAY"
                                value={partDetail?.pdlt}
                                variant="standard"
                                fullWidth
                                focused
                                onChange={(e) => {
                                    setPartDetail({ ...partDetail, boxQty: parseInt(e.target.value) })
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type='number'
                                id="standard-read-only-input"
                                label="BOX QTY"
                                value={partDetail?.boxQty}
                                variant="standard"
                                fullWidth
                                focused
                                onChange={(e) => {
                                    setPartDetail({ ...partDetail, boxQty: parseInt(e.target.value) })
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="standard-read-only-input"
                                label="UNIT"
                                value={partDetail?.unit}
                                InputProps={{
                                    readOnly: false,
                                }}
                                variant="standard"
                                fullWidth
                                onChange={(e) => {
                                    setPartDetail({ ...partDetail, unit: e.target.value })
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type='number'
                                id="standard-read-only-input"
                                label="BOX MIN"
                                value={partDetail?.boxMin}
                                variant="standard"
                                fullWidth
                                focused
                                onChange={(e) => {
                                    setPartDetail({ ...partDetail, boxMin: parseInt(e.target.value) })
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type='number'
                                id="standard-read-only-input"
                                label="BOX MAX"
                                value={partDetail?.boxMax}
                                variant="standard"
                                fullWidth
                                focused
                                onChange={(e) => {
                                    setPartDetail({ ...partDetail, boxMax: parseInt(e.target.value) })
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="standard-read-only-input"
                                label="VENDER"
                                value={partDetail?.vdCode}
                                variant="standard"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={() => setOpenDialogPartDetail(false)}>ปิดหน้าต่าง</Button>
                    <Button type='button' variant='contained' onClick={() => handleMasterPartUpdate()}>บันทึก</Button>
                </DialogActions>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    )
}

export default MasterPage