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
  const navigate = useNavigate();
  const folder = "http://localhost:5000/image/";
  const folder1 = "http://localhost:5000/video/";

  const { user, authToken } = useContext(Context);

  const [seenIndex, setSeenIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState();
  const [allStatus, setAllStatus] = useState([]);
  const [status, setStatus] = useState();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const getAllStatus = async () => {
      try {
        const res = await axios.get("/status", {
          headers: { authorization: authToken },
        });

        setAllStatus([...res.data[0], ...res.data[1]]);
      } catch (err) {}
    };

    getAllStatus();
  }, []);

  useEffect(() => {
    for (var i = 0; i < allStatus.length; i++)
      if (allStatus[i].userId._id.toString() === path) {
        setStatus(allStatus[i]);
        setCurrentIndex(i);
        break;
      }
  }, [allStatus]);

  useEffect(() => {
    console.log("curInd", currentIndex);
    setStatus(allStatus[currentIndex]);
  }, [currentIndex]);

  useEffect(() => {
    {
      status && setSeenIndex(status.startAt);
      status && createContent();
    }
  }, [status]);

  const handleNextStatus = () => {
    if (currentIndex + 1 < allStatus.length) {
      var temp = currentIndex + 1;
      setCurrentIndex(temp);
    } else {
      navigate("/");
    }
  };

  const createVideoPage = (story) => (
    <div style={{ display: "flex", width: "100%" }}>
      <div
        className="storyMainContainer"
        style={{
          display: "flex",
          flexDirection: "row",
          top: 0,
          zIndex: "10000",
          width: "100%",
        }}
      >
        <img
          className="sidebarCloseFriendImg"
          src={folder + status.userId.profilePic}
          alt=""
        />
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            float: "right",
            marginRight: "100px",
          }}
        >
          <Link className="link" to="/">
            <span>❌</span>
            <span style={{ marginLeft: "5px" }}>Close</span>
          </Link>
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
      <div style={{ display: "flex", width: "100%" }}>
        <div
          className="storyMainContainer"
          style={{
            display: "flex",
            flexDirection: "row",
            top: 0,
            zIndex: "10000",
            width: "100%",
          }}
        >
          <img
            className="sidebarCloseFriendImg"
            src={folder + status.userId.profilePic}
            alt=""
          />
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              float: "right",
              marginRight: "100px",
            }}
          >
            <Link className="link" to="/">
              <span>❌</span>
              <span style={{ marginLeft: "5px" }}>Close</span>
            </Link>
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
      <div style={{ display: "flex", width: "100%", zIndex: "100000" }}>
        <div
          className="storyMainContainer"
          style={{
            display: "flex",
            flexDirection: "row",
            top: 0,
            zIndex: "100000",
            width: "100%",
          }}
        >
          <img
            className="sidebarCloseFriendImg"
            src={folder + status.userId.profilePic}
            alt=""
          />
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              float: "right",
              marginRight: "100px",
              zIndex: "100000",
            }}
          >
            <Link className="link" to="/">
              <span>❌</span>
              <span style={{ marginLeft: "5px" }}>Close</span>
            </Link>
          </div>
        </div>

        <div className="storyTextContainer">
          <div className="statusText">
            <h1 className="contentText">{story.desc}</h1>
          </div>
        </div>
      </div>
    );
  };

  const createContent = () => {
    console.log("single", status.content);
    setStories([]);
    var tempStories = [];
    if (status.content.length > 0) {
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
    }
  };

  const handleSeenBy = async () => {
    if (seenIndex < status.content.length) {
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
      } catch (err) {}
    }
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
                currentIndex={0}
                onStoryStart={handleSeenBy}
                onStoryEnd={handleSeenBy}
                onAllStoriesEnd={handleNextStatus}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
