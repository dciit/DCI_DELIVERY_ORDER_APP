import { Button, Stack, Table } from "@mui/material";
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { DownloadTableExcel } from "react-export-table-to-excel";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import moment from "moment";
function ExportToExcel(props) {
    const { data, vd, rn, buyer } = props;
    const tableRef = useRef(null);
    const reducer = useSelector(state => state.mainReducer);
    var ExcelName = '';
    if (reducer.typeAccount == 'employee') {
        // if (vd == '-') {
        //     ExcelName = `DO-BUYER-${buyer}-ALL-${rn}`;
        // } else {
        //     ExcelName = `DO-BUYER-${buyer}-${vd}-${rn}`;
        // }
        if (vd == '-') {
            ExcelName = `DO-BUYER-ALL-${rn}`;
        } else {
            ExcelName = `DO-BUYER-${vd}-${rn}`;
        }
    } else {
        ExcelName = `DO-${vd}-${rn}`;
    }
    return <>
        <DownloadTableExcel
            filename={ExcelName}
            sheet="D/O Plan"
            currentTableRef={tableRef.current}
        >
            <div>
                <div className={`bg-[#4effca] text-[#080b0f] w-fit rounded-[8px] px-[8px] pt-[0px] pb-[4px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] shadow-mtr`}>
                    <Stack alignItems={'center'} direction={'row'}>
                        <SimCardDownloadIcon className='md:text-[1.5vw] lg:text-[1.5vw] xl:text-[1vw] mr-1' />
                        <span className='text-center'> Export to Excel</span>
                    </Stack>
                </div>
            </div>
        </DownloadTableExcel>
        <table ref={tableRef} className="hidden">
            <tbody>
                <tr>
                    <th>PARTNO</th>
                    <th>DATE</th>
                    {
                        reducer.typeAccount == 'employee' && <th>PLAN</th>
                    }
                    <th>D/O</th>
                    {
                        reducer.typeAccount == 'employee' && <th>STOCK</th>
                    }
                    <th>VENDER</th>
                </tr>
                {
                    data.map((item, index) => {
                        // console.log(item)
                        var date = item.date;
                        // if (date.indexOf('/') !== -1) {
                            date = moment(item.date).format('YYYYMMDD');
                        // }
                        return <tr key={index}>
                            <th>{item.partNo}</th>
                            <th>{date}</th>
                            {
                                reducer.typeAccount == 'employee' && <th>{parseFloat(item.plan).toLocaleString('en')}</th>
                            }
                            <th>{parseFloat(item?.do).toLocaleString('en')}</th>
                            {
                                reducer.typeAccount == 'employee' && <th>{parseFloat(item.stock).toLocaleString('en')}</th>
                            }
                            <th>{item.vender}</th>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </>
}
export default ExportToExcel;