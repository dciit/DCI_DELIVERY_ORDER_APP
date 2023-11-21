import { Button, ButtonGroup, CircularProgress, Stack, TextField } from '@mui/material'
import axios, { Axios } from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import bodyImage from '../images/body-image.jpg';
import { BoxInput } from '../styles/LoginStyled';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { ServicePrivilege } from '../Services';
// import { ServiceJWT } from '../Services';
function LoginPage() {
    const { register, handleSubmit, watch, formState: { errors }, setValue, setFocus } = useForm();
    const dispatch = useDispatch();
    const [loginState, setLoginState] = useState(false);
    const [LoginFalse, setLoginFalse] = useState(false);
    const [wayLogin, setWayLogin] = useState('employee');
    const reducer = useSelector(state => state.mainReducer);
    function getJwt(username, password) {
        return new Promise(resolve => {
            axios.post(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/jwt', { username: username, password: encodeURIComponent(password) }, {
                headers: {
                    "Content-Type": 'application/json;charset=UTF-8',
                    "Authorization": 'Bearer ' + reducer.jwt
                }
            }).then((jwt) => {
                if (typeof jwt.data.jwt != 'undefined' && jwt.data.jwt.length > 0) {
                    resolve(jwt.data.jwt);
                } else {
                    resolve('');
                }
                resolve(jwt.data.jwt);
            }).catch((err) => {
                resolve('');
            });
        })
    }
    function loginEmp(uname, pwd) {
        // url: 'http://websrv01.dci.daikin.co.jp/BudgetCharts/BudgetRestService/api/authen?username=' + uname + '&password=' + encodeURIComponent(pwd),
        return new axios({
            method: 'get',
            url: 'https://scm.dci.co.th/BudgetCharts/BudgetRestService/api/authen?username=' + uname + '&password=' + encodeURIComponent(pwd),
            withCredentials: false,
        }).then(async (res) => {
            console.log(res)
            if (res.data[0]['EmpCode'] != null) {
                // var jwt = await getJwt(uname, pwd);
                // console.log(jwt.length)
                // if (jwt.length) {
                    // dispatch({ type: 'JWT', payload: jwt });
                    dispatch({ type: 'TYPE_ACCOUNT', payload: 'employee' });
                    // localStorage.setItem('jwt', jwt);
                    dispatch({ type: 'INIT_LOGIN', payload: { login: true, id: res.data[0]['EmpCode'], name: res.data[0]['ShortName'], typeAccount: 'employee' } });
                    setLoginFalse(false);
                    setLoginState(true)
                // } else {
                //     setLoginFalse(true);
                //     setLoginState(false);
                //     console.log('12312')

                // }
            } else {
                axios.post(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/login/employee', { username: uname, password: encodeURIComponent(pwd) }, {
                    headers: {
                        "Content-Type": 'application/json;charset=UTF-8'
                    }
                }).then((jwt) => {
                    if (jwt.data.status) {
                        dispatch({ type: 'TYPE_ACCOUNT', payload: 'employee' })
                        dispatch({ type: 'JWT', payload: jwt });
                        dispatch({ type: 'INIT_LOGIN', payload: { login: true, id: uname, name: jwt.data.vdName } });
                        localStorage.setItem('jwt', jwt);
                        setLoginFalse(false);
                        setLoginState(true)
                    } else {
                        setLoginFalse(true);
                        setLoginState(false)
                    }
                }).catch((err) => {
                    setLoginFalse(true);
                    setLoginState(false)
                });
            }
        }).catch((error) => {
            console.log(error)
            setLoginFalse(true);
            setLoginState(false)
        })
    }
    function loginSupplier(uname, pwd) {
        return new axios.post(import.meta.env.VITE_BASE_DELIVERY_ORDER + '/login/supplier', { username: uname, password: encodeURIComponent(pwd) }, {
            headers: {
                "Content-Type": 'application/json;charset=UTF-8'
            }
        }).then((res) => {
            if (typeof res.data.status != 'undefined' && res.data.status) {
                dispatch({ type: 'TYPE_ACCOUNT', payload: 'supplier' });
                dispatch({ type: 'INIT_LOGIN', payload: { login: true, id: uname, name: res.data.vdName, typeAccount: 'supplier' } });
                dispatch({ type: 'JWT', payload: res.data.jwt });
                window.localStorage.setItem('jwt', res.data.jwt);
                setLoginFalse(true);
            } else {
                setLoginFalse(true);
                setLoginState(false);
            }
        }).catch((err) => {
            setLoginFalse(true);
            setLoginState(false);
        });
    }
    const onSubmit = async param => {
        setLoginState(true);
        if (wayLogin == 'employee') {
            loginEmp(param.username, param.password);
        } else {
            loginSupplier(param.username, param.password);
        }
        const privilege = await ServicePrivilege(wayLogin);
        dispatch({ type: 'PRIVILEGE_SET', payload: privilege })
    }
    const handleChangeWay = (way) => {
        setValue('username', '');
        setValue('password', '');
        setFocus('username');
        setWayLogin(way);
    }
    return (
        <form className='flex h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex h-full w-full justify-center select-none' style={{
                backgroundImage: `url(${bodyImage})`,
            }}>
                {
                    !loginState ? (
                        <BoxInput>
                            <div className='h-[30%] flex justify-center items-center'>
                                <span className='text-center text-[3rem] sm:text-[3rem] md:text-[3.5rem]  transition-all duration-1000 font-600'>DELIVERY ORDER</span>
                            </div>

                            <div className=' h-[70%] flex-col items-center justify-center  transition-all duration-1000'>
                                <div className='text-center'>
                                    {
                                        wayLogin == 'employee' ? <PeopleAltIcon className='text-[7rem] text-blue-600' /> : <LocalShippingIcon className='text-[7rem] text-blue-600' />
                                    }
                                </div>
                                <div className='flex justify-center mt-3'>
                                    <div className={`${wayLogin == 'employee' ? 'text-blue-500 border-blue-500 border-r-2' : ''} flex justify-center items-center gap-1 w-full border-2 border-r-0 rounded-l-xl cursor-pointer py-1 transition-all duration-1000 hover:border-blue-500 hover:border-r-2 hover:text-blue-500`} onClick={() => {
                                        handleChangeWay('employee')

                                    }}>
                                        <PeopleAltIcon />
                                        <span>Employee</span>
                                    </div>
                                    <div className={`${wayLogin == 'supplier' ? 'text-blue-500 border-blue-500 border-r-2' : ''} flex justify-center items-center gap-1 w-full border-2 rounded-r-xl cursor-pointer transition-all duration-1000 hover:border-blue-500 hover:text-blue-500`} onClick={() => {
                                        handleChangeWay('supplier')
                                    }}>
                                        <span>Supplier</span>
                                        <LocalShippingIcon />
                                    </div>
                                </div>
                                <input type="text" placeholder="Username or Supplier Code" className='px-3 py-2 border-gray-300 border-2 border-solid rounded-md w-full mt-3' onChange={(e) => setUsername(e.target.value)} {...register('username', { required: true })} autoFocus />
                                <input type="password" placeholder="Password or Supplier Code" className='mt-2 px-3 py-2 mb-3 border-gray-300 border-2 border-solid rounded-md w-full' onChange={(e) => setPassword(e.target.value)} {...register('password', { required: true })} />
                                <Button variant='contained' type='submit' className='w-full'>เข้าสู่ระบบ</Button>
                                {
                                    LoginFalse && <div className='flex items-center justify-center p-3 text-red-500'>ไม่สามารถเข้าสู่ระบบได้ ...</div>
                                }
                            </div>
                            <span className=' h-auto text-center pb-3'>2023 DCI, All right Reserved</span>
                        </BoxInput>
                    ) : (
                        <div className='h-full flex justify-center items-center flex-col gap-3'>
                            <CircularProgress />
                            <p>กำลังเข้าสู่ระบบ . . . </p>
                        </div>
                    )
                }
            </div>
        </form>
    )
}

export default LoginPage