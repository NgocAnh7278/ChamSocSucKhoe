import {
    THEM_DANH_MUC_MON_AN,
    SUA_DANH_MUC_MON_AN,
    XOA_DANH_MUC_MON_AN,
    THEM_MON_AN,
    SUA_MON_AN,
    XOA_MON_AN
} from "../asset/MyConst";


function ThemDanhMucMonAn(email, password) {

}


export default function monAn(type, data) {
    switch (type) {
        case THEM_DANH_MUC_MON_AN:
            return ThemDanhMucMonAn(data);
        case SUA_DANH_MUC_MON_AN:
            return LayThucDon(data);
        case XOA_DANH_MUC_MON_AN:
            return LayThucDon(data);
        case THEM_MON_AN:
            return LayThucDon(data);
        case SUA_MON_AN:
            return LayThucDon(data);
        case XOA_MON_AN:
            return LayThucDon(data);
    }
}