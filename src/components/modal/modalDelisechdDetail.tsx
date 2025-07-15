import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import srvDelisec from '../../Services/delisc.service';
import { DeliSecDetail } from '../../interface/delisc.interface';
import moment from 'moment';

interface Props {
    param: string;
    modalStatus: boolean;
    onClose?: () => void;
}

const modalDelisechdDetail = (prp: Props) => {
    const { param, modalStatus, onClose } = prp;
    const [modalState, setModalState] = useState<boolean>(modalStatus);
    const [loading, setloading] = useState<boolean>(false);
    const [Delidetail, setDelidetail] = useState<DeliSecDetail[]>();
    const init = async () => {
        try {
            setloading(true);
            const res = await srvDelisec.GET_DELISEC_DETAIL(JSON.stringify(param));
            setDelidetail(res.data);
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false);
        }
    }
    useEffect(() => {
        init();
    }, [])
    const handleClose = () => {
        setModalState(false);
        if (onClose) onClose();
    };
    console.log(Delidetail);
    return (
        <div>
            <Modal
                loading={loading}
                width={1800}
                title={`รายการที่ต้องส่ง ณ วันที่ ${moment().format("YYYY-MM-DD")}`}
                open={modalState}
                onCancel={handleClose}
                footer={[
                    <Button key="cancel" onClick={handleClose}>
                        ปิด
                    </Button>,
                ]}
                styles={{
                    header: {
                        borderBottom: "1px solid #5d5d5d",
                    },
                }}
            >
                <div>
                    <div className=''></div>
                    <div className='table w-full'>
                        <table className="min-w-full border border-gray-300 text-sm text-center">
                            <thead className="bg-blue-500 text-white sticky top-0 z-10">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">#</th>
                                    <th className="border border-gray-300 px-4 py-2">System</th>
                                    <th className="border border-gray-300 px-4 py-2">Supplier</th>
                                    <th className="border border-gray-300 px-4 py-2">Part No</th>
                                    <th className="border border-gray-300 px-4 py-2">Description</th>
                                    <th className="border border-gray-300 px-4 py-2">Cap</th>
                                    <th className="border border-gray-300 px-4 py-2">Delivery Cycle</th>
                                    <th className="border border-gray-300 px-4 py-2">Time Schedule</th>
                                    <th className="border border-gray-300 px-4 py-2">P/O Remain</th>
                                    <th className="border border-gray-300 px-4 py-2">Plan Q'ty</th>
                                    <th className="border border-gray-300 px-4 py-2">Actual Time</th>
                                    <th className="border border-gray-300 px-4 py-2">Actual Q'ty</th>
                                    <th className="border border-gray-300 px-4 py-2">Diff Q'ty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Delidetail?.map((item, index) => (
                                    <tr key={index} className="even:bg-blue-50 hover:bg-blue-100">
                                        <td className={`border border-gray-300 px-2 py-1 `}>{index + 1}</td>
                                        <td className={`border border-gray-300 px-2 py-1 ${item.datafrm === "ไม่มีในแผน" ? "text-red-800" : ""}`}>{item.datafrm}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-left `}>({item.vdcode}) {item.vdname}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-left `}>{item.partno} {item.cm}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-left `}>{item.partname}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-right `}>{Number(item.capacity).toLocaleString()}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-left `}>{item.delicycle}</td>
                                        <td className={`border border-gray-300 px-2 py-1 `}>{item.timesech}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-right `}>{Number(item.poremain).toLocaleString()}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-right `}>{Number(item.plan_qty).toLocaleString()}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-right `}>
                                            {item.acttime
                                                ? item.acttime
                                                    .split(",")
                                                    .map((t) => moment(t.trim()).format("HH:mm:ss"))
                                                    .join(", ")
                                                : ""}
                                        </td>
                                        <td className={`border border-gray-300 px-2 py-1 text-right `}>{Number(item.act_qty).toLocaleString()}</td>
                                        <td className={`border border-gray-300 px-2 py-1 text-right ${item.diff_qty >= 0 ? "text-green-800" : "text-red-800"}`}>{item.diff_qty > 0 ? "+" + Number(item.diff_qty).toLocaleString() : Number(item.diff_qty).toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className={`border border-gray-300 px-2 py-1 text-center font-bold`} colSpan={8}>Total</td>
                                    <td className={`border border-gray-300 px-2 py-1 text-right font-bold`}>{Number((Delidetail ?? []).reduce((sum, item) => sum + item.poremain, 0)).toLocaleString()}</td>
                                    <td className={`border border-gray-300 px-2 py-1 text-right font-bold`}>{Number((Delidetail ?? []).reduce((sum, item) => sum + item.plan_qty, 0)).toLocaleString()}</td>
                                    <td className={`border border-gray-300 px-2 py-1 text-right font-bold`}></td>
                                    <td className={`border border-gray-300 px-2 py-1 text-right font-bold`}>{Number((Delidetail ?? []).reduce((sum, item) => sum + item.act_qty, 0)).toLocaleString()}</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </Modal >
        </div >
    )
}

export default modalDelisechdDetail