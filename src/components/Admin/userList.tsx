import React, { Fragment, useEffect, useState } from 'react';
import * as firebaseType from 'firebase';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { State } from './index';
import { UserInfo } from './index';
import { IFirebase } from '../Firebase/firebase';

type UserListBaseProps = {
  firebase: IFirebase
}

const UserListBase = ({ firebase }: UserListBaseProps) => {
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
  if (isLoading) {
    return <div><h1>...LOADING</h1></div>
  } else {
    return (
      <Fragment>
        <h3>Users list:</h3>
        {error && <p>error.message</p>}
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
              <span style={{marginLeft: "10px", marginRight: '10px'}}>
                <Link to={`${ROUTES.ADMIN}/${user.uid}`}>
                  Details
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </Fragment>
    )
  }
};
export const UserList = withFirebase(UserListBase);