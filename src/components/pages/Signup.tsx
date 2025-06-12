import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
// @ts-ignore
import { registerUser } from "../../services/api";
import DepartmentSelector from "./DepartmentSelector";

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
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-semibold text-indigo-900"
      >
        {label}
      </label>
      <input
        type={isPassword && showPassword ? "text" : type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-md border border-blue-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 text-indigo-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition"
        required
        autoComplete="off"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-8 right-4 text-indigo-400 hover:text-indigo-700"
          tabIndex={-1}
        >
          {showPassword ? (
            <MdVisibilityOff size={22} />
          ) : (
            <MdVisibility size={22} />
          )}
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.departmentOrSector.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        departmentOrSector: formData.departmentOrSector,
        password: formData.password,
      });
      setSuccess("Registration successful!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        departmentOrSector: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(
        "Registration failed: " +
          (err.response?.data?.error ||
            err.response?.data?.message ||
            err.message)
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-400 via-blue-400 to-teal-300">
      <div className="w-full max-w-4xl bg-gradient-to-br from-teal-50 via-blue-100 to-indigo-100/90 rounded-2xl shadow-2xl border border-blue-200 p-10">
        <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-2 tracking-tight">
          Create Your Account
        </h2>
        <p className="text-center text-base text-indigo-800 mb-6">
          Welcome! Fill in your details to join the platform.
        </p>
        {(error || success) && (
          <div
            className={`mx-auto mb-4 w-full max-w-md px-4 py-2 rounded text-center text-sm font-medium border ${
              error
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {error || success}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
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
          {/* DepartmentSelector occupies one column and two rows to align with your layout */}
          <div className="w-full md:col-span-1 md:row-span-2 flex flex-col">
            <DepartmentSelector
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, departmentOrSector: val }))
              }
            />
          </div>
          {/* Password and Confirm Password side-by-side under DepartmentSelector on desktop */}
          <div className="w-full md:col-span-1 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <InputField
                label="Password"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                isPassword={true}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                isPassword={true}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex items-center space-x-2 text-xs text-indigo-900 mt-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="accent-indigo-600"
            />
            <label htmlFor="terms" className="select-none">
              I agree to the{" "}
              <a
                href="#"
                className="underline text-indigo-600 hover:text-teal-700 transition"
              >
                Terms and Conditions
              </a>
            </label>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-teal-600 transition-all shadow-md"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="w-full py-3 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-100 shadow transition border border-indigo-200"
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
