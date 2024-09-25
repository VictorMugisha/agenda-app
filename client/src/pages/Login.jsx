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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(formData.username, formData.password);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Processing..." : "Login"}
        </button>
      </form>

      <p className="text-center mt-4">
        {"Don't"} have an account?{" "}
        <Link to="/register" className="text-blue-500 hover:text-blue-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}
