import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SearchIcon, FilterIcon, FileTextIcon, StarIcon } from "lucide-react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useNotifications } from "../../context/NotificationContext";
import TemplateMemoLetter from "./TemplateMemoLetter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DepartmentSelector from "./DepartmentSelector";
import { useInbox } from "../../context/InboxContext";

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
    return res.data;
  } catch (err) {
    return [];
  }
};

// Fetch users by department from your actual API
const fetchUsersByDepartment = async (departmentName: string) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/users?department=${encodeURIComponent(
        departmentName
      )}`
    );
    return res.data;
  } catch (err) {
    return [];
  }
};

const Inbox = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
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
  const [toEmployee, setToEmployee] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [forwardComment, setForwardComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user.email || "";
  const { updateUnreadLetters } = useNotifications();
  const {
    letters,
    loadingLetters,
    isRefreshing,
    totalLetters,
    hasInitialLoad,
    fetchLetters,
    updateLetterStatus,
  } = useInbox();

  // Calculate total pages
  const totalPages = Math.ceil(totalLetters / itemsPerPage);

  // Initial fetch only once when component mounts
  useEffect(() => {
    if (!hasInitialLoad) {
      fetchLetters();
    }
  }, [hasInitialLoad, fetchLetters]);

  // Filter letters based on selected filter and search
  const filteredLetters = useMemo(() => {
    return letters.filter((letter) => {
      const matchesSearch = search
        ? letter.subject.toLowerCase().includes(search.toLowerCase()) ||
          letter.fromName.toLowerCase().includes(search.toLowerCase()) ||
          letter.content.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchesFilter = (() => {
        switch (selectedFilter) {
          case "unread":
            return letter.unread;
          case "starred":
            return letter.starred;
          case "urgent":
            return letter.priority === "urgent";
          case "seen":
            return !letter.unread;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesFilter;
    });
  }, [letters, search, selectedFilter]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLetters = filteredLetters.slice(startIndex, endIndex);

  // Debounced search handler
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (searchTerm: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSearch(searchTerm);
        setCurrentPage(1);
      }, 300);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      const timeoutId = (debouncedSearch as any).timeoutId;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [debouncedSearch]);

  const handleLetterOpen = useCallback(
    async (letter: Letter) => {
      try {
        await axios.post(`http://localhost:5000/api/letters/status`, {
          letterId: letter._id,
          unread: false,
        });

        updateLetterStatus(letter._id, { unread: false });
        setOpenLetter({ ...letter, unread: false });
        setViewMode(false);

        const unreadCount = letters.filter(
          (l) => l.unread && l._id !== letter._id
        ).length;
        updateUnreadLetters(unreadCount);
      } catch (error) {
        console.error("Error updating letter status:", error);
        toast.error("Error updating letter status.");
      }
    },
    [letters, updateUnreadLetters, updateLetterStatus]
  );

  const handleStarToggle = useCallback(
    async (letter: Letter, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const newStarredState = !letter.starred;

        await axios.post(`http://localhost:5000/api/letters/status`, {
          letterId: letter._id,
          starred: newStarredState,
        });

        updateLetterStatus(letter._id, { starred: newStarredState });

        if (openLetter && openLetter._id === letter._id) {
          setOpenLetter((prev) =>
            prev ? { ...prev, starred: newStarredState } : null
          );
        }

        if (newStarredState) {
          toast.success(`Letter "${letter.subject}" starred!`);
        } else {
          toast.info(`Letter "${letter.subject}" unstarred.`);
        }
      } catch (error) {
        console.error("Error toggling star:", error);
        toast.error("Error toggling star.");
      }
    },
    [openLetter, updateLetterStatus]
  );

  // Memoize the letter list item component
  const LetterListItem = useMemo(() => {
    return React.memo(
      ({
        letter,
        onOpen,
        onStarToggle,
      }: {
        letter: Letter;
        onOpen: (letter: Letter) => void;
        onStarToggle: (letter: Letter, e: React.MouseEvent) => void;
      }) => (
        <div
          key={letter._id}
          className={`p-4 cursor-pointer hover:bg-gray-50 ${
            letter.unread ? "bg-blue-50/30" : ""
          }`}
          onClick={() => onOpen(letter)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-medium ${
                  letter.unread
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600"
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
                  onClick={(e) => onStarToggle(letter, e)}
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
      )
    );
  }, []);

  // Memoize pagination handlers
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

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
      setLoadingUsers(true);
      fetchUsersByDepartment(selectedDepartment)
        .then((users) => setDepartmentUsers(users))
        .catch((error) => {
          console.error("Error fetching users:", error);
          toast.error("Error fetching users for the selected department.");
          setDepartmentUsers([]);
        })
        .finally(() => {
          setLoadingUsers(false);
          setSelectedUsers([]);
          setToEmployee("");
        });
    } else {
      setDepartmentUsers([]);
      setSelectedUsers([]);
      setToEmployee("");
    }
  }, [selectedDepartment]);

  // Forward letter logic (send to actual users)
  const handleForwardLetter = async () => {
    if (!openLetter || (!toEmployee && selectedUsers.length === 0)) return;

    try {
      // Find the selected user from the toEmployee field
      const toUser = departmentUsers.find((u) => u.name === toEmployee);
      const recipients = toUser ? [toUser, ...selectedUsers] : selectedUsers;

      // Create a new letter for each recipient
      const forwardPromises = recipients.map(async (recipient) => {
        const forwardData = {
          subject: `Fwd: ${openLetter.subject}`,
          from: user.email, // The server will look up the user by email
          to: recipient.name, // The server expects the recipient's name
          department: recipient.department || selectedDepartment,
          priority: openLetter.priority,
          content: forwardComment
            ? `${forwardComment}\n\n--- Forwarded Message ---\n\n${openLetter.content}`
            : `--- Forwarded Message ---\n\n${openLetter.content}`,
          ccEmployees: {}, // Empty object for CC
          cc: [], // Empty array for CC
          status: "sent",
        };

        return axios.post("http://localhost:5000/api/letters", forwardData);
      });

      await Promise.all(forwardPromises);

      const recipientNames = recipients.map((u) => u.name).join(", ");
      setForwardStatus(`Message forwarded to: ${recipientNames}`);
      setTimeout(() => setForwardStatus(null), 3000);
      setShowForwardModal(false);
      setSelectedDepartment("");
      setSelectedUsers([]);
      setToEmployee("");
      setForwardComment("");
      toast.success(`Letter forwarded to: ${recipientNames}`);

      // Refresh the letters list
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
      updateLetterStatus(openLetter._id, { unread: false, starred: false });
      fetchLetters();

      // Update unread count
      const unreadCount = formattedLetters.filter(
        (l: Letter) => l.unread
      ).length;
      updateUnreadLetters(unreadCount);
    } catch (error) {
      console.error("Error forwarding letter:", error);
      setForwardStatus("Failed to forward message.");
      toast.error("Failed to forward message.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Inbox</h2>
            <p className="text-gray-600">Manage your incoming letters</p>
          </div>
          <button
            onClick={() => fetchLetters(true)}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
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
                  onChange={(e) => debouncedSearch(e.target.value)}
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
          {loadingLetters ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading letters...</p>
            </div>
          ) : currentLetters.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No letters found.
            </div>
          ) : (
            currentLetters.map((letter) => (
              <LetterListItem
                key={letter._id}
                letter={letter}
                onOpen={handleLetterOpen}
                onStarToggle={handleStarToggle}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
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
                {openLetter.attachments &&
                  openLetter.attachments.length > 0 && (
                    <div className="mb-2">
                      <strong>Attachment:</strong>
                      <ul>
                        {openLetter.attachments.map((file, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <a
                              href={`http://localhost:5000/api/letters/download/${
                                openLetter._id
                              }/${encodeURIComponent(file.filename)}`}
                              className="text-blue-600 hover:text-blue-800 underline"
                              download={file.filename}
                            >
                              Download
                            </a>
                            <a
                              href={`http://localhost:5000/api/letters/view/${
                                openLetter._id
                              }/${encodeURIComponent(file.filename)}`}
                              className="text-green-600 hover:text-green-800 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                            <span className="text-gray-700">
                              {file.filename}
                            </span>
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
                      <h3 className="text-lg font-semibold mb-4">
                        Forward Letter
                      </h3>
                      {/* Department Selector */}
                      <div className="mb-4">
                        <DepartmentSelector
                          value={selectedDepartment}
                          onChange={(value) => {
                            setSelectedDepartment(value);
                            setSelectedUsers([]);
                            setToEmployee("");
                          }}
                        />
                      </div>
                      {/* To Field */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          To
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder={
                              loadingUsers
                                ? "Loading users..."
                                : "Select employee"
                            }
                            value={toEmployee}
                            onChange={(e) => setToEmployee(e.target.value)}
                            list="user-list"
                            autoComplete="off"
                            disabled={!selectedDepartment || loadingUsers}
                          />
                          {loadingUsers && (
                            <div className="absolute right-3 top-2.5">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                            </div>
                          )}
                          <datalist id="user-list">
                            {departmentUsers.map((user) => (
                              <option key={user.email} value={user.name}>
                                {user.name}
                              </option>
                            ))}
                          </datalist>
                        </div>
                      </div>
                      {/* Comment Field */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add Comment (Optional)
                        </label>
                        <textarea
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Add a comment to the forwarded message..."
                          value={forwardComment}
                          onChange={(e) => setForwardComment(e.target.value)}
                          rows={3}
                        />
                      </div>
                      {/* User Multi-Selector */}
                      {loadingUsers ? (
                        <div className="mb-4 p-4 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                          <p className="mt-2 text-gray-600">Loading users...</p>
                        </div>
                      ) : departmentUsers.length > 0 ? (
                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Additional Recipients (Optional)
                          </label>
                          <div className="border rounded-lg p-2 max-h-48 overflow-y-auto">
                            {departmentUsers.map((user) => (
                              <div
                                key={user.email}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50"
                              >
                                <input
                                  type="checkbox"
                                  id={user.email}
                                  checked={selectedUsers.some(
                                    (u) => u.email === user.email
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedUsers([
                                        ...selectedUsers,
                                        user,
                                      ]);
                                    } else {
                                      setSelectedUsers(
                                        selectedUsers.filter(
                                          (u) => u.email !== user.email
                                        )
                                      );
                                    }
                                  }}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={user.email}
                                  className="text-sm text-gray-700"
                                >
                                  {user.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setShowForwardModal(false);
                            setSelectedDepartment("");
                            setSelectedUsers([]);
                            setToEmployee("");
                            setForwardComment("");
                          }}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleForwardLetter}
                          disabled={!toEmployee && selectedUsers.length === 0}
                          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Forward
                        </button>
                      </div>
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

export default React.memo(Inbox);
