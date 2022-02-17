import "./post.css";
import { MoreVert, Bookmark, BookmarkBorder } from "@material-ui/icons";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import { useEffect } from "react";

export default function Post({ post }) {
  const { authToken } = useContext(Context);

  const [like, setLike] = useState(0);

  useEffect(() => {
    setLike(post?.likes.length);
  }, [post]);

  const handleLike = async (e) => {
    try {
      const res = await axios.put("/post/like/" + post._id, post, {
        headers: { authorization: authToken },
      });
      setLike(res.data.likes.length);
    } catch (err) {}
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src={post?.userId.profilePic}
              alt=""
            />
            <span className="postUsername">{post?.userId.name}</span>
            <span className="postDate">
              {new Date(post?.createdAt).toDateString()}
            </span>
          </div>
          <div className="postTopRight">
            {true ? <Bookmark /> : <BookmarkBorder />}
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post?.photo} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src="/assets/like.png"
              onClick={handleLike}
              alt=""
              referrerPolicy="no-referrer"
            />
            <img
              className="likeIcon"
              src="/assets/heart.png"
              onClick={handleLike}
              alt=""
            />
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              <Link className="link" to={`/post/${post?._id}`}>
                {post?.size} comments
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
