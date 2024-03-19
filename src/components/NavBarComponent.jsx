import React, { useEffect } from 'react'
import { Divider, Stack } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
function NavBarComponent() {
    const reducer = useSelector(state => state.mainReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let PATH = import.meta.env.VITE_PATH;
    let menu = reducer.menuLeft;
    const openMenu = (key, path) => {
        dispatch({ type: 'NAV_MENU_SELECT', payload: key });
        navigate(path);
    }
    var once = false;
    useEffect(() => {
        if (!once) {
            let menuIndex = 0;
            if (reducer.menuIndex === '') {
                if (reducer.typeAccount == 'supplier') {
                    menuIndex = menu.findIndex(x=>x.value == 'supplier');
                    dispatch({ type: 'NAV_MENU_SELECT', payload: menuIndex });
                    navigate(import.meta.env.VITE_PATH + menu[menuIndex].path)
                } else {
                    dispatch({ type: 'NAV_MENU_SELECT', payload: 0 });
                    navigate(import.meta.env.VITE_PATH + menu[0].path)
                }
            }else{
                dispatch({ type: 'NAV_MENU_SELECT', payload: reducer.menuIndex });
                navigate(import.meta.env.VITE_PATH + menu[reducer.menuIndex].path)
            }
            once = true;
        }else{
            navigate(import.meta.env.VITE_PATH + menu[reducer.menuIndex].path) 
        }
    }, [])

    return (
        <div className='flex items-center flex-col md:w-[10%] lg:w-[8%] xl:w-[7.5%] 2xl:w-[6%] md:text-[1vw] lg:text-[1vw] xl:text-[.75vw] bg-[#37393c] text-[#ececec]  gap-[8px] pt-[8px] pl-[8px] pr-[8px] select-none'>
            <Divider className='bg-[#4effca] border-2 w-[65%] rounded-lg mb-2' />
            {
                menu.map((item, key) => {
                    var hidden = 'hidden';
                    hidden = reducer.navPrivilege.some(pri => (pri.refCode == 'MENU' && pri.note == item.value)) ? '' : 'hidden';
                    return <div key={key} className={`${hidden} ${reducer.menuIndex == key ? ' bg-[#4effca] text-[#080b0f]' : 'bg-[#212327]'} w-full rounded-[8px]  px-[8px] py-[8px] cursor-pointer transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-105 hover:bg-[#4effca] hover:text-[#080b0f] duration-300 shadow-mtr`} onClick={() => openMenu(key, PATH + item.path)}>
                        <Stack alignItems={'center'}>
                            <GridViewIcon />
                            <span className='text-center'>{item.text}</span>
                        </Stack>
                    </div>
                })
            }

        </div>
    )
}

export default NavBarComponent