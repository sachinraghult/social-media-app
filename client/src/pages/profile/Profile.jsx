import "./profile.css";
import { Link } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import MyFeed from "../../components/myFeed/MyFeed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext } from "react";
import { Context } from "../../context/Context";

export default function Profile() {
  const folder = "http://localhost:5000/images/";

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
                />
              </div>
            </div>

            <Link className="link" to="/confirmDelete">
              <button
                type="submit"
                className="shareButton"
                style={{ float: "right", backgroundColor: "red" }}
              >
                Delete
              </button>
            </Link>

            <Link className="link" to="/settings">
              <button
                type="submit"
                className="shareButton"
                style={{ float: "right" }}
              >
                Edit
              </button>
            </Link>

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
                <Link className="link" to="/friends">
                  <button
                    type="submit"
                    className="shareButton"
                    style={{ float: "right", backgroundColor: "#7e54f3" }}
                  >
                    {user.following.length} Following
                  </button>
                </Link>

                <Link className="link" to="/friends">
                  <button
                    type="submit"
                    className="shareButton"
                    style={{ float: "right", backgroundColor: "#1877f2" }}
                  >
                    {user.followers.length} Followers
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="profileRightBottom">
            <MyFeed />
            <Rightbar profile user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
