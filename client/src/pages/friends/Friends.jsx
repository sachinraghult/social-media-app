import "./Friends.css";
import { Link } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import DisplayFriends from "../../components/displayFriends/DisplayFriends";
import { useContext } from "react";
import { Context } from "../../context/Context";

export default function Friends() {
  const folder = "http://localhost:5000/image/";

  const { user, authToken } = useContext(Context);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={folder + user.coverPic}
                alt=""
              />

              <div>
                <img
                  className="profileUserImg"
                  src={folder + user.profilePic}
                  alt=""
                  style={{ marginLeft: "44%" }}
                />
              </div>
            </div>

            <div className="profileInfo">
              <h4 className="profileInfoName">{user.name}</h4>
              <span className="profileInfoDesc">{user.status}</span>
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
                  {user.following.length} Following
                </button>
                <button
                  type="submit"
                  className="shareButton"
                  style={{ float: "right", backgroundColor: "#1877f2" }}
                >
                  {user.followers.length} Followers
                </button>
              </div>
            </div>
          </div>
          <div className="profileRightBottom" style={{ marginTop: "35px" }}>
            <DisplayFriends type={"Following"} />
            <DisplayFriends type={"Followers"} />
          </div>
        </div>
      </div>
    </>
  );
}
