import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { IFirebase } from '../Firebase/firebase';

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);
type State = {
  email: string,
  error: Error | null,
}
type Props = {
  firebase: IFirebase
}
const INITIAL_STATE: State = {
  email: '',
  error: null,
};

const PasswordForgetFormBase = ({ firebase }: Props) => {
  const [
    { email, error },
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
      const userAuth = await firebase.doPasswordReset(email);
      setState({ ...INITIAL_STATE });
    } catch(error) {
      setError(error);
    }
  };
  const isInvalid: boolean = email === '';
  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };