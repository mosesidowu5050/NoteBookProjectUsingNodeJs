import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br from-blue-500 via-green-400 to-blue-400 shadow-lg border-2 border-white transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer select-none"
        title={userInfo?.fullName}
      >
        {getInitials(userInfo?.fullName)}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {userInfo?.fullName}
        </p>
        {userInfo && (
          <button
            className="text-xs text-blue-500 underline hover:text-blue-700 transition-colors"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
