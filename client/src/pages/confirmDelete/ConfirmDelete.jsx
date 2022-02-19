import axios from "../../axios";
import "./ConfirmDelete.css";
import React, { useContext } from "react";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { Context } from "../../context/Context";
import { Logout } from "../../context/Actions";
import { useNavigate } from "react-router-dom";

export default function ConfirmDelete() {
  const { user, dispatch, authToken } = useContext(Context);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete("/user", {
        headers: { authorization: authToken },
      });
      dispatch(Logout());
      navigate("/register", { replace: true });
    } catch (err) {}
  };

  return (
    <>
      <Topbar />
      <div className="confirmDelete">
        <Sidebar />
        <div className="confirmDeleteContainer1">
          <h3>
            On deleting your account, all posts, comments and interactions
            performed by you will be deleted.
            <br />
            <br />
            <h5>
              <i>Once the account is deleted, it cannot be retreived.</i>
            </h5>
          </h3>
          <button className="confirmSubmit" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <div className="confirmDeleteContainer2"></div>
        <Rightbar profile />
      </div>
    </>
  );
}
