import "./Settings.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
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
              Edit
            </button>

            <div className="profileInfo">
              <h4 className="profileInfoName">Edit Kocaoglu</h4>
              <span className="profileInfoDesc">Hello my friends!</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed />
            <Rightbar profile />
          </div>
        </div>
      </div>
    </>
  );
}
