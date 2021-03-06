import "./post.css";
import { MoreVert, Bookmark, BookmarkBorder } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import { PermMedia } from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import { UpdateSuccess } from "../../context/Actions";
import { useEffect } from "react";
import styled from "styled-components";
import moment from "moment";
import CalculateTime from "../calculateTime/CalculateTime";
import Video from "../video/Video";

export default function Post({ post, recievedPostsState, recievedLikeState }) {
  const folder = "http://localhost:5000/image/";
  const folder1 = "http://localhost:5000/video/";

  const { user, authToken, dispatch } = useContext(Context);

  const [like, setLike] = useState([]);
  const [edit, setEdit] = useState(false);
  const [desc, setDesc] = useState(post?.desc);
  const [editedfile, setEditedFile] = useState();
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setLike(post?.likes);
  }, [post]);

  const handleBookmark = async () => {
    try {
      const res = await axios.put("/user/bookmark/" + post._id, post, {
        headers: { authorization: authToken },
      });

      dispatch(UpdateSuccess(res.data));
    } catch (err) {}
  };

  const handleLike = async (e) => {
    try {
      const res = await axios.put("/post/like/" + post._id, post, {
        headers: { authorization: authToken },
      });
      setLike(res.data.likes);
      recievedLikeState(res.data);

      const img = document.querySelector(".postImg");
      const icon = document.querySelector(".icon");
      img.addEventListener("dblclick", () => {
        icon.classList.add("like");
        setTimeout(() => {
          icon.classList.remove("like");
        }, 1200);
      });
    } catch (err) {}
  };

  const getURL = (data) => {
    var binaryData = [];
    binaryData.push(data);
    return window.URL.createObjectURL(
      new Blob(binaryData, { type: "video/*" })
    );
  };

  const handleEdit = async (e) => {
    setAnchorEl(null);
    e.preventDefault();
    setDisable(true);

    const editedPost = {
      desc: desc,
    };

    if (editedfile) {
      const data = new FormData();
      const filename = Date.now() + editedfile.name;
      data.append("name", filename);
      data.append("file", editedfile);
      editedPost.photo = filename;
      const type = editedfile.type.split("/")[0];

      try {
        await axios.post("/upload/" + type, data);
      } catch (err) {}
    }

    try {
      const res = await axios.put("/post/" + post._id, editedPost, {
        headers: { authorization: authToken },
      });
      recievedPostsState(post._id, { type: "edit", res: res });
      setDisable(false);
      setEditedFile(null);
      setEdit(false);
    } catch (err) {
      setEdit(false);
      setDisable(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete("/post/" + post._id, {
        headers: { authorization: authToken },
      });

      recievedPostsState(post._id, { type: "delete", res: res });
    } catch (err) {}
  };

  const handleCancel = () => {
    setEditedFile(null);
    setEdit(false);
    setAnchorEl(null);
  };

  {
    /*Morevert*/
  }
  const [anchorEl, setAnchorEl] = useState(null);

  const MyOptions = ["Edit Post", "Delete Post"];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {!edit ? (
        <div className="post">
          <div className="postWrapper">
            <div className="postTop">
              <div className="postTopLeft">
                <Link className="link" to={`/user/${post?.userId._id}`}>
                  <img
                    className="postProfileImg"
                    src={folder + post?.userId.profilePic}
                    alt=""
                  />
                  <span className="postUsername">{post?.userId.name}</span>
                </Link>
                <span className="postDate">
                  {post.edited ? (
                    <>
                      <i>edited </i>
                      <CalculateTime
                        current={new Date(moment().format())}
                        previous={new Date(moment(post.edited).format())}
                      />
                    </>
                  ) : (
                    <CalculateTime
                      current={new Date(moment().format())}
                      previous={new Date(moment(post.createdAt).format())}
                    />
                  )}
                </span>
              </div>
              {!(
                post?.desc === "Updated his profile picture" ||
                post?.desc === "Updated her profile picture"
              ) && (
                <div className="postTopRight" style={{ cursor: "pointer" }}>
                  {user.bookmark.includes(post._id)
                    ? post.userId._id !== user._id && (
                        <span onClick={handleBookmark}>
                          <Bookmark />
                        </span>
                      )
                    : post.userId._id !== user._id && (
                        <span onClick={handleBookmark}>
                          <BookmarkBorder />
                        </span>
                      )}
                  {user._id === post.userId._id && (
                    <>
                      <IconStyled>
                        <IconButton
                          aria-label="more"
                          onClick={handleClick}
                          aria-haspopup="true"
                          aria-controls="long-menu"
                        >
                          <MoreVert />
                        </IconButton>
                      </IconStyled>
                      <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        onClose={handleClose}
                        open={open}
                      >
                        {MyOptions.map((option) => (
                          <MenuItem
                            key={option}
                            onClick={
                              option === "Edit Post"
                                ? () => setEdit(true)
                                : handleDelete
                            }
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="postCenter">
              {post?.desc === "Updated his profile picture" ||
              post?.desc === "Updated her profile picture" ? (
                <span
                  className="postText"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <i>{post?.desc}</i>
                </span>
              ) : (
                <span className="postText">{post?.desc}</span>
              )}

              {/\.(mp4|ogg|webm)$/i.test(post?.photo) ? (
                <Video src={folder1 + post?.photo} />
              ) : post?.desc === "Updated his profile picture" ||
                post?.desc === "Updated her profile picture" ? (
                <div style={{ marginLeft: "30%" }}>
                  <img
                    className="postImg"
                    style={{
                      width: "300px",
                      height: "300px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    src={folder + post?.photo}
                    alt=""
                  />
                </div>
              ) : (
                <>
                  
                  <img
                    className="postImg"
                    src={folder + post?.photo}
                    alt=""
                    onDoubleClick={handleLike}
                  />
                  <svg
                    aria-hidden="true"
                    style={{position: "absolute", width: 0, height: 0, overflow: "hidden"}}
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <defs>
                      <symbol id="icon-heart" viewBox="0 0 32 32">
                        <path d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z"></path>
                      </symbol>
                    </defs>
                  </svg>
                  <svg class="icon icon-heart">
                    <use xlinkHref="#icon-heart"></use>
                  </svg>
                </>
              )}
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
                <span className="postLikeCounter">
                  <Link className="link" to={`/post/${post?._id}/likes`}>
                    {like.length} people{" "}
                    {like.some((like) => like._id === user._id) && "and you "}
                    liked it
                  </Link>
                </span>
              </div>
              <div className="postBottomRight">
                <span className="postCommentText">
                  <Link className="link" to={`/post/${post?._id}/comments`}>
                    {post?.size} comments
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="share">
          <form className="shareWrapper" onSubmit={handleEdit}>
            <div className="shareTop">
              <img
                className="shareProfileImg"
                src={folder + user.profilePic}
                alt=""
              />
              <input
                placeholder="Have your say.."
                className="shareInput"
                defaultValue={post?.desc}
                autoFocus={true}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>
            {!editedfile ? (
              /\.(mp4|ogg|webm)$/i.test(post?.photo) ? (
                <video
                  className="postImg"
                  src={folder1 + post?.photo}
                  type="video/*"
                  width="320"
                  height="240"
                  controls
                ></video>
              ) : (
                <img className="postImg" src={folder + post?.photo} alt="" />
              )
            ) : (
              editedfile &&
              (editedfile.type.split("/")[0] === "image" ? (
                <img
                  className="postImg"
                  src={URL.createObjectURL(editedfile)}
                  alt=""
                />
              ) : (
                <video
                  className="postImg"
                  src={getURL(editedfile)}
                  type="video/*"
                  width="320"
                  height="240"
                  controls
                ></video>
              ))
            )}
            <hr className="shareHr" />

            <div className="shareBottom">
              <div className="shareOptions">
                <label htmlFor="fileEdited" className="shareOption">
                  <PermMedia htmlColor="tomato" className="shareIcon" />
                  Photo or Video
                </label>

                <input
                  id="fileEdited"
                  type="file"
                  className="shareOption"
                  accept="image/*, video/*"
                  style={{ display: "none" }}
                  onChange={(e) => setEditedFile(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                style={{ float: "right" }}
                className="shareButton"
                disabled={disable}
              >
                {disable ? "Updating..." : "Post"}
              </button>
              <button
                type="button"
                style={{ backgroundColor: "red" }}
                className="shareButton"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

const IconStyled = styled(IconButton)`
  &:focus {
    outline: none;
  }
`;
