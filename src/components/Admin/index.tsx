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
import { compose } from 'recompose';
import { AuthUser, IFirebase, MergedUserWithUserDb } from '../Firebase/firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

type Props = {
  firebase: IFirebase
}
type State = {
  loading: boolean,
  users: UserInfo[],
  error: null | Error
}
type UserInfo = {
  uid: string,
  email: string,
  username: string,
}
type UserListProps = {
  users: UserInfo[],
  isLoading: boolean
}

import React, { useEffect, useState } from 'react';

import { withFirebase } from '../Firebase';
import * as firebaseType from 'firebase';

const UsersList = ({ users, isLoading }: UserListProps) => {
  if (isLoading) {
    return <div><h1>...LOADING</h1></div>
  } else {
    return (
      <React.Fragment>
        <h3>Users list:</h3>
        <ul>
          {users.map((user: UserInfo) => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <span style={{marginLeft: "10px", marginRight: '10px'}}>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <span>
                <strong>Username:</strong> {user.username}
              </span>
            </li>
          ))}
        </ul>
      </React.Fragment>
    )
  }
};

const AdminPage = ({firebase}: Props) => {
  const [isLoading, setLoading] = useState<State['loading']>(false);
  const [users, setUserList] = useState<State['users']>([]);
  const [error, setError] = useState<State['error']>(null);

  useEffect(() => {
    /*
    Warning: useEffect function must return a cleanup function or nothing.
    Promises and useEffect(async () => …) are not supported, but you can call an async function inside an effect..
     */
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const querySnapshot: firebaseType.firestore.QuerySnapshot = await firebase.users().get();
        const usersList: any = []
        querySnapshot.forEach((doc: firebaseType.firestore.QueryDocumentSnapshot) => {
          console.log(`${doc.id} =>`, doc.data());
          const user: UserInfo = {
            uid: doc.id,
            email: doc.data().email,
            username: doc.data().username,
          };
          usersList.push(user);
        });
        setUserList(usersList);
      } catch(error) {
        setError(error);
      } finally {
        setLoading(false)
      }
    };
    fetchUsers().then();
    // .then() clears the warning: "Promise returned from fetchUsers() is ignored."
    /* May need to return a function to clear eventual listener
     */
  }, []);

  return (
    <div>
      <h1>Admin</h1>
      <p>
        The Admin Page is accessible by every signed in admin user.
      </p>
      {error && <p>{error.message}</p>}
      {<UsersList users={users} isLoading={isLoading}/>}
    </div>
  );
};

const condition = (authUser: MergedUserWithUserDb) =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);

// export default withFirebase(AdminPage);