import React, { useEffect, useMemo, useState } from "react";
import { API_WARINING_DO } from "../Services";
import UpdateIcon from '@mui/icons-material/Update';
import { CircularProgress } from "@mui/material";
import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select, Space } from "antd";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function DoWarning() {
  const redx = useSelector((state) => state.mainReducer);

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateNow,setdateNow] = useState("");

  useEffect(() => {
    initContent();
  }, []);

  async function initContent() {
    setLoading(true);
    const initPlan = await API_WARINING_DO();
    setData(initPlan);
    setdateNow(initPlan[0].dateRound)
    setLoading(false);
  }

  const columns = useMemo(
    () => [

      {
        accessorKey: "date",
        header: "DATE",
        size: 50,
        Cell: ({ cell }) => (
          <span>{moment(cell.getValue()).format("DD/MM/YYYY")}</span>
        ),
      },
      {
        accessorFn: (row) => `${row.vdCode}` + ":" + `${row.vdName}`,
        header: "Vender",
        size: 200,
        Cell: ({ renderedCellValue }) => {
          return (
            <>
              <span>{renderedCellValue?.split(":")[0]}</span> <br />
              <span>{renderedCellValue?.split(":")[1]}</span>
            </>
          );
        },
      },

      {
        accessorFn: (row) =>
          `${row.partNo} ${row.cm}` + ":" + `${row.description}`,
        header: "PARTNO",
        size: 100,
        Cell: ({ renderedCellValue }) => {
          return (
            <>
              <span>{renderedCellValue?.split(":")[0]}</span> <br />
              <span>{renderedCellValue?.split(":")[1]}</span>
            </>
          );
        },
      },
  

      {
        accessorKey: "stock",
        header: "STOCK",
        Cell: ({ cell }) => (
          <span className="text-red-500 ">
            {cell.getValue().toLocaleString("en-Us")}
          </span>
        ),
        size: 100,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { density: "compact" },
    enableRowActions: true,
    positionActionsColumn: "last",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Action",
      },
    },
    renderRowActions: ({ row }) => [
      <Button
        type="primary"
        onClick={() => warningAction(row.original.vdCode, row.original.partNo)}
        icon={<EditOutlined />}
      >
        แก้ไขจำนวนสั่งซื้อ
      </Button>,
    ],
  });

  const warningAction = (vdCode, partNo) => {
    dispatch({
      type: "ADJ_WARNING_STOCK_TO_DELIVERLY",
      payload: { vdCode: vdCode, partNo: partNo },
    });

 
    dispatch({ type: "SET_ACTIVE_MENU", payload: 'd/o' });

    window.open("/do", "_blank", "noreferrer");

  };

  return (
    <>
      <div className="p-6">
        <div className="flex flex-row justify-between">
          <div>  <span>แจ้งเตือน Stock Part Shortage</span></div>
      
        <div>  <span className="text-[#5b5b5b]">Update :</span>
        <span className="font-bold p-2 text-[#5c5fc8]">{Object.keys(data).length > 0 && moment(dateNow).format("DD/MM/YYYY HH:mm")}</span>
        &nbsp;&nbsp;&nbsp;
        <span className="font-bold p-2 text-green-800 bg-green-100 ring-1 ring-green-500 rounded-lg">ข้อมูล Stock Part Shortage อัพเดททุก 30 นาที</span></div>
      
        </div>
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full mt-8 loading">
            <CircularProgress style={{ color: "#5c5fc8" }} />
            <span className=" mt-3">กำลังโหลดข้อมูล . . .</span>
          </div>
        ) : (
          <>
            <div className="mt-4">
              {" "}
              <MaterialReactTable table={table} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DoWarning;
