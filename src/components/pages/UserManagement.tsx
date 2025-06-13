import React, { useEffect, useState, useMemo, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { Edit, Trash2, Save, X, Search } from "lucide-react";
import DepartmentSelector from "./DepartmentSelector";

interface User {
  _id: string;
  name: string;
  email: string;
  departmentOrSector: string;
  phone?: string;
}

// Debounce hook to optimize filtering on search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface UserManagementProps {
  setSuccessMsg: Dispatch<SetStateAction<string>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ setSuccessMsg }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
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
        
        // Create a searchable string that includes all user fields
        const searchableString = [
          user.name,
          user.email,
          user.departmentOrSector,
          user.phone
        ].filter(Boolean).join(" ");

        // Normalize both the search term and the searchable string
        const normalizedSearch = debouncedSearch.trim().toLowerCase();
        const normalizedString = searchableString.toLowerCase();

        // Check if the normalized search term is included in the normalized string
        const matchesSearch = normalizedString.includes(normalizedSearch);

        return matchesDepartment && matchesSearch;
      }),
    [users, debouncedSearch, selectedDepartment]
  );

  // Show breadcrumb only when not filtering
  const isFiltering = !!selectedDepartment || !!userSearch;

  return (
    <div className="w-full flex flex-col h-full">
      {/* Search and filter section - Fixed at top */}
      <div className="bg-white/80 backdrop-blur p-4 border-b rounded-t-2xl shadow-sm sticky top-0 z-10">
        <div className="flex flex-row items-center gap-4 mb-4">
          {/* Department Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <DepartmentSelector 
              onChange={setSelectedDepartment} 
              showBreadcrumb={!isFiltering}
              showSubDropdowns={true} 
            />
          </div>
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 shadow-inner flex-1">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="ml-2 bg-transparent border-none outline-none w-full"
            />
          </div>
          {/* User Count */}
          <span className="text-gray-500 text-base font-medium whitespace-nowrap">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* User list section - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map((user) => (
              <div key={user._id} className="bg-white p-4 rounded-lg shadow flex flex-col justify-between min-h-[220px]">
                {editingUserId === user._id ? (
                  <div className="space-y-2 flex-1">
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      placeholder="Phone"
                    />
                    <input
                      type="text"
                      name="departmentOrSector"
                      value={editForm.departmentOrSector}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      placeholder="Department"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleSaveEdit(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 inline-block mr-2">Email:</span>
                        <p className="text-gray-800 inline-block">{user.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 inline-block mr-2">Phone:</span>
                        <p className="text-gray-800 inline-block">{user.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 inline-block mr-2">Department:</span>
                        <p className="text-gray-800 inline-block">{user.departmentOrSector}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;