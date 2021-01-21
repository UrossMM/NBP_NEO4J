import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import RegisterStudent from './components/auth/RegisterStudent';
import RegisterOrdinacija from './components/auth/RegisterOrdinacija';
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
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
