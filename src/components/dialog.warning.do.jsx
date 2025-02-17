import React, { useEffect, useMemo, useState } from "react";

import { API_WARINING_DO } from "../Services";
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import moment from 'moment/moment'
import WarningIcon from '@mui/icons-material/Warning';
import { CircularProgress } from '@mui/material'

import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';

import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";


// const columnsRecord = [
//   { id: "date", label: "DATE" },
//   { id: "vd", label: "Vender" },
//   { id: "partno", label: "PARTNO" },
//   { id: "pofifo", label: "STOCK" },
// ];

function DialogDOWarningPage(props) {
  
  const { open, close } = props;
  const [data, setData] = useState([]);
  const [dateNow,setdateNow] = useState("");
  
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initContent();
  }, []);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

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
       //   Cell: ({ renderedCellValue }) => {xx
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
    initialState: { density: 'compact' },
    enableExpandAll: true, //disable expand all button
    positionExpandColumn: "last",
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
                      {item._do > 0 && <span class="bg-green-600 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
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

  return (
    <>
      <div>
        <Dialog open={open} onClose={() => close()} fullWidth maxWidth="md">
          <DialogTitle className="bg-red-600/90 text-white"><WarningIcon/> รายการ Waring stock : Part Shortage</DialogTitle>
          <DialogContent dividers>
            

                 {loading ? <div className='flex flex-col justify-center items-center h-full loading'><CircularProgress style={{ color: '#5c5fc8' }} /><span className=' mt-3'>กำลังโหลดข้อมูล . . .</span></div>
                 : <>
                   <div className="flex flex-col  gap-6">
                         
                       
                         <div>  <span className="text-[#5b5b5b]">Update :</span>
                         <span className="font-bold p-2 text-[#5c5fc8]">{Object.keys(data).length > 0 && moment(dateNow).format("DD/MM/YYYY HH:mm")}</span>
                         &nbsp;&nbsp;&nbsp;
                         <span className="font-bold p-2 text-green-800 bg-green-100 ring-1 ring-green-500 rounded-lg">ข้อมูล Stock Part Shortage อัพเดททุก 30 นาที</span></div>
                       
                         
                  <div>
                <MaterialReactTable table={table} />
                </div>
                </div>
                 {/* <Paper sx={{ width: "100%", overflow: "auto" }}>
                     <TableContainer>
                <Table className="tbMain">
                  <TableHead>
                    <TableRow>
                      {columnsRecord.map((column, index) => (
                        <TableCell
                          key={index}
                          className="bg-blue-200  font-bold"
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data2
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow
                          key={index}
                          className={`${
                            index % 2 == 0 ? "bg-gray-200" : "bg-white"
                          }`}
                        >
                          <TableCell className="text-sm  text-left">
                            {moment(row.date).format("DD/MM/YYYY")} 
                          </TableCell>
                          <TableCell className="text-sm  text-left">
                            {row.vdCode} <br /> {row.vdName}
                          </TableCell>
                          <TableCell className="text-sm  text-left">
                            {row.partNo}
                          </TableCell>
                          <TableCell className="text-sm  text-left">
                            {row.stock.toLocaleString("en-Us")}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data2.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              </Paper> */}
                 </>}
             
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => close()}>
              ปิดหน้าต่าง
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default DialogDOWarningPage;
