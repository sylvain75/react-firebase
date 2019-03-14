import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { IFirebase, UserCredential } from '../Firebase/firebase';

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignUpLink />
    <PasswordForgetLink />
  </div>
);
type State = {
  email: string,
  password: string,
  error: null | Error
}
type Props = {
  firebase: IFirebase,
  history: any
}
const INITIAL_STATE: State = {
  email: 'sylvain75004+13@hotmail.com',
  password: 'test1234',
  error: null,
};


const SignInFormBase = ({firebase, history}: Props) => {
  const [
    { email, password, error },
    setState
  ] = useState(INITIAL_STATE);

  const onChange = (e: React.SyntheticEvent) => {
    let target = e.target as HTMLInputElement;
    const { name, value } = target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const setError = (error: Error) => {
    setState(prevState => ({ ...prevState, error }));
  };

  const onSubmit = async(event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const userCredential: UserCredential = await firebase.doSignInWithEmailAndPassword(email, password);
      console.log('userCredential SIGN_IN', userCredential);
      setState({ ...INITIAL_STATE });
      history.push(ROUTES.HOME);
    } catch(error) {
      setError(error);
    }
  };

  const isInvalid = password === '' || email === '';
  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
