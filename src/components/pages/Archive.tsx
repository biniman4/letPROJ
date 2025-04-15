// import React from 'react';
import { ArchiveIcon, SearchIcon, FilterIcon } from 'lucide-react';
const Archive = () => {
  return <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Archive</h2>
        <p className="text-gray-600">Access your archived letters</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative">
              <input type="text" placeholder="Search archive..." className="w-64 pl-9 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <FilterIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-6 text-center text-gray-500">
          <ArchiveIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No archived letters yet</p>
        </div>
      </div>
    </div>;
};
export default Archive;