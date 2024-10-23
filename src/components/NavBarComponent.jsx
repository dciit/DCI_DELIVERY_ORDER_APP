import React, { useEffect, useState } from 'react'
import { Divider, Stack } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import { DesktopWindows } from '@mui/icons-material';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import RouteIcon from '@mui/icons-material/Route';
import { persistor } from '../reducers/store';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BentoOutlinedIcon from '@mui/icons-material/BentoOutlined';
import BentoIcon from '@mui/icons-material/Bento';
import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
export const menuNavbar = [
    {
        path: '/do', text: 'Delivery', value: 'd/o', priv: ['employee', 'supplier'], icon: < DesktopWindows />, noicon: <DesktopWindowsOutlinedIcon />
    }, {
        path: '/supplier', text: 'Supplier', value: 'supplier', priv: ['employee', 'supplier'], icon: <AirportShuttleIcon />, noicon: <AirportShuttleOutlinedIcon />
    },
    //  {
    //     path: '/stock', text: 'Stock', value: 'stock', priv: ['employee'], icon: <InventoryIcon />, noicon: <Inventory2OutlinedIcon />
    // },
    //  {
    //     path: '/po', text: 'PO', value: 'po', priv: ['employee'], icon: null, noicon: null
    // }, 
    {
        path: '/master', text: 'Master', value: 'master', priv: ['employee'], icon: <BentoIcon />, noicon: <BentoOutlinedIcon />
    }, {
        path: '/calendar', text: 'Calendar', value: 'calendar', priv: ['employee'], icon: <CalendarMonthOutlinedIcon />, noicon: <CalendarMonthOutlinedIcon />
    }, {
        path: '/delivery', text: 'Delivery', value: 'delivery', priv: ['supplier'], icon: null, noicon: null
    }
]
function NavBarComponent() {
    const redx = useSelector(state => state.mainReducer);
    const typeAccount = redx?.typeAccount || '';
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let menu = redx.menuLeft;
    const handleActiveMenu = (key, path) => {
        dispatch({ type: 'SET_ACTIVE_MENU', payload: key });
        setMenuActive(key);
        navigate(path);
    }
    var once = false;
    const [menuActive,setMenuActive] = useState('');
    useEffect(() => {
        try {
            if (!once) {
                let menuNav = menuNavbar.filter(x => x.priv.includes(typeAccount));
                let menuActive = redx.activeMenu != '' ? redx.activeMenu : (typeAccount == 'employee' ? 'd/o' : 'supplier');
                // console.log(menuNav)
                if (menuActive != '' && menuNavbar.filter(x => x.value == menuActive).length > 0) {
                    let oMenuDef = menuNav.filter(x => x.value == menuActive);
                    if (oMenuDef.length > 0) {
                        navigate(oMenuDef[0].path)
                    }
                } else {
                    if (typeAccount == 'supplier') {
                        let defValue = 'supplier';
                        dispatch({ type: 'SET_MENU_ACTIVE', payload: defValue });
                        let oMenuDef = menuNavbar.filter(x => x.value == defValue);
                        if (oMenuDef.length > 0) {
                            navigate(oMenuDef.path)
                        }
                    } else {
                        let defValue = 'd/o';
                        dispatch({ type: 'SET_MENU_ACTIVE', payload: defValue });
                        let oMenuDef = menuNavbar.filter(x => x.value == defValue);
                        if (oMenuDef.length > 0) {
                            navigate(oMenuDef.path)
                        }
                    }
                }
                setMenuActive(menuActive);
                once = true;
            } else {
                navigate(import.meta.env.VITE_PATH + menu[redx.menuIndex].path)
            }
        } catch (e) {
            alert(`เกิดข้อผิดพลาดระหว่างการใช้งาน ติดต่อ เบีย IT 250 Error : ${e.message}`);
            dispatch({ type: 'CLEAR_LOGIN' });
            persistor.purge();
            location.reload();
        }
    }, [])

    return (
        <div className=' flex items-center flex-col md:w-[10%] lg:w-[8%] xl:w-[5%] 2xl:w-[75px] md:text-[1vw] lg:text-[1vw] xl:text-[.75vw] bg-[#ebebeb] gap-[16px] pt-[16px] pl-[8px] pr-[8px] select-none cursor-pointer transition-all duration-300  border-r border-[#ddd]'>
            {
                menuNavbar.filter(x => x.priv.includes(typeAccount)).map((item, key) => {
                    return <div key={key} className={` ${menuActive == item.value ? 'text-[#5c5fc8]' : 'text-[#8b8b8b]'} w-full rounded-[8px] `} onClick={() => handleActiveMenu(item.value, item.path)}>
                        <Stack alignItems={'center'}>
                            {
                                menuActive == item.value ? item.icon : item.noicon
                            }
                            <span className='text-center'>{item.text}</span>
                        </Stack>
                    </div>
                })
            }
        </div>
    )
}

export default NavBarComponent