import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import axios from "../../axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState(false);
  const [pwdError, setPwdError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setPwdError(false);

    if (password !== confirmPwd) {
      setPwdError(true);
      return;
    }

    try {
      const res = await axios.post("/auth/register", {
        username,
        name,
        dob,
        gender,
        email,
        password,
      });
      res.data && window.location.replace("/login");

    } catch (err) {
      setError(true);
    }
  };

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
          <form className="regBox" onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              className="loginInput"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              placeholder="Name"
              className="loginInput"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              placeholder="Date Of Birth"
              className="loginInput"
              onChange={(e) => setDob(e.target.value)}
              required
            />

            <div>
              <span
                style={{ marginLeft: "23px", color: "grey", fontSize: "18px" }}
              >
                Gender:
              </span>
              <input
                type="radio"
                value="male"
                id="male"
                name="gender"
                className="radioBtn"
                onChange={(e) => setGender(e.target.value)}
                checked
              />
              <label htmlFor="male" className="label">
                Male
              </label>
              <input
                type="radio"
                value="female"
                id="female"
                name="gender"
                className="radioBtn"
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="female" className="label">
                Female
              </label>
            </div>

            <input
              type="email"
              placeholder="Email"
              className="loginInput"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="loginInput"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="loginInput"
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
            />
            {pwdError && (
              <span className="registerError">Passwords do not match</span>
            )}
            <button type="submit" className="loginButton">
              Sign Up
            </button>
            <button className="loginRegisterButton">
              <Link className="link" to="/login">
                Log into Account
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
