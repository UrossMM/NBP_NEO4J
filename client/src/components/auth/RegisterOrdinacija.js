import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registracija } from '../../actions/auth';

const RegisterOrdinacija = ({ registracija }) => {
  const [formData, setFormData] = useState({
    ime: '',
    grad: '',
    adresa: '',
  });

  const history = useHistory();

  const { ime, grad, adresa } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const zaSlanje = {
      ime,
      grad,
      adresa,
    };
    registracija(zaSlanje, 'Ordinacija');
  };
  return (
    <div className='terza1'>
      <div class='login'>
        <h1>Register</h1>
        <form onSubmit={onSubmit}>
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
            name='grad'
            placeholder='Grad'
            required='required'
            value={grad}
            onChange={onChange}
          />
          <input
            type='text'
            name='adresa'
            placeholder='Adresa'
            required='required'
            value={adresa}
            onChange={onChange}
          />
          <button type='submit' class='btn btn-primary btn-block btn-large'>
            Registruj ordinaciju
          </button>
        </form>
      </div>
    </div>
  );
};

RegisterOrdinacija.propTypes = {
  registracija: PropTypes.func.isRequired,
};

export default connect(null, { registracija })(RegisterOrdinacija);
