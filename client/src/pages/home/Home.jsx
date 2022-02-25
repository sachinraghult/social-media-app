import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import Status from "../../components/status/Status";

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <div className="status">
          <Status />
          <Feed bookmark={false} />
        </div>
        <Rightbar />
      </div>
    </>
  );
}
