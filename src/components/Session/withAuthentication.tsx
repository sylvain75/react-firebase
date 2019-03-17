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
      const listener: () => void = props.firebase.auth.onAuthStateChanged(async(authUser: any | null) => {
        // authUser: any could be AuthUser but it gets merged with dbUser later
        if (authUser) {
          const userDoc: firebaseType.firestore.DocumentSnapshot = await props.firebase.user(authUser.uid)
            .doc(authUser.uid)
            .get();
          const dbUser: firebaseType.firestore.DocumentData | undefined = userDoc.data();
          // default empty roles
          if (dbUser && !dbUser.roles) {
            dbUser.roles = [];
          }
          // merge auth and db user
          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            ...dbUser,
          };
          setUser(authUser);
        } else {
          setUser(null)
        }
      });
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