import React from 'react';
import Zahtev from './Notification';

const ZahteviStudenata = (props) => {
  return (
    <div>
      <Zahtev telefon={props.match.params.telefon} />
    </div>
  );
};

export default ZahteviStudenata;
