import React, { useState } from "react";
import { useAuthStore } from "../Store/AuthStore";
import { toast } from "react-hot-toast";
import { Camera, Loader2 } from "lucide-react";

const Profile = () => {
  const { UpdateProfile, isUpdatingProfile } = useAuthStore();
  const [Bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!Bio) {
      toast.error("Bio is required.");
      return;
    }
    if (!profilePic) {
      toast.error("Profile Pic is required.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      UpdateProfile({ bio: Bio, profilePic: base64Image });
    };
    reader.readAsDataURL(profilePic);
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-8 bg-base-300 rounded-box shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Update Your Profile
        </h2>

        <div className="flex justify-center mb-6">
          <div className="relative avatar">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={previewUrl || "https://placehold.co/128x128"}
                alt="Profile Preview"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white cursor-pointer">
              <Camera
                onClick={() =>
                  document.getElementById("profilePicInput").click()
                }
                className="w-6 h-6"
              />
              <input
                id="profilePicInput"
                type="file"
                hidden
                onChange={handleProfilePicChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <textarea
          value={Bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write your bio..."
          className="textarea textarea-bordered w-full mb-4"
          rows="4"
        />

        <button
          onClick={handleSubmit}
          className="btn btn-ghost bg-red-400 w-full"
          disabled={isUpdatingProfile}
        >
          {isUpdatingProfile ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            "Update Profile"
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;
