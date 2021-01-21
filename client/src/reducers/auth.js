import {
  USPESNO_REGISTROVAN,
  GRESKA_PRILIKOM_REGISTROVANJA,
  USPESNO_LOGOVAN,
  GRESKA_PRI_LOGOVANJU,
  USPESNO_REGISTROVANA_ORDINACIJA,
  GRESKA_PRILIKOM_REGISTROVANJA_ORDINACIJE,
} from '../actions/types';

const initialState = {
  user: null,
  ordinacija: null,
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USPESNO_REGISTROVAN:
    case USPESNO_LOGOVAN:
      return {
        ...state,
        user: payload,
        ordinacija: null,
      };
    case GRESKA_PRILIKOM_REGISTROVANJA:
    case GRESKA_PRI_LOGOVANJU:
      return {
        ...state,
        user: null,
      };
    case USPESNO_REGISTROVANA_ORDINACIJA:
      return {
        ...state,
        ordinacija: payload,
      };
    case GRESKA_PRILIKOM_REGISTROVANJA_ORDINACIJE:
      return {
        ...state,
        ordinacija: null,
      };
    default:
      return state;
  }
}

export default authReducer;
