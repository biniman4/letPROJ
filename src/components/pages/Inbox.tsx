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

const Inbox = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [search, setSearch] = useState("");
  const [openLetter, setOpenLetter] = useState<Letter | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
          {currentLetters.map((letter) => (
            <div
              key={letter._id}
              className={`p-4 hover:bg-gray-50 flex items-center cursor-pointer ${
                letter.unread ? "bg-blue-50/30" : ""
              }`}
              onClick={() => handleLetterOpen(letter)}
            >
              <div className="flex-1 flex items-center min-w-0">
                <div className="flex items-center space-x-4">
                  <button
                    className="text-gray-400 hover:text-yellow-400"
                    onClick={(e) => handleStarToggle(letter, e)}
                  >
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
                  <p className="text-sm text-gray-500 truncate">
                    {letter.fromName} ({letter.department})
                  </p>
                </div>
              </div>
            </div>
          ))}
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
              <button
                onClick={() => setViewMode(false)}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
              >
                Back
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Inbox;