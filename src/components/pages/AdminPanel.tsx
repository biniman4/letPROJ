import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit, Save, X } from 'lucide-react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  departmentOrSector: string;
  phone: string;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user._id);
    setEditForm(user);
  };

  const handleSave = async (userId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Admin Panel</h2>
        <p className="text-gray-600">Manage users and system settings</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">User Management</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        name="departmentOrSector"
                        value={editForm.departmentOrSector || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.departmentOrSector
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.phone
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {editingUser === user._id ? (
                        <>
                          <button
                            onClick={() => handleSave(user._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;