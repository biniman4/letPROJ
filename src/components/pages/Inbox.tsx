import React, { useState, useEffect } from "react";
import { SearchIcon, FilterIcon, FileTextIcon, StarIcon } from "lucide-react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useNotifications } from "../../context/NotificationContext";
import TemplateMemoLetter from "./TemplateMemoLetter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Letter {
  _id: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  toName?: string;
  department: string;
  priority: string;
  content: string;
  createdAt: string;
  unread: boolean;
  starred: boolean;
  attachments?: Array<{ filename: string }>;
}

const getLetterSentDate = (dateString: string) => {
  const d = new Date(dateString);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

// Fetch departments from your actual API
const fetchDepartments = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/departments");
    return res.data; // [{ name: "HR", ... }]
  } catch (err) {
    return [];
  }
};

// Fetch users by department from your actual API
const fetchUsersByDepartment = async (departmentName: string) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/users?department=${encodeURIComponent(departmentName)}`);
    return res.data; // [{ name, email }, ...]
  } catch (err) {
    return [];
  }
};

const Inbox = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [search, setSearch] = useState("");
  const [openLetter, setOpenLetter] = useState<Letter | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departmentUsers, setDepartmentUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [forwardStatus, setForwardStatus] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user.email || "";
  const { updateUnreadLetters } = useNotifications();

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/letters");
        const formattedLetters = res.data
          .filter((letter: Letter) => letter.toEmail === userEmail)
          .map((letter: Letter) => ({
            ...letter,
            unread: letter.unread ?? true,
            starred: letter.starred ?? false,
            priority: letter.priority ?? "normal",
            createdAt: letter.createdAt || new Date().toISOString(),
          }))
          .sort(
            (a: Letter, b: Letter) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setLetters(formattedLetters);

        // Update unread count
        const unreadCount = formattedLetters.filter(
          (l: Letter) => l.unread
        ).length;
        updateUnreadLetters(unreadCount);
      } catch (err) {
        console.error("Error fetching letters:", err);
        setLetters([]);
        toast.error("Error fetching letters.");
      }
    };
    fetchLetters();
  }, [userEmail, selectedFilter, updateUnreadLetters]);

  const handleLetterOpen = async (letter: Letter) => {
    try {
      // Only update unread status
      await axios.post(`http://localhost:5000/api/letters/status`, {
        letterId: letter._id,
        unread: false,
      });

      setLetters((prevLetters) =>
        prevLetters.map((l) =>
          l._id === letter._id ? { ...l, unread: false } : l
        )
      );

      // Update unread count
      const unreadCount = letters.filter(
        (l) => l.unread && l._id !== letter._id
      ).length;
      updateUnreadLetters(unreadCount);

      // Open the letter (don't modify starred state)
      setOpenLetter({ ...letter, unread: false });
      setViewMode(false);
    } catch (error) {
      console.error("Error updating letter status:", error);
      toast.error("Error updating letter status.");
      setLetters((prevLetters) =>
        prevLetters.map((l) =>
          l._id === letter._id ? { ...l, unread: false } : l
        )
      );
      setOpenLetter({ ...letter, unread: false });
      setViewMode(false);
    }
  };

  // MODIFIED: Show toast message when star status is toggled
  const handleStarToggle = async (letter: Letter, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newStarredState = !letter.starred;

      // Update backend
      await axios.post(`http://localhost:5000/api/letters/status`, {
        letterId: letter._id,
        starred: newStarredState,
      });

      // Update local state
      setLetters((prevLetters) =>
        prevLetters.map((l) =>
          l._id === letter._id ? { ...l, starred: newStarredState } : l
        )
      );

      // If the letter is open in the modal, update it too
      if (openLetter && openLetter._id === letter._id) {
        setOpenLetter((prev) =>
          prev ? { ...prev, starred: newStarredState } : null
        );
      }

      // Show custom toast message for starring/un-starring
      if (newStarredState) {
        toast.success(`Letter "${letter.subject}" starred!`);
      } else {
        toast.info(`Letter "${letter.subject}" unstarred.`);
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      toast.error("Error toggling star.");
      // If the update fails, still update the local state to maintain UI consistency
      setLetters((prevLetters) =>
        prevLetters.map((l) =>
          l._id === letter._id ? { ...l, starred: !l.starred } : l
        )
      );
    }
  };

  // Add "seen" to the filter logic
  const filteredLetters = letters
    .filter((letter) => {
      switch (selectedFilter) {
        case "unread":
          return letter.unread === true;
        case "starred":
          return letter.starred === true;
        case "urgent":
          return letter.priority === "urgent";
        case "seen":
          return letter.unread === false;
        default:
          return true;
      }
    })
    .filter(
      (letter) =>
        letter.subject.toLowerCase().includes(search.toLowerCase()) ||
        (letter.fromName || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // Calculate pagination
  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLetters = filteredLetters.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, search]);

  // Format date function (for modal and lists)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Helper: receiver full name, fallback to username part of email if name not present
  const getRecipientDisplayName = (letter: Letter) =>
    letter.toName || (letter.toEmail ? letter.toEmail.split("@")[0] : "");

  // Helper: Extract only the user name before @ in email, fallback to full name if no email
  const getSenderDisplayName = (letter: Letter) => {
    if (letter.fromName) return letter.fromName;
    if (letter.fromEmail) return letter.fromEmail.split("@")[0];
    return "";
  };

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments().then((data) => setDepartments(data));
  }, []);

  // Fetch users when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchUsersByDepartment(selectedDepartment).then((users) => setDepartmentUsers(users));
      setSelectedUsers([]);
    } else {
      setDepartmentUsers([]);
      setSelectedUsers([]);
    }
  }, [selectedDepartment]);

  // Forward letter logic (send to actual users)
  const handleForwardLetter = async () => {
    if (!openLetter || selectedUsers.length === 0) return;
    try {
      await axios.post("http://localhost:5000/api/letters/forward", {
        letterId: openLetter._id,
        to: selectedUsers.map((u) => u.email),
      });
      setForwardStatus(
        `Message forwarded to: ${selectedUsers.map((u) => u.name).join(", ")}`
      );
      setTimeout(() => setForwardStatus(null), 3000);
      setShowForwardModal(false);
      setSelectedDepartment("");
      setSelectedUsers([]);
      toast.success(
        `Letter forwarded to: ${selectedUsers.map((u) => u.name).join(", ")}`
      );
    } catch (error) {
      setForwardStatus("Failed to forward message.");
      toast.error("Failed to forward message.");
    }
  };

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
              {["all", "unread", "starred", "urgent", "seen"].map((filter) => (
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
            <div className="flex items-center space-x-2">
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search letters..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
                <FilterIcon className="h-5 w-5 mr-2 -ml-1" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Letter List */}
        <div className="divide-y divide-gray-200">
          {currentLetters.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No letters found.
            </div>
          ) : (
            currentLetters.map((letter) => (
              <div
                key={letter._id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  letter.unread ? "bg-blue-50/30" : ""
                }`}
                onClick={() => handleLetterOpen(letter)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-medium ${
                        letter.unread ? "text-gray-900 font-semibold" : "text-gray-600"
                      }`}
                    >
                      {letter.subject}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {letter.priority === "urgent" && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Urgent
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {formatDate(letter.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {letter.fromName} ({letter.department})
                      </p>
                      <button
                        onClick={(e) => handleStarToggle(letter, e)}
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        <StarIcon
                          className={`h-5 w-5 transition-colors duration-200 ease-in-out ${
                            letter.starred ? "text-yellow-400 fill-yellow-400" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(endIndex, filteredLetters.length)}
            </span>{" "}
            of <span className="font-medium">{filteredLetters.length}</span>{" "}
            letters
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Letter Details Modal */}
      {openLetter && (
        <Modal
          open={!!openLetter}
          onClose={() => {
            setOpenLetter(null);
            setViewMode(false);
          }}
          center
        >
          <div className="p-4">
            {!viewMode ? (
              <div className="p-4">
                <div className="mb-2 text-gray-700">
                  <strong>Subject:</strong> {openLetter.subject}
                </div>
                <div className="mb-2 text-gray-700">
                  <strong>To:</strong> {getRecipientDisplayName(openLetter)}
                </div>
                <div className="mb-2 text-gray-700">
                  <strong>From:</strong> {getSenderDisplayName(openLetter)}
                </div>
                <div className="mb-2 text-gray-700">
                  <strong>Department:</strong> {openLetter.department}
                </div>
                <div className="mb-2 text-gray-700">
                  <strong>Priority:</strong> {openLetter.priority}
                </div>
                <div className="mb-2 text-gray-700">
                  <strong>Date:</strong> {formatDate(openLetter.createdAt)}
                </div>
                {openLetter.attachments && openLetter.attachments.length > 0 && (
                  <div className="mb-2">
                    <strong>Attachment:</strong>
                    <ul>
                      {openLetter.attachments.map((file, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <a
                            href={`http://localhost:5000/api/letters/download/${openLetter._id}/${encodeURIComponent(
                              file.filename
                            )}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                            download={file.filename}
                          >
                            Download
                          </a>
                          <a
                            href={`http://localhost:5000/api/letters/view/${openLetter._id}/${encodeURIComponent(
                              file.filename
                            )}`}
                            className="text-green-600 hover:text-green-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                          <span className="text-gray-700">{file.filename}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={() => setViewMode(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mt-4"
                >
                  View
                </button>
              </div>
            ) : (
              <div className="p-4">
                <TemplateMemoLetter
                  subject={openLetter.subject}
                  date={getLetterSentDate(openLetter.createdAt)}
                  recipient={getRecipientDisplayName(openLetter)}
                  reference={""}
                  body={openLetter.content}
                  signature={openLetter.fromName}
                />
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => setViewMode(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setShowForwardModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                  >
                    Forward
                  </button>
                </div>
                {/* Forward Modal */}
                {showForwardModal && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-2">Forward Letter</h3>
                      {/* Department Selector */}
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Select Department/Sector
                      </label>
                      <select
                        className="w-full rounded px-3 py-2 border mb-2"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        <option value="">-- Select Department --</option>
                        {departments.map((dept) => (
                          <option key={dept.name} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                      {/* User Multi-Selector */}
                      {departmentUsers.length > 0 && (
                        <>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Select User(s)
                          </label>
                          <select
                            multiple
                            className="w-full rounded px-3 py-2 border mb-2 h-32"
                            value={selectedUsers.map((u) => u.email)}
                            onChange={(e) => {
                              const options = Array.from(e.target.selectedOptions);
                              setSelectedUsers(
                                options.map((opt) =>
                                  departmentUsers.find((u) => u.email === opt.value)
                                )
                              );
                            }}
                          >
                            {departmentUsers.map((user) => (
                              <option key={user.email} value={user.email}>
                                {user.name} ({user.email})
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                      <div className="flex space-x-2 mt-2">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                          onClick={handleForwardLetter}
                          disabled={selectedUsers.length === 0}
                        >
                          Send
                        </button>
                        <button
                          className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
                          onClick={() => {
                            setShowForwardModal(false);
                            setSelectedDepartment("");
                            setSelectedUsers([]);
                            setForwardStatus(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                      {forwardStatus && (
                        <div className="mt-2 text-green-600">{forwardStatus}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Inbox;