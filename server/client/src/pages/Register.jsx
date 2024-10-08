import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CLOUD_NAME, UPLOAD_PRESET } from "../constants/constants";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      let profileImageUrl = null;

      if (profileImage) {
        setUploadingImage(true);

        const fileData = new FormData();
        fileData.append("file", profileImage);
        fileData.append("cloud_name", CLOUD_NAME);
        fileData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/victormugisha/image/upload",
          {
            method: "POST",
            body: fileData,
          }
        );

        const data = await res.json();
        profileImageUrl = data.url;

        setUploadingImage(false);
      }

      // Prepare form data for submission
      const finalFormData = {
        ...formData,
        profilePicture: profileImageUrl,
      };

      // Submit form data to backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
      }

      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        {errorMessage && (
          <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Choose a username"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password */}
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
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Profile Picture */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Profile Picture (optional)
            </label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
            {uploadingImage && (
              <p className="text-blue-500 text-center mt-2">
                Uploading image...
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={uploadingImage}
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </p>

        <p className="text-center mt-4">
          Go back to{" "}
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
