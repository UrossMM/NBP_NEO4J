import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

const Usluga = (props) => {
  const [uslugaPodaci, setUslugaPodaci] = useState({
    naziv: '',
    cena: '',
    opis: '',
  });
  const [usluge, setUsluge] = useState([]);
  useEffect(async () => {
    const res = await axios.get(
      `/vratiUslugeZubara/${props.match.params.username}`
    );
    setUsluge(res.data);
  }, []);

  const { naziv, cena, opis } = uslugaPodaci;
  const onSubmit = async (e) => {
    e.preventDefault();
    const zaSlanje = {
      username: props.match.params.username,
      naziv,
      cena,
      opis,
    };

    await axios.put('/novaUsluga', zaSlanje);
    window.location.reload();
  };
  const onChange = (e) =>
    setUslugaPodaci({ ...uslugaPodaci, [e.target.name]: e.target.value });
  const klik = async (ind) => {
    await axios.put('/obrisiUslugu', {
      usernameZubara: props.match.params.username,
      nazivUsluge: usluge[ind].naziv,
    });
    window.location.reload();
  };

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
            {usluge.map((usl, index) => (
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                {usl.naziv}
                <MDBBadge color='primary' pill>
                  {usl.cena}
                  <MDBBtn
                    id={usl.naziv}
                    onClick={() => klik(index)}
                    size='sm'
                    gradient='peach'
                  >
                    Brisi
                  </MDBBtn>
                </MDBBadge>
              </MDBListGroupItem>
            ))}
          </MDBListGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Usluga;
