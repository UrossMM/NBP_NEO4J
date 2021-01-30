import React, { useEffect, useState } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBIcon,
} from 'mdbreact';

const Poruke = (props) => {
  const [poruke, setPoruke] = useState([]);
  useEffect(() => {
    fetch(`/vratiPrivatnePoruke/${props.match.params.telefon}`)
      .then((res) => res.json())
      .then((data) => setPoruke(data))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className='comm1'>
      <h1>Privatne poruke</h1>
      {poruke.map((p) => (
        <MDBCard style={{ width: '39rem', marginTop: '2rem' }}>
          <MDBCardBody>
            <MDBCardTitle>
              {' '}
              {`${p.student.ime} ${p.student.prezime}`}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <MDBIcon far icon='clock' />
              &nbsp;&nbsp;
              {new Date(Date.parse(p.poruka.vreme))
                .toUTCString()
                .split(' ')
                .slice(0, 4)
                .join(' ')}
            </MDBCardTitle>
            <MDBCardText>{p.poruka.tekst}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      ))}
    </div>
  );
};

export default Poruke;
