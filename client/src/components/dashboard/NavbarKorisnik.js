import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBContainer,
  MDBFormInline,
  MDBBtn,
} from "mdbreact";
import { SVI_KORISNICI, SVI_ZUBARI, SVI_STUDENTI } from "../../actions/types";
import PropTypes from "prop-types";

class Navbarkorisnik extends Component {
  state = {
    vrednost: "",
  };

  onChange = (e) => {
    this.setState({ ...this.state, vrednost: e.target.value });
    console.log(this.state);
  };

  pretraziUslugu() {
    this.props.promeniPretragu(this.state.vrednost);
  }

  // klik = async () => {
  //   const { dispatch } = this.props;

  //   const tmp =
  //     this.state.vrednost.charAt(0).toUpperCase() +
  //     this.state.vrednost.slice(1);

  //   const res = await axios.get("/sviZubari");
  //   const niz = res.data.filter((z) => z.ime === tmp);

  //   dispatch({
  //     type: SVI_ZUBARI,
  //     payload: niz,
  //   });

  //   const res1 = await axios.get("/sviKorisnici");
  //   const niz1 = res1.data.filter((k) => k.ime === tmp);

  //   dispatch({
  //     type: SVI_KORISNICI,
  //     payload: niz1,
  //   });
  //   const res2 = await axios.get("/sviStudenti");
  //   const niz2 = res2.data.filter((s) => s.ime === tmp);

  //   dispatch({
  //     type: SVI_STUDENTI,
  //     payload: niz2,
  //   });
  // };

  render() {
    return (
      <MDBContainer>
        <MDBNavbar
          color="light-blue"
          dark
          expand="md"
          style={{ marginTop: "20px" }}
        >
          <MDBNavbarBrand>
            <strong className="white-text">
              {this.props.ime && this.props.ime}
            </strong>
          </MDBNavbarBrand>
          <MDBNavbarNav left>
            {/* <MDBNavItem>
                <MDBBtn href="/#">
                  <i class="fa fa-fw fa-home"></i> Home
                </MDBBtn>
              </MDBNavItem> */}
            <MDBNavItem>
              <MDBFormInline waves>
                <div className="md-form my-0">
                  <input
                    className="form-control mr-sm-2"
                    type="text"
                    placeholder="Pretraga..."
                    aria-label="Search"
                    onChange={this.onChange}
                  />
                </div>
              </MDBFormInline>
            </MDBNavItem>
            {/* <MDBNavItem>
                <MDBBtn
                  color="light-blue"
                  className="dugmence"
                  onClick={() => this.klik(this.state.vrednost)}
                >
                  Pretrazi forum
                </MDBBtn>
              </MDBNavItem> */}
            <MDBNavItem>
              <MDBBtn
                color="light-blue"
                className="dugmence"
                onClick={() => this.pretraziUslugu()}
              >
                Pretrazi usluge
              </MDBBtn>
            </MDBNavItem>
          </MDBNavbarNav>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBNavLink className="waves-effect waves-" to="/">
                Odjavi se
              </MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBNavbar>
      </MDBContainer>
    );
  }
}

Navbarkorisnik.propTypes = {
  promeniPretragu: PropTypes.func.isRequired,
};

export default connect(null, null)(Navbarkorisnik);
