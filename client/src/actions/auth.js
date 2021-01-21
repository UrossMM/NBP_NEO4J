import axios from 'axios';
import {
  USPESNO_REGISTROVAN,
  GRESKA_PRILIKOM_REGISTROVANJA,
  USPESNO_LOGOVAN,
  GRESKA_PRI_LOGOVANJU,
  USPESNO_REGISTROVANA_ORDINACIJA,
} from './types';

//Register user
export const registracija = (podaci, tip) => async (dispatch) => {
  try {
    const res = await axios.post(`/create${tip}`, podaci);
    if (tip === 'Ordinacija') {
      dispatch({
        type: USPESNO_REGISTROVANA_ORDINACIJA,
        payload: podaci,
      });
      return;
    }
    dispatch({
      type: USPESNO_REGISTROVAN,
      payload: podaci,
    });
  } catch (err) {
    console.error(err);
  }
};

export const login = (podaci) => async (dispatch) => {
  try {
    console.log(podaci);

    dispatch({
      type: USPESNO_LOGOVAN,
      payload: podaci,
    });
  } catch (err) {
    dispatch({
      type: GRESKA_PRI_LOGOVANJU,
    });
  }
};
