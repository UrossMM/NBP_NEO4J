import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import MultiSelect from "react-multi-select-component";
import Select from "react-select";

import axios from "axios";
import { connect } from "react-redux";

class FormaDodaj extends Component {
  state = {
    naslov: "",
    tekst: "",
    tagovi: [],
    selektovaniTagovi: [],
  };

  // user = {
  //   prezime: "Stefanovic",
  //   ime: "Djordje",
  //   sifra: "djole",
  //   telefon: "0213543256",
  //   username: "djolecar@gmail.com",
  // };

  componentDidMount() {
    fetch("/vratiTagove", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ tagovi: data });
      });

    console.log(this.props);
  }

  dodajTemu = (e) => {
    const zaSlanje = {
      naslov: this.state.naslov,
      tekstPitanja: this.state.tekst,
      telefonKorisnika: this.props.user.telefon,
      tagoviZaFlitriranje: this.state.selektovaniTagovi,
    };
    try {
      axios.post("http://localhost:5000/postaviPitanje", zaSlanje).then(() => {
        window.location.href = "/forum";
      });
    } catch (err) {
      console.log(err);
    }
    console.log(zaSlanje);
  };

  promenaTeksta(event) {
    const value = event.target.value;

    this.setState({
      tekst: value,
    });
  }

  promenaNaslova(event) {
    const value = event.target.value;

    this.setState({
      naslov: value,
    });
  }

  promenaTagova(selktovaniTagovi) {
    const tagovi = selktovaniTagovi.map((item) => item.value);
    console.log(selktovaniTagovi, tagovi);

    this.setState({
      selektovaniTagovi: tagovi,
    });
  }

  render() {
    return (
      <MDBContainer className="mt-5">
        <MDBRow>
          <MDBCol md="12">
            <form>
              <p className="h4 text-center mb-4">Dodaj novu temu</p>
              <label htmlFor="defaultFormLoginEmailEx" className="black-text">
                Naslov:
              </label>
              <input
                type="text"
                id="subject"
                className="form-control"
                placeholder="npr. krvarenje desni..."
                onChange={(value) => this.promenaNaslova(value)}
              />
              <br />
              <label
                htmlFor="defaultFormLoginPasswordEx"
                className="black-text"
              >
                Tekst:
              </label>
              <textarea
                type="textarea"
                id="subjectText"
                className="form-control"
                onChange={(value) => this.promenaTeksta(value)}
              />
              <label className="black-text mt-4">Tagovi:</label>

              <div></div>
              <Select
                isMulti={true}
                options={this.state.tagovi.map((name) => {
                  return {
                    value: name,
                    label: name,
                  };
                })}
                onChange={(value) => this.promenaTagova(value)}
              />
              <div className="text-center mt-4">
                <MDBBtn
                  color="indigo"
                  onClick={(e) => this.dodajTemu(e)}
                >
                  Dodaj
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(FormaDodaj);
