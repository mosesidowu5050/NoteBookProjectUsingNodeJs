import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { validateEmail, validatePassword } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/Toast Message/Toast";

const SignUp = () => {
  const [name, setName] = useState("");
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      setShowToast(true);
      return;
    }
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
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      if (response.data && response.data.error) {
        setError(response.data.message);
        setShowToast(true);
        setLoading(false);
        return;
      }
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
              Create your account
            </h2>
            <p className="text-gray-500 text-sm">
              Sign up to start taking smart notes and organizing your ideas.
            </p>
          </div>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="signup-name" className="input-label">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                className="input-box focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="signup-email" className="input-label">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                className="input-box focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="signup-password" className="input-label">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                id="signup-password"
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="mx-2 text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            {/* Social auth placeholder */}
            {/* <button className="w-full flex items-center justify-center gap-2 border border-slate-300 rounded-md py-2 text-sm hover:bg-slate-50 transition">
              <FaGoogle className="text-lg" /> Sign up with Google
            </button> */}
            <p className="text-xs text-center mt-2 text-gray-500">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:underline font-medium"
              >
                Login here
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

export default SignUp;
