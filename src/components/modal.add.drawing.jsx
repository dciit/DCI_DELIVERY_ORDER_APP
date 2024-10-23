import { Button, Input, Modal, notification, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import {  APIAddPartMaster, ServiceGetSupplier } from '../Services';
import { useSelector } from 'react-redux';
function ModalAddDrawing({ open, setOpen, load, vdCode }) {
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, msg) => {
        api[type]({
            message: 'แจ้งเตือน',
            description: msg
        });
    };
    const redux = useSelector(state => state.mainReducer);
    const empcode = redux.id;
    const [venders, setVenders] = useState([]);
    const [data, setData] = useState({
        vender: '',
        unit: 'PCS',
        description: '',
        boxQty: 100,
        boxMin: 100,
        updateBy: empcode
    });
    useEffect(() => {
        if (open) {
            init();
        }
    }, [open])
    const init = async () => {
        let RESLoadVender = await ServiceGetSupplier('41256');
        try {
            setVenders(RESLoadVender.data);
        } catch {
            setVenders([]);
        }
    }
    useEffect(() => {
        if (venders.length > 0) {
            setData({ ...data, vender: venders[0].vdCode })
        }
    }, [venders])
    const addDrawing = async () => {
        let RESAddDrawing = await APIAddPartMaster(data);
        try {
            if (RESAddDrawing.status == true) {
                openNotificationWithIcon('success', 'บันทึกข้อมูลสําเร็จ')
            }
        } catch (e) {
            openNotificationWithIcon('error', 'เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล หรือ มีข้อมูลอยู่แล้ว')
        }
    }
    return (
        <Modal title='Add Drawing' open={open} onCancel={() => setOpen(false)} footer={<div className='flex gap-2 justify-end'>
            <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
            <Button type="primary" onClick={() => addDrawing()}>บันทึก</Button>
        </div>}>
            {
                contextHolder
            }
            <div id='content' className='py-3 flex gap-3 flex-col'>
                <div className='grid grid-cols-4'>
                    <div className='flex justify-end pr-2 items-center'>
                        <span>Vender : </span>
                    </div>
                    <div className='col-span-3'>
                        <Select className='w-full' value={data.vender} onChange={(e) => setData({ ...data, vender: e })}>
                            {
                                venders.map((item, index) => {
                                    return <Select.Option value={item.vdCode} key={index}>{item.vdDesc}</Select.Option>
                                })
                            }

                        </Select>
                    </div>
                </div>
                <div className='grid grid-cols-4'>
                    <div className='flex justify-end pr-2 items-center'>
                        <span>Drawing : </span>
                    </div>
                    <div className='col-span-3'>
                        <Input type='text' placeholder='กรุณาระบุ Drawing ที่ต้องการ' onChange={(e) => setData({ ...data, drawing: e.target.value })} />
                    </div>
                </div>
                <div className='grid grid-cols-4'>
                    <div className='flex justify-end pr-2 items-center'>
                        <span>Description : </span>
                    </div>
                    <div className='col-span-3'>
                        <Input type='text' placeholder='กรุณาระบุ Drawing ที่ต้องการ' onChange={(e) => setData({ ...data, description: e.target.value })} />
                    </div>
                </div>
                <div className='grid grid-cols-4'>
                    <div className='flex justify-end pr-2 items-center'>
                        <span>CM : </span>
                    </div>
                    <div className='col-span-3'>
                        <Input type='text' placeholder='กรุณาระบุ CM ที่ต้องการ' onChange={(e) => setData({ ...data, cm: e.target.value })} />
                    </div>
                </div>
                <div className='grid grid-cols-4'>
                    <div className='flex justify-end pr-2 items-center'>
                        <span>Box Min : </span>
                    </div>
                    <div className='col-span-3'>
                        <Input type='number' placeholder='กรุณาระบุจำนวน Box ที่ต้องการ' value={data.boxQty} onChange={(e) => setData({ ...data, boxMin: Number(e.target.value) })} />
                    </div>
                </div>
                <div className='grid grid-cols-4'>
                    <div className='flex justify-end pr-2 items-center'>
                        <span>Box Qty : </span>
                    </div>
                    <div className='col-span-3'>
                        <Input type='number' placeholder='กรุณาระบุจำนวน Box ที่ต้องการ' value={data.boxQty} onChange={(e) => setData({ ...data, boxQty: Number(e.target.value) })} />
                    </div>
                </div>
                <div className='grid grid-cols-4'>
                    <div className='flex justify-end pr-2 items-center'>
                        <span>UNIT : </span>
                    </div>
                    <div className='col-span-3'>
                        <Select value={data.unit} onChange={(e) => setData({ ...data, unit: e })}>
                            <Select.Option value='PCS'>PCS</Select.Option>
                            <Select.Option value='KG'>KG</Select.Option>
                        </Select>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalAddDrawing