import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FiEdit, FiMail, FiPhone, FiCamera } from "react-icons/fi";
import useUserStore from "../../store/userStore";
import SkeletonProfile from "../../components/SkeletonProfile"; // We'll create this component
import { useToast } from "@chakra-ui/react";

export default function Profile() {
  const { profile, loading, error, fetchProfile, updateProfile } = useUserStore();
  const { removeToken } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    removeToken();
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        const updatedProfile = await updateProfile({ ...editedProfile, profilePicture: file });
        setEditedProfile(updatedProfile);
        toast({
          title: "Profile picture updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error updating profile picture:', error);
        toast({
          title: "Failed to update profile picture",
          description: error.message || "An unexpected error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 pt-8">
      {loading ? (
        <SkeletonProfile />
      ) : profile && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start">
              <div className="relative">
                <img
                  src={editedProfile.profilePicture || profile.profilePicture || "https://via.placeholder.com/150"}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 sm:mb-0 sm:mr-8"
                />
                <button
                  onClick={handleProfilePictureClick}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition duration-300"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiCamera size={16} />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="text-center sm:text-left flex-grow">
                <h1 className="text-3xl font-bold">{`${profile.firstName} ${profile.lastName}`}</h1>
                <p className="text-gray-600 mb-2">@{profile.username}</p>
                <p className="text-gray-700 mb-4">{profile.bio || "No bio available"}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    <FiEdit className="inline mr-2" /> Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <FiMail className="mr-2" /> {profile.email}
                  </p>
                  {profile.phoneNumber && (
                    <p className="flex items-center">
                      <FiPhone className="mr-2" /> {profile.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="firstName"
                value={editedProfile.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="lastName"
                value={editedProfile.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="bio"
                value={editedProfile.bio || ""}
                onChange={handleInputChange}
                placeholder="Bio"
                className="w-full p-2 border rounded"
              ></textarea>
              <input
                type="text"
                name="phoneNumber"
                value={editedProfile.phoneNumber || ""}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
