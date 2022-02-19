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
import { useEffect } from "react";
import styled from "styled-components";

export default function Post({ post, recievedPostsState }) {
  const folder = "http://localhost:5000/images/";

  const { user, authToken } = useContext(Context);

  const [like, setLike] = useState(0);
  const [edit, setEdit] = useState(false);
  const [desc, setDesc] = useState(post?.desc);
  const [editedfile, setEditedFile] = useState();
  const [disable, setDisable] = useState(false);

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

      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }

    try {
      const res = await axios.put("/post/" + post._id, editedPost, {
        headers: { authorization: authToken },
      });

      recievedPostsState(post._id, { type: "edit", res: res });
      setDisable(false);
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
            </div>
            <div className="postCenter">
              <span className="postText">{post?.desc}</span>
              <img className="postImg" src={folder + post?.photo} alt="" />
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
      ) : (
        <div className="share">
          <form className="shareWrapper" onSubmit={handleEdit}>
            <div className="shareTop">
              <img
                className="shareProfileImg"
                src={user.profilePic}
                alt=""
                required
              />
              <input
                placeholder="Have your say.."
                className="shareInput"
                defaultValue={post?.desc}
                autoFocus={true}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            {!editedfile ? (
              <img className="postImg" src={folder + post?.photo} alt="" />
            ) : (
              <img
                className="postImg"
                src={URL.createObjectURL(editedfile)}
                alt=""
              />
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
                Post
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
