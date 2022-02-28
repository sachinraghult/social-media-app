import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../context/Context";
import { Link } from "react-router-dom";
import "./Status.css";
import axios from "../../axios";

function Status() {
  const folder = "http://localhost:5000/image/";

  const { user, authToken } = useContext(Context);

  const [status, setStatus] = useState([]);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await axios.get("/status", {
          headers: { authorization: authToken },
        });

        setStatus(res.data);
      } catch (err) {}
    };

    getStatus();
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <b style={{ marginTop: "5px" }}>Status</b>
        <section className="stories">
          {status.length > 0 &&
            status[0].map((unseen) => (
              <Link
                to={"/viewStatus/" + unseen.userId._id + "/" + unseen.startAt}
                className="link"
              >
                <div className="stories__item stories__item--active">
                  <button>
                    <div className="stories__item-picture">
                      <img
                        src={folder + unseen.userId.profilePic}
                        alt="profilepicture"
                      />
                    </div>
                    <span className="stories__item-username">
                      {unseen.userId.username}
                    </span>
                  </button>
                </div>
              </Link>
            ))}

          {status.length > 0 &&
            status[1].map((seen) => (
              <Link
                to={"/viewStatus/" + seen.userId._id + "/status"}
                className="link"
              >
                <div className="stories__item stories__item--inactive">
                  <button>
                    <div className="stories__item-picture">
                      <img
                        src={folder + seen.userId.profilePic}
                        alt="profilepicture"
                      />
                    </div>
                    <span className="stories__item-username">
                      {seen.userId.username}
                    </span>
                  </button>
                </div>
              </Link>
            ))}
        </section>
      </div>
    </div>
  );
}

export default Status;
