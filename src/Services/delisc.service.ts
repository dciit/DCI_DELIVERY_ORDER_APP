import http from "../const/_configAxios";

const GET_DELISEC = () => {
    return http.DELISECH.get(`delisd/rm/list`);
}
const GET_DELISEC_DETAIL = (param: any) => {
    return http.DELISECH.post(`delisd/rm/detail`, param);
}
export default {
    GET_DELISEC, GET_DELISEC_DETAIL
}