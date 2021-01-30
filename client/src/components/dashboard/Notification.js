import React, { Component } from 'react';
import { MDBNotification, MDBBtn } from 'mdbreact';
import swal from 'sweetalert';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studenti: [],
    };
  }
  componentDidMount() {
    fetch('/vratiZainteresovaneStudente/' + this.props.telefon)
      .then((res) => res.json())
      .then((data) => this.setState({ studenti: data }));
  }
  prihvati(student) {
    swal(`${student.s.ime} ${student.s.prezime} sada stazira kod vas!`);
    let data = {
      usernameStudenta: student.s.username,
      usernameZubara: this.props.usernameZubara,
    };
    fetch('/prihvatiStaziranje', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error(error);
      });
    window.location.reload();
  }
  render() {
    return (
      <div className='tetko'>
        <h2
          style={{
            textAlign: 'center',
            color: 'red',
            fontFamily: 'sense',
            fontWeight: '600',
            marginTop: '20px',
          }}
        >
          Zahtevi studenata za staziranje
        </h2>
        {this.state.studenti.length === 0 ? <h1>Nemate zahteva</h1> : null}
        {this.state.studenti.map((s) => (
          <div className='red5'>
            <MDBNotification
              show
              fade
              icon='envelope'
              iconClassName='green-text'
              title='Student'
              message={`${s.ime} ${s.prezime}`}
              className='pomerimalo'
            />
            <MDBBtn
              outline
              color='success'
              onClick={() => this.prihvati({ s })}
            >
              Prihvati
            </MDBBtn>
          </div>
        ))}
      </div>
    );
  }
}

export default Notification;
