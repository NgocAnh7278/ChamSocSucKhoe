import axios from 'axios';
import { IP_SERVER, URL_DANG_KY, DANG_NHAP_ACTION, DANG_KY_ACTION } from "../asset/MyConst";


export default function callApi(url, method = 'GET', body) {
    return axios({
        method: method,
        url: url,
        data: body
    }).catch(err => {
        console.log(err);
    });
};