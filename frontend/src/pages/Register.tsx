import { useState } from "react";

interface FomFieldsDara {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
}
export default function Register() {
  const [formData, setFormData] = useState<FomFieldsDara>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState<FomFieldsDara>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: "",
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.firstName) {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        firstName: "First name is required",
      }));
    }

    if (!formData.lastName) {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        lastName: "Last name is required",
      }));
    }

    if (!formData.username) {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        username: "Username is required",
      }));
    }

    if (!formData.email) {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        email: "Email is required",
      }));
    }

    if (!formData.phoneNumber) {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        phoneNumber: "Phone number is required",
      }));
    }
  }

  return (
    <main className="w-full px-6 mt-5 flex flex-col items-center">
      <h1 className="text-3xl font-semibold pt-4 pb-9">Register</h1>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="h-11 w-full px-3 text-lg outline-none border-2 focus:border-2 rounded-lg focus:border-gray-300 transition-all"
            value={formData.firstName}
            onChange={handleChange}
          />
          {formErrors.firstName && (
            <span className="text-sm italic text-red-400 px-3 w-full font-semibold">
              {formErrors.firstName}
            </span>
          )}
        </div>

        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="h-11 w-full px-3 text-lg outline-none border-2 focus:border-2 rounded-lg focus:border-gray-300 transition-all"
            value={formData.lastName}
            onChange={handleChange}
          />
          {formErrors.lastName && (
            <span className="text-sm italic text-red-400 px-3 w-full font-semibold">
              {formErrors.lastName}
            </span>
          )}
        </div>

        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="h-11 w-full px-3 text-lg outline-none border-2 focus:border-2 rounded-lg focus:border-gray-300 transition-all"
            value={formData.username}
            onChange={handleChange}
          />
          {formErrors.username && (
            <span className="text-sm italic text-red-400 px-3 w-full font-semibold">
              {formErrors.username}
            </span>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="h-11 w-full px-3 text-lg outline-none border-2 focus:border-2 rounded-lg focus:border-gray-300 transition-all"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <span className="text-sm italic text-red-400 px-3 w-full font-semibold">
              {formErrors.email}
            </span>
          )}
        </div>

        <div>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className="h-11 w-full px-3 text-lg outline-none border-2 focus:border-2 rounded-lg focus:border-gray-300 transition-all"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {formErrors.phoneNumber && (
            <span className="text-sm italic text-red-400 px-3 w-full font-semibold">
              {formErrors.phoneNumber}
            </span>
          )}
        </div>

        <button className="btn btn-success text-white  text-xl">Send</button>
      </form>
    </main>
  );
}
