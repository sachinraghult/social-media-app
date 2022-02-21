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
import { useLocation, useNavigate } from "react-router-dom";
import DisplayLikes from "../../components/displayLikes/DisplayLikes";

export default function SinglePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[2];
  const type = location.pathname.split("/")[3];

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

  const sendPostState = (id, action) => {
    if (action.type === "edit") {
      var size = post.size;
      action.res.data.size = size;
      setPost(action.res.data);
    } else if (action.type === "delete") {
      navigate("/", { replace: true });
    }
  };

  const sendCommentsSize = (change) => {
    setPost({ ...post, size: post.size + change });
  };

  const sendLikeState = (res) => {
    setPost({ ...res });
  };

  return (
    <>
      <Topbar />
      <div className="SinglePost">
        <Sidebar />
        <div className="SinglePostMainContainer">
          <div className="SinglePostContainer">
            {post && (
              <Post
                post={post}
                recievedPostsState={sendPostState}
                recievedLikeState={sendLikeState}
              />
            )}
          </div>
        </div>
        <div className="dummy">
          {type == "likes" && <DisplayLikes post={post} />}

          {type == "comments" && (
            <Comments recievedCommentsSize={sendCommentsSize} />
          )}
        </div>
      </div>
    </>
  );
}
