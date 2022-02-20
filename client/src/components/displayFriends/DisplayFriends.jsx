import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./DisplayFriends.css";
import { Users } from "../../dummyData";
import { Context } from "../../context/Context";
import { Logout } from "../../context/Actions";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../axios";

export default function DisplayFriends({ type }) {
  const folder = "http://localhost:5000/images/";

  const { user, authToken } = useContext(Context);

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

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <span className="heading">{type}</span>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {friends &&
            friends.map((user) => (
              <li className="sidebarCloseFriend">
                <div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <img
                      className="sidebarCloseFriendImg"
                      src={folder + user.profilePic}
                      alt=""
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className="sidebarFriendName">{user.username}</span>
                      <small
                        className="sidebarFriendName"
                        style={{ color: "grey" }}
                      >
                        {user.name}
                      </small>
                    </div>
                  </div>
                </div>
                <div>
                  {type === "Following" ? (
                    <button type="submit" className="followButton">
                      Unfollow
                    </button>
                  ) : (
                    <button type="submit" className="followButton">
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
