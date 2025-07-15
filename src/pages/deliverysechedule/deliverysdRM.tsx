import moment from 'moment/moment'
import React, { useEffect, useState, useRef } from 'react'
import srvDelisec from '../../Services/delisc.service';
import { DeliverySec } from '../../interface/delisc.interface';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, CircularProgress, Avatar, Typography
} from '@mui/material';

const deliverysdRM = () => {
    const [Loading, setLoading] = useState<boolean>(false);
    const [DeliSec, setDeliSec] = useState<DeliverySec[]>([]);
    const [scrolling, setScrolling] = useState<boolean>(false)
    const [DateNow, setDateNow] = useState<string>(moment().format("YYYY-MM-DD HH:mm:ss"));
    const [countdown, setCountdown] = useState<number>(600);
    const intervalRef = useRef<number | null>(null);
    const tableContainerRef = useRef<HTMLDivElement | null>(null);

    const init = async () => {
        try {
            setLoading(true);
            const resDeliSec = await srvDelisec.GET_DELISEC();
            setDeliSec(resDeliSec.data);
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const delay = 50; // ms ต่อการ scroll 1px

        const scrollSmoothly = (time: number) => {
            if (tableContainerRef.current) {
                const el = tableContainerRef.current;
                const maxScroll = el.scrollHeight - el.clientHeight;

                if (time - lastTime >= delay) {
                    el.scrollTop += 1;
                    if (el.scrollTop >= maxScroll) {
                        el.scrollTop = 0;
                    }
                    lastTime = time;
                }

                animationFrameId = requestAnimationFrame(scrollSmoothly);
            }
        };

        animationFrameId = requestAnimationFrame(scrollSmoothly);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current); // <-- ใช้ number
            }
        };
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            init();
            setCountdown(600);
        }
    }, [countdown]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    return (
        <div className='h-full w-full'>
            <div className='MuiStack-root custome-bg  p-3 rounded-t-lg css-gmwslw-MuiStack-root'>
                <div className='flex flex-row items-center justify-between px-2 py-2 '>
                    <div className='text-[3rem] font-bold text-blue-50'>DELIVERY SECHEDULE</div>
                    <div>
                        <div className='text-[2rem] font-bold text-blue-50'>ข้อมูลล่าสุดเมื่อ : {DateNow}</div>
                        <div className='text-right text-blue-50'>{formatTime(countdown)}</div>
                    </div>

                </div>

                {/* data */}
                <div className='mt-2 w-full h-[90vh] overflow-auto scrollbar-thin' id='container-table'>
                    <TableContainer component={Paper} sx={{ maxHeight: '90vh', overflowY: 'auto' }} className="scrollbar-thin" ref={tableContainerRef}>
                        <table style={{ minWidth: 650 }} aria-label="delivery summary table" className='border-collapse '>
                            <thead className='drop-shadow-md custome-bg-h sticky top-0 h-[200px] z-10'>
                                <tr>
                                    <th rowSpan={2} className='font-bold text-[1.5rem] text-center text-white w-[500px] sticky top-0 z-10 border-0'>Supplier</th>
                                    <th colSpan={2} className='font-bold text-[1.5rem] text-center text-white w-[500px] sticky top-0 z-10'>จำนวนที่ต้องส่ง</th>
                                    <th colSpan={2} className='font-bold text-[1.5rem] text-center text-white w-[500px] sticky top-0 z-10'>จำนวนที่มาส่งจริง</th>
                                    <th colSpan={2} className='font-bold text-[1.5rem] text-center text-white w-[500px] sticky top-0 z-10'>Diff</th>
                                    <th rowSpan={2} className='font-bold text-[1.5rem] text-center text-white w-[500px] sticky top-0 z-10'>สถานะ</th>
                                    <th rowSpan={2} className='font-bold text-[1.5rem] text-center text-white w-[500px] sticky top-0 z-10'>PU Incharge</th>
                                </tr>
                                <tr>
                                    <th className='font-bold text-[1.5rem] text-center text-white w-[250px] sticky top-[56px] z-10'>Plan(Item)</th>
                                    <th className='font-bold text-[1.5rem] text-center text-white w-[250px] sticky top-[56px] z-10'>Plan(Qty)</th>
                                    <th className='font-bold text-[1.5rem] text-center text-white w-[250px] sticky top-[56px] z-10'>Act.(Item)</th>
                                    <th className='font-bold text-[1.5rem] text-center text-white w-[250px] sticky top-[56px] z-10'>Act.(Qty)</th>
                                    <th className='font-bold text-[1.5rem] text-center text-white w-[250px] sticky top-[56px] z-10'>Item</th>
                                    <th className='font-bold text-[1.5rem] text-center text-white w-[250px] sticky top-[56px] z-10'>Qty</th>
                                </tr>
                            </thead>


                            <tbody >
                                {Loading ? (
                                    <tr>
                                        <td colSpan={8} align="center">
                                            <CircularProgress />
                                        </td>
                                    </tr>
                                ) : (
                                    DeliSec.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ fontSize: '1.5rem', borderBottom: '1px solid', textAlign: 'left', borderRight: '1px solid' }} className='border-gray-900 drop-shadow-xl  text-sky-200/90 py-1 px-1 bg-transparent '>
                                                {item.datafrm} | ({item.vdcode}) {item.vdname}  <br />
                                            </td>
                                            <td style={{ fontSize: '1.5rem', borderBottom: '1px solid', textAlign: 'right' }} className='border-gray-900 drop-shadow-xl  text-sky-200/90 py-1 px-1 bg-transparent '>
                                                {item.plan_item}
                                            </td>
                                            <td style={{ fontSize: '1.5rem', borderBottom: '1px solid', textAlign: 'right' }} className='border-gray-900 drop-shadow-xl  text-sky-200/90 py-1 px-1 bg-transparent '>
                                                {Number(item.plan_qty)?.toLocaleString() || "0"}
                                            </td>
                                            <td style={{ fontSize: '1.5rem', borderBottom: '1px solid', textAlign: 'right' }} className='border-gray-900 drop-shadow-xl  text-sky-200/90 py-1 px-1 bg-transparent '>
                                                {Number(item.act_item)?.toLocaleString() || "0"}
                                            </td>
                                            <td style={{ fontSize: '1.5rem', borderBottom: '1px solid', textAlign: 'right' }} className='border-gray-900 drop-shadow-xl  text-sky-200/90 py-1 px-1 bg-transparent '>
                                                {Number(item.act_qty)?.toLocaleString() || "0"}
                                            </td>
                                            <td style={{ fontSize: '1.5rem', borderBottom: '1px solid', textAlign: 'right' }}
                                                className={`border-gray-900 drop-shadow-xl   py-1 px-1 bg-transparent 
                                                    ${item.diff_item > 0 ? "text-blue-500" : item.diff_item < 0 ? "text-red-500" : "text-green-500"}`}>
                                                {Number(item.diff_item)?.toLocaleString() || "0"}
                                            </td>
                                            <td style={{ fontSize: '1.5rem', borderBottom: '1px solid', textAlign: 'right' }}
                                                className={`border-gray-900 drop-shadow-xl   py-1 bg-transparent pr-3 
                                                ${item.diff_qty > 0 ? "text-blue-500" : item.diff_qty < 0 ? "text-red-500" : "text-green-500"}`}>
                                                {Number(item.diff_qty)?.toLocaleString() || "0"}
                                            </td>
                                            <td style={{ fontSize: '1.75rem', borderBottom: '1px solid', textAlign: 'center', borderRight: '1px solid #ddd', borderLeft: '1px solid #ddd' }}
                                                className={`border-gray-900  text-center py-1 px-4 bg-transparent  `}>
                                                <div
                                                    style={{ border: '1px solid' }}
                                                    className={` bg-transparent  py-1 rounded text-black w-full 
                                                        ${item.diff_qty > 0 && item.diff_item > 0
                                                            ? " text-blue-500"
                                                            : item.diff_qty > 0 && item.diff_item < 0
                                                                ? "text-yellow-500"
                                                                : item.diff_qty < 0 && item.diff_item > 0
                                                                    ? "text-yellow-500"
                                                                    : item.diff_qty < 0 && item.diff_item < 0
                                                                        ? "text-red-500"
                                                                        : item.diff_qty === 0 && item.diff_item !== 0
                                                                            ? "text-yellow-500"
                                                                            : item.diff_qty !== 0 && item.diff_item === 0
                                                                                ? "text-yellow-500"
                                                                                : "text-green-500"}
                                                `}>
                                                    {
                                                        item.diff_qty > 0 && item.diff_item > 0
                                                            ? "ส่งเกิน"
                                                            : item.diff_qty > 0 && item.diff_item < 0
                                                                ? "ส่งเกิน"
                                                                : item.diff_qty < 0 && item.diff_item > 0
                                                                    ? "ส่งเกิน"
                                                                    : item.diff_qty < 0 && item.diff_item < 0
                                                                        ? "ยังไม่ส่ง"
                                                                        : item.diff_qty === 0 && item.diff_item !== 0
                                                                            ? "ส่งไม่ตรง"
                                                                            : item.diff_qty !== 0 && item.diff_item === 0
                                                                                ? "ส่งไม่ตรง"
                                                                                : "ส่งครบแล้ว"
                                                    }
                                                </div>



                                            </td>
                                            <td align="center" style={{ fontSize: '1.5rem', borderBottom: '1px solid', textAlign: 'center' }} className='border-gray-700  text-white bg-transparent py-2'>
                                                <div className='flex flex-row items-center w-full justify-start gap-4 pl-6 '>
                                                    <div>
                                                        <img
                                                            src={`https://scm.dci.co.th/pic/${item.inchange_code}.JPG`}
                                                            style={{ width: 80, height: 90, margin: '0 auto', borderRadius: 8 }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Typography variant="body2" sx={{ fontSize: '1rem', mt: 1 }}>
                                                            {item.inchange_name}
                                                        </Typography>
                                                    </div>

                                                </div>

                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </TableContainer>
                </div>
            </div>
        </div >
    )
}

export default deliverysdRM