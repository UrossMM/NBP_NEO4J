import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NavbarPageZubar from './NavbarPageZubar';
import { connect } from 'react-redux';
import axios from 'axios';
import { MDBBtn } from 'mdbreact';

{
  /* <i class='fas fa-fw fa-user-graduate'></i> */
}
{
  /* <i class='fas fa-fw fa-tooth'></i> */
}

const Zubar = ({ zubar, ordinacija, zubari, korisnici, studenti }) => {
  const [podaciZubar, setPodaciZubar] = useState({});
  const [podaciOrdinacije, setPodaciOrdinacije] = useState({});
  // const [zubariNiz, setZubariNiz] = useState([]);
  useEffect(() => {
    setPodaciZubar(zubar);
  }, [zubar]);
  useEffect(() => {
    setPodaciOrdinacije(ordinacija);
  }, [ordinacija]);
  // useEffect(() => {
  //   setZubariNiz(zubari);
  // }, [zubari]);

  return (
    <Fragment>
      <NavbarPageZubar
        telefon={podaciZubar && podaciZubar.telefon}
        ime={podaciOrdinacije && podaciOrdinacije.ime}
      />
      <div className='glavni'>
        {zubari &&
          zubari.map((zubar) => (
            <div className='glavnic'>
              <h3>
                <i class='fas fa-fw fa-tooth'></i>
                {zubar.ime} {zubar.prezime}
              </h3>
              <MDBBtn color='default'>Pogledaj Profil</MDBBtn>
            </div>
          ))}
        {korisnici &&
          korisnici.map((k) => (
            <div className='glavnic'>
              <h3>
                <i class='fas fa-fw fa-male'></i>
                {k.ime} {k.prezime}
              </h3>
              <MDBBtn color='default'>Pogledaj Profil</MDBBtn>
            </div>
          ))}
        {studenti &&
          studenti.map((s) => (
            <div className='glavnic'>
              <h3>
                <i class='fas fa-fw fa-user-graduate'></i>
                {s.ime} {s.prezime}
              </h3>
              <MDBBtn color='default'>Pogledaj Profil</MDBBtn>
            </div>
          ))}
      </div>
    </Fragment>
  );
};

Zubar.propTypes = {
  zubar: PropTypes.object,
  ordinacija: PropTypes.object,
  zubari: PropTypes.array,
  korisnici: PropTypes.array,
  studenti: PropTypes.array,
};
const mapStateToProps = (state) => ({
  zubar: state.auth.user,
  ordinacija: state.dashboard.ordinacija,
  zubari: state.dashboard.sviZubari,
  korisnici: state.dashboard.sviKorisnici,
  studenti: state.dashboard.sviStudenti,
});

export default connect(mapStateToProps, null)(Zubar);
