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
import { Box, Typography } from '@mui/material';
import dayjs from "dayjs";




export const data = [
  {
    id: '1',
    firstName: 'Dylan',
    middleName: 'Sprouse',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    country: 'United States',
  },
  {
    id: '2',
    firstName: 'Raquel',
    middleName: 'Hakeem',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Vancouver',
    state: 'British Columbia',
    country: 'Canada',
  },
  {
    id: '3',
    firstName: 'Ervin',
    middleName: 'Kris',
    lastName: 'Reinger',
  },
  {
    id: '4',
    firstName: 'Brittany',
    middleName: 'Kathryn',
    lastName: 'McCullough',
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
    country: 'United States',
  },
  {
    id: '5',
    firstName: 'Branson',
    middleName: 'John',
    lastName: 'Frami',
  },
];



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
    setdateNow(initPlan[0]?.dateRound);
    setLoading(false);



  }


  const columns = useMemo(
    () => [

      
      {
        accessorFn: (row) => `${row.vdCode}` + ":" + `${row.vdName}`,
        header: "Vender",
        size: 100,
        Cell: ({ renderedCellValue }) => {
          return (
            <>
              <span className="text-lg">{renderedCellValue?.split(":")[0]} </span> <br />
              <span className="text-lg"> {renderedCellValue?.split(":")[1]}</span>
            </>
          );
        },
      },

      {
        accessorKey: "item",
        header: "item",
        size: 50,
        Cell: ({ renderedCellValue }) => {
          return (
            <>
              <span className="text-lg">{renderedCellValue}</span>
              {/* <span className="text-xl"></span> */}
            </>
          );
        },
        
      },

      // {
      //   accessorFn: (row) =>
      //     `${row.partNo} ${row.cm}` + ":" + `${row.description}`,
      //   header: "PARTNO",
      //   size: 100,
      //   Cell: ({ renderedCellValue }) => {
      //     return (
      //       <>
      //         <span>{renderedCellValue?.split(":")[0]}</span> <br />
      //         <span>{renderedCellValue?.split(":")[1]}</span>
      //       </>
      //     );
      //   },
      // },
  

      // {
      //   accessorKey: "stock",
      //   header: "STOCK",
      //   Cell: ({ cell }) => (
      //     <span className="text-red-500 ">
      //       {/* {cell.getValue().toLocaleString("en-Us")} */}
      //     </span>
      //   ),
      //   size: 100,
      // },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableExpandAll: true, //disable expand all button
    initialState: { density: "compact" },
    // enableRowActions: true,
    // positionActionsColumn: "last",
    positionExpandColumn: "last",
    // displayColumnDefOptions: {
    //   "mrt-row-actions": {
    //     header: "Action",
    //   },
    // },
    // renderRowActions: ({ row }) => [
    //   <Button
    //     type="primary"
    //     onClick={() => warningAction(row.original.vdCode, row.original.partNo)}
    //     icon={<EditOutlined />}
    //   >
    //     แก้ไขจำนวนสั่งซื้อ
    //   </Button>,
    // ],
   
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
    
    
        <div className="flex justify-center">
          <table className="tbMain w-[90%]">
              <tr className="bg-blue-200 ">
                <th>Date</th>
                <th>Partno</th>
                <th>Part Name</th>
                <th>Stock</th>
                <th className="w-10">Action</th>

              </tr>
              {row.original._venderGroup.map((item, index) => (
                <tr className={`${item.color}`}>
                  <td>{dayjs(item.date).format('DD/MM/YYYY')}</td>
                  <td>{item.partNo} {item.cm}</td>
                  <td> {item.description}</td>
                  <td className="text-red-500 font-bold">{item.stock.toLocaleString('en-US')} &nbsp;
                   { (item._do > 0 && dayjs(item.date).format('YYYYMMDD') === dayjs().format('YYYYMMDD')) && <span class="bg-green-600 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                    D/O Plan: {item._do.toLocaleString('en-US')}</span>
                   }
                   
                  </td>
                  <td> <Button
                        type="primary"
                        onClick={() => warningAction(row.original.vdCode, item.partNo)}
                        icon={<EditOutlined />}
                      >
                        แก้ไขจำนวนสั่งซื้อ
                      </Button>
                  </td>
              </tr>
              ))}
              
          
            </table>
        </div>

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
        {/* &nbsp;<span className="text-red-500 text-xl">(กำลังอยู่ในช่วงพัฒนา)</span> */}
          <div>  <span>แจ้งเตือน Stock Part Shortage</span> </div>
        <div>  <span className="text-[#5b5b5b]">Update :</span>
        <span className="font-bold p-2 text-[#5c5fc8]">{Object.keys(data).length > 0 ? moment(dateNow).format("DD/MM/YYYY HH:mm")
        :  moment().add( moment().minute() > 30 && 1 , 'hours').minutes( moment().minute() <= 30 ? 30 : 0).format("DD/MM/YYYY HH:mm")}</span>
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
              <MaterialReactTable table={table} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DoWarning;
