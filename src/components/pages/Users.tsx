import React from 'react';
import { UsersIcon, SearchIcon } from 'lucide-react';
const Users = () => {
  return <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
        <p className="text-gray-600">Manage system users and permissions</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input type="text" placeholder="Search users..." className="w-64 pl-9 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6 text-center text-gray-500">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No users found</p>
        </div>
      </div>
    </div>;
};
export default Users;