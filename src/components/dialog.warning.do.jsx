import React, { useEffect, useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { API_WARINING_DO } from "../Services";
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import moment from 'moment/moment'
import WarningIcon from '@mui/icons-material/Warning';
import { CircularProgress } from '@mui/material'

import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';


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
    setdateNow(initPlan[0].dateRound)
    setLoading(false);
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'date', 
        header: 'DATE',
        size:50,
        Cell: ({ cell }) => <span>{moment(cell.getValue()).format("DD/MM/YYYY")}</span>
      },
      {
        accessorFn: (row) =>
          `${row.vdCode}` + ":" + `(${row.vdName})`, 
        header: 'Vender',
        size:200,
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
        accessorKey: 'partNo',
        header: 'PARTNO',
        size:100,
      },

      {
        accessorKey: 'stock', 
        header: 'STOCK',
        Cell: ({ cell }) => <span className="text-red-500">{cell.getValue().toLocaleString("en-Us")}</span>,
        size:100,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { density: 'compact' },

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
