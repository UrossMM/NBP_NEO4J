import React, { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';

const KorisnikPogled = (props) => {
  const [pitanja, setPitanja] = useState([]);
  useEffect(() => {
    fetch(`/pitanjaPostavioKorisnik/${props.match.params.telefonK}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => setPitanja(data))
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div className='comm1'>
      <h1>Pitanja koje je korisnik postavljao</h1>
      {pitanja.map((p) => (
        <MDBCard style={{ width: '39rem', marginTop: '2rem' }}>
          <MDBCardBody>
            <MDBCardTitle>{p.naslov + '?'}</MDBCardTitle>
            <MDBCardText>{p.tekstPitanja}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      ))}
    </div>
  );
};

export default KorisnikPogled;
