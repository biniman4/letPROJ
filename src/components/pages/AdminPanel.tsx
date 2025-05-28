import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserPlus, Home, Edit, Trash2, Save, X } from "lucide-react";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      setSuccessMsg('User deleted!');
    } catch (err) {
      setSuccessMsg('Failed to delete user!');
    }
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // When clicking edit, set editing state and populate form
  const handleEditClick = (user: any) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      departmentOrSector: user.departmentOrSector,
      phone: user.phone || "",
    });
  };

  // When editing form fields
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSaveEdit = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${id}`, editForm);
      setUsers(prev =>
        prev.map(u => (u._id === id ? response.data : u))
      );
      setSuccessMsg('User updated!');
      setEditingUserId(null);
    } catch (err) {
      setSuccessMsg('Failed to update user!');
    }
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const buttonStyle =
    "flex items-center gap-2 px-4 py-2 rounded font-semibold shadow transition bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 md:mb-0">
          Admin Panel: Users
        </h2>
        <div className="flex gap-2">
          <button className={buttonStyle} onClick={() => navigate("/signup")}>
            <UserPlus className="w-4 h-4" />
            Register User
          </button>
          <button className={buttonStyle} onClick={() => navigate("/")}>
            <Home className="w-4 h-4" />
            Back to Home Page
          </button>
        </div>
      </div>
      {successMsg && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300 transition">
          {successMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="bg-blue-50 text-blue-800 font-bold px-6 py-2">
                Users
              </td>
            </tr>
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">No users found.</td>
              </tr>
            )}
            {users.map((user: any) =>
              editingUserId === user._id ? (
                <tr key={"user-edit-" + user._id} className="bg-yellow-50">
                  <td className="px-6 py-4">User</td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="departmentOrSector"
                      value={editForm.departmentOrSector}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="text-green-600 hover:text-green-900 mr-2"
                      onClick={() => handleSaveEdit(user._id)}
                      title="Save"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={handleCancelEdit}
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={"user-" + user._id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4">User</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.departmentOrSector}</td>
                  <td className="px-6 py-4">{user.phone || "—"}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={() => handleEditClick(user)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;