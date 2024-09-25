import { useState } from "react";
import { BACKEND_URL, CLOUD_NAME, UPLOAD_PRESET } from "../constants/constants";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function handleFileChange(e) {
    setProfileImage(e.target.files[0]);
  }

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
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      const result = await response.json();
      console.log(result);

      // Handle backend response
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
      }
      console.log("User registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        {uploadingImage && (
          <p className="text-center text-blue-500 mb-4">Uploading image...</p>
        )}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          disabled={uploadingImage}
        >
          Register
        </button>
      </form>
    </div>
  );
}
