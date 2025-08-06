import React from "react";
import { MdOutlineNoteAlt } from "react-icons/md";

const EmptyCard = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <MdOutlineNoteAlt className="text-6xl mb-4 text-blue-300" />
      <p className="text-lg font-semibold mb-2">{message}</p>
      <p className="text-sm">
        Start by adding a new note using the + button below!
      </p>
    </div>
  );
};

export default EmptyCard;
