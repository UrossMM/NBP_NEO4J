import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge,
} from 'mdbreact';

const Usluga = () => {
  return (
    <MDBContainer className='terza5'>
      <MDBRow>
        <MDBCol md='6'>
          <form>
            <p className='h4 text-center mb-4'>Dodaj novu uslugu</p>
            <label htmlFor='defaultFormContactNameEx' className='grey-text'>
              Naziv usluge
            </label>
            <input
              type='text'
              id='defaultFormContactNameEx'
              className='form-control'
            />
            <br />
            <label htmlFor='defaultFormContactEmailEx' className='grey-text'>
              Cena
            </label>
            <input
              type='email'
              id='defaultFormContactEmailEx'
              className='form-control'
            />
            <br />
            <label htmlFor='defaultFormContactMessageEx' className='grey-text'>
              Opis
            </label>
            <textarea
              type='text'
              id='defaultFormContactMessageEx'
              className='form-control'
              rows='3'
            />
            <div className='text-center mt-4'>
              <MDBBtn color='warning' outline type='submit'>
                Dodaj
                <MDBIcon far icon='paper-plane' className='ml-2' />
              </MDBBtn>
            </div>
          </form>
        </MDBCol>
        <MDBCol md='6' className='terza6'>
          <p className='h4  mb-4'>Lista usluga koje nudim</p>
          <MDBListGroup className='terzinjo' style={{ width: '31rem' }}>
            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
              Cras justo odio
              <MDBBadge color='primary' pill>
                14
              </MDBBadge>
            </MDBListGroupItem>
            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
              Dapibus ac facilisis in
              <MDBBadge color='primary' pill>
                2
              </MDBBadge>
            </MDBListGroupItem>
            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
              Morbi leo risus
              <MDBBadge color='primary' pill>
                1
              </MDBBadge>
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Usluga;
