import React, { Component } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from "mdbreact";
import axios from "axios";
import { connect } from "react-redux";

class PrikaziTemu extends Component {
  state = {
    naslov: "",
    tekst: "",
    komentari: [],
  };

  componentDidMount() {
    fetch("/vratiPitanjeSaKomentarima/" + this.props.data.match.params.id, {
      method: "GET",
    })
      .then((res) => res.json)
      .then((data) => {
        this.setState({
          naslov: data.naslov,
          tekst: data.tekst,
          komentari: data.komentari,
        });
      });
  }

  dodajOdgovor = (e) => {
    let odgovor = document.getElementById("odgovorZaTemu").value;
    const pitanjeId = this.props.data.match.params.id;

    const zaSlanje = {
      komentar: odgovor,
      idPitanja: pitanjeId,
      idKorisnika: this.props.user.telefon,
    };
    try {
      axios.post("http://localhost:5000/ostaviKomentarNaPitanje", zaSlanje);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <MDBContainer className="mt-5">
        <MDBRow>
          <MDBCol md="12">
            <h3>Naslov teme</h3>
            <div className="mt-6">
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero
              inventore, iste quas libero eius? Vitae sint neque animi alias
              sunt dolor, accusantium ducimus, non placeat voluptate.
            </div>
            <h5 className="mt-4">Postavljeni odgovori:</h5>
            <MDBCard
              className="mt-2 mb-4 px-3 pt-2 pb-2"
              style={{ fontWeight: 300 }}
            >
              <MDBCardBody className="py-0">
                <MDBRow>
                  <div className="excerpt">
                    <div className="brief">
                      <a href="#!" className="name">
                        Lili Rose
                      </a>{" "}
                      posted on her page
                    </div>
                    <div className="added-text">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Vero inventore, iste quas libero eius? Vitae sint neque
                      animi alias sunt dolor, accusantium ducimus, non placeat
                      voluptate.
                    </div>
                  </div>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
            {/* {this.state.komentari.map((el, index) => (
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
            ))} */}

            <textarea
              id="odgovorZaTemu"
              placeholder="Odgovori na temu..."
              style={{ maxWidth: 900 }}
              className="form-control"
            ></textarea>
            <MDBBtn
              className="ml-0"
              color="indigo"
              onClick={(e) => this.dodajOdgovor(e)}
            >
              Dodaj odgovor
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      //   <MDBContainer>
      //     <MDBRow>
      //       <MDBCol md="12">
      //         <form>
      //           <p className="h4 text-center mb-4">Dodaj novu temu</p>
      //           <label htmlFor="defaultFormLoginEmailEx" className="black-text">
      //             Naslov:
      //           </label>
      //           <input
      //             type="text"
      //             id="subject"
      //             className="form-control"
      //             placeholder="npr. krvarenje desni..."
      //           />
      //           <br />
      //           <label
      //             htmlFor="defaultFormLoginPasswordEx"
      //             className="black-text"
      //           >
      //             Tekst:
      //           </label>
      //           <textarea
      //             type="textarea"
      //             id="subjectText"
      //             className="form-control"
      //           />
      //           <div className="text-center mt-4">
      //             <MDBBtn color="indigo" onClick={(e) => this.dodajTemu(e)}>
      //               Dodaj
      //             </MDBBtn>
      //           </div>
      //         </form>
      //       </MDBCol>
      //     </MDBRow>
      //   </MDBContainer>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(PrikaziTemu);
