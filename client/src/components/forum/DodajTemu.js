import React, { Fragment } from "react";
import FormaDodaj from "./FormaDodaj";
import NavbarKorisnik from "../dashboard/NavbarKorisnik";

const DodajTemu = (props) => {
  return (
    <Fragment>
      {/* <NavbarKorisnik /> */}
      {/* <br></br> */}
      <FormaDodaj />
    </Fragment>
  );
};

DodajTemu.propTypes = {};

export default DodajTemu;
