import React, { useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import StatusSettings from "../../components/statusSettings/StatusSettings";
import Rightbar from "../../components/rightbar/Rightbar";
import StatusShare from "../../components/statusShare/StatusShare";
import "./MyStatus.css";
import axios from "../../axios";
import { Context } from "../../context/Context";
import { useState } from "react";
import { useEffect } from "react";

export default function MyStatus() {
  const { user, authToken } = useContext(Context);

  const [status, setStatus] = useState();

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await axios.get("/status/user/" + user._id, {
          headers: { authorization: authToken },
        });

        setStatus(res.data);
      } catch (err) {}
    };

    getStatus();
  }, []);

  const sendStatusState = (response) => {
      if(response)
        setStatus({ ...response });
      else
        setStatus(response);
  };

  return (
    <>
      <Topbar />
      <div className="myStatusContainer">
        <Sidebar />
        <div className="myStatus">
          <div className="myStatusShare">
            <StatusShare receivedStatusState={sendStatusState} />
          </div>

          <div className="myStatusPeopleDiv">
            <StatusSettings
              status={status}
              receivedStatusState={sendStatusState}
            />
          </div>
        </div>
        <Rightbar />
      </div>
    </>
  );
}
