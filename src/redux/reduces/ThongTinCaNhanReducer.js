import { LUU_THONG_TIN_DANG_NHAP } from '../../asset/MyConst'

const initialState = {
  thongTin: {
    HoTen: 'Nguyễn Thị Ngọc Ánh',
    Email: 'AnhNN@gmail.com',
    Avatar: 'https://2img.net/h/i148.photobucket.com/albums/s1/KingofSarus/Dress-upLuffy2.jpg',
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LUU_THONG_TIN_DANG_NHAP:
      {
        return { ...state, HoTen: action.HoTen, Email: action.Email, Avatar: action.Avatar }
      }
    default:
      return state;
  }
}
