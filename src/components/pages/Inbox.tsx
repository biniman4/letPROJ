import React, { useState, useEffect } from "react";
import { SearchIcon, FilterIcon, FileTextIcon, StarIcon } from "lucide-react";
import axios from "axios";

const Inbox = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [letters, setLetters] = useState([]);
  const [search, setSearch] = useState("");
  // Replace this with your actual logged-in user's email (from auth context or similar)
  // Get user email from localStorage (set this after login)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user.email || ""; // fallback to empty string if not logged in

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/letters");
        setLetters(res.data.filter((letter) => letter.toEmail === userEmail));
      } catch (err) {
        setLetters([]);
      }
    };
    fetchLetters();
  }, [userEmail]);

  // Filtering logic
  const filteredLetters = letters
    .filter((letter) => {
      if (selectedFilter === "unread") return letter.unread;
      if (selectedFilter === "starred") return letter.starred;
      if (selectedFilter === "urgent") return letter.status === "urgent";
      return true;
    })
    .filter(
      (letter) =>
        letter.subject.toLowerCase().includes(search.toLowerCase()) ||
        letter.sender.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Inbox</h2>
        <p className="text-gray-600">Manage your incoming letters</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex space-x-2">
              {["all", "unread", "starred", "urgent"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedFilter === filter
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inbox..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <FilterIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        {/* Letters List */}
        <div className="divide-y divide-gray-200">
          {filteredLetters.length === 0 && (
            <div className="p-4 text-gray-500 text-center">
              No letters found.
            </div>
          )}
          {filteredLetters.map((letter) => (
            <div
              key={letter._id || letter.id}
              className={`p-4 hover:bg-gray-50 flex items-center ${
                letter.unread ? "bg-blue-50/30" : ""
              }`}
            >
              <div className="flex-1 flex items-center min-w-0">
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-yellow-400">
                    <StarIcon
                      className={`h-5 w-5 ${
                        letter.starred ? "text-yellow-400 fill-yellow-400" : ""
                      }`}
                    />
                  </button>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileTextIcon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-medium ${
                        letter.unread ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {letter.subject}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {letter.status === "urgent" && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Urgent
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {letter.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {letter.sender}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredLetters.length}</span> of{" "}
            <span className="font-medium">{letters.length}</span> letters
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
