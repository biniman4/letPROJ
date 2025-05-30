import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Home, Users, Mail } from "lucide-react";
import UserManagement from "./UserManagement";
import LetterManagement from "./LetterManagement";

const AdminPanel = () => {
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'letters'>('users');
  const navigate = useNavigate();
  const buttonStyle =
    "flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow bg-blue-600 text-white hover:bg-blue-700 transition-all duration-150";

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 max-w-3xl mx-auto bg-gray-50 px-2 pb-6 overflow-hidden z-10">
      {/* Small top margin for heading and actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 mb-3 gap-2">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight drop-shadow">
          Admin Panel
        </h2>
        <div className="flex gap-2">
          <button className={buttonStyle} onClick={() => navigate("/signup")}>
            <UserPlus className="w-5 h-5" /> Register User
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow bg-gray-600 text-white hover:bg-gray-700 transition-all duration-150"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" /> Home
          </button>
        </div>
      </div>
      {successMsg && (
        <div className="mb-3 p-3 bg-green-100 text-green-800 rounded shadow text-base font-medium">
          {successMsg}
        </div>
      )}
      {/* Tabs with minimal vertical space */}
      <div className="flex justify-center mb-2 gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-2 rounded-t-lg font-semibold text-base transition-all duration-150
            ${activeTab === 'users'
              ? 'bg-white shadow text-blue-700 border-b-2 border-blue-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
        >
          <Users className="w-5 h-5" /> Users
        </button>
        <button
          onClick={() => setActiveTab('letters')}
          className={`flex items-center gap-2 px-6 py-2 rounded-t-lg font-semibold text-base transition-all duration-150
            ${activeTab === 'letters'
              ? 'bg-white shadow text-blue-700 border-b-2 border-blue-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
        >
          <Mail className="w-5 h-5" /> Letters
        </button>
      </div>
      {/* Panel content, only inner panel is scrollable */}
      <div className="bg-white rounded-b-xl shadow-lg min-h-[410px] max-h-[70vh] overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          {activeTab === 'users' ? (
            <UserManagement setSuccessMsg={setSuccessMsg} />
          ) : (
            <LetterManagement setSuccessMsg={setSuccessMsg} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;