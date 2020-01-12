import { KHOI_DONG_APP } from '../../asset/MyConst'

const initialState = null

export default function (state = initialState, action) {
  switch (action.type) {
    case KHOI_DONG_APP:
      return action.navigation
    default:
      return state
  }
}
