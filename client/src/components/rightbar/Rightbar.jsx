import "./rightbar.css";
import Online from "../online/Online";
import moment from "moment";
import { Context } from "../../context/Context";
import { useState, useEffect, useContext } from "react";
import axios from "../../axios";
import { Users } from "../../dummyData";
import { Link } from "react-router-dom";

export default function Rightbar({ profile }) {
  const { user, authToken } = useContext(Context);

  const [interaction, setInteraction] = useState();
  const folder = "http://localhost:5000/image/";

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

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">username : </span>
            <span className="rightbarInfoValue">{user?.username}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Sex : &emsp;&emsp;&emsp;</span>
            <span className="rightbarInfoValue">{user?.gender}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">DOB : &emsp;&emsp; &ensp;</span>
            <span className="rightbarInfoValue">
              {moment(user?.dob).format("MMM Do YYYY")}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">
              📅 <i>Joined at {new Date(user?.createdAt).getFullYear()}</i>
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {interaction &&
            interaction.map((i) => (
              <>
                <div className="rightbarFollowing">
                  <Link className="link" to={`/user/${i.to._id}`}>
                    <img
                      src={folder + `/${i.to.profilePic}`}
                      alt=""
                      className="rightbarFollowingImg"
                    />
                    <div>
                      <span className="rightbarFollowingName">
                        {i.to.username}
                      </span>
                    </div>
                  </Link>
                </div>
              </>
            ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
