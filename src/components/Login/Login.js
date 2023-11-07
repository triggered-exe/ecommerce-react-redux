import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, authSelector, actions, fetchAuthState } from "../../redux/authenticationSlice";



function Login() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { isLoggedIn } = useSelector(authSelector);
  const dispatch = useDispatch();



  // to redirect the login page to home if login is true
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  },[isLoggedIn]);



  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Dispatch the login action
    dispatch(loginUser({ email, password }));
  };



  return (
    <div className={styles.loginContainer}>
      <h1>sign in</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
        />
        <button>login</button>
      </form>
      <p>
        don't have an account? <Link to="/signup">sign up</Link>
      </p>
    </div>
  );
}



export default Login;
