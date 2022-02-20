import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./DisplayFriends.css";
import { Users } from "../../dummyData";
import { Context } from "../../context/Context";
import { Logout } from "../../context/Actions";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../axios";
import { UpdateSuccess } from "../../context/Actions";

export default function DisplayFriends({ type }) {
  const folder = "http://localhost:5000/images/";

  const { user, authToken, dispatch } = useContext(Context);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get("/user", {
          headers: { authorization: authToken },
        });

        if (type == "Followers") setFriends(res.data.followers);
        else if (type == "Following") setFriends(res.data.following);
      } catch (err) {}
    };

    getFriends();
  }, []);

  const handleUnfollow = async (id) => {
    try {
      const res = await axios.put("/user/unfollow?followers=" + id, user, {
        headers: { authorization: authToken },
      });
      var filteredFollowing = friends.filter(
        (friend) => friend._id.toString() !== id.toString()
      );
      setFriends(filteredFollowing);
      dispatch(UpdateSuccess(res.data));
    } catch (err) {}
  };

  const handleRemove = async (id) => {
    try {
      const res = await axios.put("/user/remove?followers=" + id, user, {
        headers: { authorization: authToken },
      });
      var filteredFollowers = friends.filter(
        (friend) => friend._id.toString() !== id.toString()
      );
      setFriends(filteredFollowers);
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
          {friends &&
            friends.map((user) => (
              <li className="sidebarCloseFriend">
                <div>
                  <Link className="link" to={`/user/${user._id}`}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <img
                        className="sidebarCloseFriendImg"
                        src={folder + user.profilePic}
                        alt=""
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="sidebarFriendName">
                          {user.username}
                        </span>
                        <small
                          className="sidebarFriendName"
                          style={{ color: "grey" }}
                        >
                          {user.name}
                        </small>
                      </div>
                    </div>
                  </Link>
                </div>
                <div>
                  {type === "Following" ? (
                    <button
                      type="submit"
                      className="followButton"
                      onClick={() => handleUnfollow(user._id)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="followButton"
                      onClick={() => handleRemove(user._id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
