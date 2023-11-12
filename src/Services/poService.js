import http from "../Services";

export function GET_PO(data){
    return new Promise(resolve => {
        http.post('/data/po',data).then((res) => {
            resolve(res.data);
        }).catch(() => {
            resolve([]);
        })
    })
}

