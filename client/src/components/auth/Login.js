import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, logout } from '../../actions/auth';
import { LOGOUT } from '../../actions/types';

const Login = ({ login, logout }) => {
  const [formData, setFormData] = useState({
    username: '',
    sifra: '',
  });

  useEffect(() => {
    logout();
  }, []);

  const history = useHistory();

  const { username, sifra } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const zaSlanje = {
      username,
      sifra,
    };
    login(zaSlanje);

    history.push('/dashboardZubar');
  };
  return (
    <div className='terza1'>
      <div class='login'>
        <h1>Login</h1>
        <form onSubmit={onSubmit}>
          <input
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
          />
          <button type='submit' class='btn btn-primary btn-block btn-large'>
            Prijavi se
          </button>
          <div className='izravnjaj'>
            <Link to='/register'>
              <h3>Registruj se</h3>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(null, { login, logout })(Login);
