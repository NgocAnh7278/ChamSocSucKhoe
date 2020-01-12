import {
    LAY_DANH_MUC_MON_AN,
    LAY_MON_AN,
    LOADING_DANH_MUC_MON_AN,
    LOADING_MON_AN,
    CHON_DANH_MUC_MON_AN
} from '../../asset/MyConst'

const initialState = {
    danhMucMonAn: [],
    monAn: [],
    isLoading: false,
    isLoadingMonAn: false,
    danhMucDaChon : ''
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LAY_DANH_MUC_MON_AN:
            return { ...state, danhMucMonAn: action.danhMucMonAn }
        case LAY_MON_AN:
            return { ...state, monAn: action.monAn }
        case LOADING_DANH_MUC_MON_AN:
            return { ...state, isLoading: action.isLoading }
        case LOADING_MON_AN:
            return { ...state, isLoadingMonAn: action.isLoadingMonAn }
        case CHON_DANH_MUC_MON_AN:
            return { ...state, danhMucDaChon: action.danhMucDaChon }
        default:
            return state
    }
}
