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

            <button
              type="submit"
              className="shareButton"
              style={{ float: "right", backgroundColor: "red" }}
            >
              <Link className="link" to="/confirmDelete">
                Delete
              </Link>
            </button>

            <button
              type="submit"
              className="shareButton"
              style={{ float: "right" }}
            >
              <Link className="link" to="/settings">
                Edit
              </Link>
            </button>

            <div className="profileInfo">
              <h4 className="profileInfoName">{user.name}</h4>
              <span className="profileInfoDesc">{user.status}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <MyFeed />
            <Rightbar profile />
          </div>
        </div>
      </div>
    </>
  );
}
