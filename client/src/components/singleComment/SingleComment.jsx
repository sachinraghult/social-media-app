import React from "react";
import "./SingleComment.css";
import axios from "../../axios";
import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../../context/Context";
import SingleReply from "../singleReply/SingleReply";
import CalculateTime from "../calculateTime/CalculateTime";
import moment from "moment";

function SingleComment({
  comment,
  recievedCommentsState,
  recievedCommentsSize,
}) {
  const folder = "http://localhost:5000/image/";

  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const { user, authToken } = useContext(Context);

  const [disable, setDisable] = useState(false);

  const [like, setLike] = useState(0);
  const [display, setDisplay] = useState("none");
  const [boxdisplay, setBoxDisplay] = useState("none");
  const [replies, setReplies] = useState([]);
  const [desc, setDesc] = useState("");
  const [edit, setEdit] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);

  const sendRepliesState = (id, action) => {
    if (action.type === "edit") {
      var index = replies.findIndex((m) => m._id.toString() === id.toString());

      var editedReplies = replies;
      editedReplies[index] = action.res.data;
      setReplies([...editedReplies]);
    } else if (action.type === "delete") {
      var filteredReplies = replies.filter(
        (replies) => replies._id.toString() !== id.toString()
      );
      setReplies(filteredReplies);
    }
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

  const handleEdit = async (e) => {
    setDisable(true);
    e.preventDefault();
    setEdit(true);

    try {
      const res = await axios.put(
        "/comment/" + comment._id,
        { comment: editedComment },
        {
          headers: { authorization: authToken },
        }
      );

      recievedCommentsState(comment._id, { type: "edit", res: res });
      setEdit(false);
    } catch (err) {}
    setDisable(false);
  };

  const handleDelete = async () => {
    setDisable(true);
    try {
      const res = await axios.delete("/comment/" + comment._id, {
        headers: { authorization: authToken },
      });
      recievedCommentsState(comment._id, { type: "delete", res: res });
      recievedCommentsSize(-1);
    } catch (err) {}
    setDisable(false);
  };

  const handleSubmit = async (e) => {
    setDisable(true);
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
      setDesc(null);
      e.target.reset();
    } catch (err) {}
    setDisable(false);
  };

  return (
    <div className="row">
      <ul id="list_comment" className="col-md-12">
        <li className="box_result row">
          <div className="avatar_comment col-md-1">
            <Link className="link" to={`/user/${comment.user._id}`}>
              <img
                src={folder + comment.user.profilePic}
                alt="avatar"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/*main comment */}
          <div className="result_comment col-md-11">
            <Link className="link" to={`/user/${comment.user._id}`}>
              <h4 style={{ marginLeft: "20px" }}>{comment.user.name}</h4>
            </Link>
            <form onSubmit={handleEdit}>
              {!edit ? (
                <p className="displayComment" style={{ marginLeft: "20px" }}>
                  {comment.comment}
                </p>
              ) : (
                <textarea
                  style={{ marginLeft: "20px" }}
                  defaultValue={comment.comment}
                  className="writeInput"
                  autoFocus={true}
                  onChange={(e) => setEditedComment(e.target.value)}
                  required
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
                <span>
                  {comment.edited ? (
                    <>
                      <i>edited </i>
                      <CalculateTime
                        current={new Date(moment().format())}
                        previous={new Date(moment(comment.edited).format())}
                      />
                    </>
                  ) : (
                    <CalculateTime
                      current={new Date(moment().format())}
                      previous={new Date(moment(comment.createdAt).format())}
                    />
                  )}
                </span>
                {/*Delete */}
                {!edit
                  ? comment.user._id === user._id && (
                      <a
                        className="like pull-right"
                        style={{ color: "red" }}
                        onClick={handleDelete}
                        disabled={disable}
                      >
                        Delete🗑️
                      </a>
                    )
                  : comment.user._id === user._id && (
                      <a
                        className="like pull-right"
                        style={{ color: "red" }}
                        onClick={() => setEdit(false)}
                      >
                        Cancel🚫
                      </a>
                    )}
                {/*Edit */}
                {!edit ? (
                  comment.user._id === user._id && (
                    <a
                      className="like pull-right"
                      style={{ color: "green", marginRight: "15px" }}
                      onClick={() => setEdit(true)}
                    >
                      Edit✒️
                    </a>
                  )
                ) : (
                  <button
                    type="submit"
                    className="like pull-right editBtn"
                    style={{ color: "green", marginRight: "15px" }}
                    disabled={disable}
                  >
                    Edit✒️
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
                        src={folder + user.profilePic}
                        alt="avatar"
                        referrerPolicy="no-referrer"
                      />
                    </span>
                    <button type="submit" disabled={disable}>
                      Post
                    </button>
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
