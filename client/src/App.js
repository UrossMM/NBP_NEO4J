import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import RegisterStudent from './components/auth/RegisterStudent';
import RegisterOrdinacija from './components/auth/RegisterOrdinacija';
import Zubar from './components/dashboard/Zubar';
import Usluga from './components/dashboard/Usluga';
import Poruke from './components/dashboard/Poruke';
import UrediProfil from './components/dashboard/UrediProfil';
import TerminiZubar from './components/dashboard/TerminiZubar';
import ZubarPogled from './components/dashboard/ZubarPogled';
import Komentari from './components/dashboard/Komentari';
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/register/student' component={RegisterStudent} />
          <Route
            exact
            path='/register/ordinacija'
            component={RegisterOrdinacija}
          />
          <Route exact path='/dashboardZubar' component={Zubar} />
          <Route exact path='/dodajUslugu' component={Usluga} />
          <Route exact path='/porukeZubar/:telefon' component={Poruke} />
          <Route exact path='/urediProfil' component={UrediProfil} />
          <Route
            exact
            path='/terminiZubar/:username/:telefon'
            component={TerminiZubar}
          />
          <Route
            exact
            path='/zubarPogled/:username/:usernameTrenutnog'
            component={ZubarPogled}
          />
          <Route exact path='/zubarKomentari/:telefon' component={Komentari} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
