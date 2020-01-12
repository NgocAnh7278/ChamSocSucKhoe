import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import FoodCategory from './src/components/diary/FoodCategory';
import DangNhapActivity from './src/activity/dang-nhap/DangNhapActivity';
import DangKyActivity from './src/activity/dang-nhap/DangKyActivity';
import NhapSoThanhVienActivity from './src/activity/nhap-so-thanh-vien/NhapSoThanhVienActivity';
import ManHinhChinhActivity from './src/activity/man-hinh-chinh/ManHinhChinhActivity';
import DanhSachDanhMucMonAnActivity from './src/activity/quan-ly-thuc-don/DanhSachDanhMucMonAnActivity';
import BaoCaoActivity from './src/activity/bao-cao/BaoCaoActivity';
import DanhSachMonAnActivity from './src/activity/quan-ly-thuc-don/DanhSachMonAnActivity';
import ChiTietMonAnActivity from './src/activity/quan-ly-thuc-don/ChiTietMonAnActivity';
import QuanLyThucDonActivity from './src/activity/quan-ly-thuc-don/QuanLyThucDonActivity';
import AdminActivity from './src/activity/admin/AdminActivity';
import QuanLyMonAnActivity from './src/activity/admin/QuanLyMonAnActivity';
import QuanLyChiTietMonAnActivity from './src/activity/admin/QuanLyChiTietMonAnActivity';
import DemoActivity from './src/activity/DemoActivity';
import { Provider } from 'react-redux';
import store from './src/redux/store/store';
const RootStack = createStackNavigator(
  {
    DangNhapActivity: DangNhapActivity,
    DangKyActivity: DangKyActivity,
    NhapSoThanhVienActivity: NhapSoThanhVienActivity,
    ManHinhChinhActivity: ManHinhChinhActivity,
    DanhSachDanhMucMonAnActivity: DanhSachDanhMucMonAnActivity,
    BaoCaoActivity: BaoCaoActivity,
    DanhSachMonAnActivity: DanhSachMonAnActivity,
    ChiTietMonAnActivity: ChiTietMonAnActivity,
    QuanLyThucDonActivity: QuanLyThucDonActivity,
    AdminActivity: AdminActivity,
    QuanLyMonAnActivity: QuanLyMonAnActivity,
    QuanLyChiTietMonAnActivity: QuanLyChiTietMonAnActivity,
    DemoActivity: DemoActivity,
  },
  {
    initialRouteName: 'DangNhapActivity',
  },
);

const AppContainer = createAppContainer(RootStack);
console.disableYellowBox = true;
export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
