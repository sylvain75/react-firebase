import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as firebase from 'firebase';
import * as ROUTES from '../../constants/routes';
import { ADMIN } from '../../constants/roles';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
enum Role {
  Admin = 'ADMIN'
}
export type UserCredential = firebase.auth.UserCredential;
export type AuthUser = firebase.User;
export type UserRole = {
  roles: Role[]
};
// export type MergedUserWithUserDb = AuthUser & {roles: Role[], username: string};
export type MergedUserWithUserDb = any;
export interface IFirebase {
  doCreateUserWithEmailAndPassword: (email: string, password: string) => Promise<firebase.auth.UserCredential>,
  doSignInWithEmailAndPassword: (email: string, password: string) => Promise<firebase.auth.UserCredential>,
  doPasswordReset: (email: string) => Promise<void>,
  doPasswordUpdate: (password: string) => void,
  doSignOut: () => Promise<void>,
  onAuthUserListener: (next: Function, fallback: Function) => void,
  user: (uid: string) => firebase.firestore.CollectionReference,
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

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next: Function, fallback: Function) =>
    this.auth.onAuthStateChanged(async(authUser: any) => {
      // authUser: any could be AuthUser but it gets merged with dbUser later
      if (authUser) {
        const userDoc: firebase.firestore.DocumentSnapshot = await this.user(authUser.uid)
          .doc(authUser.uid)
          .get();
        const dbUser: firebase.firestore.DocumentData | undefined = userDoc.data();
        // default empty roles
        if (dbUser && !dbUser.roles) {
          dbUser.roles = [];
        }
        // merge auth and db user
        // authUser = {
        //   uid: authUser.uid,
        //   email: authUser.email,
        //   ...dbUser,
        // };
        const mergedUserWithUserDb: MergedUserWithUserDb = {
          uid: authUser.uid,
          email: authUser.email,
          ...dbUser,
        };
        console.log('mergedUserWithUserDb HERE', mergedUserWithUserDb);
        next(mergedUserWithUserDb);
      } else {
        fallback();
      }
    });

  // *** User API ***
  user = (uid: string) => this.db.collection(`users`);

  users = () => this.db.collection('users');
}

export default Firebase;