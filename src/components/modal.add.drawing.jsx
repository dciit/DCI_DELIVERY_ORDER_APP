import { Button, Input, Modal, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  APIAddPartMaster,
  ServiceGetSupplier,
  API_LOAD_DATA,
  APIAddPartMasterAll 
} from "../Services";
import { useSelector } from "react-redux";
import { Table } from "antd";

const columns = [
  {
    title: "Partno",
    dataIndex: "partno",
    key: "partno",
  },
  {
    title: "Description",
    dataIndex: "desc",
    key: "desc",
  },
  {
    title: "BOX Qty",
    dataIndex: "boxQty",
    key: "boxQty",
  },
];

function ModalAddDrawing({ open, setOpen, load, vdCode }) {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, msg) => {
    api[type]({
      message: "แจ้งเตือน",
      description: msg,
    });
  };
  const [selectType, setselectType] = useState("MANUAL");
  const redux = useSelector((state) => state.mainReducer);
  const empcode = redux.id;
  const [venders, setVenders] = useState([]);
  const [data, setData] = useState({
    vender: "",
    unit: "PCS",
    description: "",
    boxQty: 100,
    boxMin: 100,
    updateBy: empcode,
  });

  const [dataSource, setdataSource] = useState([]);

  useEffect(() => {
    if (open) {
      init();
    }
  }, [open]);
  const init = async () => {
    let RESLoadVender = await ServiceGetSupplier("41256");
    try {
      setVenders(RESLoadVender.data);
    } catch {
      setVenders([]);
    }
  };
  useEffect(() => {
    if (venders.length > 0) {
      setData({ ...data, vender: venders[0].vdCode });
    }
  }, [venders]);

  useEffect(() => {
    if (selectType == "LOAD") {
      onLoadData();
    }
  }, [selectType, data.vender]);

  const onLoadData = async () => {
    let res = await API_LOAD_DATA(data.vender,empcode);
    setdataSource(res);
  };

  const addDrawing = async () => {

    if(selectType == "MANUAL"){
        let RESAddDrawing = await APIAddPartMaster(data);
        try {
          if (RESAddDrawing.status == true) {
            openNotificationWithIcon("success", "บันทึกข้อมูลสําเร็จ");
          }
        } catch (e) {
          openNotificationWithIcon(
            "error",
            "เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล หรือ มีข้อมูลอยู่แล้ว"
          );
        }
    }else if(selectType == "LOAD"){
        let RESAddDrawing = await APIAddPartMasterAll(dataSource);
        try {
            if (RESAddDrawing.status == true) {
              openNotificationWithIcon("success", "บันทึกข้อมูลสําเร็จ");
            }
          } catch (e) {
            openNotificationWithIcon(
              "error",
              "เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล หรือ มีข้อมูลอยู่แล้ว"
            );
          }
    }

   
  };
  return (
    <Modal
      title="Add Drawing"
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <div className="flex gap-2 justify-end">
          <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
          <Button type="primary" onClick={() => addDrawing()}>
            บันทึก
          </Button>
        </div>
      }
    >
      {contextHolder}
      <div></div>
      <ul className="list-none  hidden text-md shadow-b  text-center  rounded-lg  sm:flex  mt-4 ">
        <li className="w-full focus-within:z-10 ">
          <button
            onClick={() => setselectType("MANUAL")}
            className={`inline-block  w-full p-2 cursor-pointer  border-1  border-gray-100  rounded-s-lg  ${
              selectType === "MANUAL" ? "text-white bg-[#1677ff]" : "text-black"
            }     `}
          >
            Manual
          </button>
        </li>
        <li className="w-full focus-within:z-10 list:none">
          <button
            onClick={() => setselectType("LOAD")}
            className={`inline-block w-full p-2 cursor-pointer  border-s-0  border-gray-100  rounded-e-lg  ${
              selectType === "LOAD" ? "text-white bg-[#1677ff] " : "text-black"
            }     `}
          >
            Load Drawing{" "}
          </button>
        </li>
      </ul>

      {selectType == "MANUAL" ? (
        <>
          <div id="content" className="py-3 flex gap-3 flex-col">
            <div className="grid grid-cols-4">
              <div className="flex justify-end pr-2 items-center">
                <span>Vender : </span>
              </div>
              <div className="col-span-3">
                <Select
                  className="w-full"
                  value={data.vender}
                  onChange={(e) => setData({ ...data, vender: e })}
                >
                  {venders.map((item, index) => {
                    return (
                      <Select.Option value={item.vdCode} key={index}>
                        {item.vdDesc}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="flex justify-end pr-2 items-center">
                <span>Drawing : </span>
              </div>
              <div className="col-span-3">
                <Input
                  type="text"
                  placeholder="กรุณาระบุ Drawing ที่ต้องการ"
                  onChange={(e) =>
                    setData({ ...data, drawing: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="flex justify-end pr-2 items-center">
                <span>Description : </span>
              </div>
              <div className="col-span-3">
                <Input
                  type="text"
                  placeholder="กรุณาระบุ Drawing ที่ต้องการ"
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="flex justify-end pr-2 items-center">
                <span>CM : </span>
              </div>
              <div className="col-span-3">
                <Input
                  type="text"
                  placeholder="กรุณาระบุ CM ที่ต้องการ"
                  onChange={(e) => setData({ ...data, cm: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="flex justify-end pr-2 items-center">
                <span>จำนวนชิ้นงานขั้นต่ำในการจัดส่ง : </span>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="กรุณาระบุจำนวน Box ที่ต้องการ"
                  value={data.boxQty}
                  onChange={(e) =>
                    setData({ ...data, boxMin: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="flex justify-end pr-2 items-center">
                <span>Std. Packing : </span>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="กรุณาระบุจำนวน Box ที่ต้องการ"
                  value={data.boxQty}
                  onChange={(e) =>
                    setData({ ...data, boxQty: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="flex justify-end pr-2 items-center">
                <span>UNIT : </span>
              </div>
              <div className="col-span-3">
                <Select
                  value={data.unit}
                  onChange={(e) => setData({ ...data, unit: e })}
                >
                  <Select.Option value="PCS">PCS</Select.Option>
                  <Select.Option value="KG">KG</Select.Option>
                </Select>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
       
          <div id="content" className="py-3 flex gap-3 flex-col">
            <div className="grid grid-cols-4">
              <div className="flex justify-end pr-2 items-center">
                <span>Vender : </span>
              </div>
              <div className="col-span-3">
                <Select
                  className="w-full"
                  value={data.vender}
                  onChange={(e) => setData({ ...data, vender: e })}
                >
                  {venders.map((item, index) => {
                    return (
                      <Select.Option value={item.vdCode} key={index}>
                        {item.vdDesc}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              <div className="col-span-4 py-8">
              
                <Table size="small" bordered  dataSource={dataSource} columns={columns} />

              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

export default ModalAddDrawing;
