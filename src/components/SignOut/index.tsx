import React from 'react';
import { withFirebase } from '../Firebase';
import { IFirebase } from '../Firebase/firebase';

type Props = {
  firebase: IFirebase
}

const signOut = async(firebase: IFirebase) => {
  try {
    await firebase.doSignOut();
  } catch(error) {
    console.log('error signOut:', error);
  }
};

const SignOutButton = ({ firebase }: Props) => (
  <button type="button" onClick={() => signOut(firebase)}>
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);