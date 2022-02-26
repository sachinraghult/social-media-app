import Stories from "react-insta-stories";
import "./ViewStatus.css";
import { useNavigate } from "react-router-dom";
import Page1 from "./Page1";
import Page2 from "./Page2";

export default function ViewStatus() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  const stories = [
    {
      content: (props) => (
        <div>
          <Page1 />
        </div>
      ),
    },

    {
      content: (props) => (
        <div>
          <Page2 />
        </div>
      ),
    },
  ];
  return (
    <div className="statusCont">
      <Stories
        stories={stories}
        defaultInterval={6000}
        width={"100%"}
        height={"100vh"}
        loop={false}
        onStoryEnd={handleClose}
      />
    </div>
  );
}
