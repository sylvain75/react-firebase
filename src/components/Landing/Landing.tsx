import React, { useContext } from "react";
import  { FirebaseContext } from '../Firebase';

const Landing = () => {
  const firebase = useContext(FirebaseContext);
  return (
    <div><h1>I'am a landing page</h1></div>
)};

export default Landing;