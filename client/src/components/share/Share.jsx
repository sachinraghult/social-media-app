import "./share.css";
import { PermMedia } from "@material-ui/icons";

export default function Share() {
  return (
    <div className="share">
      <form className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src="/assets/person/1.jpeg"
            alt=""
            required
          />
          <input placeholder="Have your say.." className="shareInput" />
        </div>
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
              required
            />
          </div>
          <button type="submit" className="shareButton">
            Share
          </button>
        </div>
      </form>
    </div>
  );
}
