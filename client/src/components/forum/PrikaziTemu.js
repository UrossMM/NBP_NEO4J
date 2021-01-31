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
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let komentari = [];
        data.forEach((el) => {
          komentari.push(el.komentar.komentar);
        });
        this.setState({
          naslov: data[0].pitanje.naslov,
          tekst: data[0].pitanje.tekstPitanja,
          komentari: komentari,
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

   setTimeout(() => {
    window.location.reload();
   }, 1000) 
  };

  render() {
    return (
      <MDBContainer className="mt-5">
        <MDBRow>
          <MDBCol md="12">
            <h3>{this.state.naslov}</h3>
            <div className="mt-6">{this.state.tekst}</div>
            <h5 className="mt-4">Postavljeni odgovori:</h5>
            {this.state.komentari.map((el, index) => (
              <MDBCard
                className="mt-2 mb-4 px-3 pt-2 pb-2"
                style={{ fontWeight: 300, maxWidth: 900, minWidth: 500 }}
              >
                <MDBCardBody className="py-0">
                  <MDBRow>
                    <div className="excerpt">
                      <div className="added-text">
                        {el}
                      </div>
                    </div>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            ))}

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
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(PrikaziTemu);
