import Axios from "axios";
import { url } from "../const/constant"

const DELISECH = Axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default {
    DELISECH
}