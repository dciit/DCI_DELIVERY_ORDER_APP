import moment from 'moment';
import React, { useEffect, useState } from 'react'
import DialogEditCalendar from '../components/dialog.edit.calendar';
import { API_CALENDAR_GET } from '../Services';

function Calendar() {
    let year = moment().format('YYYY');
    let isToday = moment().format('YYYYMMDD');
    const [openEditCalendar, setOpenEditCalendar] = useState(false);
    const [date, setDate] = useState(null);
    const [calendar, setCalendar] = useState([]);
    const yyyy = moment().format('YYYY');
    const [once, setOnce] = useState(true);

    useEffect(() => {
        if (once == true) {
            init();
            setOnce(false);
        }else{
            if(openEditCalendar == false){
                init();
            }
        }
    }, [once,openEditCalendar]);

    useEffect(()=>{
        if(openEditCalendar == false){
            setDate(null)
        }
    },[openEditCalendar])
    
    const handleOpenEditCalendar = (date) => {
        setDate(date);
    }
    useEffect(() => {
        if (date != null) {
            setOpenEditCalendar(true);
        }
    }, [date]);
    const init = async () => {
        let apiGetCalendar = await API_CALENDAR_GET(yyyy);
        setCalendar(apiGetCalendar);
    }
    return (
        <div className='p-6 w-full flex flex-col gap-3'>
            <span>จัดการปฎิทิน</span>
            <div className='grid sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-4 w-full gap-6'>
                {
                    [...Array(12)].map((item, key) => {
                        let month = (key + 1);
                        let ymLoop = moment(`${year}${month.toString().padStart(2, '0')}`, 'YYYYMM');
                        return <div key={key} className='flex flex-col gap-1'>
                            <span>{`${ymLoop.format('MMMM')} ${ymLoop.format('YYYY')}`}</span>
                            <div className='drop-shadow-md grid grid-cols-7 p-3 gap-1 border bg-white rounded-md'  >
                                {
                                    [...Array(7)].map((oDayHead, iDayHead) => {
                                        let day = iDayHead + 1;
                                        let ymd = (ymLoop.format('YYYYMM') + '' + day.toString().padStart(2, '0'));
                                        let dayTxt = moment(ymd, 'YYYYMMDD').format('dd');
                                        return <div key={iDayHead} className='text-center text-[#8b8b8b]'>{dayTxt}</div>
                                    })
                                }
                                {
                                    [...Array(ymLoop.daysInMonth())].map((oDay, iDay) => {
                                        let day = iDay + 1;
                                        let ymd = (ymLoop.format('YYYYMM') + '' + day.toString().padStart(2, '0'));
                                        let have = calendar.filter(o => o.code == ymd).length ? true : false;
                                        return < div key={iDay} className={`hover:outline outline-primary transition-all duration-100 hover:bg-[#5c5fc810] hover:text-primary hover:font-bold drop-shadow-md  rounded-md   text-center select-none cursor-pointer ${isToday == ymd ? 'border-[#5c5fc8] bg-[#5c5fc850] border-4' : (have == true ? 'bg-[#5c5fc850] border-[#5c5fc875] border' : '')}`} onClick={() => handleOpenEditCalendar(ymd)}> {day}</div>
                                    })
                                }
                            </div>
                        </div>
                    })
                }
            </div>
            <DialogEditCalendar open={openEditCalendar} close={setOpenEditCalendar} date={date} setDate={setDate} />
        </div >
    )
}

export default Calendar