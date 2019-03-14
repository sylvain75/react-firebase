import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route, withRouter,
} from 'react-router-dom';
import { compose } from "recompose";
import Navigation from '../Navigation';
import LandingPage from '../Landing/Landing';
import SignInPage from '../SignIn';
// import PasswordForgetPage from '../PasswordForget';
// import HomePage from '../Home';
// import AccountPage from '../Account';
// import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import withAuthentication from '../Session/withAuthentication';
import SignUpPage from '../SignUp';


const AppBase = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      {/*<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />*/}
      {/*<Route path={ROUTES.HOME} component={HomePage} />*/}
      {/*<Route path={ROUTES.ACCOUNT} component={AccountPage} />*/}
      {/*<Route path={ROUTES.ADMIN} component={AdminPage} />*/}
    </div>
  </Router>
);

const App = compose(
  withAuthentication,
)(AppBase);
/*
  withAuthentication is the higher-order component to make the authenticated user available
  for all other components below of the App component
 */

export default App;