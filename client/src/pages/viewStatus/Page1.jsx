import styled from "styled-components";
import "./ViewStatus.css";

export default function Page1() {
  const folder = "http://localhost:5000/image/";
  const folder1 = "http://localhost:5000/video/";

  return (
    <div>
      <div
        className="storyMainContainer"
        style={{ display: "flex", flexDirection: "row", top: 0 }}
      >
        <img
          className="sidebarCloseFriendImg"
          src={folder + "1645195113758Ben10.png"}
          alt=""
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="sidebarFriendName">Hello</span>
          <small className="sidebarFriendName">5 min ago</small>
        </div>
      </div>

      <div id="container">
        <video
          id="videobcg"
          preload="auto"
          autoPlay="true"
          onLoadStart={(e) => (e.target.volume = 0.000001)}
        >
          <source
            src={folder1 + "1645462074724aaa.mp4"}
            type="video/mp4"
          ></source>
          Sorry, your browser does not support HTML5 video.
        </video>
      </div>

      <video
        className="video"
        preload="auto"
        autoPlay="true"
        onLoadStart={(e) => (e.target.volume = 1)}
      >
        <source
          src={folder1 + "1645462074724aaa.mp4"}
          type="video/mp4"
        ></source>
      </video>
    </div>
  );
}
