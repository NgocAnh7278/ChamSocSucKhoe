import { combineReducers } from 'redux'
import ThongTinCaNhanReducer from './ThongTinCaNhanReducer'
import TaiKhoanReducer from './TaiKhoanReducer'
import NavigationReducer from './NavigationReducer'
import ThanhVienReducer from './ThanhVienReducer'
import CaloReducer from './CaloReducer'
import ThucDonReduce from './ThucDonReduce';
import MonAnReducer from './MonAnReducer';

export default combineReducers({
  thongTinCaNhan: ThongTinCaNhanReducer,
  taiKhoan: TaiKhoanReducer,
  thanhVien: ThanhVienReducer,
  myNavigation: NavigationReducer,
  quanLyCalo: CaloReducer,
  thucDon: ThucDonReduce,
  monAn: MonAnReducer,
})
