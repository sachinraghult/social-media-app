import "./UserProfile.css";
import { Link, useLocation } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import ProfileFeed from "../../components/profileFeed/ProfileFeed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { useEffect, useState } from "react";
import axios from "../../axios";
import { UpdateSuccess } from "../../context/Actions";

export default function UserProfile() {
  const folder = "http://localhost:5000/image/";

  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const { user, authToken, dispatch } = useContext(Context);

  const [profile, setProfile] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/user?profile=" + path, {
          headers: { authorization: authToken },
        });
        setProfile(res.data);
      } catch (err) {}
    };

    getUser();
  }, []);

  const handleFollow = async () => {
    try {
      const res = await axios.put(
        "/user/follow?followers=" + profile._id,
        user,
        {
          headers: { authorization: authToken },
        }
      );
      dispatch(UpdateSuccess(res.data));

      var updatedProfile = profile;
      updatedProfile.followers.push({
        _id: user._id,
        username: user.username,
        name: user.name,
        profilePic: user.profilePic,
      });

      setProfile({ ...updatedProfile });
    } catch (err) {}
  };

  const handleUnfollow = async () => {
    try {
      const res = await axios.put(
        "/user/unfollow?followers=" + profile._id,
        user,
        {
          headers: { authorization: authToken },
        }
      );
      dispatch(UpdateSuccess(res.data));

      var filteredFollowing = profile.followers.filter(
        (u) => u._id.toString() !== user._id.toString()
      );

      var updatedProfile = profile;
      updatedProfile.followers = filteredFollowing;

      setProfile({ ...updatedProfile });
    } catch (err) {}
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        {profile && (
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
                    style={{ marginLeft: "40.5%" }}
                  />
                </div>
              </div>

              {user.following.includes(profile._id) ? (
                <button
                  className="shareButton"
                  style={{ float: "right", backgroundColor: "red" }}
                  onClick={handleUnfollow}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="shareButton"
                  style={{ float: "right" }}
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}

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
                  <Link className="link" to={`/userfriends/${profile?._id}`}>
                    <button
                      type="submit"
                      className="shareButton"
                      style={{ float: "right", backgroundColor: "#7e54f3" }}
                    >
                      {profile.following.length} Following
                    </button>
                  </Link>

                  <Link className="link" to={`/userfriends/${profile?._id}`}>
                    <button
                      type="submit"
                      className="shareButton"
                      style={{ float: "right", backgroundColor: "#1877f2" }}
                    >
                      {profile.followers.length} Followers
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="profileRightBottom">
              <ProfileFeed user={profile} />
              <Rightbar profile user={profile} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
