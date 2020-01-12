import { DANG_NHAP, DANG_KY } from '../../asset/MyConst'

const initialState = {
  email: '',
  password: '',
  trangThaiDangNhap: false,
  trangThaiDangKy: false,
  laQuanTri: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case DANG_NHAP:
      return {
        ...state,
        email: action.email,
        password: action.password,
        trangThaiDangNhap: action.trangThaiDangNhap,
        laQuanTri: action.laQuanTri
      };
    case DANG_KY:
      return {
        ...state,
        trangThaiDangKy: action.trangThaiDangKy,
      };
    default:
      return state;
  }
}
