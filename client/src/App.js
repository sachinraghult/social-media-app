import React, { useContext } from "react";
import { Context } from "./context/Context";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Timeline from "./pages/timeline/Timeline";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import SinglePost from "./pages/singlePost/SinglePost";
import ConfirmDelete from "./pages/confirmDelete/ConfirmDelete";
import Friends from "./pages/friends/Friends";
import UserProfile from "./pages/userProfile/UserProfile";
import UserFriends from "./pages/userFriends/UserFriends";
import Reels from "./pages/reels/Reels";
import Grid from "./pages/grid/Grid";
import Bookmark from "./pages/bookmarks/Bookmarks";
import Sugessions from "./pages/suggestions/Suggestions";
import ViewStatus from "./pages/viewStatus/ViewStatus";
import MyStatus from "./pages/myStatus/MyStatus";

function App() {
  const { user, authToken } = useContext(Context);

  const CheckUser = () => {
    let { id } = useParams();
    if (id === user._id.toString()) return <Profile />;
    else return <UserProfile />;
  };

  const CheckUserFriends = () => {
    let { id } = useParams();
    if (id === user._id.toString()) return <Friends />;
    else return <UserFriends />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/timeline" element={user ? <Timeline /> : <Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/settings" element={user ? <Settings /> : <Login />} />
        <Route path="/friends" element={user ? <Friends /> : <Login />} />
        <Route path="/user/:id" element={user ? <CheckUser /> : <Login />} />
        <Route
          path="/confirmDelete"
          element={user ? <ConfirmDelete /> : <Login />}
        />
        <Route
          path="/post/:id/:type"
          element={user ? <SinglePost /> : <Login />}
        />
        <Route
          path="/userfriends/:id"
          element={user ? <CheckUserFriends /> : <Login />}
        />

        <Route path="/reels" element={user ? <Reels /> : <Login />} />
        <Route path="/grid" element={user ? <Grid /> : <Login />} />
        <Route path="/bookmarks" element={user ? <Bookmark /> : <Login />} />
        <Route
          path="/suggestions"
          element={user ? <Sugessions /> : <Login />}
        />
        <Route
          path="/viewStatus/:id"
          element={user ? <ViewStatus /> : <Login />}
        />
        <Route path="/status" element={user ? <MyStatus /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
