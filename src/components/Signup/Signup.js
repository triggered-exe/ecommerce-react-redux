import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  signUpUser,
  authSelector
} from "../../redux/authenticationSlice";



function Signup() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { isLoggedIn } = useSelector(authSelector);
  const dispatch = useDispatch();


  
  // to redirect the login page to home if login is true
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn]);



  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Dispatch the login action
    dispatch(signUpUser({ email, password }));
  };



  return (
    <div className={styles.signupContainer}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        {/* <input type="text" placeholder="Enter your name" /> */}
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter your email"
          required
        />

        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Enter your password"
          required
        />
        <button>Signup</button>
      </form>
    </div>
  );
}


export default Signup;
