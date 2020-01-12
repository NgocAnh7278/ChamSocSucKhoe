import {
  DEM_SO_THANH_VIEN,
  CHON_TAB_THANH_VIEN,
  DANG_NHAP,
  DANG_KY,
  KHOI_DONG_APP,
  LAY_THONG_TIN_CALO_THANH_VIEN,
  THEM_SO_THANH_VIEN,
  LAY_THUC_DON,
  CHON_NGAY_THUC_DON,
  CHON_BUA_AN,
  LOADING,
  URLThucDon,
  CHON_THANH_VIEN,
  URL_THONG_TIN_THANH_VIEN,
  THEM_DANH_MUC_MON_AN,
  URL_MON_AN,
  LAY_DANH_MUC_MON_AN,
  LAY_MON_AN,
  LOADING_DANH_MUC_MON_AN,
  LOADING_MON_AN,
  CHON_DANH_MUC_MON_AN,
  LUU_THONG_TIN_DANG_NHAP,
  CAP_NHAT_AVATAR,
  URL_DANG_NHAP,
} from '../../asset/MyConst';

// import * as thanhVien from './thanhVienAction'
import callApi from '../../api/apiCaller';
import taiKhoan from '../../api/TaiKhoanAPI';
import thucDon from '../../api/ThucDonAPI';
import thongTinThanhVien from '../../api/ThongTinThanhVienAPI';

import { AsyncStorage } from 'react-native';

//#region  Đăng nhập
export const khoiDongApp = navigation => ({ type: KHOI_DONG_APP, navigation });
export const dangNhap = (email, password, trangThaiDangNhap, laQuanTri) => ({
  type: DANG_NHAP,
  email,
  password,
  trangThaiDangNhap,
  laQuanTri,
});
export const luuThongTinDangNhap = (HoTen, Email, Avatar) => ({
  type: LUU_THONG_TIN_DANG_NHAP,
  HoTen,
  Email,
  Avatar,
});
export function dangNhapAsync(type, data) {
  return async dispatch => {
    return callApi(URL_DANG_NHAP, 'POST', data).then(async e => {
      if (e.data === 0) {
        dispatch(dangNhap('', '', false, false));
        dispatch(demSoThanhVien(0));
      } else {
        dispatch(
          dangNhap(
            data.email,
            data.password,
            true,
            e.data.LaQuanTri === '0' ? false : true,
          ),
        );
        let HoTen = e.data.HoTen;
        let Email = e.data.Email;
        let Avatar = e.data.Avatar;

        dispatch(luuThongTinDangNhap(HoTen, Email, Avatar));
        AsyncStorage.setItem('HoTen', HoTen);
        AsyncStorage.setItem('Email', Email);
        AsyncStorage.setItem('Avatar', Avatar);

        await thongTinThanhVien(DEM_SO_THANH_VIEN, data).then(result => {
          dispatch(demSoThanhVien(result));
        });
      }
    });
  };
}

// Đăng ký
export const dangKy = trangThaiDangKy => ({
  type: DANG_KY,
  trangThaiDangKy,
});
export function dangKyAsync(type, data) {
  return async dispatch => {
    await taiKhoan(type, data).then(e => {
      if (e === 0) {
        dispatch(dangKy(false));
      } else {
        dispatch(dangKy(true));
      }
    });
  };
}
//#endregion

//#region  Quản lý calo
export const chonTabThanhVien = index => ({ type: CHON_TAB_THANH_VIEN, index });
export const layThongTinCaloThanhVien = routes => ({
  type: LAY_THONG_TIN_CALO_THANH_VIEN,
  routes,
});

//#endregion

//#region Quản lý thành viên

// Đếm số thành viên
export const demSoThanhVien = soThanhVien => ({
  type: DEM_SO_THANH_VIEN,
  soThanhVien,
});
export function demSoThanhVienAsync(type, data) {
  return async dispatch => {
    await thongTinThanhVien(type, data).then(result => {
      dispatch(demSoThanhVien(result));
    });
  };
}

// Thêm số thành viên
export const themSoThanhVien = soThanhVien => ({
  type: THEM_SO_THANH_VIEN,
  soThanhVien,
});
export function themSoThanhVienAsync(body) {
  let soThanhVien = JSON.parse(body);
  return async dispatch => {
    await callApi(URL_THONG_TIN_THANH_VIEN, 'POST', body).then(async res => {
      dispatch(themSoThanhVien(soThanhVien.soNguoi));
    });
  };
}

// Lấy thông tin calo các thành viên
export const layThongTinThanhVien = routes => ({
  type: LAY_THONG_TIN_CALO_THANH_VIEN,
  routes,
});
export function layThongTinThanhVienAsync(type, data) {
  return async dispatch => {
    await thongTinThanhVien(type, data).then(result => {
      dispatch(layThongTinThanhVien(result));
    });
  };
}

