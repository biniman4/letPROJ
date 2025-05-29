import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Save, X, Search } from "lucide-react";

const UserManagement = ({ setSuccessMsg }) => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [userSearch, setUserSearch] = useState("");

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
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setSuccessMsg("User deleted!");
    } catch (err) {
      setSuccessMsg("Failed to delete user!");
    }
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleEditClick = (user: any) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      departmentOrSector: user.departmentOrSector,
      phone: user.phone || "",
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        editForm
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? response.data : u))
      );
      setSuccessMsg("User updated!");
      setEditingUserId(null);
    } catch (err) {
      setSuccessMsg("Failed to update user!");
    }
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const filteredUsers = users.filter((user: any) =>
    [user.name, user.email, user.departmentOrSector, user.phone]
      .join(" ")
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center mb-2 gap-2">
        <h3 className="text-2xl font-semibold text-gray-700">User Management</h3>
        <div className="flex items-center bg-gray-100 rounded px-2 py-1 ml-4">
          <Search className="w-4 h-4 text-gray-500 mr-1" />
          <input
            type="text"
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            placeholder="Search users..."
            className="bg-transparent outline-none px-1 py-0.5 text-sm"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {filteredUsers.map((user: any) =>
          editingUserId === user._id ? (
            <div key={user._id} className="bg-white shadow rounded-lg p-5 flex flex-col gap-2 border relative">
              <div className="font-bold text-lg text-blue-700 mb-2">Editing: {user.name}</div>
              <input
                name="name"
                className="border rounded px-2 py-1 mb-1"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Name"
              />
              <input
                name="email"
                className="border rounded px-2 py-1 mb-1"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email"
              />
              <input
                name="departmentOrSector"
                className="border rounded px-2 py-1 mb-1"
                value={editForm.departmentOrSector}
                onChange={handleEditChange}
                placeholder="Department/Sector"
              />
              <input
                name="phone"
                className="border rounded px-2 py-1 mb-2"
                value={editForm.phone}
                onChange={handleEditChange}
                placeholder="Phone"
              />
              <div className="flex gap-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  onClick={() => handleSaveEdit(user._id)}
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded flex items-center gap-1"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div key={user._id} className="bg-white shadow rounded-lg p-5 flex flex-col gap-2 border relative">
              <div className="font-bold text-lg text-blue-700">{user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Department/Sector:</strong> {user.departmentOrSector}</div>
              <div><strong>Phone:</strong> {user.phone}</div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1"
                  onClick={() => handleEditClick(user)}
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default UserManagement;