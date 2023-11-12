import React, { useState } from 'react'
import { Badge, Divider, FilledInput, IconButton, InputAdornment, RadioGroup, Table, TableBody, TableCell, TableRow, TextField, Tooltip } from '@mui/material'
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function ItemCell(props) {
    const { keyShow, bgColor, textColor, endDate, _class, master, part = '', holiday, setOpenEditDOVal, setEditContent,editContent } = props;
    const reducer = useSelector(state => state.mainReducer);
    const dispatch = useDispatch();
    function isHoliday(days) {
        return moment(days, 'YYYY-MM-DD').format('ddd'); F
    }
    function styleTd(date) {
        var diff = moment(date, 'YYYYMMDD').diff(moment().format('YYYY-MM-DD'), 'days');
        if (diff == 0) {
            return 'today';
        } else if (diff > 0 && diff <= 6) {
            return 'fix';
        } else if (diff > 6 && diff < 14) {
            return 'do';
        } else {
            return date;
        }
    }
    var dataSet = reducer.plan.filter((item) => item.part == part);
    return dataSet.map((val, index) => {
        var TdStartOfMonth = "";
        if (val.date == moment(endDate).format('YYYYMM01')) {
            TdStartOfMonth = <TableCell className='w-[200px] text-[1.5rem] tdMonth'></TableCell>
        }
        var delivery = true;
        if (part != '') {
            if (typeof master[part] != 'undefined') {
                delivery = master[part]['vd' + dayjs(val.date).format('ddd')];
            }
        }
        return <>
            {TdStartOfMonth}
            <TableCell
                key={index} className={`col-data relative text-[1rem] text-gray-300 p-0 w-[75px] h-[40px] ${isHoliday(val.date)} ${styleTd(val.date)} ${(val[keyShow] > 0 && (styleTd(val.date) == 'fix' || styleTd(val.date) == 'do' || styleTd(val.date) == 'today')) && bgColor}`} align='center'>
                {
                    val[keyShow] > 0 ? <div>
                        {
                            keyShow == 'doPlan' ? (
                                val['doAddFixed'] > 0 ? (
                                    <Badge badgeContent={'+ ' + val['doAddFixed']} color='primary' max={99999} className='badge'>
                                        <h2 className='doLineHorizontal'>
                                            <NumericFormat displayType='text' className={`${textColor} ${keyShow == 'doPlan' ? 'doVal ' : ''} ${_class}`} allowLeadingZeros thousandSeparator="," value={val[keyShow]} decimalScale={2} />
                                        </h2>
                                    </Badge>
                                ) :
                                    <h2 className='doLineHorizontal select-none'>
                                        <NumericFormat displayType='text' className={`${textColor} ${keyShow == 'doPlan' ? 'doVal ' : ''} ${_class}`} allowLeadingZeros thousandSeparator="," value={val[keyShow]} decimalScale={2} onClick={() => {
                                            // dispatch({ type: 'UPDATE_PLAN_EDIT', part: part, index: val.index });
                                            var value = val;
                                            setEditContent({ ...value, doEdit: value.doPlan })
                                            setOpenEditDOVal(true)
                                        }} />
                                    </h2>
                            ) :
                                <NumericFormat displayType='text' className={`${textColor} ${keyShow == 'doPlan' ? 'doVal ' : ''} ${_class}`} allowLeadingZeros thousandSeparator="," value={val[keyShow]} decimalScale={2} />
                        }
                    </div> : (val[keyShow] < 0 ? <NumericFormat displayType='text' className='text-red-500' thousandSeparator="," value={val[keyShow]} decimalScale={2} /> : (keyShow == 'doPlan' ? <div>{(delivery && !holiday.includes(val.date)) ? <h2 className={`${keyShow == 'doPlan' ? 'doLineHorizontal ' : ''}`}></h2> : <Tooltip title="Supplier ไม่ส่งของ">
                        <IconButton>
                            <CloseIcon className='text-[#d84949]' />
                        </IconButton>
                    </Tooltip>}</div> : <span className='dot '></span>))
                }
            </TableCell>
        </>
    })
}

export default ItemCell