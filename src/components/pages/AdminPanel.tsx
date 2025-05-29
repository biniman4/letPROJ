import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Home } from "lucide-react";
import UserManagement from "./UserManagement";
import LetterManagement from "./LetterManagement";

const AdminPanel = () => {
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const buttonStyle =
    "flex items-center gap-2 px-4 py-2 rounded font-semibold shadow bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">
          Admin Panel
        </h2>
        <div className="flex gap-2">
          <button className={buttonStyle} onClick={() => navigate("/signup")}>
            <UserPlus className="w-4 h-4" /> Register User
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded font-semibold shadow bg-gray-600 text-white hover:bg-gray-700"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </div>
      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded shadow">
          {successMsg}
        </div>
      )}
      <UserManagement setSuccessMsg={setSuccessMsg} />
      <LetterManagement setSuccessMsg={setSuccessMsg} />
    </div>
  );
};

export default AdminPanel;