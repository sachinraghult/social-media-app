import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../context/Context";
import Stories from "react-insta-stories";
import "./ViewStatus.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "../../axios";
import CalculateTime from "../../components/calculateTime/CalculateTime";
import moment from "moment";

export default function ViewStatus() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const startWith = location.pathname?.split("/")[3];
  const navigate = useNavigate();
  const folder = "http://localhost:5000/image/";
  const folder1 = "http://localhost:5000/video/";

  const { user, authToken } = useContext(Context);

  const [seenIndex, setSeenIndex] = useState(0);

  const [status, setStatus] = useState();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await axios.get("/status/user/" + path, {
          headers: { authorization: authToken },
        });
        console.log("res", res.data);
        setStatus(res.data);
      } catch (err) {}
    };

    getStatus();
  }, []);

  useEffect(() => {
    {
      status && createContent();
    }
  }, [status]);

  useEffect(() => {
    if (startWith !== "status") setSeenIndex(startWith);
  }, []);

  const createVideoPage = (story) => (
    <div>
      <div
        className="storyMainContainer"
        style={{ display: "flex", flexDirection: "row", top: 0 }}
      >
        <img
          className="sidebarCloseFriendImg"
          src={folder + status.userId.profilePic}
          alt=""
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="sidebarFriendName">{status.userId.username}</span>
          <i>
            <small className="sidebarFriendName">
              <CalculateTime
                current={new Date(moment().format())}
                previous={new Date(moment(story.createdAt).format())}
              />
            </small>
          </i>
        </div>
      </div>

      <div id="container">
        <video
          id="videobcg"
          preload="auto"
          autoPlay="true"
          onLoadStart={(e) => (e.target.volume = 0.000001)}
        >
          <source src={folder1 + story.photo} type="video/mp4"></source>
          Sorry, your browser does not support HTML5 video.
        </video>
      </div>

      <video
        id="myvid"
        className="video"
        preload="auto"
        autoPlay="true"
        onLoadStart={(e) => (e.target.volume = 1)}
      >
        <source src={folder1 + story.photo} type="video/mp4"></source>
      </video>

      <div
        className="storyDescContainer"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {story.desc}
      </div>
    </div>
  );

  const createImagePage = (story) => {
    return (
      <div>
        <div
          className="storyMainContainer"
          style={{ display: "flex", flexDirection: "row", top: 0 }}
        >
          <img
            className="sidebarCloseFriendImg"
            src={folder + status.userId.profilePic}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="sidebarFriendName">{status.userId.username}</span>
            <i>
              <small className="sidebarFriendName">
                <CalculateTime
                  current={new Date(moment().format())}
                  previous={new Date(moment(story.createdAt).format())}
                />
              </small>
            </i>
          </div>
        </div>

        <div id="container">
          <img id="videobcg" src={folder + story.photo} alt="" />
        </div>

        <img className="statusImage" src={folder + story.photo} alt="" />

        <div
          className="storyDescContainer"
          style={{ display: "flex", flexDirection: "row" }}
        >
          {story.desc}
        </div>
      </div>
    );
  };

  const createTextPage = (story) => {
    return (
      <div className="storyTextContainer">
        <div className="statusText">
          <h1 className="contentText">{story.desc}</h1>
        </div>
      </div>
    );
  };

  const createContent = () => {
    setStories([]);
    var tempStories = [];
    status.content.map((s) => {
      if (s.photo) {
        /\.(mp4|ogg|webm)$/i.test(s.photo)
          ? tempStories.push({
              content: (props) => <div>{createVideoPage(s)}</div>,
              duration: s.duration <= 30 ? s.duration * 1000 : 30000,
            })
          : tempStories.push({
              content: (props) => <div>{createImagePage(s)}</div>,
            });
      } else {
        tempStories.push({
          content: (props) => <div>{createTextPage(s)}</div>,
        });
      }
    });

    setStories([...tempStories]);
  };

  const handleSeenBy = async () => {
    try {
      const res = await axios.put(
        "/status/seen/" + status._id + "/" + seenIndex,
        {},
        {
          headers: { authorization: authToken },
        }
      );

      const updatedSeenIndex = parseInt(seenIndex) + 1;
      setSeenIndex(updatedSeenIndex);
      console.log("res", res.data);
      console.log("seen", seenIndex);
    } catch (err) {}
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <>
      {status && (
        <div className="statusCont">
          {stories.length > 0 && (
            <>
              <Stories
                stories={stories}
                defaultInterval={6000}
                width={"100%"}
                height={"100vh"}
                loop={false}
                currentIndex={startWith === "status" ? 0 : parseInt(startWith)}
                onStoryStart={handleSeenBy}
                onStoryEnd={handleSeenBy}
                onAllStoriesEnd={handleClose}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
