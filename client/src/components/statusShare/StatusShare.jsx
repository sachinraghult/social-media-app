import "./StatusShare.css";
import { PermMedia } from "@material-ui/icons";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";

export default function StatusShare({ receivedStatusState }) {
  const folder = "http://localhost:5000/image/";

  const { user, authToken } = useContext(Context);

  const [desc, setDesc] = useState();
  const [file, setFile] = useState();
  const [disable, setDisable] = useState(false);

  const getURL = (data) => {
    var binaryData = [];
    binaryData.push(data);
    return window.URL.createObjectURL(
      new Blob(binaryData, { type: "video/*" })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);

    const newStatus = {
      desc: desc,
      photo: "",
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newStatus.photo = filename;
      const type = file.type.split("/")[0];

      if (type === "video") {
        var myvid = document.getElementById("myvid");
        myvid.onloadedmetadata = function () {
          newStatus.duration = myvid.duration;
        };
      } else {
        newStatus.duration = 6;
      }

      try {
        await axios.post("/upload/" + type, data);
      } catch (err) {}
    }
    try {
      const status = await axios.post("/status", newStatus, {
        headers: { authorization: authToken },
      });

      receivedStatusState(status.data);

      e.target.reset();
      setDisable(false);
      setFile(null);
      setDesc(null);
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
            src={folder + user.profilePic}
            alt=""
          />
          <input
            placeholder="Have your status.."
            className="shareInput"
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>
        {file &&
          (file.type.split("/")[0] === "image" ? (
            <img className="postImg" src={URL.createObjectURL(file)} alt="" />
          ) : (
            <video
              id="myvid"
              className="postImg"
              src={getURL(file)}
              type="video/*"
              width="320"
              height="240"
              controls
            ></video>
          ))}
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
            />
          </div>
          <button type="submit" className="shareButton" disabled={disable}>
            {disable ? "Uploading..." : "Send Status"}
          </button>
        </div>
      </form>
    </div>
  );
}
