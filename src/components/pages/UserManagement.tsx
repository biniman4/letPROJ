import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Edit, Trash2, Save, X, Search } from "lucide-react";
import DepartmentSelector from "./DepartmentSelector";

// Debounce hook to optimize filtering on search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const UserManagement = ({ setSuccessMsg }) => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [userSearch, setUserSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Debounced search value for responsive filtering
  const debouncedSearch = useDebounce(userSearch, 200);

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

  // Memoized filtering for responsiveness
  const filteredUsers = useMemo(
    () =>
      users.filter((user: any) => {
        const matchesDepartment =
          !selectedDepartment || user.departmentOrSector === selectedDepartment;
        const matchesSearch = [user.name, user.email, user.departmentOrSector, user.phone]
          .join(" ")
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
        return matchesDepartment && matchesSearch;
      }),
    [users, debouncedSearch, selectedDepartment]
  );

  return (
    <div className="h-[70vh] flex flex-col border rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-white">
      {/* Sticky search bar/header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur p-6 border-b rounded-t-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="w-full md:w-auto">
            <DepartmentSelector value={selectedDepartment} onChange={setSelectedDepartment} />
          </div>
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 shadow-inner mt-2 md:mt-0">
            <Search className="w-5 h-5 text-blue-400 mr-2" />
            <input
              type="text"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-transparent outline-none px-2 py-1 text-base text-gray-700 w-40 md:w-56"
            />
          </div>
          <span className="ml-2 text-gray-500 text-base font-medium">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-6 bg-white/60 rounded-b-2xl">
        <div className="grid gap-8 md:grid-cols-2 mb-10">
          {filteredUsers.length === 0 && (
            <div className="col-span-2 text-center text-gray-400 py-16 text-lg font-semibold">
              No users found.
            </div>
          )}
          {(!selectedDepartment ? users : filteredUsers).map((user: any) =>
            editingUserId === user._id ? (
              <div key={user._id} className="bg-white/90 shadow-xl rounded-xl p-7 flex flex-col gap-3 border border-blue-100 relative hover:shadow-2xl transition-shadow duration-200">
                <div className="font-bold text-xl text-blue-700 mb-2">Editing: {user.name}</div>
                <input
                  name="name"
                  className="border border-blue-200 rounded px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-200"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Name"
                />
                <input
                  name="email"
                  className="border border-blue-200 rounded px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-200"
                  value={editForm.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                />
                <input
                  name="departmentOrSector"
                  className="border border-blue-200 rounded px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-200"
                  value={editForm.departmentOrSector}
                  onChange={handleEditChange}
                  placeholder="Department/Sector"
                />
                <input
                  name="phone"
                  className="border border-blue-200 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-200"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  placeholder="Phone"
                />
                <div className="flex gap-3 mt-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                    onClick={() => handleSaveEdit(user._id)}
                  >
                    <Save className="w-5 h-5" /> Save
                  </button>
                  <button
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                    onClick={handleCancelEdit}
                  >
                    <X className="w-5 h-5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={user._id} className="bg-white/90 shadow-xl rounded-xl p-7 flex flex-col gap-2 border border-blue-100 relative hover:shadow-2xl transition-shadow duration-200">
                <div className="font-bold text-xl text-blue-700 mb-1">{user.name}</div>
                <div className="text-gray-700"><strong>Email:</strong> {user.email}</div>
                <div className="text-gray-700"><strong>Department/Sector:</strong> {user.departmentOrSector}</div>
                <div className="text-gray-700"><strong>Phone:</strong> {user.phone}</div>
                <div className="flex gap-3 mt-3">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                    onClick={() => handleEditClick(user)}
                  >
                    <Edit className="w-5 h-5" /> Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <Trash2 className="w-5 h-5" /> Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;