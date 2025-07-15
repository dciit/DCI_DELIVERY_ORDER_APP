import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import srvDelisec from '../../Services/delisc.service';
import { DeliverySec } from '../../interface/delisc.interface';
import { CircularProgress, Typography } from '@mui/material';
import DeliSechDetail from '../../components/modal/modalDelisechdDetail';

const deliverysdRMPU = () => {
    const [Loading, setLoading] = useState<boolean>(false);
    const [DeliSec, setDeliSec] = useState<DeliverySec[]>([]);
    const [ModalStatusDetail, setModalStatusDetail] = useState<boolean>(false);
    const [refresh, setRefresh] = useState(false);
    const [Param, setParam] = useState<string>("");

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

    const CloseDelisechdetail = () => {
        setModalStatusDetail(false);
        setRefresh(prev => !prev);
    }

    const handdleClickDetail = (item: string) => {
        setModalStatusDetail(true);
        setParam(item);
    }
    return (
        <div className='h-full p-4'>

            <div className='flex flex-row items-center justify-between'>
                <div className='text-[1.5rem] font-bold text-[#5C5FC8]'>
                    DELIVERY SECHEDULE
                </div>
                <div>
                    <div className='text-[1.5rem] font-bold text-[#5C5FC8]'>ข้อมูลล่าสุดเมื่อ : {moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                </div>

            </div>

            {/* data */}
            <div className='mt-2 h-[90vh]  overflow-auto scrollbar-thin'>
                <table style={{ minWidth: 650 }} aria-label="delivery summary table" className='border-collapse'>
                    <thead className='drop-shadow-md custome-bg-h sticky top-0 h-[100px] z-10'>
                        <tr>
                            <th rowSpan={2} className='font-bold text-[1rem] text-center text-white w-[400px] sticky top-0 z-10 border-0'>Supplier</th>
                            <th colSpan={2} className='font-bold text-[1rem] text-center text-white w-[400px] sticky top-0 z-10'>จำนวนที่ต้องส่ง</th>
                            <th colSpan={2} className='font-bold text-[1rem] text-center text-white w-[400px] sticky top-0 z-10'>จำนวนที่มาส่งจริง</th>
                            <th colSpan={2} className='font-bold text-[1rem] text-center text-white w-[400px] sticky top-0 z-10'>Diff</th>
                            <th rowSpan={2} className='font-bold text-[1rem] text-center text-white w-[400px] sticky top-0 z-10'>สถานะ</th>
                            <th rowSpan={2} className='font-bold text-[1rem] text-center text-white w-[400px] sticky top-0 z-10'>PU Incharge</th>
                        </tr>
                        <tr>
                            <th className='font-bold text-[1rem] text-ceter text-white w-[200px] sticky top-[56px] z-10'>Plan(Item)</th>
                            <th className='font-bold text-[1rem] text-ceter text-white w-[200px] sticky top-[56px] z-10'>Plan(Qty)</th>
                            <th className='font-bold text-[1rem] text-ceter text-white w-[200px] sticky top-[56px] z-10'>Act.(Item)</th>
                            <th className='font-bold text-[1rem] text-ceter text-white w-[200px] sticky top-[56px] z-10'>Act.(Qty)</th>
                            <th className='font-bold text-[1rem] text-ceter text-white w-[200px] sticky top-[56px] z-10'>Item</th>
                            <th className='font-bold text-[1rem] text-ceter text-white w-[200px] sticky top-[56px] z-10'>Qty</th>
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
                                    <td style={{ borderBottom: '1px solid', borderRight: '1px solid' }} className='border-gray-400 drop-shadow-xl  text-sky-700  bg-transparent px-2'>
                                        {item.datafrm} | ({item.vdcode}) {item.vdname}  <br />
                                        <button
                                            onClick={() => handdleClickDetail(item.vdcode)}
                                            className='custome-bg-h text-gray-200 border-none rounded cursor-pointer hover:'>ดูรายละเอียด</button>
                                    </td>
                                    <td style={{ borderBottom: '1px solid' }} className='border-gray-400 drop-shadow-xl  text-sky-700  bg-transparent text-center'>
                                        {item.plan_item}
                                    </td>
                                    <td style={{ borderBottom: '1px solid' }} className='border-gray-400 drop-shadow-xl  text-sky-700  bg-transparent text-center'>
                                        {Number(item.plan_qty)?.toLocaleString() || "0"}
                                    </td>
                                    <td style={{ borderBottom: '1px solid' }} className='border-gray-400 drop-shadow-xl  text-sky-700  bg-transparent text-center'>
                                        {Number(item.act_item)?.toLocaleString() || "0"}
                                    </td>
                                    <td style={{ borderBottom: '1px solid' }} className='border-gray-400 drop-shadow-xl  text-sky-700  bg-transparent text-center'>
                                        {Number(item.act_qty)?.toLocaleString() || "0"}
                                    </td>
                                    <td style={{ borderBottom: '1px solid' }}
                                        className={`border-gray-400 drop-shadow-xl bg-transparent text-center font-bold
                                                    ${item.diff_item > 0 ? "text-blue-500" : item.diff_item < 0 ? "text-red-500" : "text-green-700"}`}>
                                        {Number(item.diff_item)?.toLocaleString() || "0"}
                                    </td>
                                    <td style={{ borderBottom: '1px solid' }}
                                        className={`border-gray-400 drop-shadow-xl bg-transparent  text-center font-bold
                                                ${item.diff_qty > 0 ? "text-blue-500" : item.diff_qty < 0 ? "text-red-500" : "text-green-700"}`}>
                                        {Number(item?.diff_qty)?.toLocaleString() || "0"}
                                    </td>
                                    <td style={{ borderBottom: '1px solid', borderRight: '1px solid #ddd', borderLeft: '1px solid #ddd' }}
                                        className={`text-center  bg-transparent  px-2 border-gray-400`}>
                                        <div
                                            style={{ border: '1px solid' }}
                                            className={` bg-transparent  rounded text-black w-full 
                                                        ${item.diff_qty > 0 && item.diff_item > 0
                                                    ? " text-blue-500"
                                                    : item.diff_qty > 0 && item.diff_item < 0
                                                        ? "text-yellow-700"
                                                        : item.diff_qty < 0 && item.diff_item > 0
                                                            ? "text-yellow-700"
                                                            : item.diff_qty < 0 && item.diff_item < 0
                                                                ? "text-red-500"
                                                                : item.diff_qty === 0 && item.diff_item !== 0
                                                                    ? "text-yellow-700"
                                                                    : item.diff_qty !== 0 && item.diff_item === 0
                                                                        ? "text-yellow-700"
                                                                        : "text-green-700"}
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
                                    <td style={{ borderBottom: '1px solid', textAlign: 'center' }} className='border-gray-400  text-sky-700 bg-transparent py-2 px-6'>
                                        <div className='flex flex-row items-center w-full justify-start gap-4 '>
                                            <div>
                                                <img
                                                    src={`https://scm.dci.co.th/pic/${item.inchange_code}.JPG`}
                                                    style={{ width: 50, height: 60, margin: '0 auto', borderRadius: 8 }}
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
            </div>
            {ModalStatusDetail && (
                <DeliSechDetail
                    param={Param}
                    modalStatus={ModalStatusDetail}
                    onClose={CloseDelisechdetail}
                />
            )}
        </div >
    )
}

export default deliverysdRMPU