import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SVE_PORUKE, SVE_USLUGE } from '../../actions/types';

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge,
} from 'mdbreact';

const akcija = (usluga) => (dispatch) => {
  console.log(usluga);
  dispatch({
    type: SVE_PORUKE,
    payload: usluga,
  });
};

const Usluga = ({ user, sveUsluge, akcija }) => {
  const [uslugaPodaci, setUslugaPodaci] = useState({
    naziv: '',
    cena: '',
    opis: '',
    username: user.username,
  });

  const { naziv, cena, opis, username } = uslugaPodaci;
  const onSubmit = async (e) => {
    e.preventDefault();
    const zaSlanje = {
      username,
      naziv,
      cena,
      opis,
    };
    console.log(zaSlanje);
    const element = (
      <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
        {opis}
        <MDBBadge color='primary' pill>
          {cena}
        </MDBBadge>
      </MDBListGroupItem>
    );
    ReactDOM.render(element, document.getElementById('root1'));

    const res = await axios.put('/novaUsluga', zaSlanje);
    console.log(res.data);
    akcija(zaSlanje);
  };
  const onChange = (e) =>
    setUslugaPodaci({ ...uslugaPodaci, [e.target.name]: e.target.value });

  return (
    <MDBContainer className='terza5'>
      <MDBRow>
        <MDBCol md='6'>
          <form onSubmit={onSubmit}>
            <p className='h4 text-center mb-4'>Dodaj novu uslugu</p>
            <label htmlFor='defaultFormContactNameEx' className='grey-text'>
              Naziv usluge
            </label>
            <input
              type='text'
              id='defaultFormContactNameEx'
              className='form-control'
              name='naziv'
              value={naziv}
              onChange={onChange}
            />
            <br />
            <label htmlFor='defaultFormContactEmailEx' className='grey-text'>
              Cena
            </label>
            <input
              type='text'
              id='defaultFormContactEmailEx'
              className='form-control'
              name='cena'
              value={cena}
              onChange={onChange}
            />
            <br />
            <label htmlFor='defaultFormContactMessageEx' className='grey-text'>
              Opis
            </label>
            <textarea
              type='text'
              id='defaultFormContactMessageEx'
              className='form-control'
              rows='3'
              name='opis'
              value={opis}
              onChange={onChange}
            />
            <div className='text-center mt-4'>
              <MDBBtn color='warning' outline type='submit'>
                Dodaj
                <MDBIcon far icon='paper-plane' className='ml-2' />
              </MDBBtn>
            </div>
          </form>
        </MDBCol>
        <MDBCol md='6' className='terza6'>
          <p className='h4  mb-4'>Lista usluga koje nudim</p>
          <MDBListGroup className='terzinjo' style={{ width: '31rem' }}>
            {sveUsluge.map((usl) => (
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                {usl.naziv}
                <MDBBadge color='primary' pill>
                  {usl.cena}
                </MDBBadge>
              </MDBListGroupItem>
            ))}
            <MDBListGroupItem
              className='d-flex justify-content-between align-items-center'
              id='root1'
            >
              <MDBBadge color='primary' pill></MDBBadge>
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

Usluga.propTypes = {
  user: PropTypes.object.isRequired,
  sveUsluge: PropTypes.array.isRequired,
  akcija: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  sveUsluge: state.dashboard.sveUsluge,
});

export default connect(mapStateToProps, { akcija })(Usluga);
