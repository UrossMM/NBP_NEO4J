import React, { useEffect, useState } from 'react';
import { MDBNotification, MDBContainer } from 'mdbreact';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';

const Poruke = (props, { vratiSvePoruke }) => {
  const [poruke, setPoruke] = useState([]);
  // const datumi = [];
  const fetchData = async () => {
    const res = await axios.get(
      '/vratiPrivatnePoruke/' + props.match.params.telefon
    );
    setPoruke(res.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //   konvertuj();
  //   console.log(tmp);
  // }, [poruke]);
  // const konvertuj = () => {
  //   poruke.forEach((p) => {
  //     let d = new Date(Date.parse(p.poruka.vreme));
  //     setTmp([...tmp, 'terza']);
  //   });
  // };
  return (
    <div className='terza3'>
      <MDBContainer className='opa'>
        {poruke &&
          poruke.map((p) => (
            <div>
              {p.poruka.vreme}
              <MDBNotification
                show
                fade
                iconClassName='text-primary'
                title={`${p.student.ime} ${p.student.prezime}`}
                message={p.poruka.tekst}
                // text={porukeNiz[0]}
              />
            </div>
          ))}
      </MDBContainer>
    </div>
  );
};

Poruke.propTypes = {
  vratiSvePoruke: PropTypes.func.isRequired,
};

export default connect()(Poruke);
