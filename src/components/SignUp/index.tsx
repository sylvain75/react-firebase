import React, { Component } from 'react';
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

class SignUpFormBase extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event: React.SyntheticEvent) => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser: any) => {
        console.log('authUser HERE', authUser);
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error: Error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };


  onChange = (event: React.SyntheticEvent): void => {
    // event type: https://stackoverflow.com/a/42084103/5110929
    let target = event.target as HTMLInputElement;
    this.setState({ [target.name]: target.value } as Pick<
      State,
      any
      >);
    /* INFO typescript error before without as Pick<State, any>
      handling with as Pick ... means we pick only ModalStateName enum out of  the whole IState keys
      Casting to type Pick to avoid a typing error. It was arising because the state type we were trying to set didn’t include any of the properties as required because the compiler interprets the argument as a string type.
   */
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;
    const isInvalid: boolean =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

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