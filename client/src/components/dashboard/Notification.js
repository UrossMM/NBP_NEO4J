import React, { Component } from 'react';
import { MDBNotification, MDBBtn } from 'mdbreact';

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
  render() {
    const zaSvakog = (
      <div className='red5'>
        <MDBNotification
          show
          fade
          icon='envelope'
          iconClassName='green-text'
          title='Novi zahtev'
          message='Hello, user! You have a new message.'
          className='pomerimalo'
        />
        <MDBBtn outline color='success'>
          Prihvati
        </MDBBtn>
        <MDBBtn outline color='danger'>
          Odbij
        </MDBBtn>
      </div>
    );
    return (
      <div className='tetko'>
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
            <MDBBtn outline color='success'>
              Prihvati
            </MDBBtn>
            <MDBBtn outline color='danger'>
              Odbij
            </MDBBtn>
          </div>
        ))}
      </div>
    );
  }
}

export default Notification;
