import React, { Fragment, Component } from "react";
import NavbarKorisnik from "./NavbarKorisnik";
import Dashboar from "./UslugeDashboard";

class Forum extends Component {
  state = { pretraga: "", usluge: [] };

  promeniPretragu(value) {
    fetch("/pretraziUsluguPoCeni/" + value, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ pretraga: value, usluge: data });
      });
  }

  render() {
    return (
      <Fragment>
        <NavbarKorisnik promeniPretragu={this.promeniPretragu.bind(this)} />
        <br></br>
        <Dashboar pretraga={this.state.pretraga} usluge={this.state.usluge} />
      </Fragment>
    );
  }
}

Forum.propTypes = {};

export default Forum;
