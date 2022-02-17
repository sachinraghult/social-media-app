import { BrowserRouter, Routes, Route } from "react-router-dom";
import Timeline from "./pages/timeline/Timeline";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import SinglePost from "./pages/singlePost/SinglePost";
import React, { useContext } from "react";
import { Context } from "./context/Context";

function App() {

  const {user, authToken} = useContext(Context)
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/timeline" element={user ? <Timeline /> : <Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/settings" element={user ? <Settings /> : <Login />} />
        <Route path="/post/:id" element={user ? <SinglePost /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
