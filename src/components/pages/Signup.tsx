import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// You would probably split this out, but for clarity:
const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  isPassword = false,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
        {label}
      </label>
      <input
        type={isPassword && showPassword ? "text" : type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
        required
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-9 right-4 text-gray-600 hover:text-gray-800"
          tabIndex={-1}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    departmentOrSector: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.departmentOrSector || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Demo: simulate backend registration
    setTimeout(() => {
      setSuccess("Registration successful!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        departmentOrSector: "",
        password: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
          Register New User
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <div>
              <label htmlFor="departmentOrSector" className="block text-gray-700 font-medium mb-1">
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
              isPassword={true}
            />
            <InputField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              isPassword={true}
            />
            <div className="flex items-start space-x-2 text-sm text-gray-700">
              <input type="checkbox" id="terms" required className="mt-1 accent-teal-600" />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="underline text-teal-600 hover:text-teal-800 transition">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 mt-4 space-y-5">
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition shadow-md"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition shadow-md"
            >
              Back to Admin Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;