import "./closeFriend.css";
import { Link } from "react-router-dom";

export default function CloseFriend({ user }) {
  const folder = "http://localhost:5000/image/";

  return (
    <Link className="link" to={`/user/${user._id}`}>
      <li className="sidebarFriend">
        <img
          className="sidebarFriendImg"
          src={folder + `/${user.profilePic}`}
          alt=""
        />
        <span className="sidebarFriendName">
          <b style={{ letterSpacing: 1.15 }}>{user.name}</b>
        </span>
      </li>
    </Link>
  );
}
