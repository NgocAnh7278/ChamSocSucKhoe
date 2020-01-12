import {
    LAY_THUC_DON,
    URLThucDon,
    THEM_MON_AN
    // URL_DANG_KY
} from "../asset/MyConst";
import moment from 'moment';

function LayThucDon(data) {
    return fetch(URLThucDon, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loai: LAY_THUC_DON,
            email: data.email,
            ngayAn: data.ngayAn
        })
    }).then(response => response.json())
        .then(responseJson => responseJson).catch(err => console.log(err)
        )
}

export default function thucDon(type, data) {
    switch (type) {
        case LAY_THUC_DON:
            return LayThucDon(data);
        ca
    }
}