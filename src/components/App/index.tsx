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
import { withFirebase } from '../Firebase';
import Firebase, { AuthUser } from '../Firebase/firebase';

type Props = {
  firebase: Firebase
}

const AppBase = ({firebase}: Props) => {
  const [authUser, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    const listener: () => void = firebase.auth.onAuthStateChanged((authUser: any) => {
      // authUser: any should be AuthUser|null but it throws a warning
      console.log('authUser HERE AppBase', authUser);
      !!authUser
      ? setUser(authUser)
      : setUser(null)
    });
    return listener; // === ComponentWillUnmount activation: takes a function to run when un-mounting component
  }, []);
  return (
    <Router>
      <div>
        <Navigation authUser={authUser}/>

        <hr />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        {/*<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />*/}
        {/*<Route path={ROUTES.HOME} component={HomePage} />*/}
        {/*<Route path={ROUTES.ACCOUNT} component={AccountPage} />*/}
        {/*<Route path={ROUTES.ADMIN} component={AdminPage} />*/}
      </div>
    </Router>
  );
};

const App = compose(
  withFirebase,
)(AppBase);

export default App;