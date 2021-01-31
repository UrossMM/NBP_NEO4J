import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCard, MDBCardBody } from "mdbreact";
import axios from "axios";

class Dashboar extends Component {
  render() {
    return (
      <MDBContainer>
        <h3 style={{ display: "flex", justifyContent: "center" }}>
          Usluge nasih stomatologa
        </h3>
        <h5 className="mb-4" style={{ marginLeft: "150px" }}>
          Ovde mozete pronaci i pretraziti usluge i cene koje nude stomatolozi
          registrovani na nasem sajtu
        </h5>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "70%" }}>
            {this.props.usluge.map((el, index) => (
              <MDBCard
                className="my-3 px-5 pt-2 pb-2"
                style={{ fontWeight: 300, maxWidth: 700, minWidth: 500 }}
              >
                <MDBCardBody className="py-0">
                  <MDBRow>
                    <div className="excerpt">
                      <div className="brief">
                        <a href={"/tema/" + el.pitanje.id} className="name">
                          {el.pitanje.naslov} -
                        </a>{" "}
                        {el.korisnik.ime} {el.korisnik.prezime}
                      </div>
                      <div className="added-text">
                        {el.pitanje.tekstPitanja}
                      </div>
                      <div className="feed-footer">
                        <a href="#!" className="like">
                          <span>7 likes</span>
                        </a>
                      </div>
                    </div>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            ))}
          </div>
        </div>
      </MDBContainer>
    );
  }
}

export default Dashboar;