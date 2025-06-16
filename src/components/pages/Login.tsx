import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Both fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );
      console.log("Login successful:", response.data);
      setError("");
      // Save userId and user object to localStorage
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // <-- Add this line
      onLogin();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const goHome = () => navigate("/");

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div
        className="w-full max-w-4xl bg-white p-10 rounded-3xl shadow-2xl border border-gray-200"
        style={{ height: "90%" }}
      >
        <h2 className="text-4xl font-bold text-center text-teal-700 mb-8">
          Log In to Your Account
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded text-center mb-6">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <InputField
            label="Email Address"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />

          <InputField
            label="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          {/* Buttons & Redirect */}
          <div className="mt-6 space-y-5">
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition shadow-md"
            >
              Log In
            </button>

            <button
              type="button"
              onClick={goHome}
              className="w-full py-2 bg-gray-100 text-teal-700 rounded-xl hover:bg-gray-200 transition border border-gray-300"
            >
              Back to Home
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="underline text-teal-600 hover:text-teal-800 transition"
              >
                Sign up
              </a>
            </p>

            <p className="text-center text-gray-600 text-sm mt-2">
              <button
                type="button"
                className="underline text-blue-600 hover:text-blue-800 transition"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
      placeholder={placeholder}
      required
    />
  </div>
);

export default Login;
