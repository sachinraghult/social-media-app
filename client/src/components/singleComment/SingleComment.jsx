import React from "react";
import "./SingleComment.css";
import axios from "../../axios";
import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../../context/Context";
import SingleReply from "../singleReply/SingleReply";

function SingleComment({ comment, recievedCommentsState }) {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const { user, authToken } = useContext(Context);

  const [like, setLike] = useState(0);
  const [display, setDisplay] = useState("none");
  const [boxdisplay, setBoxDisplay] = useState("none");
  const [replies, setReplies] = useState([]);
  const [desc, setDesc] = useState("");
  const [edit, setEdit] = useState(false);

  const sendRepliesState = (id) => {
    var filteredReplies = replies.filter(
      (reply) => reply._id.toString() !== id.toString()
    );
    setReplies(filteredReplies);
  };

  useEffect(() => {
    setLike(comment?.likes.length);
  }, [comment]);

  useEffect(() => {
    const getReplies = async () => {
      try {
        const res = await axios.get("/comment/replies/" + comment._id, {
          headers: { authorization: authToken },
        });
        setReplies(res.data);
      } catch (err) {}
    };

    getReplies();
  }, []);

  const handleLike = async (e) => {
    try {
      const res = await axios.put("/comment/like/" + comment._id, comment, {
        headers: { authorization: authToken },
      });
      setLike(res.data.likes.length);
    } catch (err) {}
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete("/comment/" + comment._id, {
        headers: { authorization: authToken },
      });
      recievedCommentsState(comment._id);
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/comment",
        {
          comment: desc,
          post: path,
          parentId: comment._id,
        },
        {
          headers: { authorization: authToken },
        }
      );
      setReplies([res.data, ...replies]);
      setBoxDisplay("none");
      setDisplay("block");
      e.target.reset();
    } catch (err) {}
  };

  return (
    <div className="row">
      <ul id="list_comment" className="col-md-12">
        <li className="box_result row">
          <div className="avatar_comment col-md-1">
            <img
              src={comment.user.profilePic}
              alt="avatar"
              referrerPolicy="no-referrer"
            />
          </div>

          {/*main comment */}
          <div className="result_comment col-md-11">
            <h4 style={{ marginLeft: "20px" }}>{comment.user.name}</h4>
            <form onSubmit={handleEdit}>
              {!edit ? (
                <p style={{ marginLeft: "20px" }}>{comment.comment}</p>
              ) : (
                <input
                  style={{ marginLeft: "20px" }}
                  placeholder={comment.comment}
                  className="writeInput"
                />
              )}

              <div className="tools_comment" style={{ marginLeft: "20px" }}>
                <a className="like" onClick={handleLike}>
                  Like
                </a>
                <span aria-hidden="true"> · </span>
                <a
                  className="replay"
                  onClick={() => {
                    boxdisplay === "none"
                      ? setBoxDisplay("block")
                      : setBoxDisplay("none");
                  }}
                >
                  Reply
                </a>
                <span aria-hidden="true"> · </span>
                <i className="fa fa-thumbs-o-up" onClick={handleLike}></i>{" "}
                <span className="count">{like}</span>
                <span aria-hidden="true"> · </span>
                <span>{new Date(comment.createdAt).toDateString()}</span>
                {/*Delete */}
                {!edit
                  ? comment.user._id === user._id && (
                      <a
                        className="like pull-right"
                        style={{ color: "red" }}
                        onClick={handleDelete}
                      >
                        Delete
                      </a>
                    )
                  : comment.user._id === user._id && (
                      <a
                        className="like pull-right"
                        style={{ color: "red" }}
                        onClick={() => setEdit(false)}
                      >
                        Cancel
                      </a>
                    )}
                {/*Edit */}
                {!edit ? (
                  comment.user._id === user._id && (
                    <a
                      className="like pull-right"
                      style={{ color: "green", marginRight: "15px" }}
                      onClick={handleEdit}
                    >
                      Edit
                    </a>
                  )
                ) : (
                  <button
                    type="submit"
                    className="like pull-right editBtn"
                    style={{ color: "green", marginRight: "15px" }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </form>

            {/*comment box */}
            <div style={{ display: `${boxdisplay}` }}>
              <form
                className="box_comment col-md-11"
                style={{ marginLeft: "20px", marginTop: "10px" }}
                onSubmit={handleSubmit}
              >
                <textarea
                  className="commentar"
                  placeholder="Add a comment..."
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                ></textarea>
                <div className="box_post">
                  <div className="pull-right">
                    <span>
                      <img
                        src={user.profilePic}
                        alt="avatar"
                        referrerPolicy="no-referrer"
                      />
                    </span>
                    <button type="submit">Post</button>
                  </div>
                </div>
              </form>
            </div>

            {/*single reply*/}
            <ul className="child_replay" style={{ display: `${display}` }}>
              {replies.map((reply) => (
                <SingleReply
                  key={reply._id}
                  reply={reply}
                  recievedRepliesState={sendRepliesState}
                />
              ))}
            </ul>
          </div>
        </li>
      </ul>
      {replies?.length > 0 && (
        <button
          className="show_more"
          type="button"
          onClick={() => {
            display === "none" ? setDisplay("block") : setDisplay("none");
          }}
        >
          {display === "none"
            ? `View ${replies?.length} more replies`
            : "Hide replies"}
        </button>
      )}
    </div>
  );
}

export default SingleComment;
