import React from "react";
import "./Comments.css";
import SingleComment from "../singleComment/SingleComment";
import { useLocation } from "react-router-dom";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";

function Comments() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const { authToken } = useContext(Context);

  const [main, setMain] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get("/comment/" + path, {
          headers: { authorization: authToken },
        });

        setMain(res.data);
        console.log(main);
      } catch (err) {}
    };

    getComments();
  }, []);

  return (
    <div className="container">
      <div className="col-md-12" id="fbcomment">
        <div className="header_comment">
          <div className="row">
            <div className="col-md-6 text-left">
              <span className="count_comment">264235 Comments</span>
            </div>
            <div className="col-md-6 text-right">
              <span className="sort_title">Sort by</span>
              <select className="sort_by">
                <option>Top</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="body_comment">
          <div className="row">
            <div className="box_comment col-md-11">
              <textarea
                className="commentar"
                placeholder="Add a comment..."
              ></textarea>
              <div className="box_post">
                <div className="pull-right">
                  <span>
                    <img
                      src="https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg"
                      alt="avatar"
                    />
                    <i className="fa fa-caret-down"></i>
                  </span>
                  <button type="button" value="1">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {main.map((comment) => (
            <SingleComment comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comments;
