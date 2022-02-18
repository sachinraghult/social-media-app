import "./profile.css";
import {Link} from 'react-router-dom'
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import MyFeed from "../../components/myFeed/MyFeed";
import Rightbar from "../../components/rightbar/Rightbar";
import { PermMedia } from "@material-ui/icons";

export default function Profile() {
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
                src="assets/post/3.jpeg"
                alt=""
              />

              <div>
                <PermMedia
                  style={{ marginLeft: "49%", zIndex: "1", marginTop: "20px" }}
                />
                <img
                  className="profileUserImg"
                  src="assets/person/7.jpeg"
                  alt=""
                />
              </div>
            </div>

            <button
              type="submit"
              className="shareButton"
              style={{ float: "right", backgroundColor: "red" }}
            >
              Delete
            </button>

            <button
              type="submit"
              className="shareButton"
              style={{ float: "right" }}
            >
              <Link className="link" to='/settings'>Edit</Link>
            </button>

            <div className="profileInfo">
              <h4 className="profileInfoName">Safak Kocaoglu</h4>
              <span className="profileInfoDesc">Hello my friends!</span>
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
