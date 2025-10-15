// AvatarModal.jsx
import React, { useRef, useState, useCallback } from "react";
import axios from "axios";
import close from "../../assets/close-icon.png";
import avatarPlaceholder from "../../assets/avatar.png";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../utils/api";

const AvatarModal = ({ onClose, profileRef, avatar, onAvatarChange }) => {
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preview, setPreview] = useState(avatar);
  const [loading, setLoading] = useState(false);

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadCroppedImage = async () => {
    try {
      setLoading(true);

      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("avatar", croppedBlob, "avatar.png");

      const token = sessionStorage.getItem("authToken");

      const response = await axios.put(
        `${API_BASE_URL}/api/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Use the URL returned from backend
      const updatedAvatarUrl = response.data.avatar;
      setPreview(updatedAvatarUrl);

      if (onAvatarChange) onAvatarChange(updatedAvatarUrl);

      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCancel = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleRemove = async () => {
    try {
      setLoading(true);

      // Fetch the default avatar as a blob
      const response = await fetch(avatarPlaceholder);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("avatar", blob, "avatar.png");

      const token = sessionStorage.getItem("authToken");

      const res = await axios.put(
        `${API_BASE_URL}/api/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedAvatarUrl = res.data.avatar || avatarPlaceholder;
      setPreview(updatedAvatarUrl);

      if (onAvatarChange) onAvatarChange(updatedAvatarUrl);
    } catch (err) {
      console.error("Failed to remove avatar:", err);
      toast.error("Failed to remove avatar");
    } finally {
      setLoading(false);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  return (
    <div
      ref={profileRef}
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100]"
    >
      <div className="bg-white p-4 rounded-lg w-full max-w-[350px] relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Update Avatar</h2>
          <div
            onClick={onClose}
            className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer"
          >
            <img src={close} className="w-4" alt="" />
          </div>
        </div>

        {/* Cropper / Preview */}
        <div className="flex flex-col items-center mt-5 mb-6">
          {imageSrc ? (
            <div className="relative w-48 h-48 overflow-hidden rounded-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="square"
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : (
            <img
              className="rounded-full w-40 h-40 object-cover border"
              src={preview}
              alt=""
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          {!imageSrc && (
            <>
              <button
                onClick={handleFileClick}
                className="w-28 text-sm font-medium border rounded-full py-1.5 cursor-pointer"
              >
                Change
              </button>
              <button
                onClick={handleRemove}
                disabled={loading}
                className="w-28 h-8.5 text-sm text-white bg-black rounded-full py-2 flex justify-center items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Remove"
                )}
              </button>
            </>
          )}

          {imageSrc && (
            <>
              <button
                onClick={handleCancel}
                className="w-28 text-sm font-medium border rounded-full py-1.5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={uploadCroppedImage}
                disabled={loading}
                className="w-28 h-8.5 text-sm text-white bg-black rounded-full py-2 flex justify-center items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Save"
                )}
              </button>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
