import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BACKEND_URL,
  CLOUD_NAME,
  UPLOAD_PRESET,
} from "../../constants/constants";
import { getAuthToken } from "../../utils/utils";

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    password: "",
    confirmPassword: "",
    coverImg: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const uploadImageToCloudinary = async (image) => {
    const fileData = new FormData();
    fileData.append("file", image);
    fileData.append("upload_preset", UPLOAD_PRESET);
    fileData.append("cloud_name", CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: fileData,
      }
    );

    const data = await res.json();
    return data.url; // Return the URL of the uploaded image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name || !formData.password || !formData.confirmPassword) {
      setError("Please provide a name and password.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      let coverImgUrl = null;

      if (formData.coverImg) {
        setUploadingImage(true);
        coverImgUrl = await uploadImageToCloudinary(formData.coverImg);
        setUploadingImage(false);
      }

      const finalFormData = {
        name: formData.name,
        description: formData.description,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        coverImg: coverImgUrl,
      };

      const response = await fetch(`${BACKEND_URL}/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`, // Add auth token
        },
        body: JSON.stringify(finalFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Something went wrong");
        setLoading(false);
        return;
      }

      // On successful group creation, redirect to the group details page
      navigate(`/groups/group/${result._id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      setError("Internal server error");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 mb-10">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Create Group
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="Enter group description"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Cover Image (optional)
            </label>
            <input
              type="file"
              name="coverImg"
              accept="image/*"
              onChange={handleChange}
              className="file-input file-input-bordered w-full"
            />
            {uploadingImage && (
              <p className="text-blue-500 text-center mt-2">
                Uploading image...
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn w-full app-primary-btn"
              disabled={loading || uploadingImage}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
