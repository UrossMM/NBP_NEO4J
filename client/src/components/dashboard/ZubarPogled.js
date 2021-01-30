import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBContainer,
  MDBBadge,
  MDBBtn,
} from 'mdbreact';

const ZubarPogled = (props) => {
  const [usluge, setUsluge] = useState([]);
  useEffect(async () => {
    const res = await axios.get(
      'http://localhost:5000/vratiUslugeZubara/' + props.match.params.username
    );
    setUsluge(res.data);
    const dugme = document.getElementById('dugme');
    const res1 = await axios.get(
      `/daLiPreporucujem/${props.match.params.usernameTrenutnog}/${props.match.params.username}`
    );
    dugme.disabled = res1.data;
  }, []);
  const klik = async () => {
    const res = await axios.put('http://localhost:5000/preporuciZubara', {
      usernameZubaraTrenutnog: props.match.params.usernameTrenutnog,
      usernameZubaraZaPreporuku: props.match.params.username,
    });
    window.location.reload();
  };
  return (
    <div className='pogled'>
      <div className='gore'>
        <h2>{props.match.params.username}</h2>
        <MDBBtn id='dugme' color='success' onClick={klik}>
          Preporuci
        </MDBBtn>
      </div>
      <div className='dole'>
        <h2>Usluge koje nudim:</h2>

        <MDBListGroup style={{ width: '26rem' }}>
          {usluge.map((u) => (
            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
              {u.naziv}{' '}
              <MDBBadge color='primary' pill>
                {u.cena}
              </MDBBadge>
            </MDBListGroupItem>
          ))}
        </MDBListGroup>
      </div>
    </div>
  );
};

export default ZubarPogled;
