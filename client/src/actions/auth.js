import axios from 'axios';
import {
  USPESNO_REGISTROVAN,
  USPESNO_LOGOVAN,
  GRESKA_PRI_LOGOVANJU,
  USPESNO_REGISTROVANA_ORDINACIJA,
  POSTAVI_ORDINACIJU,
  LOGOUT,
  SVE_USLUGE,
} from './types';

//Register user
export const registracija = (podaci, tip) => async (dispatch) => {
  try {
    const res = await axios.post(`/create${tip}`, podaci);
    console.log(podaci);
    if (tip === 'Ordinacija') {
      dispatch({
        type: USPESNO_REGISTROVANA_ORDINACIJA,
        payload: podaci,
      });
      return;
    }
    dispatch({
      type: USPESNO_REGISTROVAN,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const login = (podaci) => async (dispatch) => {
  try {
    const res = await axios.post('/getLoginUser', podaci);

    dispatch({
      type: USPESNO_LOGOVAN,
      payload: res.data,
    });

    const res1 = await axios.post('/getOrdinacija', {
      username: podaci.username,
    });

    dispatch({
      type: POSTAVI_ORDINACIJU,
      payload: res1.data,
    });
    const res2 = await axios.get('/vratiUslugeZubara/' + podaci.username);
    console.log(res2.data);
    dispatch({
      type: SVE_USLUGE,
      payload: res2.data,
    });
    return res.data.role;
  } catch (err) {
    dispatch({
      type: GRESKA_PRI_LOGOVANJU,
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
