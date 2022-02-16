import {Link} from 'react-router-dom'
import "./register.css";

export default function Register() {
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
          <form className="regBox">
            <input placeholder="Username" className="loginInput" required/>
            <input placeholder="Name" className="loginInput" required/>
            <input type='text' onFocus= {(e) =>(e.target.type='date')} placeholder="Date Of Birth" className="loginInput" required/>
            
            <div>
            <span style={{marginLeft:"23px", color: "grey", fontSize: "18px"}}>Gender:</span>
            <input type="radio" value="male" id="male" name="gender" className="radioBtn" checked/>
            <label htmlFor="male" className="label">Male</label>
            <input type="radio" value="female"  id="female" name="gender" className="radioBtn"/>
            <label htmlFor="female" className="label">Female</label>
            </div>

            <input type='email' placeholder="Email" className="loginInput" required/>
            <input type='password' placeholder="Password" className="loginInput" required/>
            <input type='password' placeholder="Confirm Password" className="loginInput" required/>
            <button type='submit' className="loginButton">Sign Up</button>
            <button className="loginRegisterButton">
              <Link className="link" to='/login'>
              Log into Account
              </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
