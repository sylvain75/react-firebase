import React, { Component, ComponentClass, useContext } from 'react';

const FirebaseContext: any = React.createContext(null);

export const withFirebase: any = (Component: ComponentClass) => (props: any) => {
  const firebase = useContext(FirebaseContext);
  return <Component {...props} firebase={firebase}/>;
};

export default FirebaseContext;