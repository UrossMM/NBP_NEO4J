import {
  USPESNO_REGISTROVAN,
  GRESKA_PRILIKOM_REGISTROVANJA,
  USPESNO_LOGOVAN,
  GRESKA_PRI_LOGOVANJU,
} from '../actions/types';

const initialState = {
  user: null,
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USPESNO_REGISTROVAN:
    case USPESNO_LOGOVAN:
      return {
        ...state,
        user: payload,
      };
    case GRESKA_PRILIKOM_REGISTROVANJA:
    case GRESKA_PRI_LOGOVANJU:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

export default authReducer;
