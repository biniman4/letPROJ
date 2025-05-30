import React, { useState, useEffect } from "react";
import { SettingsIcon, Bell, Moon, Sun, Mail, User } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  departmentOrSector?: string;
}

const Settings = () => {
  const { unreadNotifications } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileDepartment, setProfileDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData._id) {
      setProfileName(userData.name || "");
      setProfileEmail(userData.email || "");
      setProfilePhone(userData.phone || "");
      setProfileDepartment(userData.departmentOrSector || "");
    }
  }, []);

  const handleEmailNotificationsToggle = () => {
    setEmailNotifications(!emailNotifications);
    // Add email notification logic here
  };

  const handleNotificationSoundToggle = () => {
    setNotificationSound(!notificationSound);
    // Add notification sound logic here
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await axios.put(
        `http://localhost:5000/api/users/${userData._id}`,
        {
          name: profileName,
          email: profileEmail,
          phone: profilePhone,
          departmentOrSector: profileDepartment,
        }
      );

      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(response.data));

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="mb-6">
        <h2
          className={`text-2xl font-semibold ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Settings
        </h2>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          Configure your application preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div
          className={`rounded-lg border p-6 transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <User
              className={`h-6 w-6 ${
                theme === "dark" ? "text-blue-400" : "text-gray-600"
              }`}
            />
            <h3
              className={`text-lg font-medium ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Profile Settings
            </h3>
          </div>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.type === "success"
                  ? theme === "dark"
                    ? "bg-green-900 text-green-200"
                    : "bg-green-50 text-green-700"
                  : theme === "dark"
                  ? "bg-red-900 text-red-200"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "border-gray-300"
                }`}
                required
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "border-gray-300"
                }`}
                required
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Phone
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Department/Sector
              </label>
              <input
                type="text"
                value={profileDepartment}
                onChange={(e) => setProfileDepartment(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "border-gray-300"
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        <div
          className={`rounded-lg border p-6 transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Bell
              className={`h-6 w-6 ${
                theme === "dark" ? "text-blue-400" : "text-gray-600"
              }`}
            />
            <h3
              className={`text-lg font-medium ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Notification Settings
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Email Notifications
                </h4>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Receive notifications via email
                </p>
              </div>
              <button
                onClick={handleEmailNotificationsToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  emailNotifications
                    ? theme === "dark"
                      ? "bg-blue-500"
                      : "bg-blue-600"
                    : theme === "dark"
                    ? "bg-gray-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Notification Sound
                </h4>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Play sound for new notifications
                </p>
              </div>
              <button
                onClick={handleNotificationSoundToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  notificationSound
                    ? theme === "dark"
                      ? "bg-blue-500"
                      : "bg-blue-600"
                    : theme === "dark"
                    ? "bg-gray-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    notificationSound ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div
          className={`rounded-lg border p-6 transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            {theme === "dark" ? (
              <Moon className="h-6 w-6 text-blue-400" />
            ) : (
              <Sun className="h-6 w-6 text-yellow-500" />
            )}
            <h3
              className={`text-lg font-medium ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Theme Settings
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Dark Mode
              </h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Switch between light and dark theme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                theme === "dark" ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
