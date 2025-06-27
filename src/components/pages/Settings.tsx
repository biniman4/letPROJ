import React, { useState, useEffect, useRef } from "react";
import { SettingsIcon, Bell, Moon, Sun, Mail, User, Camera, Eye, EyeOff } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "./LanguageContext";
import axios from "axios";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  departmentOrSector?: string;
  profileImage?: string;
}

const Settings = () => {
  const { unreadNotifications } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    departmentOrSector: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  const [changePwd, setChangePwd] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [changePwdMsg, setChangePwdMsg] = useState({ type: '', text: '' });
  const [changePwdLoading, setChangePwdLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData._id) {
      setUserProfile(userData);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size should be less than 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUserProfile(prev => ({ ...prev, profileImage: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!userProfile.profileImage || !fileInputRef.current?.files?.[0]) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('profileImage', fileInputRef.current.files[0]);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${userProfile._id}/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Update user data in localStorage
      const updatedUser = { ...userProfile, profileImage: response.data.profileImage };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('userDataUpdated'));
      
      setMessage({ type: "success", text: "Profile picture updated successfully!" });
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to upload profile picture",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userProfile._id}`,
        {
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          departmentOrSector: userProfile.departmentOrSector,
        }
      );

      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(response.data));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('userDataUpdated'));

      setMessage({ type: "success", text: t.settings.profile.saveChanges });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || t.settings.profile.errorUpdating,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwdMsg({ type: '', text: '' });
    setChangePwdLoading(true);
    
    if (changePwd.newPassword !== changePwd.confirmNewPassword) {
      setChangePwdMsg({ type: 'error', text: 'New passwords do not match.' });
      setChangePwdLoading(false);
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/api/users/${userProfile._id}/change-password`, {
        currentPassword: changePwd.currentPassword,
        newPassword: changePwd.newPassword,
      });
      
      setChangePwdMsg({ type: 'success', text: 'Password changed successfully!' });
      setChangePwd({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error: any) {
      setChangePwdMsg({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    } finally {
      setChangePwdLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen py-8 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-[#FFFFFF] text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#b97b2a] via-[#cfae7b] to-[#cfc7b7] text-transparent bg-clip-text drop-shadow-md">
            {t.settings.title}
          </h2>
          <p
            className={`text-lg font-medium ${
              theme === "dark" ? "text-gray-400" : "text-[#BFBFBF]"
            }`}
          >
            {t.settings.profile.title}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div
            className={`rounded-lg border p-6 transition-colors duration-300 transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] ${
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
                {t.settings.profile.title}
              </h3>
            </div>

            {changePwdMsg.text && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  changePwdMsg.type === "success"
                    ? theme === "dark"
                      ? "bg-green-900 text-green-200"
                      : "bg-green-50 text-green-700"
                    : theme === "dark"
                    ? "bg-red-900 text-red-200"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {changePwdMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={userProfile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userProfile.name
                    )}&background=E3F2FD&color=2563EB&size=128`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
                    title="Change profile picture"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {t.settings.profile.profilePicture || "Profile Picture"}
                  </h4>
                  <p className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {t.settings.profile.profilePictureHint || "Click the camera icon to change your profile picture"}
                  </p>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Profile picture upload section */}
              {userProfile.profileImage && userProfile.profileImage !== (JSON.parse(localStorage.getItem("user") || "{}").profileImage || null) && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">New Profile Picture</h4>
                  <div className="flex items-center space-x-3">
                    <img
                      src={userProfile.profileImage}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={uploadProfileImage}
                        disabled={isLoading}
                        className={`bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? "Uploading..." : "Upload"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const userData = JSON.parse(localStorage.getItem("user") || "{}");
                          setUserProfile(userData);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t.settings.profile.name}
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
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
                  {t.settings.profile.email}
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
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
                  {t.settings.profile.phone}
                </label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
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
                  {t.settings.profile.department}
                </label>
                <div
                  className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-100 border-gray-300 text-gray-700"
                  }`}
                  style={{ minHeight: "40px" }}
                >
                  {userProfile.departmentOrSector ? (
                    <span className="text-base">{userProfile.departmentOrSector}</span>
                  ) : (
                    <span className="text-gray-400 text-base">Not set</span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                  isLoading ? 'bg-[#a06d2a]' : 'bg-[#C88B3D]'
                } text-white font-semibold hover:bg-[#a06d2a] transition shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading
                  ? t.settings.profile.saving
                  : t.settings.profile.saveChanges}
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className={`rounded-lg border p-6 mt-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Change Password</h3>
            <form
              onSubmit={handlePasswordChange}
              className="space-y-6"
            >
              {changePwdMsg.text && (
                <div className={`p-4 rounded-lg ${changePwdMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {changePwdMsg.text}
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
                <div className="relative">
                <input
                    type={showCurrentPassword ? "text" : "password"}
                  value={changePwd.currentPassword}
                  onChange={e => setChangePwd({ ...changePwd, currentPassword: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12`}
                    placeholder="Enter current password"
                  required
                />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                  <div className="relative">
                <input
                      type={showNewPassword ? "text" : "password"}
                  value={changePwd.newPassword}
                  onChange={e => setChangePwd({ ...changePwd, newPassword: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12`}
                      placeholder="Enter new password"
                  required
                />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
              </div>
                
              <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
                  <div className="relative">
                <input
                      type={showConfirmPassword ? "text" : "password"}
                  value={changePwd.confirmNewPassword}
                  onChange={e => setChangePwd({ ...changePwd, confirmNewPassword: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12`}
                      placeholder="Confirm new password"
                  required
                />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-end">
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Password Requirements</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• At least 8 characters</li>
                    <li>• Mix of letters and numbers</li>
                    <li>• Include special characters</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={changePwdLoading}
                  className={`flex-1 py-3 ${changePwdLoading ? 'bg-[#a06d2a]' : 'bg-[#C88B3D]'} text-white font-semibold rounded-xl ${changePwdLoading ? '' : 'hover:bg-[#a06d2a]'} transition shadow-md flex items-center justify-center`}
                >
                  {changePwdLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setChangePwd({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                    setChangePwdMsg({ type: '', text: '' });
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition border border-gray-300"
                >
                  Clear Form
              </button>
              </div>
            </form>
          </div>

          {/* Notification Settings */}
          <div
            className={`rounded-lg border p-6 transition-colors duration-300 transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] ${
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
                {t.settings.notifications.title}
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
                    {t.settings.notifications.emailNotifications}
                  </h4>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t.settings.notifications.emailNotificationsDesc}
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
                    {t.settings.notifications.notificationSound}
                  </h4>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t.settings.notifications.notificationSoundDesc}
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
            className={`rounded-lg border p-6 transition-colors duration-300 transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] ${
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
                {t.settings.appearance.title}
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {t.settings.appearance.theme}
                </h4>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {theme === "dark"
                    ? t.settings.appearance.dark
                    : t.settings.appearance.light}
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
    </div>
  );
};

export default Settings;
