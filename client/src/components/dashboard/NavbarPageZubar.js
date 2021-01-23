import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBContainer,
  MDBIcon,
  MDBFormInline,
  MDBBtn,
} from 'mdbreact';
import { SVI_KORISNICI, SVI_ZUBARI, SVI_STUDENTI } from '../../actions/types';

class NavbarPageZubar extends Component {
  state = {
    collapseID: '',
    vrednost: '',
  };

  toggleCollapse = (collapseID) => () =>
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : '',
    }));
  onChange = (e) => {
    this.setState({ ...this.state, vrednost: e.target.value });
  };

  klik = async () => {
    const { dispatch } = this.props;

    const tmp =
      this.state.vrednost.charAt(0).toUpperCase() +
      this.state.vrednost.slice(1);

    const res = await axios.get('/sviZubari');
    const niz = res.data.filter((z) => z.ime === tmp);

    dispatch({
      type: SVI_ZUBARI,
      payload: niz,
    });

    const res1 = await axios.get('/sviKorisnici');
    const niz1 = res1.data.filter((k) => k.ime === tmp);

    dispatch({
      type: SVI_KORISNICI,
      payload: niz1,
    });
    const res2 = await axios.get('/sviStudenti');
    const niz2 = res2.data.filter((s) => s.ime === tmp);

    dispatch({
      type: SVI_STUDENTI,
      payload: niz2,
    });
  };

  render() {
    return (
      <MDBContainer>
        <MDBNavbar
          color='light-blue'
          dark
          expand='md'
          style={{ marginTop: '20px' }}
        >
          <MDBNavbarBrand>
            <strong className='white-text'>
              {this.props.ime && this.props.ime}
            </strong>
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse('navbarCollapse3')} />
          <MDBCollapse
            id='navbarCollapse3'
            isOpen={this.state.collapseID}
            navbar
          >
            <MDBNavbarNav left>
              <MDBNavItem>
                <MDBFormInline waves>
                  <div className='md-form my-0'>
                    <input
                      className='form-control mr-sm-2'
                      type='text'
                      placeholder='Unesi ime'
                      aria-label='Search'
                      onChange={this.onChange}
                    />
                  </div>
                </MDBFormInline>
              </MDBNavItem>
              <MDBNavItem>
                <MDBBtn
                  color='light-blue'
                  className='dugmence'
                  onClick={() => this.klik(this.state.vrednost)}
                >
                  Pretrazi
                </MDBBtn>
              </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
              <MDBNavItem>
                <MDBNavLink className='waves-effect waves-' to='/dodajUslugu'>
                  <MDBIcon icon='tooth' className='mr-1' />
                  Dodaj uslugu
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  className='waves-effect waves-light'
                  to={`/porukeZubar/${this.props.telefon}`}
                >
                  <MDBIcon icon='envelope' className='mr-1' />
                  Poruke
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBDropdown>
                  <MDBDropdownToggle nav caret>
                    <MDBIcon icon='user' className='mr-1' />
                    Profile
                  </MDBDropdownToggle>
                  <MDBDropdownMenu className='dropdown-default' right>
                    <MDBDropdownItem>
                      <Link to='/komentariZubar'>Komentari</Link>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <Link
                        to={`/terminiZubar/${this.props.username}/${this.props.telefon}`}
                      >
                        Pogledaj termine
                      </Link>
                    </MDBDropdownItem>
                    {/* <MDBDropdownItem>
                      <Link to='/urediProfil'>Uredi profil</Link>
                    </MDBDropdownItem> */}
                    <MDBDropdownItem>
                      <Link to='/'>Odjavi se</Link>
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
      </MDBContainer>
    );
  }
}

export default connect(null, null)(NavbarPageZubar);
