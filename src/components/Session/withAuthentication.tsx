import React, { useEffect, useState } from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import Firebase, { AuthUser } from '../Firebase/firebase';
import * as firebaseType from 'firebase';

type Props = {
  firebase: Firebase
}

const withAuthentication = (Component: any) => {
  const withAuthenticationListener = (props: Props) => {
    const [authUser, setUser] = useState<AuthUser | null>(null);
    useEffect(() => {
      const listener: () => void = props.firebase.onAuthUserListener(
        (authUser: any) => {
          setUser(authUser)
        },
        () => {
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