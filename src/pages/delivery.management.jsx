import React, { useEffect, useState } from 'react'
import { bgApp, bgPanel, textApp } from '../environment'
import moment from 'moment'
import { Box, Button, Checkbox, Divider, FormControlLabel, FormLabel, IconButton, Paper, Popover, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { CheckBox } from '@mui/icons-material';
import { API_INSERT_LIST_DRAWING_DELIVERY_OF_DAY, API_LIST_DRAWING_DELIVERY_OF_DAY } from '../Services';
import { useSelector } from 'react-redux';
function DeliveryManagement() {
    const reducer = useSelector(state => state.mainReducer);
    let dtNow = moment();
    let ym = moment().format('YYYYMM');
    const ListTime = ['08:00', '08:30', '09:00', '09:30', '10:30'];
    const ListWH = ['WH1', 'WH2'];
    const [openSelectOrder, setOpenSelectOrder] = useState(false);
    const [daySelected, setDaySelected] = useState('');
    const [DrawingSelected, setDrawingSelected] = useState({
        open: false,
        selected: 'DW2',
        value: 0,
        list: []
    })
    function handleOpenManagement(day = '') {
        setOpenSelectOrder(!openSelectOrder);
        setDaySelected(!openSelectOrder ? day : '');
    }
    function handleSelectDrawing() {
        setDrawingSelected({
            ...DrawingSelected,
            open: true
        })
    }
    const [anchorEl, setAnchorEl] = useState(null);
    async function FN_LIST_DRAWING_DELIVERY_OF_DAY() { // get list drawing of delivery this day
        let res = await API_LIST_DRAWING_DELIVERY_OF_DAY({ dtTarget: `${ym}21`, vdCode: reducer.id });
        setDrawingSelected({
            ...DrawingSelected,
            list: res.map(o => ({ id: o.id, part: o.partno, do: o.doVal, input: 0, checked: false, date: '', wh: '' }))
        })
    }
    const handleChecked = (checked, id, wh = '') => {
        let clone = DrawingSelected.list;
        let index = clone.findIndex(o => o.id == id);
        if (checked == false) {
            clone[index].input = 0;
        }
        clone[index].checked = checked;
        clone[index].wh = wh;
        clone[index].date = `${ym}${daySelected}`
        setDrawingSelected({
            ...DrawingSelected,
            list: clone
        })
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        FN_LIST_DRAWING_DELIVERY_OF_DAY();
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChangeDrawing = (e) => {
        setDrawingSelected({
            ...DrawingSelected,
            selected: e.target.value,
            value: 0
        })
    }

    const handleChangeDoVal = (input, id, doVal = 0) => {
        input = input != '' ? input : 0;
        if (input > doVal) {
            input = doVal;
        }
        let clone = DrawingSelected.list;
        let index = clone.findIndex(o => o.id == id);
        clone[index].input = parseInt(input);
        setDrawingSelected({
            ...DrawingSelected,
            list: clone
        })
    }
    const handleSummit = () => {
        console.log(DrawingSelected.list.filter(o => o.checked == true))
        let res = API_INSERT_LIST_DRAWING_DELIVERY_OF_DAY(DrawingSelected.list.filter(o => o.checked == true));
        console.log(res);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <div className={`${bgApp} w-full  ${textApp} p-6`}>
            <Stack>
                <Typography>{`${reducer.name} (${reducer.id})`}</Typography>
                <Typography>Delivery Of {`${daySelected} ${dtNow.format('MMMM')} ${dtNow.format('YYYY')}`}</Typography>
                <div >
                    {
                        openSelectOrder == false ?
                            <table id='tbDeliveryOfDay' className={`w-full`}>
                                <tbody>
                                    <tr>
                                        <td align='center'>DAY</td>
                                        {
                                            [...Array(7)].map((oDay, iDay) => {
                                                dtNow = dtNow.add(iDay > 0 ? 1 : 0, 'days');
                                                return <td className={`${bgPanel} py-2`} colSpan={2} align='center' >{dtNow.format('DD')}</td>
                                            })
                                        }
                                    </tr>
                                    {
                                        ListTime.map((oTime, iTime) => {
                                            return <tr key={iTime}>
                                                <td align='center' className='py-2'>{oTime}</td>
                                                {
                                                    [...Array(7)].map((oDay, iDay) => {
                                                        return ListWH.map((oWH, iWH) => {
                                                            return <td onClick={() => handleOpenManagement(moment().add(iDay, 'days').format('DD'))} align='center' className='text-[14px] cursor-pointer hover:bg-[#4effca36] duration-300 transition-all' key={iWH}>{oWH}</td>
                                                        })
                                                    })
                                                }
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table> :
                            <Stack alignItems={'start'}>
                                <IconButton onClick={handleOpenManagement}><ReplyIcon className='text-white' /></IconButton>
                                <table id='tbDeliveryOfTime'>
                                    <tbody>
                                        <tr>
                                            {
                                                ListTime.map((oTime, iTime) => {
                                                    return <td key={iTime} align='center' colSpan={ListWH.length}>{oTime}</td>
                                                })
                                            }
                                        </tr>
                                        <tr>
                                            {
                                                ListTime.map(() => {
                                                    return ListWH.map((oWH, iWH) => {
                                                        return <td align='center' className='text-[14px] cursor-pointer hover:bg-[#4effca36] duration-300 transition-all' key={iWH}>{oWH}</td>
                                                    })
                                                })
                                            }
                                        </tr>
                                        <tr>
                                            {
                                                ListTime.map(() => {
                                                    return ListWH.map((oWH, iWH) => {
                                                        return <td onClick={handleSelectDrawing} align='center' className='text-[14px] py-2 cursor-pointer hover:bg-[#4effca36] duration-300 transition-all' key={iWH}>{
                                                            false ? 'data' : <Stack>
                                                                <Button size='small' className='p-0' aria-describedby={id} variant="contained" onClick={handleClick}>
                                                                    เลือก
                                                                </Button>
                                                                <Popover
                                                                    id={id}
                                                                    open={open}
                                                                    anchorEl={anchorEl}
                                                                    onClose={handleClose}
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'left',
                                                                    }}
                                                                >
                                                                    <div className=' p-6'>
                                                                        <Stack direction={'column'} mb={2} gap={1}>
                                                                            <FormLabel id="demo-radio-buttons-group-label">กรุณาเลือก Drawing ที่ต้องการส่ง</FormLabel>
                                                                            <TextField placeholder='ค้นหา Drawing ' size='small' />
                                                                        </Stack>
                                                                        <Stack direction={'row'} gap={2}>
                                                                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                                                    <Table stickyHeader aria-label="sticky table" size='small' id='tbDelivery'>
                                                                                        <TableHead>
                                                                                            <TableRow>
                                                                                                <TableCell>#</TableCell>
                                                                                                <TableCell>Drawing</TableCell>
                                                                                                <TableCell>D/O</TableCell>
                                                                                                <TableCell>Delivery</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {
                                                                                                DrawingSelected.list.map((oDO, iDrawing) => {
                                                                                                    let partno = oDO.part;
                                                                                                    return <TableRow key={iDrawing}>
                                                                                                        <TableCell  >
                                                                                                            <Checkbox defaultValue={oDO.checked} onChange={(e) => handleChecked(e.target.checked, oDO.id, oWH)} />
                                                                                                        </TableCell>
                                                                                                        <TableCell>{partno}</TableCell>
                                                                                                        <TableCell align='right' className='font-bold'>{parseInt(oDO.do).toLocaleString('en')}</TableCell>
                                                                                                        <TableCell>
                                                                                                            <input className='rounded-md pl-1' style={{ border: '1px solid #ddd' }} value={oDO.input} onChange={(e) => handleChangeDoVal(e.target.value, oDO.id, oDO.do)} />
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                })
                                                                                            }
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Paper>
                                                                            <Paper sx={{ minWidth: '400px' }}>
                                                                                <Stack>
                                                                                    <Box p={2}>
                                                                                        <Typography>ข้อมูลการจัดส่งของคุณ</Typography>
                                                                                    </Box>
                                                                                    <Divider />
                                                                                    <div className='px-3 pt-0'>
                                                                                        <table id='tbPreview'>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td>&nbsp;  </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td className='pl-3'>{`Supplier : ${reducer.name} (${reducer.id})`}</td>
                                                                                                </tr>

                                                                                                <tr>
                                                                                                    <td className='pl-3'>{`Delivery Date : ${moment(`${ym}${daySelected}`).format('DD/MM/YYYY')}`}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>&nbsp;  </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td className='pl-3'>รายการ</td>
                                                                                                    <td>จำนวนส่ง</td>
                                                                                                </tr>
                                                                                                {
                                                                                                    DrawingSelected.list.filter(o => o.checked == true || o.checked == 'on').length > 0 ? DrawingSelected.list.filter(o => o.checked == true || o.checked == 'on').map((oDO, iDO) => {
                                                                                                        return <tr>
                                                                                                            <td className='pl-6'>{oDO.part}</td>
                                                                                                            <td align='right' className={`${oDO.input == 0 && 'text-red-500'}`}>{parseInt(oDO.input).toLocaleString('en')}</td>
                                                                                                        </tr>
                                                                                                    }) : <tr>
                                                                                                        <td colSpan={2} align='center'>
                                                                                                            <span className='text-[12px] text-red-500'>ไม่พบข้อมูลการส่งของ</span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                }
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </Stack>
                                                                            </Paper>
                                                                        </Stack>
                                                                        <Stack gap={1} className='h-[500px] hidden'>
                                                                            <FormLabel id="demo-radio-buttons-group-label">กรุณาเลือก Drawing ที่ต้องการส่ง</FormLabel>
                                                                            <Divider />
                                                                            <TextField placeholder='ค้นหา Drawing ที่คุณต้องการ' size='small' />
                                                                            <div id="table-wrapper " className='hidden'>
                                                                                <table className='w-full' id='tbDelivery' >
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>#</th>
                                                                                            <th>Drawing</th>
                                                                                            <th>D/O</th>
                                                                                            <th>Delivery</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            DrawingSelected.list.map((oDO, iDrawing) => {
                                                                                                let partno = oDO.part;
                                                                                                return <tr key={iDrawing}>
                                                                                                    <td  >
                                                                                                        <Checkbox defaultValue={oDO.checked} onChange={(e) => handleChecked(e.target.value, oDO.id)} />
                                                                                                    </td>
                                                                                                    <td>{partno}</td>
                                                                                                    <td>{parseInt(oDO.do).toLocaleString('en')}</td>
                                                                                                    <td>
                                                                                                        <input type='number' className='rounded-md' style={{ border: '1px solid #ddd' }} value={oDO.input} onChange={(e) => handleChangeDoVal(e.target.value, oDO.id, oDO.do)} />
                                                                                                    </td>
                                                                                                </tr>
                                                                                                // return <Stack direction={'row'} gap={1} py={1}>
                                                                                                //     <FormControlLabel value={partno} control={<Radio size='small' />} label={partno} defaultChecked />
                                                                                                //     <input type='number' className={`rounded-md px-3 ${DrawingSelected.selected == partno ? '' : 'bg-[#ebebebb8]'}`} style={{ border: '1px solid #ddd' }} disabled={DrawingSelected.selected == partno ? false : true} value={DrawingSelected.selected == partno ? DrawingSelected.value : ''} onChange={handleChangeValue} autoFocus />
                                                                                                // </Stack>
                                                                                            })
                                                                                        }
                                                                                        {/* {
                                                                                        DrawingSelected.list.map((oDrawing, iDrawing) => {
                                                                                            let partno = oDrawing.partno;
                                                                                            return <Stack direction={'row'} gap={1} py={1}>
                                                                                                <FormControlLabel value={partno} control={<Radio size='small' />} label={partno} defaultChecked />
                                                                                                <input type='number' className={`rounded-md px-3 ${DrawingSelected.selected == partno ? '' : 'bg-[#ebebebb8]'}`} style={{ border: '1px solid #ddd' }} disabled={DrawingSelected.selected == partno ? false : true} value={DrawingSelected.selected == partno ? DrawingSelected.value : ''} onChange={handleChangeValue} autoFocus />
                                                                                            </Stack>
                                                                                        })
                                                                                    } */}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            {/* <RadioGroup
                                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                                defaultValue={DrawingSelected.selected}
                                                                                onChange={handleChangeDrawing}
                                                                                name="radio-buttons-group"
                                                                            >
                                                                                {
                                                                                    DrawingSelected.list.map((oDrawing, iDrawing) => {
                                                                                        let partno = oDrawing.partno;
                                                                                        return <Stack direction={'row'} gap={1} py={1}>
                                                                                            <FormControlLabel value={partno} control={<Radio  size='small'/>} label={partno} defaultChecked />
                                                                                            <input type='number' className={`rounded-md px-3 ${DrawingSelected.selected == partno ? '' : 'bg-[#ebebebb8]'}`} style={{ border: '1px solid #ddd' }} disabled={DrawingSelected.selected == partno ? false : true} value={DrawingSelected.selected == partno ? DrawingSelected.value : ''} onChange={handleChangeValue} autoFocus />
                                                                                        </Stack>
                                                                                    })
                                                                                }
                                                                            </RadioGroup> */}
                                                                        </Stack>
                                                                        <Divider />
                                                                        <Stack direction={'row'} pt={1} gap={1} justifyContent={'end'}>
                                                                            <Button variant='contained' size='small' onClick={handleSummit}>บันทึก</Button>
                                                                            <Button variant='outlined' size='small' onClick={handleClose}>ปิด</Button>
                                                                        </Stack>
                                                                    </div>
                                                                </Popover>
                                                            </Stack>
                                                        }</td>
                                                    })
                                                })
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </Stack>
                    }
                </div>

            </Stack >
        </div >
    )
}

export default DeliveryManagement