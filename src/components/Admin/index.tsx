// import * as ROLES from '../../constants/roles';

// const AdminPage = () => (
//   <div>
//     <h1>Admin</h1>
//     <p>
//       Restricted area! Only users with the admin role are authorized.
//     </p>
//   </div>
// );
//
// const condition = (authUser: AuthUser) =>
//   authUser && authUser.roles.includes(ROLES.ADMIN);
//
// export default withAuthorization(condition)(AdminPage);

// PROTOTYPE ABOVE
import React from 'react';
import { compose } from 'recompose';
import { Switch, Route, Link } from 'react-router-dom';

import { IFirebase, MergedUserWithUserDb } from '../Firebase/firebase';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { UserItem } from './userItem';
import { UserList } from './userList';

export type UserItemProps = {
  firebase: IFirebase
  match: any
}
export type State = {
  loading: boolean,
  users: UserInfo[],
  error: null | Error,
  user: undefined | UserInfo
}
export type UserInfo = {
  uid: string,
  email: string,
  username: string,
}

const AdminPage = () => {
  return (
    <div>
      <h1>Admin</h1>
      <p>
        The Admin Page is accessible by every signed in admin user.
      </p>
      <Switch>
        <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
        <Route exact path={ROUTES.ADMIN} component={UserList} />
      </Switch>
    </div>
  );
};

const condition = (authUser: MergedUserWithUserDb) =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);