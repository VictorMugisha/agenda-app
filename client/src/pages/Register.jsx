import { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function handleFileChange(e) {
    setProfileImage(e.target.files[0]);
  }

//   function saveImage(image) {
//     if (image) {
//       const fileData = new FormData();
//       fileData.append("file", image);
//       fileData.append("cloud_name", "victormugisha");
//       fileData.append("upload_preset", "agenda_app");

//       fetch("https://api.cloudinary.com/v1_1/victormugisha/image/upload", {
//         method: "post",
//         body: fileData,
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("Image uploaded: ", data);
//           setFormData((prevData) => ({
//             ...prevData,
//             profilePicture: data.url,
//           }));

//           console.log("Form Submitted:", formData);
//         })
//         .catch((err) => {
//           console.log("Error while uploading image: ", err);
//         });
//     }
//   }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (profileImage) {
        const fileData = new FormData();
        fileData.append("file", profileImage);
        fileData.append("cloud_name", "victormugisha");
        fileData.append("upload_preset", "agenda_app");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/victormugisha/image/upload",
          {
            method: "post",
            body: fileData,
          }
        );

        const data = await res.json();

        console.log("Image uploaded: ", data);
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: data.url,
        }));
      }
    } catch (error) {
      console.log("Error while uploading image: ", error);
    }

    // try {
    //   console.log("Form Data: ", formData);
    //   const response = await fetch("http://localhost:8000/auth/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   const data = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
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
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
