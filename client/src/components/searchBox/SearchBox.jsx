import React, { useContext } from "react";
import { useState } from "react";
import axios from "../../axios";
import { Context } from "../../context/Context";
import AsyncSelect from "react-select/async";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function SearchBox() {
  const folder = "http://localhost:5000/image/";

  const { authToken } = useContext(Context);
  const [defaultOpt, setDefaultOpt] = useState([]);

  useEffect(() => {
    const fetchDefault = async () => {
    let options = [];

      try {
        const startValue = await axios.get("/user/defaultValue", {
          headers: { authorization: authToken },
        });

        startValue.data.map((r) =>
          options.push({
            value: r.username,
            label: (
              <>
                <Link className="link" to={`/user/${r._id}`}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <img
                      className="sidebarCloseFriendImg"
                      src={folder + r.profilePic}
                      alt=""
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className="sidebarFriendName">
                        {r.username} <small>🔵</small>
                      </span>
                      <small
                        className="sidebarFriendName"
                        style={{ color: "grey" }}
                      >
                        {r.name}
                      </small>
                    </div>
                  </div>
                </Link>
              </>
            ),
          })
        );

        setDefaultOpt(options);
      } catch (err) {
        setDefaultOpt(null);
      }
    };

    fetchDefault();
  }, []);

  const fetchData = async (e) => {
    let options = [];

    try {
      const searchBox = await axios.get("/user/searchbox?search=" + e, {
        headers: { authorization: authToken },
      });

      searchBox.data[0].map((r) =>
        options.push({
          value: r.username,
          label: (
            <>
              <Link className="link" to={`/user/${r._id}`}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <img
                    className="sidebarCloseFriendImg"
                    src={folder + r.profilePic}
                    alt=""
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className="sidebarFriendName">
                      {r.username} <small>🔵</small>
                    </span>
                    <small
                      className="sidebarFriendName"
                      style={{ color: "grey" }}
                    >
                      {r.name}
                    </small>
                  </div>
                </div>
              </Link>
            </>
          ),
        })
      );

      searchBox.data[1].map((r) =>
        options.push({
          value: r.username,
          label: (
            <>
              <Link className="link" to={`/user/${r._id}`}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <img
                    className="sidebarCloseFriendImg"
                    src={folder + r.profilePic}
                    alt=""
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className="sidebarFriendName">{r.username}</span>
                    <small
                      className="sidebarFriendName"
                      style={{ color: "grey" }}
                    >
                      {r.name}
                    </small>
                  </div>
                </div>
              </Link>
            </>
          ),
        })
      );

      return options;
    } catch (err) {
      return [];
    }
  };

  return (

    <AsyncSelect
      defaultOptions={defaultOpt}
      loadOptions={(e) => fetchData(e)}
      placeholder="Search for users..."
    />
  );
}
