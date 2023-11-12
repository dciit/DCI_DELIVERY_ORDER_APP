import moment from 'moment';
import React from 'react'
import { NumericFormat } from 'react-number-format'
import CloseIcon from '@mui/icons-material/Close';
import { Badge } from '@mui/material';
function DOItem(props) {
    const { item, data, handle, delivery, holiday } = props;
    function styleTd(date) {
        var diff = moment(date, 'YYYYMMDD').diff(moment().format('YYYY-MM-DD'), 'days');
        if (diff == 0) {
            return 'today';
        } else if (diff > 0 && diff <= 6) {
            return 'fix';
        } else if (diff > 6 && diff < 14) {
            return 'do';
        } else {
            return moment(date, 'YYYYMMDD').format('ddd');
        }
    }
    const CanEdit = moment(data.date) >= moment(moment().format('YYYYMMDD')) ? true : false;
    return (
        <td className={`${styleTd(data.date)} cursor-pointer duration-150 transition-all ease-in-out delay-50 ${CanEdit && 'hover:outline-offset-1 hover:outline-dotted  hover:outline-[#4effca]'}`} onClick={() => (item.class == 'doVal' ? (CanEdit ? handle(data.id) : null) : null)}>
            {
                item.class == 'doVal' ? (
                    (delivery && !holiday.includes(data.date)) ? data.value != 0 ? <h2 className='doLineHorizontal select-none'><NumericFormat className={`cursor-pointer ${item.class}`} displayType='text' allowLeadingZeros thousandSeparator="," value={data.value} decimalScale={2} /></h2> : <h2 className={`doLineHorizontal`}></h2> : (
                        data.value > 0 ? <h2 className='doLineHorizontal select-none'><NumericFormat className={`cursor-pointer ${item.class}`} displayType='text' allowLeadingZeros thousandSeparator="," value={data.value} decimalScale={2} /></h2> : <CloseIcon className='text-[#d84949] cursor-pointer' />
                    )
                ) : (
                    data.value != 0 ? (
                        data.value > 0
                            ? item.class == 'planVal'
                                ? (data.newplan != 0)
                                    ? <Badge badgeContent={data.newplan > 0 ? ('+' + data.newplan) : (data.newplan)} max={9999} color="primary">
                                        <NumericFormat className={`${item.class} select-nonee`} displayType='text' allowLeadingZeros thousandSeparator="," value={data.value} decimalScale={2} />
                                    </Badge>
                                    : <NumericFormat className={`${item.class} select-nonee`} displayType='text' allowLeadingZeros thousandSeparator="," value={data.value} decimalScale={2} />
                                : (item.class == 'poVal' ?
                                    <NumericFormat className={`${item.class} ${data.short == true ? 'text-red-500' : ''} select-nonee`} displayType='text' allowLeadingZeros thousandSeparator="," value={data.value} decimalScale={2} /> :
                                    <NumericFormat className={`${item.class} select-nonee`} displayType='text' allowLeadingZeros thousandSeparator="," value={data.value} decimalScale={2} />)
                            : <NumericFormat displayType='text' className='text-red-500' thousandSeparator="," value={data.value} decimalScale={2} />
                    ) : <span className='dot'></span>
                )
            }
        </td>
    )
}

export default DOItem