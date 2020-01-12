import { THEM_SO_THANH_VIEN, DEM_SO_THANH_VIEN, LAY_THONG_TIN_CALO_THANH_VIEN } from '../../asset/MyConst'

const initialState = {
  soThanhVien: 0,
  thongTinThanhVien: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case DEM_SO_THANH_VIEN:
    case THEM_SO_THANH_VIEN:
      {
        return { ...state, soThanhVien: action.soThanhVien }
      }
    default:
      return state
  }
}
