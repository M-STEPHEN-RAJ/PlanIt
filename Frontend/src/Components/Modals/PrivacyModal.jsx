import React from "react";
import close from "../../assets/close-icon.png";

const PrivacyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg w-full max-w-[700px] max-h-[80vh] relative flex flex-col">

        {/* Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white pb-3 z-10">
          <h2 className="text-lg font-semibold">Privacy Policy</h2>
          <div
            onClick={onClose}
            className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer"
          >
            <img src={close} className="w-4" alt="Close" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="mt-3 space-y-5 overflow-y-auto pr-2">
          <p className="font-medium">
            We respect your privacy and are committed to protecting your information while you use this project.
          </p>

          <div className="space-y-1">
            <h2 className="font-medium">Information We Collect</h2>
            <ul className="list-decimal text-sm pl-5">
              <li>Basic details you provide such as name, email, or profile information.</li>
              <li>Project and task data that you create or manage within the application.</li>
              <li>Technical details (such as browser type or activity timestamps) that may be collected automatically to improve functionality.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">How We Use Information</h2>
            <ul className="list-decimal text-sm pl-5">
              <li>To provide access to the project’s features.</li>
              <li>To maintain and improve the overall user experience.</li>
              <li>To ensure smooth operation, debugging, and troubleshooting.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">Sharing of Information</h2>
            <ul className="list-decimal text-sm pl-5">
              <li>We do not sell, trade, or rent user information.</li>
              <li>Information may only be shared if required by law or to support essential project services (e.g., hosting providers).</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">Your Control</h2>
            <ul className="list-decimal text-sm pl-5">
              <li>You may edit or delete your data within the application.</li>
              <li>For removal of data or questions, you may contact the project administrator at <span className="font-semibold">stephenrajm.ug22.ad@francisxavier.ac.in</span></li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">Security</h2>
            <p className="text-sm pl-2">
              We use reasonable technical measures to protect data; however, no system is 100% secure. Use the application with this understanding.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
