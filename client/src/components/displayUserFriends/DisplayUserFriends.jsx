import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./DisplayUserFriends.css";
import { Users } from "../../dummyData";
import { Context } from "../../context/Context";
import { Logout } from "../../context/Actions";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../axios";
import { UpdateSuccess } from "../../context/Actions";

export default function DisplayFriends({ type, userProfile }) {
  const folder = "http://localhost:5000/image/";

  const { user, authToken, dispatch } = useContext(Context);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (type === "Followers") setFriends([...userProfile.followers]);
    else if (type === "Following") setFriends([...userProfile.following]);
  }, []);

  const handleFollow = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.put("/user/follow?followers=" + id, user, {
        headers: { authorization: authToken },
      });

      dispatch(UpdateSuccess(res.data));
    } catch (err) {}
  };

  const handleUnfollow = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.put("/user/unfollow?followers=" + id, user, {
        headers: { authorization: authToken },
      });

      dispatch(UpdateSuccess(res.data));
    } catch (err) {}
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="headingContainer">
          <span className="heading">{type}</span>
          <hr className="sidebarHr" />
        </div>
        <ul className="sidebarFriendList">
          {friends.length !== 0 &&
            friends.map((u) => (
              <>
                <li className="sidebarCloseFriend">
                  <div>
                    <Link className="link" to={`/user/${u._id}`}>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <img
                          className="sidebarCloseFriendImg"
                          src={folder + u.profilePic}
                          alt=""
                        />
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span className="sidebarFriendName">
                            {u.username}
                          </span>
                          <small
                            className="sidebarFriendName"
                            style={{ color: "grey" }}
                          >
                            {u.name}
                          </small>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div>
                    {user._id !== u._id && (
                      <>
                        {user.following.some((f) => f._id === u._id) ? (
                          <button
                            type="submit"
                            className="followButton"
                            onClick={(e) => handleUnfollow(e, u._id)}
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="followButton"
                            onClick={(e) => handleFollow(e, u._id)}
                          >
                            Follow
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </li>
              </>
            ))}
        </ul>
      </div>
    </div>
  );
}
