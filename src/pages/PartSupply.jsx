import { TableContainer, Table, TableHead, TableBody, Box, Paper, Typography, TableRow, TableCell, Stack, Button } from '@mui/material'
import { makeStyles } from '@mui/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import { useEffect, useState } from 'react';
import { ServiceGetDataTimeSchedule, ServiceGetListTimeSchedule } from '../Services';
import moment from 'moment';
function PartSupply() {
    const [dt, setDt] = useState(new Date());
    const [data, setData] = useState([]);
    const useStyles = makeStyles({
        table: {
            borderRadius: '10px 0 0 10px',
            minWidth: 650,
            "& th": {
                borderLeft: "1px solid rgba(224, 224, 224, 1)",
                textAlign: 'center',
                background: '#f2f6fa',
                color: '#464647'
            }
        }
    });
    const classes = useStyles();
    async function fetchData() {
        const reslistTimeSchedule = await ServiceGetListTimeSchedule();
        const res = await ServiceGetDataTimeSchedule({ startDate: moment().format('YYYYMMDD') });
        reslistTimeSchedule.map((item) => {
            item.data = res.filter(x => x.timeScheduleDelivery == item.code);
            item.qty = item.data.reduce(function (prev, current) {
                return prev + current.doVal
            }, 0)
            return item;
        });
        setData(reslistTimeSchedule)
    }
    useEffect(() => {
        setInterval(() => {
            setDt(new Date());
        }, 1000);
    }, []);
    useEffect(() => {
        fetchData();
    }, []);
    return <>
        <Box className={`h-[100%] bg-[#e4e5ec] `} p={4}>
            <Box className='bg-white'>
                <Stack direction='row' className='bg-white p-3 rounded-t-lg' justifyContent={'space-between'}>
                    <Stack pl={2} justifyContent={'center'}>
                        <Typography className='font-semibold text-xl'>Time Schedule Receive Parts</Typography>
                        <Typography className='text-[#bcbdc2]'>Updated 48 mins ago</Typography>
                    </Stack>
                    <Stack pl={2} justifyContent={'center'} alignItems={'center'}>
                        {/* <Typography className='font-semibold text-xl'>26/09/2023</Typography> */}
                        <Typography className='font-semibold text-xl'>{dt.toLocaleString("en-US", {

                            dateStyle: "full",
                            timeStyle: "medium",
                            hour12: false,

                        })}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={1} className='bg-[#e4e5ec] rounded-xl' p={1}>
                        <div className='bg-white px-4 py-2 rounded-lg cursor-pointer shadow-md font-semibold' variant='contained'>TODAY</div>
                        <div className='bg-white px-4 py-2 rounded-lg cursor-pointer shadow-md  font-semibold' variant='contained'>RECEIVED</div>
                        <div className='bg-white px-4 py-2 rounded-lg cursor-pointer shadow-md  font-semibold' variant='contained'>REMAIN</div>
                    </Stack>
                </Stack>
                <Box pl={3} pr={3} pb={3} >
                    <TableContainer
                        sx={{
                            borderRadius: "14px",
                        }} className='h-[85%] '>
                        <Table sx={{ borderRadius: "20px" }} className={`${classes.table}`} size='small' style={{ border: '1px solid rgb(235 232 232)' }}>
                            <TableHead>
                                <TableRow >
                                    <TableCell className='text-3xl text-center w-[10%]'>
                                        <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} gap={1}>
                                            <AccessTimeIcon />
                                            <span>TIME</span>
                                        </Stack>
                                    </TableCell>
                                    <TableCell className='text-3xl w-[20%]'>VENDER </TableCell>
                                    <TableCell className='text-3xl w-[15%]'>PART NO</TableCell>
                                    <TableCell className='text-3xl w-[20%]'>PART NAME</TableCell>
                                    <TableCell className='text-3xl w-[15%]'> WH</TableCell>
                                    <TableCell className='text-3xl w-[20%]'>QTY</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.map((item, index) => {
                                        return item.data.map((el, ind) => {
                                            var firstOfData = item.data.indexOf(el);
                                            var rowSpan = firstOfData ? 0 : item.data.length;
                                            return <TableRow >
                                                {
                                                    rowSpan > 0 && <TableCell rowSpan={rowSpan} className='font-semibold text-center  align-top text-lg p-0'>{item.code.substring(0, 5)} - {moment(item.code, 'HH.mm.ss').add(item.refCode, 'minutes').format('HH:mm')}</TableCell>
                                                }
                                                {
                                                    rowSpan > 0 && <TableCell rowSpan={rowSpan} className='align-top font-semibold'>{el.vdDesc}</TableCell>
                                                }

                                                <TableCell className='font-semibold text-center'>{el.partno}</TableCell>
                                                <TableCell>{el.description}</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell className='text-right font-semibold text-lg p-0 pr-3'>{parseFloat(el.doVal).toLocaleString('en')}</TableCell>
                                            </TableRow>;
                                        })
                                    })
                                }
                                <TableRow>
                                    <TableCell><img src="" alt="" className='h-[50000px]' /></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    </>
}
export default PartSupply;