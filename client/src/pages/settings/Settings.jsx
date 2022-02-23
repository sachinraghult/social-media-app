import "./Settings.css";
import { Link } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { PermMedia } from "@material-ui/icons";
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../../context/Context";
import axios from "../../axios";
import { UpdateSuccess } from "../../context/Actions";

export default function Settings() {
  const folder = "http://localhost:5000/image/";
  const { user, authToken, dispatch } = useContext(Context);

  const [profilePic, setProfilePic] = useState();
  const [coverPic, setCoverPic] = useState();
  const [disable, setDisable] = useState(false);

  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.satus);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPwd) {
      setError(true);
      return;
    }

    setError(false);
    setDisable(true);

    var updatedUser = {
      name,
      status,
      email,
    };

    if (password !== "") updatedUser.password = password;

    try {
      const user = await axios.put("/user/update", updatedUser, {
        headers: { authorization: authToken },
      });

      dispatch(UpdateSuccess(user.data));

      setDisable(false);
      e.target.reset();
    } catch (err) {
      setError(true);
      setDisable(false);
    }
  };

  const handlePhoto = async (e, type) => {
    e.preventDefault();
    setDisable(true);

    var newPhoto = {};

    if (type === "cover") {
      if (coverPic) {
        const data = new FormData();
        const filename = Date.now() + coverPic.name;
        data.append("name", filename);
        data.append("file", coverPic);
        newPhoto.coverPic = filename;
        const type = coverPic.type.split("/")[0];
        setCoverPic(null);

        try {
          await axios.post("/upload/" + type, data);
        } catch (err) {}
      }
    } else if (type === "profile") {
      if (profilePic) {
        const data = new FormData();
        const filename = Date.now() + profilePic.name;
        data.append("name", filename);
        data.append("file", profilePic);
        newPhoto.profilePic = filename;
        const type = profilePic.type.split("/")[0];
        setProfilePic(null);

        try {
          await axios.post("/upload/" + type, data);
        } catch (err) {}
      }
    }

    try {
      const user = await axios.put("/user/update", newPhoto, {
        headers: { authorization: authToken },
      });

      dispatch(UpdateSuccess(user.data));

      setDisable(false);
    } catch (err) {
      setDisable(false);
    }
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {coverPic ? (
                <img
                  className="profileCoverImg"
                  src={URL.createObjectURL(coverPic)}
                  alt=""
                />
              ) : (
                <img
                  className="profileCoverImg"
                  src={folder + user.coverPic}
                  alt=""
                />
              )}
              <form onSubmit={(e) => handlePhoto(e, "cover")}>
                <span title="Update Cover Image">
                  {!coverPic ? (
                    <label
                      htmlFor="coverPicFile"
                      style={{
                        float: "right",
                        marginTop: "5px",
                        marginRight: "15px",
                        color: "tomato",
                        cursor: "pointer",
                      }}
                    >
                      <PermMedia />
                      &ensp;<small>Change Cover</small>
                    </label>
                  ) : (
                    <button
                      type="submit"
                      style={{
                        float: "right",
                        marginTop: "5px",
                        marginRight: "15px",
                        color: "tomato",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor: "white",
                      }}
                      disabled={disable}
                    >
                      <PermMedia />
                      &ensp;<small>Update Cover</small>
                    </button>
                  )}

                  <input
                    id="coverPicFile"
                    type="file"
                    className="shareOption"
                    accept="image/*, video/*"
                    style={{ display: "none" }}
                    onChange={(e) => setCoverPic(e.target.files[0])}
                  />
                </span>
              </form>
              <div>
                <form onSubmit={(e) => handlePhoto(e, "profile")}>
                  <span title="Update Profile Pic">
                    {!profilePic ? (
                      <label
                        htmlFor="userPicFile"
                        style={{
                          marginLeft: "51%",
                          zIndex: "1",
                          marginTop: "20px",
                          color: "darkgreen",
                          cursor: "pointer",
                        }}
                      >
                        <PermMedia />
                        &ensp;<small>Change Profile</small>
                      </label>
                    ) : (
                      <button
                        type="submit"
                        style={{
                          marginLeft: "51%",
                          zIndex: "1",
                          marginTop: "20px",
                          color: "darkgreen",
                          cursor: "pointer",
                          border: "none",
                          backgroundColor: "white",
                        }}
                        disabled={disable}
                      >
                        <PermMedia />
                        &ensp;<small>Update Profile</small>
                      </button>
                    )}
                    <input
                      id="userPicFile"
                      type="file"
                      className="shareOption"
                      accept="image/*, video/*"
                      style={{ display: "none" }}
                      onChange={(e) => setProfilePic(e.target.files[0])}
                    />
                  </span>
                </form>

                {profilePic ? (
                  <img
                    className="profileUserImg"
                    style={{ marginLeft: "41%" }}
                    src={URL.createObjectURL(profilePic)}
                    alt=""
                  />
                ) : (
                  <img
                    className="profileUserImg"
                    style={{ marginLeft: "41%" }}
                    src={folder + user.profilePic}
                    alt=""
                  />
                )}
              </div>
            </div>

            <Link className="link" to="/profile">
              <button
                type="submit"
                className="shareButton"
                style={{ float: "right", backgroundColor: "red" }}
              >
                Cancel
              </button>
            </Link>

            <div className="profileInfo">
              <h4 className="profileInfoName">{user.name}</h4>
              <span className="profileInfoDesc">{user.status}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            {/**Form */}
            <div className="wrapper tlWrapper">
              <div className="login-box">
                <h3 className="info-text">Update User Info</h3>
                <form
                  className="form-container"
                  action=""
                  onSubmit={handleSubmit}
                >
                  <div className="input-addon">
                    <input
                      className="form-element input-field"
                      type="text"
                      defaultValue={user.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <button className="input-addon-item" disabled>
                      <span className="fa fa-user"></span>
                    </button>
                  </div>
                  <div className="input-addon">
                    <input
                      className="form-element input-field"
                      defaultValue={user.status}
                      type="text"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <button className="input-addon-item" disabled>
                      <span className="fa fa-user"></span>
                    </button>
                  </div>
                  <div className="input-addon">
                    <input
                      className="form-element input-field"
                      defaultValue={user.email}
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="input-addon-item" disabled>
                      <span className="fa fa-envelope"></span>
                    </button>
                  </div>
                  <div className="input-addon">
                    <input
                      className="form-element input-field"
                      placeholder="Password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="input-addon-item" disabled>
                      <span className="fa fa-lock"></span>
                    </button>
                  </div>
                  <div className="input-addon">
                    <input
                      className="form-element input-field"
                      placeholder="Confirm password"
                      type="password"
                      onChange={(e) => setConfirmPwd(e.target.value)}
                    />
                    <button className="input-addon-item" disabled>
                      <span className="fa fa-lock"></span>
                    </button>
                  </div>
                  <br />
                  <button
                    className="form-element is-submit"
                    type="submit"
                    disabled={disable}
                  >
                    Submit Changes
                  </button>
                </form>
                {error && (
                  <span className="registerError">Invalid Credentials</span>
                )}
              </div>
            </div>
            <Rightbar profile user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
