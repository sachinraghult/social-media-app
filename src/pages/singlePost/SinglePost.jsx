import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./SinglePost.css";
import Post from "../../components/post/Post";
import Comments from "../../components/comments/Comments";

export default function SinglePost() {
  return (
    <>
      <Topbar />
      <div className="SinglePost">
        <Sidebar />
        <div className="SinglePostMainContainer">
          <div className="SinglePostContainer">
            <Post
              key={1}
              post={{
                id: 1,
                desc: "Love For All, Hatred For None.",
                photo: "assets/post/1.jpeg",
                date: "5 mins ago",
                userId: 1,
                like: 32,
                comment: 9,
              }}
            />
          </div>
        </div>
        <div className="dummy"><Comments /></div>
      </div>
    </>
  );
}

