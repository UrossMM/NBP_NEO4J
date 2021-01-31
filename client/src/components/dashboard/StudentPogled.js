import React, { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';

const StudentPogled = (props) => {
  const [odgovori, setOdgovori] = useState([]);
  useEffect(() => {
    fetch(`/pitanjaOdgovorioStudent/${props.match.params.telefonS}`)
      .then((res) => res.json())
      .then((data) => setOdgovori(data))
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div className='comm1'>
      <h1 style={{ color: 'blue' }}>Odgovori na pitanja</h1>
      {odgovori.map((o) => (
        <MDBCard style={{ width: '39rem', marginTop: '2rem' }}>
          <MDBCardBody>
            <MDBCardTitle>{o.pitanje + '?'}</MDBCardTitle>
            <p
              style={{
                display: 'inline',
                color: 'blue',
                fontWeight: '600',
                fontFamily: 'arial',
              }}
            >{`Pitanje je postavio:`}</p>
            <p style={{ display: 'inline', marginLeft: '10px', color: 'red' }}>
              {o.ime}
            </p>
            <MDBCardText style={{ color: 'blue' }}>
              <p
                style={{
                  display: 'inline',
                  color: 'blue',
                  fontWeight: '600',
                  fontFamily: 'arial',
                }}
              >{`Odgovor ovog korisnika je:`}</p>
              <p
                style={{ display: 'inline', marginLeft: '10px', color: 'red' }}
              >
                {o.odgovor}
              </p>
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      ))}
    </div>
  );
};

export default StudentPogled;
