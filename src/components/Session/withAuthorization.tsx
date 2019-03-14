import React, { Component, FunctionComponent, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { AuthUser } from '../Firebase/firebase';
import AuthUserContext from './context';

const withAuthorization = (condition: any) => (Component: FunctionComponent) => {
  const withAuthorizationHandler = (props: any) => {
    useEffect(() => {
      const listener: () => void = props.firebase.auth.onAuthStateChanged((authUser: any) => {
        if (!condition(authUser)) {
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
