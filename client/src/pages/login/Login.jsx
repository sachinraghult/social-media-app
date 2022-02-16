import {Link} from 'react-router-dom'
import "./login.css";

export default function Login() {
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
          <form className="loginBox">
            <input placeholder="Email" type='email' className="loginInput" required/>
            <input placeholder="Password" type='password' className="loginInput" required/>
            <br/>
            <button className="loginButton">Log In</button>
            <span className="loginForgot">Forgot Password?</span>
           
            <button className="loginRegisterButton">
              <Link className="link" to='/register'>
                Create a New Account
              </Link>
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
