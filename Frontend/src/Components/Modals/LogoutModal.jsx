import React from "react";
import close from "../../assets/close-icon.png";

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
      <div className="bg-white space-y-8 p-6 rounded-lg w-full max-w-[300px] relative">

        <div
          onClick={() => onCancel()}
          className="absolute top-3 right-3 w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer">
            <img src={close} className="w-4" alt="" />
        </div>

        <div className="flex flex-col justify-center items-center gap-1">
          <h2 className="text-lg font-semibold">Confirm Logout</h2>
          <p className="text-gray-600 text-sm">
            Are you sure you want to log out?
          </p>
        </div>

        <div className="flex justify-center items-center gap-5">
          <button
            onClick={onCancel}
            className="font-medium border border-gray-300 w-20 py-1 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCancel();
              onConfirm();
            }}
            className="text-white bg-black w-20 py-1 rounded-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
