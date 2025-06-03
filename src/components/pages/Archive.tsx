import React, { useState } from 'react';
import { ArchiveIcon, SearchIcon, FilterIcon } from 'lucide-react';

const Archive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Archive</h2>
        <p className="text-gray-600 text-sm">Access your archived letters</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FilterIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span>Filters</span>
            </button>
          </div>
          
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              {/* Add filter options here */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Filter by Date</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Filter by Type</option>
                  <option value="memo">Memo</option>
                  <option value="letter">Letter</option>
                  <option value="report">Report</option>
                </select>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Filter by Department</option>
                  <option value="hr">HR</option>
                  <option value="finance">Finance</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 text-center text-gray-500">
          <ArchiveIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No archived letters yet</p>
          <p className="text-sm text-gray-400 mt-1">Letters you archive will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Archive;