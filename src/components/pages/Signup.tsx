import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    departmentOrSector: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.departmentOrSector
    ) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      setSuccess(response.data.message);
      setError("");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setSuccess("");
    }
  };

  const goHome = () => navigate("/");

  return (
    <div className="h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-indigo-500 flex items-center justify-center">
      <div
        className="w-full max-w-4xl bg-white p-10 rounded-3xl shadow-2xl border border-gray-200"
        style={{ height: "90%" }}
      >
        <h2 className="text-4xl font-bold text-center text-teal-700 mb-8">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded text-center mb-6">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 bg-green-100 p-3 rounded text-center mb-6">
            {success}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="space-y-5">
            <InputField
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
            <InputField
              label="Email Address"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            <InputField
              label="Phone Number"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
            />

            {/* Department or Sector Dropdown */}
            <div>
              <label
                htmlFor="departmentOrSector"
                className="block text-gray-700 font-medium mb-1"
              >
                Department or Sector
              </label>
              <select
                id="departmentOrSector"
                name="departmentOrSector"
                value={formData.departmentOrSector}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                required
              >
                <option value="">Select Department or Sector</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <InputField
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <InputField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />

            <div className="flex items-start space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 accent-teal-600"
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a
                  href="#"
                  className="underline text-teal-600 hover:text-teal-800 transition"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          {/* Buttons & Redirect */}
          <div className="col-span-1 md:col-span-2 mt-4 space-y-5">
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition shadow-md"
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={goHome}
              className="w-full py-2 bg-gray-100 text-teal-700 rounded-xl hover:bg-gray-200 transition border border-gray-300"
            >
              Back to Home
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="underline text-teal-600 hover:text-teal-800 transition"
              >
                Log in
              </a>
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

export default Signup;
