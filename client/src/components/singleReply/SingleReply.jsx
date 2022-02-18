import React from "react";
import "./SingleReply.css";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";

function SingleReply({ reply, recievedRepliesState }) {
  const { user, authToken } = useContext(Context);

  const [like, setLike] = useState(0);
  const [edit, setEdit] = useState(false);
  const [editedReply, setEditedReply] = useState(reply.comment);

  useEffect(() => {
    setLike(reply?.likes.length);
  }, [reply]);

  const handleLike = async () => {
    try {
      const res = await axios.put("/comment/like/" + reply._id, reply, {
        headers: { authorization: authToken },
      });
      setLike(res?.data.likes.length);
    } catch (err) {}
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEdit(true);

    try {
      const res = await axios.put("/comment/" + reply._id, {comment: editedReply}, {
        headers: { authorization: authToken },
      });

      recievedRepliesState(reply._id, {type: "edit", res: res});
      setEdit(false);
    } catch (err) {}
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete("/comment/" + reply._id, {
        headers: { authorization: authToken },
      });
      recievedRepliesState(reply._id, {type: "delete", res: res});
    } catch (err) {}
  };

  return (
    <li className="box_reply row" style={{ marginTop: "15px" }}>
      <div className="avatar_comment col-md-1">
        <img
          src={reply.user.profilePic}
          alt="avatar"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="result_comment col-md-11">
        <h4 style={{ marginLeft: "20px" }}>{reply.user.name}</h4>
        {/*Form */}
        <form onSubmit={handleEdit}>
          {!edit ? (
            <p style={{ marginLeft: "20px" }}>{reply.comment}</p>
          ) : (
            <textarea
              style={{ marginLeft: "20px" }}
              defaultValue={reply.comment}
              className="writeInput"
              onChange={(e) => setEditedReply(e.target.value)}
            />
          )}

          <div className="tools_comment" style={{ marginLeft: "20px" }}>
            <a className="like" onClick={handleLike}>
              Like
            </a>
            <span aria-hidden="true"> · </span>
            <i className="fa fa-thumbs-o-up" onClick={handleLike}></i>{" "}
            <span className="count">{like}</span>
            <span aria-hidden="true"> · </span>
            <span>{new Date(reply.createdAt).toDateString()}</span>
            {/*Delete */}
            {!edit
              ? reply.user._id === user._id && (
                  <a
                    className="like pull-right"
                    style={{ color: "red", marginRight: "15px" }}
                    onClick={handleDelete}
                  >
                    Delete🗑️
                  </a>
                )
              : reply.user._id === user._id && (
                  <a
                    className="like pull-right"
                    style={{ color: "red", marginRight: "15px" }}
                    onClick={() => setEdit(false)}
                  >
                    Cancel🚫
                  </a>
                )}
            {/*Edit */}
            {!edit ? (
              reply.user._id === user._id && (
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
              >
                Edit✒️
              </button>
            )}
          </div>
        </form>


      </div>
    </li>
  );
}

export default SingleReply;
