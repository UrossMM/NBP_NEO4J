import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCard, MDBCardBody } from "mdbreact";
import axios from "axios";
import { connect } from "react-redux";

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
                        <div className="name">
                          {el.usluga.naziv} -
                          <a
                            href={
                              "/terminiZubar/" +
                              el.zubar.username +
                              "/" +
                              el.zubar.telefon
                            }
                          >
                            {" "}
                            {el.zubar.ime} {el.zubar.prezime}{" "}
                          </a>
                        </div>{" "}
                      </div>
                      <div className="added-text">{el.usluga.opis}</div>
                      <div className="feed-footer">
                        <span>Cena: {el.usluga.cena} RSD</span>
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

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Dashboar);
