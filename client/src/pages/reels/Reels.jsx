import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Reels.css";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";
import Video from "../../components/video/Video";

export default function Home() {
  const folder1 = "http://localhost:5000/video/";
  const { user, authToken } = useContext(Context);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await axios.get("/post?feed=true", {
          headers: { authorization: authToken },
        });

        let vid = [];
        res.data.map(
          (post) => /\.(mp4|ogg|webm)$/i.test(post?.photo) && vid.push(post)
        );

        setPosts([...vid]);
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
          <div className="user-name">Reels</div>
          <div class="container1">
            <div class="gallery">
              {posts &&
                posts.map((post) => (
                  <div class="gallery-item" tabindex="0">
                    <Video src={folder1 + post.photo} />
                  </div>
                ))}
              {posts.length % 3 !== 0 &&
                Array(3 - (posts.length % 3))
                  .fill(null)
                  .map(() => <div class="gallery-item" tabindex="0"></div>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
