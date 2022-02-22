import React from "react";
import "./Comments.css";
import SingleComment from "../singleComment/SingleComment";
import { useLocation } from "react-router-dom";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";

function Comments({ recievedCommentsSize }) {
  const folder = "http://localhost:5000/image/";

  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const { user, authToken } = useContext(Context);

  const [main, setMain] = useState([]);
  const [desc, setDesc] = useState("");
  const [disable, setDisable] = useState(false);

  const sendCommentsState = (id, action) => {
    if (action.type === "edit") {
      var index = main.findIndex((m) => m._id.toString() === id.toString());

      var editedComments = main;
      editedComments[index] = action.res.data;
      setMain([...editedComments]);
    } else if (action.type === "delete") {
      var filteredComments = main.filter(
        (comment) => comment._id.toString() !== id.toString()
      );
      setMain(filteredComments);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get("/comment/" + path, {
          headers: { authorization: authToken },
        });

        setMain(res.data);
      } catch (err) {}
    };

    getComments();
  }, []);

  const handleSubmit = async (e) => {
    setDisable(true);
    e.preventDefault();

    try {
      const res = await axios.post(
        "/comment",
        {
          comment: desc,
          post: path,
          parentId: "",
        },
        {
          headers: { authorization: authToken },
        }
      );

      setMain([res.data, ...main]);
      recievedCommentsSize(1);
      setDesc(null);
      e.target.reset();
    } catch (err) {}

    setDisable(false);
  };

  return (
    <div className="container3">
      <div className="col-md-12" id="fbcomment">
        <div className="header_comment">
          <div className="row">
            <div className="col-md-6 text-left">
              <span className="count_comment">{main.length} Comments</span>
            </div>
          </div>
        </div>

        {/*comment box*/}
        <div className="body_comment">
          <form className="row" onSubmit={handleSubmit}>
            <div className="box_comment col-md-11">
              <textarea
                className="commentar"
                placeholder="Add a comment..."
                onChange={(e) => setDesc(e.target.value)}
                required
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
            </div>
          </form>

          {/*single comments */}
          {main.map((comment) => (
            <SingleComment
              key={comment._id}
              comment={comment}
              recievedCommentsState={sendCommentsState}
              recievedCommentsSize={recievedCommentsSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comments;
