import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { useState } from "react";

export default function Feed({ bookmark }) {
  const { user, authToken } = useContext(Context);

  const [posts, setPosts] = useState([]);

  const sendPostState = (res) => {
    setPosts([res.data, ...posts]);
  };

  const sendPostsState = (id, action) => {
    if (action.type === "edit") {
      var index = posts.findIndex((m) => m._id.toString() === id.toString());
      var size = posts[index].size;
      var editedPosts = posts;
      editedPosts[index] = action.res.data;
      editedPosts[index].size = size;
      setPosts([...editedPosts]);
    } else if (action.type === "delete") {
      var filteredPosts = posts.filter(
        (post) => post._id.toString() !== id.toString()
      );
      setPosts(filteredPosts);
    }
  };

  useEffect(() => {
    const getFeed = async () => {
      if (bookmark) {
        const res = await axios.get("/user/bookmarks", {
          headers: { authorization: authToken },
        });

        setPosts(res.data.bookmark);
      } else {
        try {
          const res = await axios.get("/post?feed=true", {
            headers: { authorization: authToken },
          });

          setPosts(res.data);
        } catch (err) {}
      }
    };

    getFeed();
  }, [user]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {bookmark && posts.length === 0 && <h3>You haven't bookmarked yet!</h3>}
        {!bookmark && <Share recievedPostState={sendPostState} />}
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            recievedPostsState={sendPostsState}
          />
        ))}
      </div>
    </div>
  );
}
