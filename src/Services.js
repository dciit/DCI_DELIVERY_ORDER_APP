import Axios from "axios";
const http = Axios.create({
    baseURL: import.meta.env.VITE_BASE_DELIVERY_ORDER,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
        // 'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
});

export default { http };

export function ServiceGetPlan(vdCode, buyer, sDate, fDate) {
    return http.post('/getplans', { vdCode: vdCode, buyer: buyer, startDate: sDate, endDate: fDate });
}



export function ServiceGetSupplier(buyer = "") {
    return http.get('/getSupplier/' + buyer);
}

export function ServiceGetListSupplier(buyer = "") {
    return new Promise((resolve) => {
        http.get('/getSupplier/' + buyer).then((res) => {
            resolve(res.data);
        })
    })
}
export function APIGetVenderMaster() {
    return new Promise((resolve) => {
        http.get('/vender').then((res) => {
            resolve(res.data);
        })
    })
}

export function ServiceGetListTimeSchedule() {
    return new Promise((resolve) => {
        http.get('/dict/timeschedule').then((res) => {
            resolve(res.data);
        })
    })
}

export function ServiceGetVenderMaster(vender) {
    return new Promise((resolve) => {
        http.get('/vender/get/' + vender).then((res) => {
            resolve(res.data);
        })
    })
}

export function ServiceGetPickList() {
    return http.get('/getPickList');
}
export function ServiceApproveDo(data) {
    return http.post('/setDoPlan', data);
}

export function ServiceRunDo(data) {
    return http.get('/RunDo/' + data.careHistory);
}

export function ServiceGetBuyer() {
    return http.get('/buyer');
}

export function ServiceGetHisrtoryById(id) {
    return http.get('/do/' + id);
}
export function GET_STOCK(data) {
    return new Promise(resolve => {
        http.post('/data/stock', data).then((res) => {
            resolve(res.data);
        }).catch(() => {
            resolve([]);
        })
    })
}

export function UPDATE_DO(data) {
    return new Promise(resolve => {
        http.post('/do/update', data).then((res) => {
            resolve(res.data);
        })
    })
}


export function getMaster(param) {
    return new Promise(resolve => {
        http.post('/master/get', param).then((res) => {
            resolve(res.data);
        })
    })
}

export function ServiceGetPartDetail(param) {
    return new Promise(resolve => {
        http.post('/part/get', param).then((res) => {
            resolve(res.data);
        })
    })
}

export function GetVenderDetail(vdcode) {
    return new Promise(resolve => {
        http.get('/vender/' + vdcode).then((res) => {
            resolve(res.data);
        })
    })
}

export function ServicePrivilege(type) {
    return new Promise(resolve => {
        http.get('/privilege/' + type).then((res) => {
            resolve(res.data);
        })
    })
}

export function ServiceUpdateDay(data) {
    console.log(data)
    return http.post('/vender/update/day', data);
}

export function ServiceUpdateDate(data) {
    return http.post('/vender/update/date', data);
}

export function ServiceUpdateVenderDetail(data) {
    return http.post('/vender/update/detail', data);
}

export function ApiUpdateVenderSTD(param) {
    return new Promise(resolve => {
        http.post('/vender/update/detail', param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log(e);
        });
    })
}

export function ServiceUpdateMasterPart(data) {
    return http.post('/part/update', data);
}

export function ServiceJWT() {
    return http.post('/test/jwt', {});
}

export function ServiceGetDataTimeSchedule(param) {
    return new Promise((resolve) => {
        http.post('/partsupply/timescheduledelivery', param).then((res) => {
            resolve(res.data);
        })
    })
}

export function API_GET_DO(buyer, vdCode, sDate, fDate, hiddenPartNoPlan) {
    return new Promise((resolve) => {
        http.post('/getplans', { vdCode: vdCode, buyer: buyer, startDate: sDate, endDate: fDate, hiddenPartNoPlan: hiddenPartNoPlan }).then((res) => {
            resolve(res.data);
        });
    })
}

export function API_GET_BUYER() {
    return new Promise((resolve) => {
        http.post('/getListBuyer').then((res) => {
            resolve(res.data);
        });
    })
}
export function API_GET_SUPPLIER_BY_BUYER(param = {}) {
    return new Promise((resolve) => {
        http.post('/getListSupplierByBuyer', param).then((res) => {
            resolve(res.data);
        });
    })
}
// export function API_RUN_DO(param = {}) {
//     return new Promise((resolve) => {
//         http.post('/insertDO',param).then((res) => {
//             resolve(res.data);
//         });
//     })
// }

