import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
export type UserCredential = firebase.auth.UserCredential;
export type AuthUser = firebase.User;
export interface IFirebase {
  doCreateUserWithEmailAndPassword: (email: string, password: string) => Promise<firebase.auth.UserCredential>,
  doSignInWithEmailAndPassword: (email: string, password: string) => Promise<firebase.auth.UserCredential>,
  doPasswordReset: (email: string) => Promise<void>,
  doPasswordUpdate: (password: string) => void,
  doSignOut: () => Promise<void>,
  user: () => firebase.firestore.CollectionReference,
  users: () => firebase.firestore.CollectionReference,
}
class Firebase implements IFirebase{
  auth: any;
  db: any;
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
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

  // *** User API ***
  user = () => this.db.collection('users');

  users = () => this.db.collection('users');
}

export default Firebase;