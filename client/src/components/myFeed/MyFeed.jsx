import Post from "../post/Post";
import Share from "../share/Share";
import "./MyFeed.css";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context"
import { useState } from "react";

export default function Feed() {

  const {user, authToken} = useContext(Context);

  const [posts, setPosts] = useState([]);

  const sendPostState = (res) => {
    setPosts([res.data, ...posts]);
  };

  const sendPostsState = (id, action) => {
    if (action.type === "edit") {
        var index = posts.findIndex((m) => m._id.toString() === id.toString());
        var size =  posts[index].size;
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
      try {
        const res = await axios.get("/post?user=" + user.username, {
          headers: {authorization: authToken},
        })
        
        setPosts(res.data);
      } catch (err) {

      }
    }
    
    getFeed();
  }, [user])

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share recievedPostState={sendPostState} />
        {posts.map((post) => (
          <Post key={post._id} post={post} recievedPostsState={sendPostsState} />
        ))}
      </div>
    </div>
  );
}
