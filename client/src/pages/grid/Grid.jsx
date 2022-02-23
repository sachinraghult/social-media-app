import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Grid.css";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";
import Video from "../../components/video/Video";
import { Link } from "react-router-dom";

export default function Home() {
  const folder = "http://localhost:5000/image/";
  const folder1 = "http://localhost:5000/video/";
  const { user, authToken } = useContext(Context);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await axios.get("/post?user=" + user.username, {
          headers: { authorization: authToken },
        });

        setPosts(res.data);
      } catch (err) {}
    };

    getFeed();
  }, [user]);

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <div style={{ flex: "10" }}>
          <div className="user-name">{user.name}'s Grid</div>
          <div className="container1">
            <div className="gallery">
              {posts &&
                posts.map(
                  (post) =>
                    (!(post?.desc === "Updated his profile picture" ||
                    post?.desc === "Updated her profile picture") && (
                      <div className="gallery-item" tabindex="0">
                        {/\.(mp4|ogg|webm)$/i.test(post?.photo) ? (
                          <Video src={folder1 + post.photo} reels={true} />
                        ) : (
                          <>
                            <Link
                              className="link"
                              to={`/post/${post._id}/comments
                        `}
                            >
                              <img
                                className="gallery-image"
                                src={folder + post.photo}
                              />
                              <div class="gallery-item-info">
                                <ul>
                                  <li class="gallery-item-likes">
                                    <span class="visually-hidden">Likes:</span>
                                    <i
                                      class="fas fa-heart"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    {post.likes.length}
                                  </li>
                                  <li class="gallery-item-comments">
                                    <span class="visually-hidden">
                                      Comments:
                                    </span>
                                    <i
                                      class="fas fa-comment"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    {post.size}
                                  </li>
                                </ul>
                              </div>
                            </Link>
                          </>
                        )}
                      </div>
                    ))
                )}
              {posts.length % 3 !== 0 &&
                Array(3 - (posts.length % 3))
                  .fill(null)
                  .map(() => <div className="gallery-item" tabindex="0"></div>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
