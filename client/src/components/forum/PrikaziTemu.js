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
    odgovori: []
  };

  componentDidMount() {
    fetch("/vratiPitanjeSaKomentarimaIOdgovorima/" + this.props.data.match.params.id, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data[0] !== undefined){
        console.log(data);
        let komentari = [];
        let odgovori = [];
        data.forEach((el) => {
          komentari.push(el.komentar.komentar);
          odgovori.push(el.odogovor.odgovor);
        });
        console.log(odgovori);

     let noviOdgovori =  odgovori.filter(function(el, index, arr) {
          return index === arr.indexOf(el);
      });

      let noviKomentari = komentari.filter(function(el, index, arr) {
        return index === arr.indexOf(el);
    }); 
        this.setState({
          naslov: data[0].pitanje.naslov,
          tekst: data[0].pitanje.tekstPitanja,
          komentari: noviKomentari,
          odgovori: noviOdgovori
        });
      }
      });

      if (this.state.naslov === '') {
        fetch("/vratiPitanjeSaKomentarima/" + this.props.data.match.params.id, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data[0] !== undefined){
            let komentari = [];
            data.forEach((el) => {
              komentari.push(el.komentar.komentar);
            });
            this.setState({
              naslov: data[0].pitanje.naslov,
              tekst: data[0].pitanje.tekstPitanja,
              komentari: komentari,
            });
          }
          });
      }

      if (this.state.naslov === '') {
        fetch("/vratiPitanje/" + this.props.data.match.params.id, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            this.setState({
              naslov: data.naslov,
              tekst: data.tekstPitanja,
            });

          });
      }
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
      if (this.props.user.role === 'Korisnik') {
        console.log("Korisnik");
      axios.post("http://localhost:5000/ostaviKomentarNaPitanje", zaSlanje);
      } else {
        console.log("Zubar");

        axios.post("http://localhost:5000/odgovoriNaPitanje", {
          odgovor: odgovor, 
          idPitanja: pitanjeId,
          idPosiljaoca: this.props.user.telefon,
          daLiJeZubar: this.props.user.role === 'Zubar' ? true : false
        });
      }
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
        <div style={{ display: "flex", flexDirection: "row" }}>

        <div style={{ width: "48%" }}>
            <h5 className="mt-4">Odgovori korisnika:</h5>
            {this.state.komentari.map((el, index) => (
              <MDBCard
                className="mt-2 mb-4 px-3 pt-2 pb-2"
                style={{ fontWeight: 300, maxWidth: 900, minWidth: 400 }}
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
            </div>
            <div className='ml-4' style={{ width: "48%" }}>
          <h5 className="mt-4">Odgovori zubara:</h5>
            {this.state.odgovori.map((el, index) => (
              <MDBCard
                className="mt-2 mb-4 px-3 pt-2 pb-2"
                style={{ fontWeight: 300, maxWidth: 900, minWidth: 400 }}
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
            </div>

      </div>
            <textarea
              id="odgovorZaTemu"
              placeholder="Odgovori na temu..."
              
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
