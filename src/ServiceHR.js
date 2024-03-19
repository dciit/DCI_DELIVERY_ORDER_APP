import Axios from "axios";
const http = Axios.create({
    baseURL: import.meta.env.VITE_PATH_HR_API,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
        // 'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
});

export default { http };

export function API_PRIVILEGE(module = '', component = '') {
    return new Promise(resolve => {
        http.get(`/privilege/${module}/${component}`).then((res) => {
            resolve(res.data);
        }).catch(() => {
            resolve([]);
        })
    })
}