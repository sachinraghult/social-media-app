import {Link, useNavigate} from 'react-router-dom'
import "./login.css";
import axios from "../../axios";
import React, { useState, useContext } from "react";
import { Context } from "../../context/Context";
import { LoginStart, LoginSuccess, LoginFailure } from "../../context/Actions";

export default function Login() {
  
  const { authToken, dispatch, isFetching } = useContext(Context);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(LoginStart());
    setError(false);

    try {

      const res = await axios.post("/auth/login", {
        username,
        password,
      });

      dispatch(
        LoginSuccess({...res.data, authToken: res.headers.authorization})
      );

      navigate("/", { replace: true });

    } catch (err) {
      dispatch(LoginFailure());
      setError(true);
    }
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input 
            placeholder="Username" 
            type='text' 
            className="loginInput" 
            onChange={(e) => setUsername(e.target.value)}
            required/>
            <input 
            placeholder="Password" 
            type='password' 
            className="loginInput" 
            onChange={(e) => setPassword(e.target.value)}
            required/>
            <br/>
            <button type='submit' className="loginButton">Log In</button>
            <span className="loginForgot">Forgot Password?</span>
           
            <button className="loginRegisterButton">
              <Link className="link" to='/register'>
                Create a New Account
              </Link>
            </button>
            {error && (
              <span className="registerError">Invalid Credentials</span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
