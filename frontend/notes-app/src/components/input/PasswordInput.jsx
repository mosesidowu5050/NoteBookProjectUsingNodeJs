import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { label: "", color: "", score: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-400", score };
    if (score === 2 || score === 3)
      return { label: "Medium", color: "bg-yellow-400", score };
    if (score >= 4) return { label: "Strong", color: "bg-green-500", score };
    return { label: "", color: "", score };
  };

  return (
    <div className="w-full">
      <div className="relative mb-2">
        <input
          value={value}
          onChange={onChange}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || "Password"}
          className="w-full text-sm bg-transparent px-4 py-3 pr-10 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
          onClick={togglePassword}
        >
          {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
        </span>
      </div>
      {/* Password strength meter */}
      {value && (
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`h-2 w-20 rounded ${getPasswordStrength(value).color}`}
          ></div>
          <span
            className={`text-xs font-medium ${getPasswordStrength(
              value
            ).color.replace("bg", "text")}`}
          >
            {getPasswordStrength(value).label}
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