// Cập nhật thông tin calo của các thành viên
export function capNhatThongTinCaloThanhVienAsync(type, data) {
  return async dispatch => {
    await thongTinThanhVien(type, data);
    await thongTinThanhVien(LAY_THONG_TIN_CALO_THANH_VIEN, {
      email: data.email,
    }).then(result => {
      dispatch(layThongTinThanhVien(result));
    });
  };
}

export function capNhatAvatarAsync(body, uri) {
  return async dispatch => {
    await callApi(URL_THONG_TIN_THANH_VIEN, 'POST', body).then(async res => {
      await AsyncStorage.setItem('Avatar', uri);
    });
  };
}

export const chonThanhVien = id => ({
  type: CHON_THANH_VIEN,
  id,
});

export function xoaThanhVienAsync(body, email) {
  return async dispatch => {
    await callApi(URL_THONG_TIN_THANH_VIEN, 'POST', body).then(async res => {
      dispatch(
        layThongTinThanhVienAsync(LAY_THONG_TIN_CALO_THANH_VIEN, { email }),
      );
    });
  };
}

export function themThanhVienAsync(body, email) {
  return async dispatch => {
    await callApi(URL_THONG_TIN_THANH_VIEN, 'POST', body).then(async res => {
      dispatch(
        layThongTinThanhVienAsync(LAY_THONG_TIN_CALO_THANH_VIEN, { email }),
      );
    });
  };
}

//#endregion

//#region Thực đơn
// Tải lại màn hình thực đơn
export const taiLaiTrang = isLoading => ({ type: LOADING, isLoading });
export const layThucDon = thucDon => ({ type: LAY_THUC_DON, thucDon });
export function layThucDonAsync(type, data) {
  return async dispatch => {
    await thucDon(type, data).then(async result => {
      await dispatch(layThucDon(result));
    });
  };
}

export const chonNgayThucDon = ngayChon => ({
  type: CHON_NGAY_THUC_DON,
  ngayChon,
});
export const chonBuaAn = buaAn => ({ type: CHON_BUA_AN, buaAn });
export function chonBuaAnAsync(buaAn) {
  return async dispatch => {
    await dispatch(chonBuaAn(buaAn));
  };
}

export function themMonAnAsync(monAn, email, ngayAn) {
  return dispatch => {
    return callApi(URLThucDon, 'POST', monAn).then(async res => {
      dispatch(
        layThucDonAsync(LAY_THUC_DON, {
          email: email,
          ngayAn: ngayAn,
        }),
      );
    });
  };
}

// Thêm danh mục món

export const layDanhMucMonAn = danhMucMonAn => ({
  type: LAY_DANH_MUC_MON_AN,
  danhMucMonAn,
});
export const loadingDanhMucMonAn = isLoading => ({
  type: LOADING_DANH_MUC_MON_AN,
  isLoading,
});
export const chonDanhMucMonAn = danhMucDaChon => ({
  type: CHON_DANH_MUC_MON_AN,
  danhMucDaChon,
});

export const layMonAn = monAn => ({ type: LAY_MON_AN, monAn });
export const loadingMonAn = isLoadingMonAn => ({
  type: LOADING_MON_AN,
  isLoadingMonAn,
});

export function layDanhMucMonAnAsync(body) {
  return dispatch => {
    dispatch(loadingDanhMucMonAn(true));
    return callApi(URL_MON_AN, 'POST', body)
      .then(async danhMucMonAn => {
        dispatch(layDanhMucMonAn(danhMucMonAn.data));
      })
      .then(() => {
        dispatch(loadingDanhMucMonAn(false));
      });
  };
}

// THêm danh mục món ăn
export function themDanhMucMonAnAsync(danhMucMonAn) {
  return dispatch => {
    return callApi(URL_MON_AN, 'POST', danhMucMonAn).then(async res => {
      dispatch(
        layDanhMucMonAnAsync(
          JSON.stringify({
            loai: LAY_DANH_MUC_MON_AN,
          }),
        ),
      );
    });
  };
}

// Sửa danh mục món ăn
export function danhMucMonAnAsync(danhMucMonAn) {
  return dispatch => {
    return callApi(URL_MON_AN, 'POST', danhMucMonAn).then(async res => {
      dispatch(
        layDanhMucMonAnAsync(
          JSON.stringify({
            loai: LAY_DANH_MUC_MON_AN,
          }),
        ),
      );
    });
  };
}

export function layMonAnAsync(body) {
  return dispatch => {
    dispatch(loadingMonAn(true));
    return callApi(URL_MON_AN, 'POST', body)
      .then(async monAn => {
        dispatch(layMonAn(monAn.data));
      })
      .then(() => {
        dispatch(loadingMonAn(false));
      });
  };
}

// Sửa danh mục món ăn
export function monAnAsync(monAn, idDanhMuc) {
  return dispatch => {
    return callApi(URL_MON_AN, 'POST', monAn).then(async res => {
      dispatch(
        layMonAnAsync(
          JSON.stringify({
            loai: LAY_MON_AN,
            idDanhMuc: idDanhMuc,
          }),
        ),
      );
    });
  };
}

//#endregion
