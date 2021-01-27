import React, { useState, useEffect } from 'react';
import { MDBListGroup, MDBListGroupItem, MDBContainer } from 'mdbreact';
import axios from 'axios';

const Komentari = (props) => {
  const [komentari, setKomentari] = useState([]);
  useEffect(async () => {
    const res = await axios.get(
      '/vratiKomentareOZubaru/' + props.match.params.telefon
    );
    setKomentari(res.data);
  }, []);
  return (
    <div className='comm'>
      <MDBListGroup style={{ width: '25rem' }}>
        {komentari.map((k) => (
          <MDBListGroupItem>
            <div className='d-flex w-100 justify-content-between'>
              <h5 className='mb-1'>
                Komentarisao:&nbsp;&nbsp;{k.imeKorisnika}
              </h5>
              <small>3 days ago</small>
            </div>
            <p className='mb-1 terrr'>{k.komentar}</p>
            <small style={{ color: 'green' }}>Ocena:{k.ocena}</small>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </div>
  );
};

export default Komentari;
