import "./share.css";
import { PermMedia } from "@material-ui/icons";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";

export default function Share({recievedPostState}) {
  const { user, authToken } = useContext(Context);

  const [desc, setDesc] = useState();
  const [file, setFile] = useState();
  const [disable, setDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);

    const newPost = {
      desc: desc,
      userId: user._id,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;

      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }

    try {
      const post = await axios.post("/post", newPost, {
        headers: { authorization: authToken },
      });
      
      post.data.size = 0;
      recievedPostState(post);

      setDisable(false);

      e.target.reset();
      setFile(null);
    } catch (err) {
      setDisable(false);
    }
  };

  return (
    <div className="share">
      <form className="shareWrapper" onSubmit={handleSubmit}>
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
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        {file && (
          <img className="postImg" src={URL.createObjectURL(file)} alt="" />
        )}
        <hr className="shareHr" />

        <div className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="fileInput" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              Photo or Video
            </label>

            <input
              id="fileInput"
              type="file"
              className="shareOption"
              accept="image/*, video/*"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" className="shareButton" disabled={disable}>
            Share
          </button>
        </div>
      </form>
    </div>
  );
}
