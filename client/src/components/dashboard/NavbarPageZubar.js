import React, { Component } from 'react';
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
} from 'mdbreact';

class NavbarPageZubar extends Component {
  state = {
    collapseID: '',
  };

  toggleCollapse = (collapseID) => () =>
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : '',
    }));

  render() {
    return (
      <MDBContainer>
        <MDBNavbar
          color='info-color'
          dark
          expand='md'
          style={{ marginTop: '20px' }}
        >
          <MDBNavbarBrand>
            <strong className='white-text'></strong>
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
                      placeholder='Pretrazi po imenu'
                      aria-label='Search'
                    />
                  </div>
                </MDBFormInline>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink className='waves-effect waves-' to='/dodajUslugu'>
                  <MDBIcon icon='tooth' className='mr-1' />
                  Dodaj uslugu
                </MDBNavLink>
              </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
              <MDBNavItem>
                <MDBNavLink
                  className='waves-effect waves-light'
                  to='/porukeZubar'
                >
                  <MDBIcon icon='envelope' className='mr-1' />
                  Poruke
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  className='waves-effect waves-light'
                  to='/urediProfilZubar'
                >
                  <MDBIcon icon='cog' className='mr-1' />
                  Uredi profil
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
                      <Link to='/terminiZubar'>Pogledaj termine</Link>
                    </MDBDropdownItem>
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

export default NavbarPageZubar;
