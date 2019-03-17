import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
// import { History } from 'history';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { IFirebase, UserCredential } from '../Firebase/firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);
type Props = {
  firebase: IFirebase,
  history: any //TODO type history => error with History as type
}
type State = {
  username: string,
  email: string,
  passwordOne: string,
  passwordTwo: string,
  isAdmin: boolean,
  error: null | Error,
}
const INITIAL_STATE: State = {
  username: 'syl della',
  email: 'sylvain75004+52@hotmail.com',
  passwordOne: 'ttest1234',
  passwordTwo: 'ttest1234',
  isAdmin: false,
  error: null,
};

const SignUpFormBase = ({firebase, history}: Props) => {
  const [
    { username, email, passwordOne, passwordTwo, isAdmin, error },
    setState
  ] = useState(INITIAL_STATE);

  const clearState = () => {
    setState({ ...INITIAL_STATE });
  };

  const onChange = (e: React.SyntheticEvent) => {
    let target = e.target as HTMLInputElement;
    const { name, value } = target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };
  const onChangeCheckbox = (e: React.SyntheticEvent) => {
    let target = e.target as HTMLInputElement;
    const { name, checked } = target;
    setState(prevState => ({ ...prevState, [name]: checked }));
  };
  const setError = (error: Error) => {
    setState(prevState => ({ ...prevState, error }));
  };

  const onSubmit = async(event: React.SyntheticEvent) => {
    event.preventDefault();
    const roles = [];
    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }
    try {
      const userCredential: UserCredential = await firebase.doCreateUserWithEmailAndPassword(email, passwordOne);
      if (userCredential && userCredential.user) {
        /* Create a user in your Firestore
           Pass userCredential.uid as reference to firestore db
         */
        const res = await firebase.users().doc(userCredential.user.uid).set({ username, email, roles });
        /*
        Behind the scenes, .add(...) and .doc().set(...) are completely equivalent,
        so you can use whichever is more convenient.
         */
      }
      clearState();
      history.push(ROUTES.HOME);
    } catch(error) {
      setError(error);
    }
  };

  const isInvalid: boolean =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';
  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />
      <label>
        Admin:
        <input
          name="isAdmin"
          type="checkbox"
          checked={isAdmin}
          onChange={onChangeCheckbox}
        />
      </label>
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);
// INFO: compose avoid double HOC encapsulating withRouter(withFirebase(SignupFormBase))

export default SignUpPage;

export { SignUpForm, SignUpLink };