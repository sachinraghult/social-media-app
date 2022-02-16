import {Link} from 'react-router-dom'
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";

export default function Topbar() {
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo"><Link className="link" to='/'>Lamasocial</Link></span>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">
          <Link className="link" to='/'>Homepage</Link>
          </span>
          <span className="topbarLink">
          <Link className="link" to='/timeline'>Timeline</Link>
          </span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Link className="link" to='/profile'>
              <Person />
              <span className="topbarIconBadge">1</span>
            </Link>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Link className="link" to='/timeline'>
              <Notifications />
              <span className="topbarIconBadge">1</span>
            </Link>
          </div>
        </div>
        <Link className="link" to='/profile'>
        <img src="/assets/person/1.jpeg" alt="" className="topbarImg"/>
        </Link>
      </div>
    </div>
  );
}
