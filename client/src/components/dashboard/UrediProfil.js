import React, { Fragment, useState } from 'react';
import { MDBInput, MDBBtn } from 'mdbreact';

const UrediProfil = () => {
  const [formData, setFormData] = useState({
    username: '',
    sifra: '',
    telefon: '',
  });
  const { username, sifra, telefon } = formData;
  const onSubmit = async (e) => {
    e.preventDefault();
    const zaSlanje = {
      username,
      sifra,
      telefon,
    };
    console.log(zaSlanje);
  };
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <MDBInput
          label='Promeni username'
          outline
          size='lg'
          background
          name='username'
          value={username}
          onChange={onChange}
        />
        ;
        <MDBInput
          label='Promeni sifru'
          outline
          size='lg'
          background
          name='sifra'
          value={sifra}
          onChange={onChange}
        />
        ;
        <MDBInput
          label='Promeni telefon'
          outline
          size='lg'
          background
          name='telefon'
          value={telefon}
          onChange={onChange}
        />
        ;
        <MDBBtn color='success' size='lg' type='submit'>
          Sacuvaj izmene
        </MDBBtn>
      </form>
    </Fragment>
  );
};

export default UrediProfil;
