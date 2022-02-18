import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
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

  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await axios.get("/post?feed=true", {
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
        <Share recievedPostsState={sendPostState} />
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
