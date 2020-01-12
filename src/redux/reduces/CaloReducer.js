import {
  CHON_TAB_THANH_VIEN,
  LAY_THONG_TIN_CALO_THANH_VIEN,
  CHON_THANH_VIEN
} from '../../asset/MyConst'

const initialState = {
  index: 0,
  routes: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case CHON_TAB_THANH_VIEN:
      return { ...state, index: action.index }
    case LAY_THONG_TIN_CALO_THANH_VIEN: {
      return { ...state, routes: action.routes }
    }
    case CHON_THANH_VIEN: {
      return {
        ...state,
        routes: state.routes.map(e => {
          if (e.info.id !== action.id) return e;
          return { ...e, info: { ...e.info, checked: !e.info.checked } };
        })
      }
    }
    default:
      return state
  }
}
