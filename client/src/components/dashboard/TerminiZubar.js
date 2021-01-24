import React, { Component } from 'react';
import { DayPilotScheduler, DayPilot } from 'daypilot-pro-react';
import axios from 'axios';
import { MDBIcon, MDBBtn } from 'mdbreact';
import nextId from 'react-id-generator';

class TerminiZubar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usluge: [],
      terminiNeodobreni: [],
      ime1: 'Danilo',
      ime2: 'Marija',
      startDate: '2021-01-23',
      days: 31,
      scale: 'Day',
      eventHeight: 45,
      cellWidth: 40,
      timeHeaders: [{ groupBy: 'Month' }, { groupBy: 'Day', format: 'd' }],
      cellWidthSpec: 'Auto',
      resources: [
        // { name: 'Resource B', id: 'B' },
        // { name: 'Resource C', id: 'C' },
        // { name: 'Resource D', id: 'D' },
        // { name: 'Resource E', id: 'E' },
        // { name: 'Resource F', id: 'F' },
        // { name: 'Resource G', id: 'G' },
      ],
      events: [
        // {
        //   id: 1,
        //   text: 'Event 1',
        //   start: '2021-10-01',
        //   end: '2021-10-01',
        //   resource: 'A0',
        // },
      ],
    };
  }
  componentDidMount() {
    fetch('/vratiTermineZubaraOdobrene/' + this.props.match.params.telefon, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) =>
        data.forEach((t) => {
          let zaTabelu = {
            id: nextId(),
            //ovde mitke da mi vrati i ime korisnika koji je potvrdio termin
            text: 'OKS',
            start: t.datum,
            end: t.datum,
            resource: t.imeUsluge,
            backColor: '#ff2626',
          };
          this.setState((state) => ({
            events: [...state.events, zaTabelu],
          }));
        })
      );
    fetch(`/vratiTermineZubaraNeOdobrene/${this.props.match.params.telefon}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        this.setState({ terminiNeodobreni: data });
      });

    fetch(`/vratiUslugeZubara/${this.props.match.params.username}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ usluge: data });
        data.forEach((d, index) => {
          let dodaj = { name: d.naziv, id: d.naziv };
          this.setState((state) => ({
            resources: [...state.resources, dodaj],
          }));
        });
      });
  }
  brisi(vrednost) {
    let div = document.querySelector('.terzar' + vrednost);
    div.remove();
  }
  async funkcija(ind) {
    let obj = {
      datum: this.state.terminiNeodobreni[ind].datum,
      telefon: this.props.match.params.telefon,
    };
    console.log(obj);
    const res = await axios.put('/potvrdiTermin', obj);
    // console.log(res);
    window.location.reload();
  }

  render() {
    var { ...config } = this.state;
    return (
      <div>
        <DayPilotScheduler
          {...config}
          onEventMoved={(args) => {
            console.log(
              'Event moved: ',
              args.e.data.id,
              args.newStart,
              args.newEnd,
              args.newResource
            );
          }}
          onTimeRangeSelected={(args) => {
            DayPilot.Modal.prompt('Upisite naziv korisnika', '').then(
              (modal) => {
                this.scheduler.clearSelection();
                if (!modal.result) {
                  return;
                }
                this.scheduler.events.add({
                  id: DayPilot.guid(),
                  text: modal.result,
                  start: args.start,
                  end: args.end,
                  resource: args.resource,
                });
                console.log(modal.result);
                var datum = args.start.toString('yyyy-MM-dd');
                var telefon = this.props.match.params.telefon;
              }
            );
          }}
          onEventMoved={(args) =>
            this.scheduler.message(
              'Promenili ste datum pregleda: ' + args.e.data.text
            )
          }
          ref={(component) => {
            this.scheduler = component && component.control;
          }}
        />
        <h3 style={{ color: 'black', marginTop: '20px' }}>
          Termini na cekanju
        </h3>
        {this.state.terminiNeodobreni &&
          this.state.terminiNeodobreni.map((t, index) => (
            <div className='terzica'>
              <div className={`terzar${index}`}>
                {t.datum}&nbsp;&nbsp;&nbsp;
                <MDBIcon icon='arrow-right' />
                &nbsp; Ime: &nbsp;
                {t.ime + ','}&nbsp;
                {'Opis:'} &nbsp;{t.imeUsluge}&nbsp; &nbsp;
                <MDBBtn
                  color='success'
                  size='sm'
                  onClick={() => this.funkcija(index)}
                >
                  Potvrdi
                </MDBBtn>
                <MDBBtn
                  color='danger'
                  size='sm'
                  onClick={() => this.brisi(index)}
                >
                  Odbij
                </MDBBtn>
                &nbsp;
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default TerminiZubar;
