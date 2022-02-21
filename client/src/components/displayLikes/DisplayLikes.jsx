import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./DisplayLikes.css";
import { Context } from "../../context/Context";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../axios";
import { useLocation } from "react-router-dom";

export default function DisplayLikes({ post }) {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const folder = "http://localhost:5000/images/";

  const { authToken } = useContext(Context);
  console.log("likes", post);

  return (
    <div
      className="sidebar"
      style={{
        marginTop: "50px",
        height: "700px",
        marginLeft: "10px",
      }}
    >
      <div className="sidebarWrapper">
        <div className="headingContainer">
          <span className="heading">Liked by</span>
          <hr className="sidebarHr" />
        </div>
        <ul className="sidebarFriendList">
          {post &&
            post.likes.map((user) => (
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
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
