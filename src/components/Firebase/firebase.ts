import app from 'firebase/app';
import 'firebase/auth';
import * as firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
export type AuthUser = firebase.auth.UserCredential;
export interface IFirebase {
  doCreateUserWithEmailAndPassword: (email: string, password: string) => Promise<firebase.auth.UserCredential>,
  doSignInWithEmailAndPassword: (email: string, password: string) => Promise<firebase.auth.UserCredential>,
  doPasswordReset: (email: string) => void,
  doPasswordUpdate: (password: string) => void,
  doSignOut: () => void,
}
class Firebase implements IFirebase{
  auth: any
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password: string) =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;