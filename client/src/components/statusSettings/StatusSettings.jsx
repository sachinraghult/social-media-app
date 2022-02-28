import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./StatusSettings.css";
import { Context } from "../../context/Context";
import axios from "../../axios";

export default function StatusSettings({ status, receivedStatusState }) {
  const folder = "http://localhost:5000/image/";

  const { user, authToken } = useContext(Context);
  const [seenByMode, setSeenByMode] = useState(false);

  const handleSeenByUsers = async (e, id) => {
    e.preventDefault();
    setSeenByMode(true);
    try {
    } catch (err) {}
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "/status/delete/" + id,
        {},
        {
          headers: { authorization: authToken },
        }
      );

      receivedStatusState(res.data);
    } catch (err) {}
  };

  const handleDeleteAll = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete("/status", {
        headers: { authorization: authToken },
      });

      receivedStatusState(null);
    } catch (err) {}
  };

  return (
    <div className="sidebar10">
      <div className="sidebarWrapper10">
        <div className="headingContainer">
          <span className="heading">
            {seenByMode ? "Seen By" : "My Status"}
          </span>
          {status && seenByMode ? (
            <button
              type="submit"
              className="followButton"
              style={{
                float: "right",
                marginRight: "5px",
                font: "20px roboto, sans serif",
              }}
              onClick={() => setSeenByMode(false)}
            >
              Back
            </button>
          ) : (
            <button
              type="submit"
              className="followButton"
              style={{
                float: "right",
                marginRight: "5px",
                font: "20px roboto, sans serif",
              }}
              onClick={(e) => handleDeleteAll(e)}
            >
              Delete All
            </button>
          )}
          <hr className="sidebarHr" />
        </div>
        {!seenByMode && (
          <ul className="sidebarFriendList10">
            {status &&
              status.content.map((story, index) => (
                <li className="sidebarCloseFriend10">
                  <div>
                    <Link
                      className="link"
                      to={`/viewStatus/${user._id}/${index}`}
                    >
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <img
                          className="sidebarCloseFriendImg11"
                          src={folder + status.userId.profilePic}
                          alt=""
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            color: "#1877f2",
                          }}
                        >
                          <span className="sidebarFriendName10">
                            {status.userId.username}
                          </span>
                          <small
                            className="statusDesc"
                            style={{ color: "grey" }}
                          >
                            <b>
                              <i style={{ letterSpacing: 1.15 }}>
                                {story.desc}
                              </i>
                            </b>
                          </small>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div style={{ display: "flex" }}>
                    <button
                      type="submit"
                      className="followButton"
                      onClick={(e) => handleSeenByUsers(e, story._id)}
                      style={{
                        backgroundColor: "green",
                        height: "30px",
                        width: "75px",
                      }}
                    >
                      Seen By
                    </button>
                    <button
                      type="submit"
                      className="followButton"
                      onClick={(e) => handleDelete(e, story._id)}
                      style={{
                        height: "30px",
                        width: "75px",
                        marginRight: "5px",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}

            {!status && <h4>No status yet : ( </h4>}
          </ul>
        )}
      </div>
    </div>
  );
}
