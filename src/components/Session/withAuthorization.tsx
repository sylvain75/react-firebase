import React, { Component, FunctionComponent, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { AuthUser } from '../Firebase/firebase';
import AuthUserContext from './context';
import * as firebaseType from 'firebase';

const withAuthorization = (condition: (...args: any) => boolean) => (Component: FunctionComponent) => {
  const withAuthorizationHandler = (props: any) => {
    useEffect(() => {
      const listener: () => void = props.firebase.auth.onAuthStateChanged(async(authUser: any | null) => {
        // authUser: any could be AuthUser but it gets merged with dbUser later
        if (authUser) {
          console.log('authUser HERE', authUser);
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
          console.log('authUser ENNNND HERE', authUser);
          if (!condition(authUser)) {
            props.history.push(ROUTES.SIGN_IN);
          }
        } else {
          props.history.push(ROUTES.SIGN_IN);
        }
      });
      return listener; // === ComponentWillUnmount activation: return a function to run when un-mounting component
    }, []);
    const authUser: AuthUser | null = useContext(AuthUserContext);
    let componentToReturn: JSX.Element | null = null;
    if (condition(authUser)) {
      componentToReturn = <Component {...props} />
    }
    return componentToReturn;
  };
  return compose(
    withRouter,
    withFirebase,
  )(withAuthorizationHandler);
};

export default withAuthorization;
