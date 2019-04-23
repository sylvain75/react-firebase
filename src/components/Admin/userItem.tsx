import React, { useEffect, useState } from 'react';
import { withFirebase } from '../Firebase';
import { UserInfo, UserItemProps, State } from './index';
import { IFirebase } from '../Firebase/firebase';
export type UserItemProps = {
  firebase: IFirebase
  match: any
}

const UserItemBase = ({ match, firebase }: UserItemProps) => {
  // location, match, history are passed as props with <Route> wrapping UserItem
  const [isLoading, setLoading] = useState<State['loading']>(false);
  const [user, setUserItem] = useState<State['user']>(undefined);
  const [error, setError] = useState<State['error']>(null);

  useEffect(() => {
    setLoading(true);
    const fetchUserInfo = async () => {
      try {
        const querySnapshot: any = await firebase.user(match.params.id).doc(match.params.id).get();
        const userData: UserInfo = querySnapshot.data();
        setUserItem(userData);
      } catch(error) {
        setError(error);
      } finally {
        setLoading(false)
      }
    };
    fetchUserInfo().then();
  }, []);
  if (isLoading) {
    return (
      <div><h1>...LOADING</h1></div>
    )
  }
  return (
    <div>
      <h2>User ({match.params.id})</h2>
      {user && (
        <div>
          <span>
            <strong>ID:</strong> {match.params.id}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
        </div>
      )}
    </div>
  )};
export const UserItem = withFirebase(UserItemBase);