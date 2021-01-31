import React, { Fragment, Component } from "react";
import NavbarKorisnik from "../dashboard/NavbarKorisnik";
import Dashboar from "../forum/Dashboard";

class Forum extends Component {
  state = { pretraga: "" };

  promeniPretragu(value) {
    this.setState({
      pretraga: value,
    });
  }

  render() {
    return (
      <Fragment>
        {/* <NavbarKorisnik promeniPretragu={this.promeniPretragu.bind(this)} /> */}
        {/* <br></br> */}
        <Dashboar pretraga={this.state.pretraga} />
      </Fragment>
    );
  }
}

Forum.propTypes = {};

export default Forum;
