import React from 'react';

import { withAuthorization } from '../Session';
import { AuthUser } from '../Firebase/firebase';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>
  </div>
);

const condition = (authUser: AuthUser | null) => !!authUser;

export default withAuthorization(condition)(HomePage);