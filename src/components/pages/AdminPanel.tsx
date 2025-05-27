import React, { useState } from 'react';
import { Edit, Trash2, Eye, CheckCircle2, UserPlus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialMockUsers = [
  {
    _id: 'u1',
    name: 'Alice Demo',
    email: 'alice@example.com',
    departmentOrSector: 'HR',
    phone: '123-456-7890',
    priority: 'Normal',
  },
  {
    _id: 'u2',
    name: 'Bob Sample',
    email: 'bob@example.com',
    departmentOrSector: 'IT',
    phone: '098-765-4321',
    priority: 'High',
  },
];

const initialMockLetters = [
  {
    _id: 'l1',
    subject: 'Welcome Letter',
    toEmail: 'alice@example.com',
    department: 'HR',
    priority: 'high',
    approved: false,
  },
  {
    _id: 'l2',
    subject: 'IT Policy Update',
    toEmail: 'bob@example.com',
    department: 'IT',
    priority: 'normal',
    approved: false,
  },
];

const AdminPanel = () => {
  const [users, setUsers] = useState(initialMockUsers);
  const [letters, setLetters] = useState(initialMockLetters);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Approve & send for high-priority letter
  const handleApproveAndSend = (letterId: string) => {
    setLetters(prev =>
      prev.map(l =>
        l._id === letterId ? { ...l, approved: true } : l
      )
    );
    setSuccessMsg('Letter approved and sent!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Delete user
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u._id !== id));
    setSuccessMsg('User deleted!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Change user priority
  const handleChangePriority = (id: string, priority: string) => {
    setUsers(prev =>
      prev.map(u => (u._id === id ? { ...u, priority } : u))
    );
    setSuccessMsg('User priority updated!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Unified button style
  const buttonStyle =
    "flex items-center gap-2 px-4 py-2 rounded font-semibold shadow transition " +
    "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 md:mb-0">
          Admin Panel: Users & Letters (Demo)
        </h2>
        <div className="flex gap-2">
          <button
            className={buttonStyle}
            onClick={() => navigate("/signup")}
          >
            <UserPlus className="w-4 h-4" />
            Register User
          </button>
          <button
            className={buttonStyle}
            onClick={() => navigate("/")}
          >
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name/Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone/Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Users section header */}
            <tr>
              <td colSpan={6} className="bg-blue-50 text-blue-800 font-bold px-6 py-2">
                Users
              </td>
            </tr>
            {users.map((user) => (
              <tr key={'user-' + user._id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-4">User</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.departmentOrSector}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.priority}
                    onChange={e => handleChangePriority(user._id, e.target.value)}
                    className={`px-2 py-1 rounded border ${
                      user.priority === 'High'
                        ? 'bg-red-200 text-red-800'
                        : user.priority === 'Admin'
                        ? 'bg-yellow-200 text-yellow-900'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Letters section header */}
            <tr>
              <td colSpan={6} className="bg-green-50 text-green-800 font-bold px-6 py-2">
                Letters
              </td>
            </tr>
            {letters.map((letter) => (
              <tr key={'letter-' + letter._id} className="hover:bg-green-50 transition">
                <td className="px-6 py-4">Letter</td>
                <td className="px-6 py-4">{letter.subject}</td>
                <td className="px-6 py-4">{letter.toEmail}</td>
                <td className="px-6 py-4">{letter.department}</td>
                <td className="px-6 py-4">
                  {letter.priority === 'high' ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-red-200 text-red-800">
                      High
                    </span>
                  ) : (
                    letter.priority.charAt(0).toUpperCase() + letter.priority.slice(1)
                  )}
                  {letter.approved && (
                    <span className="ml-2 inline-flex items-center text-green-700">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approved
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button className="text-green-600 hover:text-green-900 mr-2">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 mr-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {letter.priority === 'high' && !letter.approved && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition"
                      onClick={() => handleApproveAndSend(letter._id)}
                    >
                      Approve &amp; Send
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;