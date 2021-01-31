import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCard, MDBCardBody } from "mdbreact";
import axios from "axios";

class Dashboar extends Component {
  state = {
    teme: [],
    tagovi: [],
    kliknutiTagovi: [],
  };

  componentDidMount() {
    fetch("/vratiSveTeme", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ teme: data });
      });

    fetch("/vratiTagove", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ tagovi: data });
      });
  }

  // stampaj(value) {
  //   // console.log(this.state.teme[0].pitanje.naslov, this.state);
  //   console.log(this.state);
  // }

  async tag(event) {
    let tag = event.target.innerText;
    fetch("/vratiPitanjaSaTagovima/" + tag, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ teme: data });
      });

    // const pitanja = await axios.get("/vratiPitanjaSaTagovima", {
    //   tagoviZaFiltriranje: [tag],
    // });
    // console.log(pitanja);
  }

  async klikniTag(event) {
    const imeTaga = event.target.value;
    let kliknutiTagovi = this.state.kliknutiTagovi;

    if (kliknutiTagovi.includes(imeTaga)) {
      kliknutiTagovi = kliknutiTagovi.filter((item) => item !== imeTaga);
    } else {
      kliknutiTagovi.push(imeTaga);
    }

    this.setState({
      kliknutiTagovi: kliknutiTagovi,
    });

    if (kliknutiTagovi.length === 0) {
      await fetch("/vratiSveTeme", { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ teme: data });
        });
    }

    const zaSlanje = {
      tagoviZaFiltriranje: kliknutiTagovi,
    };

    const res = await axios.post(
      "http://localhost:5000/vratiPitanjaSaTagovima",
      zaSlanje
    );

    this.setState({ teme: res.data });
  }

  render() {
    return (
      <MDBContainer className="mt-5">
        {/* <div onClick={(value) => this.stampaj(value)}>Djole</div> */}
        {/* <div>{this.props.pretraga}</div> */}
        <h3 style={{ display: "flex", justifyContent: "center" }}>
          Dobrodosli na forum za stomatologiju!
        </h3>
        <h5 className="mb-4">
          Ovde mozete pronaci sva pitanja koja su nasi korisnici do sada
          postavljali. Ukoliko ne pronadjete odgovor na Vase pitanje dodajte
          novu temu i neki od nasih korisnika ce Vam odgovoriti u sto kracem
          roku.
        </h5>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "70%" }}>
            {this.state.teme.map((el, index) => (
              <MDBCard
                className="my-3 px-5 pt-2 pb-2"
                style={{ fontWeight: 300, maxWidth: 700, minWidth: 500 }}
              >
                <MDBCardBody className="py-0">
                  <MDBRow>
                    <div className="excerpt">
                      <div className="brief">
                        <a href={"/tema/" + el.idPitanja} className="name">
                          {el.pitanje.naslov} -
                        </a>{" "}
                        {el.korisnik.ime} {el.korisnik.prezime}
                      </div>
                      <div className="added-text">
                        {el.pitanje.tekstPitanja}
                      </div>
                    </div>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            ))}
          </div>

          <div className="my-3 pt-2">
            <a href="/dodajTemu" className="btn btn-success">
              Dodaj novu temu
            </a>
            <p className="mt-3 ml-1 mb-0">Pretrazi po tagovima:</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {this.state.tagovi.map((el, index) => (
                <button
                  id={"button-" + index}
                  key={"button-" + index}
                  type="button"
                  className={
                    this.state.kliknutiTagovi.includes(el)
                      ? "btn btn-primary"
                      : "btn btn-outline-primary"
                  }
                  value={el}
                  onClick={(event) => {
                    this.klikniTag(event);
                  }}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>
        </div>
      </MDBContainer>
    );
  }
}

export default Dashboar;
