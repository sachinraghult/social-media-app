import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import {
  RssFeed,
  PermMedia,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  Person,
  Event,
} from "@material-ui/icons";
import { Users } from "../../dummyData";
import { Context } from "../../context/Context";
import { Logout } from "../../context/Actions";
import CloseFriend from "../closeFriend/CloseFriend";
import { useState, useEffect } from "react";
import axios from "../../axios";

export default function Sidebar() {
  const { user, dispatch } = useContext(Context);
  const { authToken } = useContext(Context);

  const [interaction, setInteraction] = useState();

  const handleSubmit = async (e) => {
    dispatch(Logout());
  };

  useEffect(() => {
    const getInteraction = async () => {
      try {
        const res = await axios.get("/interaction", {
          headers: { authorization: authToken },
        });

        setInteraction(res.data);
      } catch (err) {}
    };

    getInteraction();
  }, [user]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <Link to="/profile" className="link">
            <li className="sidebarListItem">
              <Person className="sidebarIcon" />
              <span className="sidebarListItemText">Profile</span>
            </li>
          </Link>

          <Link to="#" className="link">
            <li className="sidebarListItem">
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>
            </li>
          </Link>
          
          <Link to="/status" className="link">
            <li className="sidebarListItem">
            <PermMedia htmlColor="black" />
              <span className="sidebarListItemText">&ensp;&ensp;Status</span>
            </li>
          </Link>

          <Link to="#" className="link">
            <li className="sidebarListItem">
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Chats</span>
            </li>
          </Link>

          <Link to="/timeline" className="link">
            <li className="sidebarListItem">
              <Event className="sidebarIcon" />
              <span className="sidebarListItemText">Timeline</span>
            </li>
          </Link>

          <Link to="/reels" className="link">
            <li className="sidebarListItem">
              <PlayCircleFilledOutlined className="sidebarIcon" />
              <span className="sidebarListItemText">Reels</span>
            </li>
          </Link>

          <Link to="/suggestions" className="link">
            <li className="sidebarListItem">
              <Group className="sidebarIcon" />

              <span className="sidebarListItemText">Suggestions</span>
            </li>
          </Link>

          <Link to="/bookmarks" className="link">
            <li className="sidebarListItem">
              <Bookmark className="sidebarIcon" />
              <span className="sidebarListItemText">Bookmarks</span>
            </li>
          </Link>

          <Link to="/grid" className="link">
            <li className="sidebarListItem">
              <PlayCircleFilledOutlined className="sidebarIcon" />
              <span className="sidebarListItemText">Grid</span>
            </li>
          </Link>

          <Link to="#" className="link" onClick={handleSubmit}>
            <li className="sidebarListItem">
              <Group className="sidebarIcon" />
              <span className="sidebarListItemText">Logout</span>
            </li>
          </Link>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {interaction &&
            interaction.map((i) => <CloseFriend key={i.to._id} user={i.to} />)}
        </ul>
      </div>
    </div>
  );
}
