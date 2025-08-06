import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Modal from "react-modal";

Modal.setAppElement("#root");

const routes = (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signUp" exact element={<SignUp />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Router>
);
const App = () => {
  return <div>{routes}</div>;
};

export default App;
