import React from 'react';
import Zahtev from './Notification';

const ZahteviStudenata = (props) => {
  return (
    <div>
      <Zahtev
        telefon={props.match.params.telefon}
        usernameZubara={props.match.params.usernameZubara}
      />
    </div>
  );
};

export default ZahteviStudenata;
