import React, { useEffect, useState } from 'react';
import * as firebaseType from 'firebase';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import Firebase, { AuthUser } from '../Firebase/firebase';
import { AUTH_USER } from '../../constants/localStorageKeys';

type Props = {
  firebase: Firebase
}

const withAuthentication = (Component: any) => {
  const withAuthenticationListener = (props: Props) => {
    const userFromLocalStorage: any = localStorage.getItem(AUTH_USER);
    const localAuthUser: AuthUser | null = JSON.parse(userFromLocalStorage);
    const [authUser, setUser] = useState<AuthUser | null>(localAuthUser);
    useEffect(() => {
      const listener: () => void = props.firebase.onAuthUserListener(
        (authUser: any) => {
          localStorage.setItem(AUTH_USER, JSON.stringify(authUser));
          setUser(authUser)
        },
        () => {
          localStorage.removeItem(AUTH_USER);
          setUser(null)
        }
      );
      return listener; // === ComponentWillUnmount activation: return a function to run when un-mounting component
    }, []);
    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };
  return withFirebase(withAuthenticationListener);
};

export default withAuthentication;