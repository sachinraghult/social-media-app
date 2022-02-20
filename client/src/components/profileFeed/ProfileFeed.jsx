import Post from "../post/Post";
import Share from "../share/Share";
import "./ProfileFeed.css";
import axios from "../../axios";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "../../context/Context"
import { useState } from "react";

export default function Feed({ user }) {

  const {authToken} = useContext(Context);

  const [posts, setPosts] = useState([]);

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
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
