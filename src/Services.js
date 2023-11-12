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
export function ServiceVender() {
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

export function GetVenders() {
    return new Promise(resolve => {
        http.get('/getSupplier').then((res) => {
            resolve(res.data);
        }).catch(() => {
            console.log('catch')
            resolve([]);
        })
    })
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
        console.log('123')
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
    console.log(type)
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