import React, { useState } from "react";
import ProfileInfo from "../cards/ProfileInfo";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { FaRegStickyNote } from "react-icons/fa";

const Navbar = ({ userInfo, searchNote, handleClearSearch }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");
  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signUp";

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (search) {
      searchNote(search);
    }
  };

  const onClearSearch = () => {
    setSearch("");
    handleClearSearch();
  };

  return (
    <nav className="backdrop-blur-md bg-white/70 bg-gradient-to-r from-blue-50/80 to-green-50/80 shadow-lg rounded-xl mx-2 sm:mx-4 mt-4 mb-6 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 border border-slate-100">
      <div
        className="flex items-center gap-3 cursor-pointer select-none transition-transform hover:scale-105"
        onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
      >
        <FaRegStickyNote className="text-3xl text-blue-500 drop-shadow-sm" />
        <span className="text-2xl font-extrabold text-gray-800 tracking-tight logo-text hover:text-green-600 transition-colors duration-200">
          NoteNest
        </span>
      </div>
      {isAuthenticated && !isLoginPage && !isSignUpPage && (
        <div className="flex-1 flex justify-center w-full sm:w-auto">
          <SearchBar
            value={search}
            onChange={({ target }) => setSearch(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>
      )}
      {isAuthenticated && !isLoginPage && !isSignUpPage && (
        <div className="flex items-center gap-4">
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
