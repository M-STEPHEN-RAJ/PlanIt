import React from "react";
import close from "../../assets/close-icon.png";

const TermsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg w-full max-w-[700px] max-h-[80vh] relative flex flex-col">

        {/* Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white pb-3 z-10">
          <h2 className="text-lg font-semibold">Terms & Conditions</h2>
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
            By accessing and using this project, you agree to the following terms:
          </p>

          <div className="space-y-1">
            <h2 className="font-medium">Usage</h2>
            <ul className="list-decimal text-sm pl-5">
              <li>You may use this project for learning, personal, or organizational purposes.</li>
              <li>You agree not to misuse the platform, attempt to hack it, or disrupt its functionality.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">User Responsibilities</h2>
            <ul className="list-decimal text-sm pl-5">
              <li>Provide accurate information when creating or managing data.</li>
              <li>Avoid uploading or sharing sensitive or unlawful content.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">Intellectual Property</h2>
            <ul className="list-decimal text-sm pl-5">
              <li>All code, design, and materials related to this project are the intellectual property of the project owner.</li>
              <li>You may not reproduce or distribute substantial parts of the project without permission.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">Limitation of Liability</h2>
            <ul className="list-decimal text-sm pl-5">
              <li>This project is provided “as is” without warranties of any kind.</li>
              <li>The project owner is not responsible for data loss, errors, downtime, or any damages resulting from the use of the application.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">Changes to Terms</h2>
            <p className="text-sm pl-2">
              We may update these Terms and the Privacy Policy from time to time. 
              Continued use of the project after updates indicates your acceptance of those changes.
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="font-medium">Contact</h2>
            <p className="text-sm pl-2">
              For any inquiries, please reach out to{" "}
              <span className="font-semibold">
                stephenrajm.ug22.ad@francisxavier.ac.in
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsModal;
