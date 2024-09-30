import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { loading, login } = useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.password);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter your username"
              required
            />
          </div>

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

          <div className="text-center">
            <button
              type="submit"
              className="btn w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center mt-4">
          {"Don't"} have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Sign up
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
