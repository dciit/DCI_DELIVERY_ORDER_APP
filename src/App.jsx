import React, { useEffect, useState } from 'react'
import './App.css'
import { Box, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button, Select, Stack, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, IconButton, InputBase, Typography, FormGroup, FormControlLabel, Checkbox, FormLabel, Grid, TextField } from '@mui/material'
import { TableVirtuoso } from 'react-virtuoso'
import { ServiceGetPlan, ServiceGetSupplier, ServiceRunDo } from './Services'
import moment from 'moment/moment'
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import ItemCell from './components/ItemCell'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { pink, red } from '@mui/material/colors';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LoginPage from './components/LoginPage'
import { useDispatch, useSelector } from 'react-redux'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import StarsIcon from '@mui/icons-material/Stars';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import CheckBoxFilter from './components/CheckBoxFilter'
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs'
function App() {
  const [openDialogLogout, setOpenDialogLogout] = useState(false);
  const [plan, setPlan] = useState([]);
  const [parts, setParts] = useState([]);
  const [columns, setColumns] = useState([]);
  const [master, setMaster] = useState([]);
  const [planDefault, setPlanDefault] = useState([]);
  const [ListSupplier, SetListSupplier] = useState([]);
  const [SupplierSelected, SetSupplierSelected] = useState('195021');
  const [loading, setLoading] = useState(true);
  const [msgNoData, setMsgNoData] = useState(false);
  const [openApprDo, setOpenApprDo] = useState(false);
  const [loadingApprDo, setLoadingApprDo] = useState(false);
  const [disabledBtnApprDo, setDisabledBtnApprDo] = useState(false);
  const [msgWaitApprDo, setMsgWaitApprDo] = useState('กรุณารอสักครู่ . . .');
  const [RunningCode, setRunningCode] = useState('-');
  const [showBtnRunDo, setShowBtnRunDo] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [openViewDetailDrawing, setOpenViewDetailDrawing] = useState(false);
  const [drawingDetail, setDrawingDetail] = useState([]);
  const reducer = useSelector(state => state.mainReducer);
  const dispatch = useDispatch();
  let imageUrl = 'http://dcidmc.dci.daikin.co.jp/PICTURE/' + reducer.id + '.JPG';
  var startDate = moment().add(-7, 'days').format('YYYY-MM-DD');
  var endDate = moment().add(1, 'months').format('YYYY-MM-DD');
  var mainColor = '#18181c';
  var ranonce = false;
  useEffect(() => {
    if (!ranonce) {
      if (reducer.login) {
        setShowBtnRunDo(true);
        GetSupplier();
        GetPlan();
        SetColDay();
        ranonce = true;
      }
    }
  }, [reducer.login]);
  function GetSupplier() {
    ServiceGetSupplier().then((res) => {
      SetListSupplier(res.data);
    })
  }
  function GetPlan(SupplierCode) {
    SupplierCode = (SupplierCode != "" && typeof SupplierCode != 'undefined') ? SupplierCode : SupplierSelected;
    SetSupplierSelected(SupplierCode);
    setLoading(true);
    setMsgNoData(false);
    ServiceGetPlan(SupplierCode).then((res) => {
      console.log(res)
      setLoading(false);
      setRunningCode(res.data.runningCode != '' ? res.data.runningCode : '-');
      if (Object.keys(res.data.data).length) {
        setMaster(res.data.master);
        var newPlan = [];
        setPlanDefault(res.data.data);
        res.data.data.map((item, index) => {
          if (typeof newPlan[item.part] == 'undefined') {
            newPlan[item.part] = []
          }
          if (item.date != null && (moment(item.date) >= moment(startDate) && moment(item.date) <= moment(endDate))) {
            newPlan[item.part].push(item);
          }
        });
        setPlan(newPlan);
        setParts(Object.keys(newPlan));
      } else {
        setMsgNoData(true);
        setPlanDefault([]);
        setPlan([]);
        setParts([]);
      }
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

  function fixedHeaderContent() {
    return (
      <>
        <TableRow >
          <TableCell rowSpan={4} className='w-[400px] p-0 text-center stuck' style={{ boxShadow: 'rgb(171 171 171) 5px 2px 9px -7px' }}>
            <div className='flex'>
              <div className='flex-1 text-[1.5rem] text-left pl-6'>DRAWING NO.</div>
              <div className='flex-1 text-[1.5rem]'>{moment(startDate).format('MMM').toUpperCase()}</div>
            </div>
          </TableCell>
          {columns.map((column, i) => {
            var _ThStartMonth = "";
            if (column.date == moment(endDate).format('YYYY-MM-01')) {
              _ThStartMonth = <TableCell rowSpan={2} className='text-center w-[200px] start-[200px] text-[1.5rem] stuck border-0 bg-[#1976d2] text-white' style={{ width: column.width, padding: 0, height: column.height, borderRight: '1px solid #e0e0e0 !important' }}>{moment(endDate).format('MMM').toUpperCase()}</TableCell>
            }
            return <>
              {_ThStartMonth}
              <TableCell
                className={`${isHoliday(column.label)} ${styleDay(column)}`}
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

        </TableRow >
        <TableRow>
          {columns.map((column, i) => (
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
        </TableRow>
      </>
    );
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
  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
  }
  function ApprDo() {
    ServiceRunDo({ plan: planDefault, master: master }).then((res) => {
      try {
        if (res.status == 200) {
          if (res.data.RunningCode != "" && typeof res.data.RunningCode != 'undefined') {
            setRunningCode(res.data.RunningCode);
          }
          setMsgWaitApprDo('สร้างแผน Delivery Order สำเร็จแล้ว');
          setShowBtnRunDo(false);
          // setTimeout(() => {
          //   setOpenApprDo(false);
          // }, 1500);
        } else {
          setMsgWaitApprDo('ไม่สามารถสร้างแผน Delivery Order ได้ กรุณาติดต่อทีมงาน IT (เบียร์ 250)');
        }
        setDisabledBtnApprDo(false);
        // setLoadingApprDo(false);
      } catch (e) {
        console.log(e);
        setDisabledBtnApprDo(false);
        setMsgWaitApprDo('ไม่สามารถสร้างแผน Delivery Order ได้ กรุณาติดต่อทีมงาน IT (เบียร์ 250)');
      }
    })
  }
  const handleSupplier = event => {
    SetSupplierSelected(event.target.value);
    GetPlan(event.target.value);
  }
  const handleCloseApprDo = () => {
    setLoadingApprDo(false);
    setOpenApprDo(false);
  }
  const confirmApprDo = () => {
    setMsgWaitApprDo('กรุณารอสักครู่ . . .')
    setLoadingApprDo(true);
    setDisabledBtnApprDo(true);
    ApprDo();
  }
  const handleCloseLogout = () => {
    setOpenDialogLogout(false);
  }
  const handleLogout = () => {
    dispatch({ type: 'CLEAR_LOGIN' });
    setOpenDialogLogout(false);
  }
  const handleViewDetailDrawing = (partNo) => {
    master[partNo].partNo = partNo
    setDrawingDetail(master[partNo])
    setOpenViewDetailDrawing(true);
  }
  return (
    <>
      {
        reducer.login ? <div className='h-screen overflow-hidden'>
          <div className='flex items-center justify-between h-[6.5%] px-[2rem] bg-[#1d1d1d]' >
            <div className='text-3xl text-white'>DELIVERY ORDER</div>
            <div className='flex items-center gap-2'>
              <span className='text-white'>{reducer?.name}</span>
              <Avatar alt="Remy Sharp" src={imageUrl} />
              <IconButton style={{ background: red[400] }} onClick={() => setOpenDialogLogout(true)}><ExitToAppRoundedIcon className='' /></IconButton>
            </div>
          </div >
          <Box>
            <Stack direction={'row'} className='bg-[#dddddd]'>
              <Typography className='px-6 py-1'>Monitor Plan</Typography>
              <Typography className='px-6 py-1'>Suppiler</Typography>
              <Typography className='px-6 py-1'>Monitor Stock</Typography>
            </Stack>
          </Box>
          <Divider light={true} />
          <div className='h-[7.5%] flex justify-between items-center px-6'>
            <div className=' px-2 py-1 rounded-lg border' >
              <Stack direction="row" alignItems="center" gap={1}>
                <HomeIcon fontSize='14px' /><span>Supplier</span>
              </Stack>
            </div>
            <div className='w-full p-3'>
              <FormControl fullWidth>
                <Select
                  inputProps={{ readOnly: loading }}
                  // labelId="demo-simple-select-label"
                  // id="demo-simple-select"
                  size='small'
                  value={SupplierSelected}
                  // onChange={(e) => ChangeSupplier(e.target.value)}
                  onChange={handleSupplier}
                  sx={{
                    height: '2.5rem',
                    // color: 'white',
                    // '& .MuiOutlinedInput-notchedOutline': {
                    //   borderColor: '#a3a3a326'
                    // },
                    // '& .MuiSvgIcon-root': {
                    //   color: 'white'
                    // },
                    // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    //   borderColor: 'white',
                    // },
                    // "&:hover": {
                    //   "&& fieldset": {
                    //     border: "2px solid white"
                    //   }
                    // }
                  }}
                >
                  {
                    ListSupplier.map((sp) => {
                      return <MenuItem value={sp.vender} key={sp.vender}>{sp.venderName} ({sp.vender})</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </div>
            <div>
              <Button variant='outlined' onClick={() => setOpenFilter(true)}><FilterAltOffOutlinedIcon />&nbsp;Filter</Button>
            </div>
          </div>
          <Divider light={true} />
          <div className='h-[7.5%] p-1  flex gap-5'>
            <div className='border-none w-full border-[#ffffff26] px-5 py-1 rounded-lg text-center flex items-center justify-between'>
              <div className='text-left flex  flex-col gap-2' style={{ lineHeight: 1 }}>
                <span className='text-[#000000] font-semibold'>{dayjs().format('YYYYMMDD')}001</span>
                <span className='text-[#b3b3b3] text-[1rem]'>RUNNING CODE</span>
                {/* <div className='flex items-center gap-1 pl-3'><StarsIcon style={{ fontSize: '14px', color: 'rgb(255 241 0)' }} /><span className='text-[1.5rem]'>{RunningCode}</span></div> */}
              </div>
              <div>
                <Button className='ml-3' variant='contained' onClick={() => {
                  setShowBtnRunDo(true);
                  setOpenApprDo(true);
                }} ><CheckIcon fontSize='small' />&nbsp;Start D/O Plan</Button>
              </div>
            </div>
          </div>
          <Divider light={true} />
          <div className='h-[78.5%] text-center bg-[#f4f4f4]' >
            {
              loading ? <div className='flex flex-col justify-center items-center h-full'><CircularProgress /><span className=' mt-3'>กำลังโหลดข้อมูล . . .</span></div> : <>
                {
                  msgNoData ? <div className=' h-full flex items-center justify-center'>ไม่พบข้อมูลการผลิต . . . </div> : <TableVirtuoso
                    id='tbDo'
                    // style={{ backgroundColor: '#202026' }}
                    data={parts}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={fixedHeaderContent}
                    itemContent={(index, part) => (
                      <TableCell key={index} colSpan={63} className='p-0 cursor-pointer' style={{ borderBottomWidth: 0 }}>
                        <Paper elevation={2}>
                          <Table id="tbContent" className='w-auto'>
                            <TableBody>
                              <TableRow className='bg-white'>
                                <TableCell className='stuck text-center align-top  text-[1rem] font-bold p-0 w-[400px] ' colSpan={2} rowSpan={5}>
                                  <Table className='w-[400px] tbTitle shadow-xl '>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell rowSpan={5} className='pl-1 pr-1 py-1 align-top'>
                                          <Stack direction='column' gap={1}>
                                            <div className='nmb-2 partDetail shadow-xl'>
                                              <Stack>
                                                <Typography className='font-semibold'>{part} {master[part]?.partCm} </Typography>
                                                <Typography className='text-[14px]'>({master[part]?.partDesc})</Typography>
                                                <IconButton size='small' className='p-1' onClick={() => handleViewDetailDrawing(part)}><SearchIcon fontSize='small' className='text-white' /></IconButton>
                                              </Stack>
                                            </div>
                                          </Stack>
                                        </TableCell>
                                      </TableRow>
                                      {
                                        reducer.titles.map((item, index) => {
                                          return item.checked && <TableRow key={index}>
                                            <TableCell className='stuck px-0 h-[40px] p-0 text-[#dddddd] w-[200px] border-0'>
                                              <div className='flex items-center gap-2 pl-2'>
                                                <span className={`title ${item.name}`}>{item.label}</span>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        })
                                      }
                                    </TableBody>
                                  </Table>
                                </TableCell>
                              </TableRow>
                              {
                                reducer.titles[0].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='plan' _class=' planVal' endDate={endDate}></ItemCell>
                                </TableRow>
                              }
                              {
                                reducer.titles[1].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='picklist' textColor='text-red-400' endDate={endDate}></ItemCell>
                                </TableRow>
                              }
                              {
                                reducer.titles[2].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='ProdUse' textColor='' endDate={endDate}></ItemCell>
                                </TableRow>
                              }
                              {
                                reducer.titles[3].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='doPlan' endDate={endDate}></ItemCell>
                                </TableRow>
                              }
                              {
                                reducer.titles[4].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='doAct' textColor='text-teal-300' endDate={endDate}></ItemCell>
                                </TableRow>
                              }
                              {
                                reducer.titles[5].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='doBalance' textColor='' endDate={endDate}></ItemCell>
                                </TableRow>
                              }
                              {
                                reducer.titles[6].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='stock' textColor='text-orange-400' endDate={endDate}></ItemCell>
                                </TableRow>
                              }
                              {
                                reducer.titles[7].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='stockSim' _class='stockSimVal' endDate={endDate}></ItemCell>
                                </TableRow>
                              }
                              {
                                reducer.titles[8].checked && <TableRow>
                                  <ItemCell dataSet={plan[part]} keyShow='po' _class='poVal' endDate={endDate}></ItemCell>
                                </TableRow>
                              }

                            </TableBody>
                          </Table>
                        </Paper>
                      </TableCell>
                    )}
                  />
                }

              </>
            }
          </div >
          <Dialog
            open={openApprDo}
          >
            <DialogTitle id="alert-dialog-title">
              {"คุณต้องการสร้างแผน Delivery Order ใช่หรือไม่ ?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                กรุณาตรวจสอบข้อมูลของระบบที่แสดงให้คุณเห็น หากมั่นใจและต้องการออกแผน Delivery Order สามารถกดปุ่ม ยืนยัน
              </DialogContentText>
              {
                loadingApprDo && <div className='flex items-center justify-start flex-col gap-2 py-[16px]'>{
                  msgWaitApprDo == "กรุณารอสักครู่ . . ." ? <CircularProgress /> : (msgWaitApprDo == "สร้างแผน Delivery Order สำเร็จแล้ว" ? <CheckCircleRoundedIcon color={'success'} sx={{ fontSize: 100 }} /> : <CancelRoundedIcon sx={{ fontSize: 100, color: red[500] }} />)
                }<span>{msgWaitApprDo}</span></div>
              }
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={testAction}>test</Button> */}
              <Button onClick={handleCloseApprDo} disabled={disabledBtnApprDo && 'disabled'}>ปิดหน้าต่าง</Button>
              {
                showBtnRunDo && <Button onClick={confirmApprDo} autoFocus variant='contained' disabled={disabledBtnApprDo && 'disabled'}>
                  ยืนยัน
                </Button>
              }
            </DialogActions>
          </Dialog>
          <Dialog open={openDialogLogout} onClose={handleCloseLogout}>
            <DialogTitle>ออกจากระบบ</DialogTitle>
            <DialogContent>
              <DialogContentText>
                คุณต้องการออกจากระบบ ใช่หรือไม่ ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLogout}>ปิดหน้าต่าง</Button>
              <Button onClick={() => handleLogout()} variant='contained'>ยืนยัน</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openFilter} fullWidth maxWidth={'sm'}>
            <DialogTitle>Filter Choice</DialogTitle>
            <DialogContent dividers>
              <CheckBoxFilter />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenFilter(false)} variant='contained' color='inherit'>Close</Button>
              {/* <Button onClick={() => setOpenFilter(false)} variant='contained'><FilterAltOutlinedIcon />&nbsp;Filter</Button> */}
            </DialogActions>
          </Dialog>

          <Dialog open={openViewDetailDrawing} onClose={() => setOpenViewDetailDrawing(false)} fullWidth maxWidth={'sm'}>
            <DialogTitle>Drawing Standard</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={6} >
                  <Stack>
                    <FormLabel>Code</FormLabel>
                    <TextField hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.partNo + ' ' + drawingDetail.partCm} />
                  </Stack>
                </Grid>
                <Grid item xs={6} >
                  <Stack>
                    <FormLabel>Description</FormLabel>
                    <TextField hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.partDesc} />
                  </Stack>
                </Grid>
                <Grid item xs={6} >
                  <Stack>
                    <FormLabel>Box</FormLabel>
                    <TextField type='number' hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.partQtyBox} />
                  </Stack>
                </Grid>
                <Grid item xs={6} >
                  <Stack>
                    <FormLabel>Production LeadTime</FormLabel>
                    <TextField type='number' hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.vdProdLeadtime} />
                  </Stack>
                </Grid>
                <Grid item xs={6} >
                  <Stack>
                    <FormLabel> Minimum Delivery</FormLabel>
                    <TextField type='number' hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.vdMinDelivery} />
                  </Stack>
                </Grid>
                <Grid item xs={6} >
                  <Stack>
                    <FormLabel> Maximum Delivery</FormLabel>
                    <TextField type='number' hiddenLabel variant='filled' size='small' inputProps={{ readOnly: true }} focused value={drawingDetail.vdMaxDelivery != '99999' ? drawingDetail.vdMaxDelivery : '-'} />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <FormLabel className='flex'><CalendarMonthIcon />&nbsp;Delivery Calendar </FormLabel>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {
                              reducer.dayOfWeek.map((day, index) => (
                                <TableCell key={index}>
                                  {
                                    day
                                  }
                                </TableCell>
                              ))
                            }
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            {
                              Object.keys(drawingDetail).length && reducer.dayOfWeek.map((day, index) => (
                                <TableCell key={index}>
                                  {
                                    master[drawingDetail.partNo]["vd" + day] == true ? <CheckCircleOutlineIcon color='success' /> : <HighlightOffIcon color='error' />
                                  }
                                </TableCell>
                              ))
                            }
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDetailDrawing(false)} variant='outlined'>Close</Button>
            </DialogActions>
          </Dialog>
        </div > : <LoginPage />
      }
    </>
  )
}

export default App
