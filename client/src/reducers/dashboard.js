import {
  POSTAVI_ORDINACIJU,
  LOGOUT,
  SVI_ZUBARI,
  SVI_KORISNICI,
  SVI_STUDENTI,
} from '../actions/types';

const initialState = {
  ordinacija: null,
  sviZubari: [],
  sviKorisnici: [],
  sviStudenti: [],
  svePoruke: [],
};

function dashboardReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case POSTAVI_ORDINACIJU:
      return {
        ...state,
        ordinacija: payload,
      };
    case LOGOUT:
      return {
        ordinacija: null,
        sviZubari: [],
        sviKorisnici: [],
        sviStudenti: [],
        svePoruke: [],
      };
    case SVI_ZUBARI:
      return {
        ...state,
        sviZubari: payload,
      };
    case SVI_KORISNICI:
      return {
        ...state,
        sviKorisnici: payload,
      };
    case SVI_STUDENTI:
      return {
        ...state,
        sviStudenti: payload,
      };
    default:
      return state;
  }
}

export default dashboardReducer;
