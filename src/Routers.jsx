import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import MainLayout from "./pages/MainLayout";
import SupplierPage from "./pages/SupplierPage";
import DoPoPage from "./pages/DoPoPage";
import StockPage from "./pages/StockPage";
import PoPage from "./pages/PoPage";
import DeliveryOfDayPage from "./pages/DeliveryOfDayPage";
import MasterPage from "./pages/MasterPage";
import Test from "./pages/Test";
import { useDispatch, useSelector } from "react-redux";
import PartSupply from "./pages/PartSupply";
import DOPage from "./pages/DOPage";
import { persistor } from './reducers/store'
import DeliveryManagement from "./pages/delivery.management";
import Calendar from "./pages/calendar";
const Routers = () => {
    const dispatch = useDispatch();
    const VITE_BASE_PATH = ''
    const version = import.meta.env.VITE_VERSION;
    const reducer = useSelector(state => state.mainReducer);
    if (reducer.version == 'undefined' || reducer.version != version) {
        persistor.purge();
        dispatch({ type: 'RESET', payload: { version: version, login: false } });
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path={VITE_BASE_PATH + '/'} element={<DOPage />} />
                    <Route path={VITE_BASE_PATH + '/do'} element={<DOPage />} />
                    <Route path={VITE_BASE_PATH + '/supplier'} element={<SupplierPage />} />
                    <Route path={VITE_BASE_PATH + '/dopo'} element={<DoPoPage />} />
                    <Route path={VITE_BASE_PATH + '/stock'} element={<StockPage />} />
                    <Route path={VITE_BASE_PATH + '/po'} element={<PoPage />} />
                    <Route path={VITE_BASE_PATH + '/delivery'} element={<DeliveryManagement />} />
                    <Route path={VITE_BASE_PATH + '/master'} element={<MasterPage />} />
                    <Route path={VITE_BASE_PATH + '/test'} element={<Test />} />
                    <Route path={VITE_BASE_PATH + '/calendar'} element={<Calendar />} />
                </Route>
                <Route path="*" element={<NotFound />} />
                <Route path='do/partsupply' element={<PartSupply />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Routers;