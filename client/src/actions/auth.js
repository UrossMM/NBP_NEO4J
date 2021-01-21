import axios from 'axios';
import {
  USPESNO_REGISTROVAN,
  GRESKA_PRILIKOM_REGISTROVANJA,
  USPESNO_LOGOVAN,
  GRESKA_PRI_LOGOVANJU,
} from './types';

//Register user
export const registracija = (podaci, tip) => async (dispatch) => {
  try {
    if (tip === 'Zubar') {
      const res = await axios.post('/createZubar', podaci);
      console.log(res.data);
    } else {
      const res = await axios.post('/createKorisnik', podaci);
      console.log(res.data);
    }

    dispatch({
      type: USPESNO_REGISTROVAN,
      payload: podaci,
    });
  } catch (err) {
    dispatch({
      type: GRESKA_PRILIKOM_REGISTROVANJA,
    });
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
