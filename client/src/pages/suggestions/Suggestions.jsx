import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import People from "../../components/people/People";
import Rightbar from "../../components/rightbar/Rightbar";
import "./Suggestions.css";

export default function Sugessions() {
  return (
    <>
      <Topbar />
      <div className="suggContainer">
        <Sidebar />
        <div className="suggest">
          <div className="peopleDiv">
            <People />
          </div>
          <Rightbar />
        </div>
      </div>
    </>
  );
}
