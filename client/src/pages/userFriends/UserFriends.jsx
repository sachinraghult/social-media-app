import "./UserFriends.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import DisplayUserFriends from "../../components/displayUserFriends/DisplayUserFriends";
import { useContext } from "react";
import { Context } from "../../context/Context";
import axios from "../../axios";
import { useState } from "react";
import { useEffect } from "react";

export default function UserFriends() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const folder = "http://localhost:5000/image/";

  const { user, authToken } = useContext(Context);

  const [profile, setProfile] = useState();

  useEffect(() => {
    const getUserFriends = async () => {
      try {
        const res = await axios.get("/user?profile=" + path, {
          headers: { authorization: authToken },
        });
        setProfile(res.data);
      } catch (err) {}
    };

    getUserFriends();
  }, []);

  return (
    <>
      {profile && (
        <>
          <Topbar />
          <div className="profile">
            <Sidebar />
            <div className="profileRight">
              <div className="profileRightTop">
                <div className="profileCover">
                  <img
                    className="profileCoverImg"
                    src={folder + profile.coverPic}
                    alt=""
                  />

                  <div>
                    <img
                      className="profileUserImg"
                      src={folder + profile.profilePic}
                      alt=""
                      style={{ marginLeft: "44%" }}
                    />
                  </div>
                </div>

                <div className="profileInfo">
                  <h4 className="profileInfoName">{profile.name}</h4>
                  <span className="profileInfoDesc">{profile.status}</span>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "5px",
                      marginLeft: "20px",
                    }}
                  >
                    <button
                      type="submit"
                      className="shareButton"
                      style={{ float: "right", backgroundColor: "#7e54f3" }}
                    >
                      {profile.following.length} Following
                    </button>
                    <button
                      type="submit"
                      className="shareButton"
                      style={{ float: "right", backgroundColor: "#1877f2" }}
                    >
                      {profile.followers.length} Followers
                    </button>
                  </div>
                </div>
              </div>

              <div className="profileRightBottom" style={{ marginTop: "35px" }}>
                <DisplayUserFriends type={"Following"} userProfile={profile} />
                <DisplayUserFriends type={"Followers"} userProfile={profile} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
