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
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-[360px] bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-teal-700 text-center mb-6">
          Log In to Your Account
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-gray-800 text-[15px]"
              placeholder="amanuelabateh@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-[15px]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors duration-200 text-[15px] mt-4"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-[15px]"
          >
            Back to Home
          </button>

          <div className="text-center space-y-4 pt-2">
            <div>
              <span className="text-gray-600 text-sm">Don't have an account? </span>
              <a
                href="/signup"
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                Sign up
              </a>
            </div>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Forgot Password?
            </button>
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
