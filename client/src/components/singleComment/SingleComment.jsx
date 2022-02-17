import React from "react";
import "./SingleComment.css";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";

function Comments({ comment }) {
  const { authToken } = useContext(Context);

  const [like, setLike] = useState(0);

  useEffect(() => {
    setLike(comment?.likes.length);
  }, [comment]);

  const handleLike = async (e) => {
    try {
      const res = await axios.put("/comment/like/" + comment._id, comment, {
        headers: { authorization: authToken },
      });
      setLike(res.data.likes.length);
    } catch (err) {}
  };

  return (
    <div className="row">
      <ul id="list_comment" className="col-md-12">
        <li className="box_result row">
          <div className="avatar_comment col-md-1">
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg"
              alt="avatar"
            />
          </div>
          <div className="result_comment col-md-11">
            <h4 style={{ marginLeft: "20px" }}>{comment.user.name}</h4>
            <p style={{ marginLeft: "20px" }}>{comment.comment}</p>
            <div className="tools_comment" style={{ marginLeft: "20px" }}>
              <a className="like" onClick={handleLike}>
                Like
              </a>
              <span aria-hidden="true"> · </span>
              <a className="replay">Reply</a>
              <span aria-hidden="true"> · </span>
              <i className="fa fa-thumbs-o-up" onClick={handleLike}></i>{" "}
              <span className="count">{like}</span>
              <span aria-hidden="true"> · </span>
              <span>26m</span>
            </div>
            <ul className="child_replay"></ul>
          </div>
        </li>
      </ul>
      <button className="show_more" type="button">
        View {comment.size} more replies
      </button>
    </div>
  );
}

export default Comments;
