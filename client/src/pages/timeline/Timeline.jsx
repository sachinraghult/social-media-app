import React from "react";
import "./Timeline.css";
import { Link } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";
import axios from "../../axios";
import moment from "moment";
import CalculateTime from "../../components/calculateTime/CalculateTime";
import Video from "../../components/video/Video";

function Timeline() {
  const folder = "http://localhost:5000/image/";
  const folder1 = "http://localhost:5000/video/";

  const { authToken } = useContext(Context);
  const [timeline, setTimeline] = useState();

  useEffect(() => {
    const getTimeline = async () => {
      try {
        const res = await axios.get("/timeline", {
          headers: { authorization: authToken },
        });

        setTimeline(res.data);
      } catch (err) {}
    };

    getTimeline();
  }, []);

  const DisplayContent = ({ tl }) => {
    if (tl?.comment) {
      if (tl?.post) {
        return (
          <Link className="link" to={`/post/${tl.comment.post._id}/comments`}>
            {tl?.post.desc === "Updated his profile picture" ||
            tl?.post?.desc === "Updated her profile picture" ? (
              <p>
                commented on your profile picture : <i>{tl?.comment.comment}</i>
              </p>
            ) : (
              <p>
                commented on your post : <i>{tl?.comment.comment}</i>
              </p>
            )}
          </Link>
        );
      } else {
        return (
          <Link className="link" to={`/post/${tl.comment.post._id}/comments`}>
            <p>
              replied to your comment on{" "}
              <b>{tl?.comment.post.userId.name}'s post</b> :{" "}
              <i>{tl?.comment.comment}</i>
            </p>
          </Link>
        );
      }
    } else if (tl?.post) {
      return (
        <Link className="link" to={`/post/${tl.post._id}/likes`}>
          {tl?.post.desc === "Updated his profile picture" ||
          tl?.post?.desc === "Updated her profile picture" ? (
            <p>liked your profile picture</p>
          ) : (
            <p>liked your post</p>
          )}
        </Link>
      );
    } else {
      return (
        <Link className="link" to={`/user/${tl.from._id}`}>
          <p>started following you</p>
        </Link>
      );
    }
  };

  const DisplayImage = ({ tl }) => {
    if (tl?.comment) {
      return (
        <Link className="link" to={`/post/${tl.comment.post._id}/comments`}>
          {/\.(mp4|ogg|webm)$/i.test(tl?.post.photo) ? (
            <PostImage src="https://www.pinpng.com/pngs/m/120-1204737_play-start-video-film-arrow-media-multimedia-blue.png" />
          ) : tl?.post.desc === "Updated his profile picture" ||
            tl?.post?.desc === "Updated her profile picture" ? (
            <PostImage
              className="postImg"
              style={{ borderRadius: "50%", objectFit: "cover" }}
              src={folder + tl?.comment.post.photo}
              alt=""
            />
          ) : (
            <PostImage
              className="postImg"
              src={folder + tl?.comment.post.photo}
              alt=""
            />
          )}
        </Link>
      );
    } else if (tl?.post) {
      return (
        <Link className="link" to={`/post/${tl.post._id}/likes`}>
          {/\.(mp4|ogg|webm)$/i.test(tl?.post.photo) ? (
            <PostImage src="https://www.pinpng.com/pngs/m/120-1204737_play-start-video-film-arrow-media-multimedia-blue.png" />
          ) : tl?.post.desc === "Updated his profile picture" ||
            tl?.post?.desc === "Updated her profile picture" ? (
            <PostImage
              className="postImg"
              src={folder + tl?.post.photo}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              alt=""
            />
          ) : (
            <PostImage
              className="postImg"
              src={folder + tl?.post.photo}
              alt=""
            />
          )}
        </Link>
      );
    } else {
      return <p></p>;
    }
  };

  return (
    <>
      <Topbar />
      <div className="TimelineContainer">
        <Sidebar />
        <div className="flex">
          <div className="tlContainer">
            <div className="tlWrapper">
              <h1> A day in my 'sleepy' life 😅</h1>
              <ul className="sessions">
                {timeline &&
                  timeline.map((tl, index) => (
                    <>
                      {tl.from._id.toString() !== tl.to.toString() && (
                        <>
                          <ComponentContainer>
                            <Link className="link" to={`/user/${tl.from._id}`}>
                              <img
                                src={folder + tl.from.profilePic}
                                referrerPolicy="no-referrer"
                              />
                            </Link>
                            <ContentContainer>
                              <Content>
                                <div className="time">
                                  <Link
                                    className="link"
                                    to={`/user/${tl.from._id}`}
                                  >
                                    <b>{tl.from.name}</b>
                                  </Link>
                                  <small style={{ marginLeft: "10px" }}>
                                    <CalculateTime
                                      current={new Date(moment().format())}
                                      previous={
                                        new Date(moment(tl.createdAt).format())
                                      }
                                    />{" "}
                                  </small>
                                </div>
                                <DisplayContent tl={tl} />
                              </Content>
                              <DisplayImage tl={tl} />
                            </ContentContainer>
                          </ComponentContainer>
                          {timeline.length !== index + 1 && <VL />}
                        </>
                      )}
                    </>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Timeline;

const ComponentContainer = styled.div`
  display: flex;
  margin-bottom: -20px;
  margin-left: 40px;

  img {
    border-radius: 50%;
    object-fit: cover;
    width: 50px;
    height: 50px;
  }
`;

const ContentContainer = styled.div`
  margin-left: 30px;
  width: 100%;
  display: flex;
  justify-content: space-around;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  img {
    border-radius: 5%;
    flex: 3;
    width: 50px;
    height: 50px;
    object-fit: contain;
    justify-content: flex-start;
  }
`;

const PostImage = styled.img`
  height: auto;
  max-height: 100px;
  width: auto;
  max-width: 100px;
`;

const Content = styled.div`
  flex: 5;
`;

const VL = styled.div`
  border-left: 1px dashed black;
  margin-left: 62px;
  height: 5vh;
`;
