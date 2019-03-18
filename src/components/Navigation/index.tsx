import React, { useContext } from "react";
import { Link } from "react-router-dom";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from '../../constants/roles';

import { AuthUserContext } from "../Session";
import { AuthUser, MergedUserWithUserDb } from '../Firebase/firebase';

type PropNavigationAuth = {
  authUser: MergedUserWithUserDb
}

const Navigation = () => {
  const authUser: MergedUserWithUserDb | null = useContext(AuthUserContext);
  return <div>{authUser ? <NavigationAuth authUser={authUser}/> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = ({ authUser }: PropNavigationAuth) => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    {authUser.roles.includes(ROLES.ADMIN) && (
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
    )}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
