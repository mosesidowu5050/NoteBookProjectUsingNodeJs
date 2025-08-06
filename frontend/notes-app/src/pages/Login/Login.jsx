import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validateEmail, validatePassword } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/Toast Message/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email, please enter a valid email");
      setShowToast(true);
      return;
    }
    if (!validatePassword(password)) {
      setError("Invalid password, please enter a valid password");
      setShowToast(true);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        setShowToast(true);
      } else {
        setError("An unexpected error occurred. Please try again.");
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[80vh] px-2">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md flex flex-col gap-2">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-500 text-sm">
              Login to access your notes and ideas.
            </p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="login-email" className="input-label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                className="input-box focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="login-password" className="input-label">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                id="login-password"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs text-center -mt-2">{error}</p>
            )}
            <button
              type="submit"
              className={`btn-primary font-semibold mt-2 transition-all duration-200 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="mx-2 text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            {/* Social auth placeholder */}
            {/* <button className="w-full flex items-center justify-center gap-2 border border-slate-300 rounded-md py-2 text-sm hover:bg-slate-50 transition">
              <FaGoogle className="text-lg" /> Login with Google
            </button> */}
            <p className="text-xs text-center mt-2 text-gray-500">
              Not registered yet?{" "}
              <Link
                to="/signUp"
                className="text-blue-500 hover:underline font-medium"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Toast
        isShown={showToast && !!error}
        message={error}
        type="delete"
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default Login;
