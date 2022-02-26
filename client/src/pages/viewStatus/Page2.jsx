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
        <img
          id="videobcg"
          src={folder + "1645204399333a42af5f160d4b42694f03c334e35e4c8.jpg"}
          alt=""
        />
      </div>

      <img
        className="statusImage"
        src={folder + "1645204399333a42af5f160d4b42694f03c334e35e4c8.jpg"}
        alt=""
      />
    </div>
  );
}
