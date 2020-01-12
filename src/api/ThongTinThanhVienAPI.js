import {
  DEM_SO_THANH_VIEN,
  LAY_THONG_TIN_CALO_THANH_VIEN,
  THEM_SO_THANH_VIEN,
  URL_THONG_TIN_THANH_VIEN,
  CAP_NHAT_THONG_TIN_CALO_THANH_VIEN
} from '../asset/MyConst'

function LaySoThanhVien(email) {
  return fetch(URL_THONG_TIN_THANH_VIEN, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      loai: DEM_SO_THANH_VIEN
    })
  })
    .then(response => response.json())
    .then(responseJson => responseJson)
}

function LayThongTinThanhVien(email) {
  return fetch(URL_THONG_TIN_THANH_VIEN, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      loai: LAY_THONG_TIN_CALO_THANH_VIEN,
      email: email
    })
  })
    .then(response => response.json())
    .then(
      responseJson => {
        let routes = [];
        for (let index = 0; index < responseJson.length; index++) {
          const element = responseJson[index]
          let title = ''
          if (element.chucDanh === 'Tôi') {
            title = 'Tôi'
          } else {
            title = 'Member ' + (index + 1).toString()
          }
          routes.push({
            key: element.id,
            title: title,
            info: element
          })
        }
        return routes;
      }
    )
    .catch(error => {
      console.error(error)
    })
}

function ThemThanhVien(email, soThanhVien) {
  return fetch(URL_THONG_TIN_THANH_VIEN, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      loai: THEM_SO_THANH_VIEN,
      email: email,
      soNguoi: soThanhVien,
    }),
  })
    .then(response => response.json())
    .then(responseJson => {
      responseJson
    }
    )
}

function CapNhatThongTinThanhVien(query) {
  fetch(URL_THONG_TIN_THANH_VIEN, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      loai: CAP_NHAT_THONG_TIN_CALO_THANH_VIEN,
      sql_Query: query,
    }),
  })
    .then(response => response.json())
    .then(responseJson => { })
    .catch(error => {
      console.error(error);
    });
}


export default function thongTinThanhVien(type = 1, data) {
  switch (type) {
    case DEM_SO_THANH_VIEN:
      return LaySoThanhVien(data.email);
    case LAY_THONG_TIN_CALO_THANH_VIEN:
      return LayThongTinThanhVien(data.email);
    case THEM_SO_THANH_VIEN:
      return ThemThanhVien(data.email, data.soThanhVien);
    case CAP_NHAT_THONG_TIN_CALO_THANH_VIEN:
      return CapNhatThongTinThanhVien(data.query);

  };
}
