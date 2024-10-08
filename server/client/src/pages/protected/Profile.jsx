import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import { FiEdit, FiLink, FiMail, FiPhone } from "react-icons/fi";

export default function Profile() {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

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

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 pt-8">
      {profile && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start">
              <img
                src={profile.profilePicture || "https://via.placeholder.com/150"}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 sm:mb-0 sm:mr-8"
              />
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
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <FiMail className="mr-2" /> {profile.email}
                  </p>
                  <p className="flex items-center">
                    <FiPhone className="mr-2" /> {profile.phoneNumber}
                  </p>
                  {profile.website && (
                    <p className="flex items-center">
                      <FiLink className="mr-2" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {profile.website}
                      </a>
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
                name="website"
                value={editedProfile.website || ""}
                onChange={handleInputChange}
                placeholder="Website"
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