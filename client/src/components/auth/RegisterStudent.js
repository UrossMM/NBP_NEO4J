import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registracija } from '../../actions/auth';

const RegisterStudent = ({ registracija }) => {
  const [formData, setFormData] = useState({
    // username: '',
    // sifra: '',
    ime: '',
    prezime: '',
    grad: '',
    telefon: '',
    godina: '',
    prosek: '',
  });

  const history = useHistory();

  const {
    // username,
    // sifra,
    ime,
    prezime,
    grad,
    telefon,
    godina,
    prosek,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const zaSlanje = {
      //   username,
      //   sifra,
      ime,
      prezime,
      grad,
      telefon,
      godina,
      prosek,
    };
    registracija(zaSlanje, 'Student');
  };
  return (
    <div className='terza1'>
      <div class='login'>
        <h1>Register</h1>
        <form onSubmit={onSubmit}>
          {/* <input
            type='text'
            name='username'
            placeholder='Username'
            required='required'
            value={username}
            onChange={onChange}
          />
          <input
            type='password'
            name='sifra'
            placeholder='Password'
            required='required'
            value={sifra}
            onChange={onChange}
          /> */}
          <input
            type='text'
            name='ime'
            placeholder='Ime'
            required='required'
            value={ime}
            onChange={onChange}
          />
          <input
            type='text'
            name='prezime'
            placeholder='Prezime'
            required='required'
            value={prezime}
            onChange={onChange}
          />
          <input
            type='text'
            name='grad'
            placeholder='Grad'
            required='required'
            value={grad}
            onChange={onChange}
          />
          <input
            type='text'
            name='telefon'
            placeholder='Telefon'
            required='required'
            value={telefon}
            onChange={onChange}
          />
          <input
            type='text'
            name='godina'
            placeholder='Godina'
            required='required'
            value={godina}
            onChange={onChange}
          />
          <input
            type='text'
            name='prosek'
            placeholder='Prosek'
            required='required'
            value={prosek}
            onChange={onChange}
          />
          <button type='submit' class='btn btn-primary btn-block btn-large'>
            Registruj se
          </button>
        </form>
      </div>
    </div>
  );
};

RegisterStudent.propTypes = {
  registracija: PropTypes.func.isRequired,
};

export default connect(null, { registracija })(RegisterStudent);
