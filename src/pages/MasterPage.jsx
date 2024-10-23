import { Alert, ButtonGroup, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputBase, InputLabel, MenuItem, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Backdrop } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { selectStyle } from '../Styleds';
import { useDispatch, useSelector } from 'react-redux';
import { GetVenderDetail, ServiceGetPartDetail, ServiceGetSupplier, ServiceUpdateMasterPart, ServiceVender, getMaster } from '../Services';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DialogVenderDetail from '../components/DialogVenderDetail';
import { Button, Select } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ModalAddDrawing from '../components/modal.add.drawing';
function MasterPage() {
    const [listType, setListType] = useState(['part', 'vender'])
    const [typeSelected, setTypeSelected] = useState('part');
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
    const filter = reducer?.filter;
    const dispatch = useDispatch();
    var once = false;
    const [openModalAddDrawing, setOpenModalAddDrawing] = useState(false);
    useEffect(() => {
        if (!once) {
            async function getData() {
                setLoading(true);
                if (typeSelected == 'part') {
                    const venders = await ServiceGetSupplier("all");
                    var vdSelect = venders.data.map((item) => (
                        { value: item.vdCode, label: (item.vdDesc + ' (' + item.vdCode + ')') }
                    ));
                    setListVender(venders.data);
                    if (Object.keys(vdSelect).length && reducer.filter.master.vender == '') {
                        setFilterContent({ ...filterContent, vender: venders.data[0] })
                        reducer.filter.master.vender = venders.data[0]
                    }
                    console.log(reducer.filter.master?.vender?.vdCode)
                    const content = await getMaster({ type: typeSelected, vender: reducer.filter.master?.vender?.vdCode == undefined ? reducer.filter.master.vender : reducer.filter.master.vender.vdCode });
                    setData(content);
                    setDataDefault(content);
                    setLoading(false);
                } else {
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


    const filterData = (search) => {
        const filteredRows = dataDefault.filter((row) => {
            if (typeSelected.value == 'vender') {
                return row.vdDesc.toLowerCase().includes(event.target.value.toLowerCase()) || row.vdCode.toLowerCase().includes(event.target.value.toLowerCase()) || (row.vdMinDelivery + '').includes(event.target.value.toLowerCase()) || (row.vdMaxDelivery + '').includes(event.target.value.toLowerCase())
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
    useEffect(() => {
        dispatch({
            type: 'MASTER_SET_FILTER', payload: { ...reducer.filter.master, type: typeSelected }
        })
    }, [typeSelected])
    return (
        <div className='stock-page w-full flex h-[100%]'>
            <div className={`overflow-hidden w-full p-6 h-[100%] `}>
                <div className='flex flex-col w-full h-[100%] box-content'>
                    <div className='flex gap-2 box-filter line-b'>
                        <div className='flex items-center gap-2 flex-1'>
                            <span className='text-[#5f5ce8]'>TYPE</span>
                            <Select options={listType.map((item, index) => ({ value: item, label: item.toUpperCase() }))} className='w-full' value={typeSelected} onChange={(e) => {
                                setTypeSelected(e);
                                setEffect(!effect)
                            }} />
                        </div>
                        {
                            typeSelected == 'part' && <div className='flex items-center flex-1 gap-2'>
                                <span className='color-mtr'>VENDER</span>
                                <Select options={listVender.map((item, index) => ({ value: item.vdCode, label: (item.vdDesc + ' (' + item.vdCode + ')') }))} className='w-full' value={reducer.filter.master?.vender?.vdCode == undefined ? reducer.filter.master.vender : reducer.filter.master.vender.vdCode} defaultValue={venderSelected} onChange={(e) => {
                                    setVenderSelected(e);
                                    dispatch({
                                        type: 'MASTER_SET_FILTER', payload: { vender: e }
                                    })
                                    setEffect(!effect);
                                }} />
                            </div>
                        }
                    </div>
                    <div className='h-[100%] w-full text-center py-3'>
                        <div className='flex w-full h-full flex-col items-start gap-2 pb-[2em]'>
                            <div className='flex w-full justify-between items-center tag-search'>
                                <Typography className='text-[#5f5f5f] '>ระบบจัดการข้อมูล</Typography>

                                <div className='flex  items-center gap-2'>
                                    <Button type='primary' icon={<PlusCircleOutlined />} onClick={() => setOpenModalAddDrawing(true)}>Add Drawing</Button>
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
                            </div>
                            <div className='bg-white overflow-auto h-[100%] w-full'>
                                <Table size='small' id="tbContent" stickyHeader={true}>
                                    <TableHead>
                                        <TableRow>
                                            {
                                                typeSelected == 'vender' ? <>
                                                    <TableCell className='text-center border'>รหัส</TableCell>
                                                    <TableCell className='text-start border'>ชื่อ</TableCell>
                                                    <TableCell className='text-right'>PU Leadtime (D)</TableCell>
                                                    <TableCell className='text-center border'>รอบต่อวัน</TableCell>
                                                    <TableCell className='text-center border'>จัดส่งขั้นต่ำ (กล่อง)</TableCell>
                                                    <TableCell className='text-center border'>จัดส่งสูงสุด (กล่อง)</TableCell>
                                                    <TableCell className='text-center border'>เครื่องมือ</TableCell>
                                                </> :
                                                    <>
                                                        <TableCell className='pl-3 border'>CODE</TableCell>
                                                        <TableCell className='pl-3 border'>NAME</TableCell>
                                                        <TableCell className='text-center border'>UNIT</TableCell>
                                                        <TableCell className='text-center border'>PDLT</TableCell>
                                                        <TableCell className='text-center border'>BOX QTY</TableCell>
                                                        <TableCell className='text-center border'>BOX MIN</TableCell>
                                                        <TableCell className='text-center border'>BOX MAX</TableCell>
                                                        <TableCell className='text-center border'>VENDER</TableCell>
                                                        <TableCell className='text-center border'>#</TableCell>
                                                    </>
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            loading ? <TableRow><TableCell colSpan={typeSelected == 'vender' ? 6 : 9} className='text-center'><CircularProgress /></TableCell></TableRow> : (
                                                data.length ? data.map((item, index) => {
                                                    return typeSelected == 'vender' ? <TableRow key={index}>
                                                        <TableCell className='text-center  border'>{item?.vdCode}</TableCell>
                                                        <TableCell className='font-bold border '>{item?.vdDesc}</TableCell>
                                                        <TableCell className='text-right border font-semibold'>{`${item?.vdProdLead}`}</TableCell>
                                                        <TableCell className='text-right border font-semibold'>{item?.vdRound}</TableCell>
                                                        <TableCell className='text-right border font-semibold'>{item?.vdMinDelivery != undefined ? Number(item.vdMinDelivery).toLocaleString('en') : ''}</TableCell>
                                                        <TableCell className='text-right border font-semibold'>{item?.vdMaxDelivery != undefined ? Number(item.vdMaxDelivery).toLocaleString('en') : ''}</TableCell>
                                                        <TableCell className='text-center'><div className='flex gap-1 justify-center'>
                                                            <Button type='primary' onClick={() => dialogVenderDetail(item?.vdCode)} icon={<EditOutlined />}>  แก้ไข</Button></div></TableCell>
                                                    </TableRow> :
                                                        <TableRow key={index} className='tdMaster'>
                                                            <TableCell className='border text-left pl-4 font-bold'>{item?.partno}  {item?.cm}</TableCell>
                                                            <TableCell>{item?.description}</TableCell>
                                                            <TableCell className='border text-center font-bold'>{item?.unit}</TableCell>
                                                            <TableCell className='border text-right font-bold '>{item?.pdlt}</TableCell>
                                                            <TableCell className='border text-right font-bold '>{item?.boxQty != undefined ? Number(item.boxQty).toLocaleString('en') : ''}</TableCell>
                                                            <TableCell className='border text-right font-bold '>{item?.boxMin != undefined ? Number(item.boxMin).toLocaleString('en') : ''}</TableCell>
                                                            <TableCell className='border text-right font-bold '>{item?.boxMax != undefined ? Number(item.boxMax).toLocaleString('en') : ''}</TableCell>
                                                            <TableCell className='border text-right font-bold'>{item?.vdCode}</TableCell>
                                                            <TableCell className='border text-center'><div className='flex gap-1 justify-center'><Button type='primary' size='small' onClick={() => handleOpenDialogPartDetail(item?.partno)} icon={<EditOutlined />}>แก้ไข</Button></div></TableCell>
                                                        </TableRow>
                                                }) :
                                                    <TableRow><TableCell colSpan={typeSelected == 'vender' ? 6 : 8} className='text-center'>ไม่พบข้อมูลที่คุณค้นหา</TableCell></TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </div>
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
            <ModalAddDrawing open={openModalAddDrawing} setOpen={setOpenModalAddDrawing} />
        </div >
    )
}

export default MasterPage