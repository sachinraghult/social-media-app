import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./People.css";
import { Users } from "../../dummyData";
import { Context } from "../../context/Context";
import { Logout } from "../../context/Actions";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../axios";
import { UpdateSuccess } from "../../context/Actions";

export default function People() {
  const folder = "http://localhost:5000/image/";

  const { user, authToken, dispatch } = useContext(Context);

  const [people, setPeople] = useState([]);

  useEffect(() => {
    const getPeople = async () => {
      try {
        const res = await axios.get("/user/suggestions", {
          headers: { authorization: authToken },
        });
        console.log(res.data);

        setPeople(res.data);
      } catch (err) {}
    };

    getPeople();
  }, []);

  const handleFollow = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.put("/user/follow?followers=" + id, user, {
        headers: { authorization: authToken },
      });

      dispatch(UpdateSuccess(res.data));

      const updatedPeople = people.filter(
        (item) => item._id.toString() !== id.toString()
      );
      setPeople([...updatedPeople]);
    } catch (err) {}
  };

  return (
    <div className="sidebar10">
      <div className="sidebarWrapper10">
        <div className="headingContainer">
          <span className="heading">Suggestions</span>
          <hr className="sidebarHr" />
        </div>
        <ul className="sidebarFriendList10">
          {people &&
            people.map((user) => (
              <li className="sidebarCloseFriend10">
                <div>
                  <Link className="link" to={`/user/${user._id}`}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <img
                        className="sidebarCloseFriendImg10"
                        src={folder + user.profilePic}
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
                          {user.username}
                        </span>
                        <small
                          className="sidebarFriendName10"
                          style={{ color: "grey" }}
                        >
                          {user.name}
                        </small>
                        <small
                          className="sidebarFriendName10"
                          style={{ color: "grey" }}
                        >
                          <b>
                            <i style={{ letterSpacing: 1.25 }}>
                              Followed by {user.parent[0].username}
                              {user.parent[1] && ", " + user.parent[1].username}
                              {user.parent.length === 3 && " and 1 other"}
                              {user.parent.length > 3 &&
                                " and " + (user.parent.length - 2) + " others"}
                            </i>
                          </b>
                        </small>
                      </div>
                    </div>
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    className="followButton"
                    onClick={(e) => handleFollow(e, user._id)}
                  >
                    Follow
                  </button>
                </div>
              </li>
            ))}

          {people.length === 0 && <h4>Sorry no suggestions : ( </h4>}
        </ul>
      </div>
    </div>
  );
}
