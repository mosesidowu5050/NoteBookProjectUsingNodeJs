import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline, MdOutlinePushPin } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);

 
  let accentColor = "after:bg-green-400";
  let borderColor = "border-green-400";
  let icon = <LuCheck className="text-2xl text-green-500" />;
  if (type === "delete") {
    accentColor = "after:bg-red-400";
    borderColor = "border-red-400";
    icon = <MdDeleteOutline className="text-2xl text-red-400" />;
  } else if (type === "pin") {
    accentColor = "after:bg-blue-400";
    borderColor = "border-blue-400";
    icon = <MdOutlinePushPin className="text-2xl text-blue-500" />;
  }

  return (
    <div
      className={`absolute top-20 right-6 transition-all duration-400 z-50 ${
        isShown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`min-w-52 bg-white border rounded-md shadow-2xl flex items-center after:w-[5px] after:h-full ${accentColor} after:absolute after:left-0 after:top-0 after:rounded-l-lg relative`}
      >
        <div className="flex items-center gap-3 py-2 px-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 ${borderColor}`}
          >
            {icon}
          </div>
          <p className="text-sm text-slate-800 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
