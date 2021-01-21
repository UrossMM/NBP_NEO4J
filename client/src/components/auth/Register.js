import React, { Fragment, useState, useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registracija } from '../../actions/auth';
import { json } from 'body-parser';

const Register = ({ registracija }) => {
  const [formData, setFormData] = useState({
    imeZ: '',
    prezimeZ: '',
    gradZ: '',
    telefonZ: '',
    usernameZ: '',
    sifraZ: '',
    imeK: '',
    prezimeK: '',
    telefonK: '',
    usernameK: '',
    sifraK: '',
  });

  const {
    imeZ,
    prezimeZ,
    gradZ,
    telefonZ,
    usernameZ,
    sifraZ,
    imeK,
    prezimeK,
    telefonK,
    usernameK,
    sifraK,
  } = formData;

  const history = useHistory();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const zaSlanje = {
      ime: imeZ,
      prezime: prezimeZ,
      grad: gradZ,
      telefon: telefonZ,
      username: usernameZ,
      sifra: sifraZ,
    };
    registracija(zaSlanje, 'Zubar');
    history.push('/');
  };

  const onSubmitK = async (e) => {
    e.preventDefault();
    const zaSlanje = {
      ime: imeK,
      prezime: prezimeK,
      telefon: telefonK,
      username: usernameK,
      sifra: sifraK,
    };
    registracija(zaSlanje, 'Korisnik');
    history.push('/');
  };

  return (
    <div className='terza'>
      <div className='login-wrap'>
        <div className='login-html'>
          <input id='tab-1' type='radio' name='tab' className='sign-in' />
          <label for='tab-1' className='tab'>
            Zubar
          </label>
          <input id='tab-2' type='radio' name='tab' className='sign-up' />
          <label for='tab-2' className='tab'>
            Korisnik
          </label>
          <div className='login-form'>
            <form onSubmit={onSubmit}>
              <div className='sign-in-htm'>
                <div className='group'>
                  <label for='imeZubara' className='label'>
                    Ime
                  </label>
                  <input
                    id='imeZubara'
                    type='text'
                    className='input'
                    name='imeZ'
                    value={imeZ}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='prezimeZubara' className='label'>
                    Prezime
                  </label>
                  <input
                    id='prezimeZubara'
                    type='text'
                    className='input'
                    name='prezimeZ'
                    value={prezimeZ}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='gradZubara' className='label'>
                    Grad
                  </label>
                  <input
                    id='gradZubara'
                    type='text'
                    className='input'
                    name='gradZ'
                    value={gradZ}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='telefonZubara' className='label'>
                    Telefon
                  </label>
                  <input
                    id='telefonZubara'
                    type='number'
                    className='input'
                    name='telefonZ'
                    value={telefonZ}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='usernameZubara' className='label'>
                    Username
                  </label>
                  <input
                    id='username'
                    type='text'
                    className='input'
                    name='usernameZ'
                    value={usernameZ}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='sifraZubara' className='label'>
                    Sirfa
                  </label>
                  <input
                    id='sifraZubara'
                    type='password'
                    className='input'
                    name='sifraZ'
                    value={sifraZ}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <input
                    type='submit'
                    className='button'
                    value='Registruj se'
                  />
                </div>
                <div className='group'>
                  <input
                    type='submit'
                    className='button1'
                    value='Kreiraj ordinaciju'
                    onClick={() => history.push('/register/ordinacija')}
                  />
                </div>
              </div>
            </form>
            <form onSubmit={onSubmitK}>
              <div className='sign-up-htm'>
                <div className='group'>
                  <label for='imeKorisnika' className='label'>
                    Ime
                  </label>
                  <input
                    id='imeKorisnika'
                    type='text'
                    className='input'
                    name='imeK'
                    value={imeK}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='prezimeKorisnika' className='label'>
                    Prezime
                  </label>
                  <input
                    id='prezimeKorisnika'
                    type='text'
                    className='input'
                    name='prezimeK'
                    value={prezimeK}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='telefonKorisnika' className='label'>
                    Telefon
                  </label>
                  <input
                    id='telefonKorisnika'
                    type='munber'
                    className='input'
                    name='telefonK'
                    value={telefonK}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='usernameKorisnika' className='label'>
                    Username
                  </label>
                  <input
                    id='usernameKorisnika'
                    type='text'
                    className='input'
                    name='usernameK'
                    value={usernameK}
                    onChange={onChange}
                  />
                </div>
                <div className='group'>
                  <label for='sifraKorisnika' className='label'>
                    Sifra
                  </label>
                  <input
                    id='sifraKorisnika'
                    type='password'
                    className='input'
                    name='sifraK'
                    value={sifraK}
                    onChange={onChange}
                  />
                </div>

                <div className='group'>
                  <input
                    type='submit'
                    className='button'
                    value='Registruj se'
                  />
                </div>

                <div className='group'>
                  <input
                    type='submit'
                    className='button1'
                    value='Student si?'
                    onClick={() => history.push('/register/student')}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  registracija: PropTypes.func.isRequired,
};

export default connect(null, { registracija })(Register);
