import React from "react";
import close from "../../assets/close-icon.png";

const DeleteModal = ({ isOpen, onClose, message, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white space-y-4 p-5 rounded-lg w-full max-w-[350px] relative shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Confirm Delete</h2>
          <div
            onClick={onClose}
            className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer"
          >
            <img src={close} className="w-4" alt="Close" />
          </div>
        </div>

        <p className="text-center text-gray-700 mb-5">{message}</p>

        <div className="flex justify-center gap-5">
          <button
            onClick={onClose}
            className="px-4 py-1 border border-gray-300 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
