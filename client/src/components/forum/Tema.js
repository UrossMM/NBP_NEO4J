import React, { Fragment } from "react";
import PrikaziTemu from "./PrikaziTemu";
import NavbarKorisnik from "../dashboard/NavbarKorisnik";

const OtvoriTemu = (props) => {
  return (
    <Fragment>
      {/* <NavbarKorisnik /> */}
      {/* <br></br> */}
      <PrikaziTemu data={props} />
    </Fragment>
  );
};

OtvoriTemu.propTypes = {};

export default OtvoriTemu;
