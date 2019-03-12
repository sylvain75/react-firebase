import React, { Component, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);
type Props = {

}
type State = {
  username: string,
  email: string,
  passwordOne: string,
  passwordTwo: string,
  error: null | any,
}
const INITIAL_STATE: State = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: Error,
};

const SignUpFormBase = (props: any) => {
  const [username, onChangeUsername] = useState("");
  const [email, onChangeEmail] = useState("");
  const [passwordOne, onChangePasswordOne] = useState("");
  const [passwordTwo, onChangePasswordTwo] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [initialState, resetState] = useState();
  const onSubmit = (event: React.SyntheticEvent) => {
    props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser: any) => {
        console.log('authUser HERE', authUser);
        resetState(INITIAL_STATE);
        console.log('onChangeEmail HERE',initialState, email);
        props.history.push(ROUTES.HOME);
      })
      .catch((error: Error) => {
        setError(error);
      });

    event.preventDefault();
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
        onChange={(e: React.SyntheticEvent) => {
          let target = e.target as HTMLInputElement;
          return onChangeUsername(target.value)
        }}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={(e: React.SyntheticEvent) => {
          let target = e.target as HTMLInputElement;
          return onChangeEmail(target.value)
        }}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={(e: React.SyntheticEvent) => {
          let target = e.target as HTMLInputElement;
          return onChangePasswordOne(target.value)
        }}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={(e: React.SyntheticEvent) => {
          let target = e.target as HTMLInputElement;
          return onChangePasswordTwo(target.value)
        }}
        type="password"
        placeholder="Confirm Password"
      />
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

export default SignUpPage;

export { SignUpForm, SignUpLink };