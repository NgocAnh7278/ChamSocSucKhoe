import { URL_DANG_NHAP, URL_DANG_KY, DANG_NHAP_ACTION, DANG_KY_ACTION } from "../asset/MyConst";

function layThongTinCaloThanhVien(email, password) {
    return fetch(this.URLLayThongTinThanhVien, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loai: LAY_THONG_TIN_CALO_THANH_VIEN_ACTION,
            email: this.props.email,
            soNguoi: this.props.soThanhVien
        })
    })
        .then(response => response.json())
        .then(responseJson => {
            for (let index = 0; index < responseJson.length; index++) {
                const element = responseJson[index]
                let title = ''
                if (element.chucDanh === 'Tôi') {
                    title = 'Tôi'
                } else {
                    title = 'Member ' + (index + 1).toString()
                }
                this.routes.push({
                    key: element.id,
                    title: title,
                    info: element
                })
            }
            this.props.layThongTinCaloThanhVien(this.routes)
        })
        .catch(error => {
            console.error(error)
        })
}

export default function calo(type, data) {
    switch (type) {
        case DANG_NHAP_ACTION:
            return DangNhap(data.email, data.password)
        case DANG_KY_ACTION:
            return DangKy(email, password, hoTen, ngayTao)
    }
}