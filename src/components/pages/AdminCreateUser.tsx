import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import DepartmentSelector from "./DepartmentSelector";
import { useLanguage } from "./LanguageContext";

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    departmentOrSector: "",
    role: "user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("user");
  const [departmentSelection, setDepartmentSelection] = useState({ main: '', sub: '', subSub: '', fullPath: '', role: 'user' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDepartmentChange = (selection: { main: string; sub: string; subSub: string; fullPath: string; role: string }) => {
    setDepartmentSelection(selection);
    setFormData((prev) => ({ ...prev, departmentOrSector: selection.fullPath }));
    if (selection.role) setSelectedRole(selection.role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.departmentOrSector.trim()
    ) {
      setError(t.signup?.fillAllFields || "Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    // Enforce: if sub-category is selected, sub-sub-category must be selected
    if (departmentSelection.sub && !departmentSelection.subSub) {
      setError("If a sub-category is selected, you must also select a sub-sub-category.");
      setIsSubmitting(false);
      return;
    }
    // Enforce: role must be selected
    if (!departmentSelection.role || departmentSelection.role === "") {
      setError("Please select a role for the user.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/admin/create-user",
        { ...formData, role: selectedRole }
      );
      setSuccess(
        t.signup?.registrationSuccessful ||
          `User created successfully! A welcome email with temporary password has been sent to ${formData.email}`
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        departmentOrSector: "",
        role: "user",
      });
      setSelectedRole("user");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        t.signup?.registrationFailed ||
        "Failed to create user. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="mb-4 px-6 py-2 rounded-full bg-[#f5e8d6] text-[#b97b2a] border border-[#b97b2a] text-sm font-semibold shadow-sm hover:bg-[#b97b2a] hover:text-white transition-colors duration-150 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            {t.sidebar?.adminPanel || "Back to Admin Panel"}
          </button>
          <div className="flex items-center gap-3 mb-2">
            <UserPlus className="w-8 h-8 text-teal-700" />
            <h1 className="text-3xl font-bold text-gray-800">
              {t.signup?.signUpButton || "Create New User"}
            </h1>
          </div>
          <p className="text-gray-600">
            {t.signup?.subtitle || "Create a new user account. They will receive a welcome email with temporary login credentials."}
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.signup?.fullNameLabel || "Full Name"} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.signup?.fullNamePlaceholder || "Enter full name"}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.signup?.emailLabel || "Email Address"} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.signup?.emailPlaceholder || "Enter email address"}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Phone and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.signup?.phoneNumberLabel || "Phone Number"} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.signup?.phoneNumberPlaceholder || "Enter phone number"}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.sent?.departmentLabel || "Department/Sector"} *
                </label>
                <DepartmentSelector
                  onChange={handleDepartmentChange}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">
                {"What happens next?"}
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• User account will be created with a temporary password</li>
                <li>• Welcome email will be sent with login credentials</li>
                <li>• User must change password on first login</li>
                <li>• User can immediately access the system</li>
              </ul>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (t.signup?.signUpButton || "Create User") + "..." : t.signup?.signUpButton || "Create User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUser; 