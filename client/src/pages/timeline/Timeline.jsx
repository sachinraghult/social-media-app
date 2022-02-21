import React from "react";
import "./Timeline.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";
import axios from "../../axios";
import moment from "moment";
import CalculateTime from "../../components/calculateTime/CalculateTime";

function Timeline() {
  const folder = "http://localhost:5000/images/";

  const { authToken } = useContext(Context);
  const [timeline, setTimeline] = useState();

  useEffect(() => {
    const getTimeline = async () => {
      try {
        const res = await axios.get("/timeline", {
          headers: { authorization: authToken },
        });
        console.log("res", res.data);

        setTimeline(res.data);
      } catch (err) {}
    };

    getTimeline();
  }, []);

  return (
    <>
      <Topbar />
      <div className="TimelineContainer">
        <Sidebar />
        <div className="flex">
          <div className="tlContainer">
            <div className="tlWrapper">
              <h1> A day in my 'sleepy' life 😅</h1>
              <ul className="sessions">
                {timeline &&
                  timeline.map((tl, index) => (
                    <>
                      <ComponentContainer>
                        <img
                          src={folder + tl.from.profilePic}
                          referrerPolicy="no-referrer"
                        />
                        <ContentContainer>
                          <Content>
                            <div className="time">
                              <b>{tl.from.name}</b>
                              <small style={{ marginLeft: "10px" }}>
                                <CalculateTime
                                  current={new Date(moment().format())}
                                  previous={
                                    new Date(moment(tl.createdAt).format())
                                  }
                                />{" "}
                              </small>
                            </div>
                            <p>How is it already 9:00? Just how??? 🤯🤯</p>
                          </Content>
                          {tl.post ? (
                            <img src={folder + tl.post.photo} />
                          ) : (
                            <img src={folder + tl.comment.post.photo} />
                          )}
                        </ContentContainer>
                      </ComponentContainer>
                      {timeline.length !== index + 1 && <VL />}
                    </>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Timeline;

const ComponentContainer = styled.div`
  display: flex;
  margin-bottom: -20px;
  margin-left: 40px;

  img {
    border-radius: 50%;
    object-fit: cover;
    width: 50px;
    height: 50px;
  }
`;

const ContentContainer = styled.div`
  margin-left: 30px;
  width: 100%;
  display: flex;
  justify-content: space-around;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  img {
    border-radius: 5%;
    flex: 3;
    width: 50px;
    height: 50px;
    object-fit: contain;
    justify-content: flex-start;
  }
`;

const Content = styled.div`
  flex: 5;
`;

const VL = styled.div`
  border-left: 1px dashed black;
  margin-left: 62px;
  height: 5vh;
`;
