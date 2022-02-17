import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./SinglePost.css";
import Post from "../../components/post/Post";
import Comments from "../../components/comments/Comments";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const { authToken } = useContext(Context);

  const [post, setPost] = useState();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get("/post/" + path, {
          headers: { authorization: authToken },
        });

        setPost(res.data);
      } catch (err) {}
    };

    getPost();
  }, []);

  return (
    <>
      <Topbar />
      <div className="SinglePost">
        <Sidebar />
        <div className="SinglePostMainContainer">
          <div className="SinglePostContainer">
            {post && <Post post={post} />}
          </div>
        </div>
        <div className="dummy">
          <Comments />
        </div>
      </div>
    </>
  );
}