export function API_RUN_DO(buyerCode = "41256") {
    return new Promise((resolve) => {
        http.get('/distribute/' + buyerCode).then((res) => {
            resolve(res.data);
        });
    })
}

export function API_GET_MASTER_OF_VENDER(vdcode = '') {
    return new Promise((resolve) => {
        http.get(`/getVenderMasterOfVender/${vdcode}`).then((res) => {
            resolve(res.data);
        })
    })
}
export function API_GET_VENDER_MASTERS() {
    return new Promise((resolve) => {
        http.get(`/getVenderMasterOfVenders`).then((res) => {
            resolve(res.data);
        })
    })
}

export function API_EDIT_DO(param) {
    return new Promise((resolve) => {
        http.post(`/editDO`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function API_GET_LOG(param) {
    return new Promise((resolve) => {
        http.post(`/DOLog`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function API_LIST_DRAWING_DELIVERY_OF_DAY(param) {
    return new Promise((resolve) => {
        http.post(`/GET_LIST_DRAWING_DELIVERY_OF_DAY`, param).then((res) => {
            resolve(res.data);
        })
    })
}

export function API_INSERT_LIST_DRAWING_DELIVERY_OF_DAY(param) {
    return new Promise((resolve) => {
        http.post(`/INSERT_LIST_DRAWING_DELIVERY_OF_DAY`, param).then((res) => {
            resolve(res.data);
        })
    })
}



export function API_VIEW_HISTORY_PLAN(param) {
    return new Promise((resolve) => {
        http.post(`/VIEW_HISTORY_PLAN`, param).then((res) => {
            resolve(res.data);
        })
    })
}



export function API_EDIT_CALENDAR() {
    return new Promise((resolve) => {
        http.post(`/editCalendar`, param).then((res) => {
            resolve(res.data);
        });
    })
}

export function API_CALENDAR_INSERT(param) {
    return new Promise((resolve) => {
        http.post(`CALENDAR/INSERT`, param).then((res) => {
            resolve(res.data);
        })
    });
}


export function API_CALENDAR_GET(yyyy) {
    return new Promise((resolve) => {
        http.get(`CALENDAR/GET/${yyyy}`).then((res) => {
            resolve(res.data);
        })
    });
}
export function API_CALENDAR_GET_BY_DATE(ymd) {
    return new Promise((resolve) => {
        http.get(`CALENDAR/DATE/GET/${ymd}`).then((res) => {
            resolve(res.data);
        })
    });
}

export function API_CALENDAR_DEL(ymd) {
    return new Promise((resolve) => {
        http.get(`CALENDAR/DEL/${ymd}`).then((res) => {
            resolve(res.data);
        })
    });
}

export function API_GET_HISTORY_DO(param) {
    return new Promise((resolve) => {
        http.post(`HISTORY/DO`, param).then((res) => {
            resolve(res.data);
        })
    });
}

export function API_HISTORY_EDIT_DO(param) {
    return new Promise((resolve) => {
        http.post(`HISTORY/EDIT/DO`, param).then((res) => {
            resolve(res.data);
        })
    });
}
export function APIAddPartMaster(param) {
    return new Promise((resolve) => {
        http.post(`AddPartMaster`, param).then((res) => {
            resolve(res.data);
        })
    });
}


export function APIAddPartMasterAll(param) {
    return new Promise((resolve) => {
        http.post(`AddPartMasterAll`, param).then((res) => {
            resolve(res.data);
        })
    });
}
export function ChkVers(param){
    return new Promise((resolve) => {
        http.post(`ChkVers`,param).then((res) => {
            resolve(res.data);
        })
    });
}



export function API_WARINING_DO() {
    return new Promise((resolve) => {
        http.get('/DOWarining').then((res) => {
            resolve(res.data);
        });
    })
}




export function API_LOAD_DATA(vdCode,empcode) {
    return new Promise((resolve) => {
        http.get(`/getPartMstrPU/${vdCode}/${empcode}`).then((res) => {
            resolve(res.data);
        });
    })
}