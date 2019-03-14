import React, { useContext } from 'react';

import { PasswordForgetForm } from '../PasswordForget';
// import PasswordChangeForm from '../PasswordChange';
import { withAuthorization } from '../Session';
import { AuthUser } from '../Firebase/firebase';
import AuthUserContext from '../Session/context';

const AccountPage = () => {
  const authUser: AuthUser = useContext(AuthUserContext);
  return (
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      {/*<PasswordChangeForm />*/}
    </div>
  );
};

const condition: (...args: any) => boolean = (authUser: AuthUser | null) => !!authUser;

export default withAuthorization(condition)(AccountPage);