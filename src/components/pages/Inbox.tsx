import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useNotifications } from "../../context/NotificationContext";
import TemplateMemoLetter from "./TemplateMemoLetter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DepartmentSelector from "./DepartmentSelector";
import { useInbox } from "../../context/InboxContext";
import { useLanguage } from "./LanguageContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { FaPaperclip } from "react-icons/fa";
import logo from "../../img icon/logo.png";
import {
  SearchIcon,
  FilterIcon,
  FileTextIcon,
  StarIcon,
  Download,
  Eye,
} from "lucide-react";

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
  status?: string;
  rejectionNote?: string;
  attachments?: Array<{ filename: string }>;
  // CC fields
  isCC?: boolean;
  originalLetter?: string;
}

// Format date function (for modal and lists) - Moved here to be accessible
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
  const [forwardIncludeSender, setForwardIncludeSender] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewType, setPreviewType] = useState<string>("");
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isForwardLoading, setIsForwardLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [isViewFileLoading, setIsViewFileLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState<string>(
    new Date().toISOString()
  );
  const [hasNewLetters, setHasNewLetters] = useState(false);

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
  const { t } = useLanguage();

  const getPriorityBadge = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return (
          <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
            {t.letterManagement.priorityValues.urgent}
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-0.5 text-xs font-bold bg-yellow-100 text-yellow-600 rounded-full">
            {t.letterManagement.priorityValues.high}
          </span>
        );
      case "normal":
        return (
          <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-600 rounded-full">
            {t.letterManagement.priorityValues.normal}
          </span>
        );
      default:
        return null;
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalLetters / itemsPerPage);

  // Initial fetch only once when component mounts
  useEffect(() => {
    if (!hasInitialLoad) {
      fetchLetters();
    }
  }, [hasInitialLoad, fetchLetters]);

  // Add polling effect for new letters
  useEffect(() => {
    const checkForNewLetters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/letters/check-new`,
          {
            params: {
              lastChecked: lastCheckedTimestamp,
              userEmail: userEmail,
            },
          }
        );

        if (response.data.hasNewLetters) {
          setHasNewLetters(true);
          // Update the last checked timestamp
          setLastCheckedTimestamp(new Date().toISOString());
          // Fetch new letters
          fetchLetters();
        }
      } catch (error) {
        console.error("Error checking for new letters:", error);
      }
    };

    // Check for new letters every 30 seconds
    const intervalId = setInterval(checkForNewLetters, 30000);

    return () => clearInterval(intervalId);
  }, [lastCheckedTimestamp, userEmail, fetchLetters]);

  // Reset new letters indicator when user clicks refresh
  const handleRefresh = useCallback(() => {
    setHasNewLetters(false);
    fetchLetters(true);
  }, [fetchLetters]);

  // Filter letters based on selected filter and search
  const filteredLetters = useMemo(() => {
    return letters.filter((letter) => {
      // Check if the letter is meant for the current user (direct recipient or CC)
      const isRecipient = letter.toEmail === userEmail;
      const isCCRecipient = letter.isCC && letter.toEmail === userEmail;

      // If not the recipient or CC recipient, don't show the letter
      if (!isRecipient && !isCCRecipient) return false;

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
          case "rejected":
            return letter.status === "rejected";
          default:
            return true;
        }
      })();

      return matchesSearch && matchesFilter;
    });
  }, [letters, search, selectedFilter, userEmail]);

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
        setIsViewLoading(true);
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
        toast.error(t.inbox.errorUpdatingStatus);
      } finally {
        setIsViewLoading(false);
      }
    },
    [
      letters,
      updateUnreadLetters,
      updateLetterStatus,
      t.inbox.errorUpdatingStatus,
    ]
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
          toast.success(t.inbox.letterStarred(letter.subject));
        } else {
          toast.info(t.inbox.letterUnstarred(letter.subject));
        }
      } catch (error) {
        console.error("Error toggling star:", error);
        toast.error(t.inbox.errorTogglingStar);
      }
    },
    [
      openLetter,
      updateLetterStatus,
      t.inbox.letterStarred,
      t.inbox.letterUnstarred,
      t.inbox.errorTogglingStar,
    ]
  );

  // Remove React.memo from LetterListItem to ensure reactivity to language changes
  const LetterListItem =
    ({ letter, onOpen, onStarToggle, isActive }: { letter: Letter; onOpen: (letter: Letter) => void; onStarToggle: (letter: Letter, e: React.MouseEvent) => void; isActive: boolean; }) => {
      const isUnread = letter.unread;
      return (
        <div
          className={`flex items-center p-3 cursor-pointer border-l-4 ${
            isActive
              ? "border-[#C88B3D] bg-yellow-50/80 shadow-md scale-[1.01]"
              : isUnread
              ? "border-blue-500 bg-blue-50/70"
              : "border-transparent"
          } hover:bg-gray-100 transition-all duration-200 group`}
          onClick={() => onOpen(letter)}
          style={{
            transition: "box-shadow 0.2s, background 0.2s, transform 0.1s",
          }}
        >
          <div className="flex items-center gap-4 w-48 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStarToggle(letter, e);
              }}
              className={`text-xl ${
                letter.starred ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
            >
              <StarIcon
                fill={letter.starred ? "currentColor" : "none"}
                className="w-5 h-5"
              />
            </button>
            <span
              className={`font-semibold truncate ${
                isUnread ? "text-gray-800" : "text-gray-600"
              }`}
            >
              {letter.fromName}
            </span>
          </div>
          <div className="flex-grow min-w-0 mx-4">
            <span
              className={`font-semibold truncate ${
                isUnread ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {letter.subject}
            </span>
          </div>
          <div className="flex items-center justify-end gap-4 w-48 shrink-0 ml-auto">
            {getPriorityBadge(letter.priority)}
            {letter.attachments && letter.attachments.length > 0 && (
              <FaPaperclip className="text-gray-400" />
            )}
            <span
              className={`text-sm font-medium whitespace-nowrap ${
                isUnread ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {new Date(letter.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      );
    };

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
          toast.error(t.inbox.errorFetchingUsers);
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
  }, [selectedDepartment, t.inbox.errorFetchingUsers]);

  // Forward letter logic (send to actual users)
  const handleForwardLetter = async () => {
    if (!openLetter) return;

    try {
      setIsForwardLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) {
        throw new Error("User email not found");
      }

      const recipients = selectedUsers.map((u) => ({
        name: u.name,
        email: u.email,
        department: u.department,
      }));

      // If "Include Original Sender" is checked, add the sender to recipients
      if (forwardIncludeSender && openLetter) {
        recipients.push({
          name: openLetter.fromName,
          email: openLetter.fromEmail,
          department: openLetter.department, // Or fetch if not available
        });
      }

      // Send all recipients in one request to the new /forward endpoint
      const forwardData = {
        subject: `Fwd: ${openLetter.subject}`,
        from: user.email,
        recipients,
        department: selectedDepartment,
        priority: openLetter.priority,
        content: forwardComment
          ? `${forwardComment}\n\n--- Forwarded Message ---\n\n${openLetter.content}`
          : `--- Forwarded Message ---\n\n${openLetter.content}`,
      };

      const response = await axios.post(
        "http://localhost:5000/api/letters/forward",
        forwardData
      );

      if (response.status === 201) {
        const recipientNames = recipients.map((u) => u.name).join(", ");
        setForwardStatus(`Message forwarded to: ${recipientNames}`);
        setTimeout(() => setForwardStatus(null), 3000);
        setShowForwardModal(false);
        setForwardIncludeSender(false);
        setSelectedDepartment("");
        setSelectedUsers([]);
        setToEmployee("");
        setForwardComment("");
        toast.success(`Message forwarded to: ${recipientNames}`);

        // Refresh the letters list
        fetchLetters();
      } else {
        // Handle unexpected success statuses if necessary
        setForwardStatus(
          "Failed to forward message due to unexpected server response."
        );
        toast.error(
          "Failed to forward message due to unexpected server response."
        );
      }
    } catch (error: any) {
      console.error("Error forwarding letter:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to forward message.";
      setForwardStatus(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsForwardLoading(false);
    }
  };

  const handleDownload = async (letterId: string, filename: string) => {
    try {
      setIsDownloadLoading((prev) => ({ ...prev, [filename]: true }));
      const response = await axios.get(
        `http://localhost:5000/api/letters/download/${letterId}/${filename}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t.inbox.downloadSuccess);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(t.inbox.errorDownloadingFile);
    } finally {
      setIsDownloadLoading((prev) => ({ ...prev, [filename]: false }));
    }
  };

  const handleView = async (
    letterId: string,
    filename: string,
    contentType: string
  ) => {
    try {
      setIsViewFileLoading((prev) => ({ ...prev, [filename]: true }));
      const response = await axios.get(
        `http://localhost:5000/api/letters/view/${letterId}/${filename}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );
      setPreviewUrl(url);
      setPreviewType(contentType);
      setPreviewVisible(true);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error(t.inbox.errorViewingFile);
    } finally {
      setIsViewFileLoading((prev) => ({ ...prev, [filename]: false }));
    }
  };

  const handlePreviewClose = () => {
    setPreviewVisible(false);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  // Effect: If previewVisible and unsupported type, stop loading
  useEffect(() => {
    if (
      previewVisible &&
      previewType &&
      !previewType.startsWith("image/") &&
      previewType !== "application/pdf"
    ) {
      setIsPreviewLoading(false);
    }
  }, [previewVisible, previewType]);

  const handlePrint = () => {
    if (!openLetter) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const printContent = `
        <html>
          <head>
            <title>Memo - ${openLetter.subject}</title>
            <style>
              @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;700&display=swap");
              @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
              
              body {
                font-family: 'Roboto', 'Noto Sans Ethiopic', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .memo-container {
                display: flex;
                flex-direction: column;
                width: 210mm;
                height: 297mm;
                margin: 20px auto;
                background: white;
                padding: 20mm;
                box-sizing: border-box;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                flex-shrink: 0;
              }
              .logo {
                height: 60px;
                margin-bottom: 10px;
              }
              .institute-name .amharic {
                font-family: 'Noto Sans Ethiopic', sans-serif;
                font-weight: 700;
                font-size: 18px;
                color: #003F5D;
                margin: 0;
              }
              .institute-name .english {
                font-family: 'Roboto', sans-serif;
                font-weight: 700;
                font-size: 16px;
                color: #000;
                margin-top: 5px;
                margin-bottom: 0;
              }
              .color-bars {
                display: flex;
                width: 100%;
                height: 4px;
                margin-top: 15px;
              }
              .color-bars .bar { flex: 1; }
              .color-bars .blue { background-color: #005f9e; }
              .color-bars .brown { background-color: #c88b3d; margin: 0 5px; }
              .color-bars .red { background-color: #d62e2e; }
              
              .memo-title-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-top: 2px solid #c88b3d;
                padding-top: 15px;
                margin-top: 20px;
                flex-shrink: 0;
              }
              .memo-title .amharic {
                font-family: 'Noto Sans Ethiopic', sans-serif;
                font-size: 16px;
                font-weight: 700;
                margin: 0;
              }
              .memo-title .english {
                font-size: 14px;
                font-weight: 700;
                margin-top: 5px;
              }
              .memo-date {
                text-align: right;
                font-size: 14px;
              }
              .memo-date p { margin: 0; }
              .memo-date .date-label {
                font-size: 12px;
                color: #555;
              }
              
              .memo-body {
                margin-top: 20px;
                flex-grow: 1; /* Allows this to take up space */
                overflow-y: auto; /* In case content is too long, for viewing */
              }
              
              .signature-section {
                margin-top: 20px;
              }
              .signature-section p {
                margin: 0;
              }

              .footer {
                text-align: center;
                flex-shrink: 0;
                margin-top: 20px;
              }
              .footer-line {
                border-top: 2px solid #003F5D;
              }
              .footer-content {
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 10px 0;
                font-size: 11px;
              }
              .footer-item {
                display: flex;
                align-items: center;
                gap: 5px;
              }
              .footer-item svg {
                width: 16px;
                height: 16px;
              }
              .footer-quote {
                margin-top: 10px;
                font-family: 'Noto Sans Ethiopic', sans-serif;
                font-style: italic;
                font-size: 12px;
              }

              @media print {
                body { margin: 0; background-color: white; }
                .memo-container {
                  margin: 0;
                  box-shadow: none;
                  width: 100%;
                  height: 100vh; /* Use viewport height for printing */
                  padding: 15mm;
                }
                .memo-body {
                  overflow-y: visible;
                }
              }
            </style>
          </head>
          <body>
            <div class="memo-container">
                <div class="header">
                    <img src="${logo}" alt="SSGI Logo" class="logo">
                    <div class="institute-name">
                        <p class="amharic">የኅዋ ሳይንስና ጂኦስፓሻል ኢንስቲዩት</p>
                        <p class="english">SPACE SCIENCE AND GEOSPATIAL INSTITUTE</p>
                    </div>
                    <div class="color-bars">
                        <div class="bar blue"></div>
                        <div class="bar brown"></div>
                        <div class="bar red"></div>
                    </div>
                </div>

                <div class="memo-title-section">
                    <div class="memo-title">
                        <p class="amharic">የውስጥ ማስታወሻ</p>
                        <p class="english">OFFICE MEMO</p>
                    </div>
                    <div class="memo-date">
                        <p><strong>${new Date(
                          openLetter.createdAt
                        ).toLocaleDateString("en-GB")}</strong></p>
                        <p class="date-label">Date</p>
                    </div>
                </div>

                <div class="memo-body">
                    <p><strong>Subject:</strong> ${openLetter.subject}</p>
                    <p><strong>To:</strong> ${getRecipientDisplayName(
                      openLetter
                    )}</p>
                    <br>
                    <div class="content-body">${openLetter.content.replace(
                      /\n/g,
                      "<br>"
                    )}</div>
                    <div class="signature-section">
                        <p>Signature:</p>
                        <br><br>
                        <p>${openLetter.fromName}</p>
                    </div>
                </div>

                <div class="footer">
                    <div class="footer-line"></div>
                    <div class="footer-content">
                        <div class="footer-item">
                          <svg fill="#c88b3d" viewBox="0 0 24 24"><path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"></path></svg>
                          <span>+251 118 96 10 50 / 51</span>
                        </div>
                        <div class="footer-item">
                           <svg fill="#c88b3d" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A1,1 0 0,0 10,17H14A1,1 0 0,0 15,16V15L19.79,10.21C19.92,10.78 20,11.38 20,12C20,16.08 16.95,19.44 13,19.93V18H11V19.93M17.89,8.11L13,13H11L6.11,8.11C6.5,7.22 7.22,6.5 8.11,6.11L12,10L15.89,6.11C16.78,6.5 17.5,7.22 17.89,8.11Z"></path></svg>
                          <span>www.ssgi.gov.et</span>
                        </div>
                        <div class="footer-item">
                           <svg fill="#c88b3d" viewBox="0 0 24 24"><path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,11L20,6H4L12,11M20,18V8L12,13L4,8V18H20Z"></path></svg>
                           <span>33679 / 597</span>
                        </div>
                         <div class="footer-item">
                           <svg fill="#c88b3d" viewBox="0 0 24 24"><path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,11L20,6H4L12,11M20,18V8L12,13L4,8V18H20Z"></path></svg>
                           <span>info@ssgi.gov.et</span>
                        </div>
                    </div>
                    <div class="footer-quote">
                        <p>"ከምድር እስከ ህዋ..."</p>
                    </div>
                </div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  const container = document.querySelector('.memo-container');
                  const content = document.querySelector('.content-body');
                  if (container.scrollHeight > container.clientHeight) {
                    let fontSize = 12; // Starting font size in px
                    content.style.fontSize = fontSize + 'px';
                    while (container.scrollHeight > container.clientHeight && fontSize > 6) {
                      fontSize -= 0.5;
                      content.style.fontSize = fontSize + 'px';
                    }
                  }
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `;
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#b97b2a] via-[#cfae7b] to-[#cfc7b7] text-transparent bg-clip-text drop-shadow-md">
            {t.inbox.title}
          </h2>
          <p className="text-lg text-[#BFBFBF] font-medium">
            {t.inbox.manageLetters}
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {[
              { key: "all", label: t.inbox.filterOptions.all },
              { key: "unread", label: t.inbox.filterOptions.unread },
              { key: "starred", label: t.inbox.filterOptions.starred },
              { key: "urgent", label: t.inbox.filterOptions.urgent },
              { key: "seen", label: t.inbox.filterOptions.seen },
              { key: "rejected", label: t.inbox.filterOptions.rejected },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm border border-blue-100 bg-white hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-400 ${
                  selectedFilter === filter.key
                    ? "bg-blue-100 text-blue-700 shadow-md border-blue-300"
                    : "text-gray-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.inbox.searchPlaceholder}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white"
              />
            </div>
            <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:scale-105">
              <FilterIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                hasNewLetters ? "animate-pulse" : ""
              }`}
            >
              {isRefreshing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <svg
                  className="w-5 h-5 mr-2"
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
              )}
              {isRefreshing ? t.inbox.refreshing : t.inbox.refresh}
              {hasNewLetters && !isRefreshing && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  New
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#BFBFBF] overflow-hidden">
          {loadingLetters ? (
            <div className="p-12 text-center">
              <LoadingSpinner message="Loading your inbox..." />
            </div>
          ) : currentLetters.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 text-gray-300">
                <FileTextIcon className="w-full h-full" />
              </div>
              <p className="mt-4 text-xl text-gray-500">
                {t.inbox.noLettersFound}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {currentLetters.map((letter) => (
                <LetterListItem
                  key={letter._id}
                  letter={letter}
                  onOpen={handleLetterOpen}
                  onStarToggle={handleStarToggle}
                  isActive={!!openLetter && openLetter._id === letter._id}
                />
              ))}
            </div>
          )}
        </div>
        {currentLetters.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {t.inbox.showing}{" "}
              <span className="font-semibold text-gray-900">
                {startIndex + 1}
              </span>{" "}
              {t.inbox.to}{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(endIndex, filteredLetters.length)}
              </span>{" "}
              {t.inbox.of}{" "}
              <span className="font-semibold text-gray-900">
                {filteredLetters.length}
              </span>{" "}
              {t.inbox.letters}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm border border-blue-100 bg-white hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-400 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700"
                }`}
              >
                {t.inbox.previous}
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm border border-blue-100 bg-white hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-400 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700"
                }`}
              >
                {t.inbox.next}
              </button>
            </div>
          </div>
        )}
      </div>
      {openLetter && (
        <Modal
          open={!!openLetter}
          onClose={() => {
            setOpenLetter(null);
            setViewMode(false);
          }}
          center
          classNames={{
            modal:
              "rounded-2xl shadow-2xl max-w-3xl w-full h-auto max-h-[90vh] flex flex-col",
            overlay: "bg-black/50 backdrop-blur-sm",
          }}
        >
          <div className="p-4 overflow-y-auto">
            {!viewMode ? (
              <div className="bg-white p-4">
                {openLetter.status === "rejected" && (
                  <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg shadow">
                    <h4 className="font-bold text-lg mb-2">
                      {t.inbox.letterRejected}
                    </h4>
                    <p>
                      <span className="font-semibold">
                        {t.inbox.rejectionReason}:
                      </span>{" "}
                      {openLetter.rejectionNote}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#C88B3D] flex-1 truncate">
                    {openLetter.subject}
                  </h3>
                  {getPriorityBadge(openLetter.priority)}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-100/70 rounded-lg p-3">
                    <div className="text-xs text-gray-500 font-semibold mb-1">
                      {t.inbox.from}
                    </div>
                    <div className="text-gray-800 font-semibold text-sm truncate">
                      {getSenderDisplayName(openLetter)}
                    </div>
                  </div>
                  <div className="bg-gray-100/70 rounded-lg p-3">
                    <div className="text-xs text-gray-500 font-semibold mb-1">
                      {t.inbox.recipient}
                    </div>
                    <div className="text-gray-800 font-semibold text-sm truncate">
                      {getRecipientDisplayName(openLetter)}
                    </div>
                  </div>
                  <div className="bg-gray-100/70 rounded-lg p-3">
                    <div className="text-xs text-gray-500 font-semibold mb-1">
                      {t.inbox.departmentLabel}
                    </div>
                    <div className="text-gray-800 font-semibold text-sm truncate">
                      {(openLetter.department || "")
                        .split(' > ')
                        .map((dep: string) => t.departments[dep.trim() as keyof typeof t.departments] || dep.trim())
                        .join(' > ')
                      }
                    </div>
                  </div>
                  <div className="bg-gray-100/70 rounded-lg p-3">
                    <div className="text-xs text-gray-500 font-semibold mb-1">
                      {t.inbox.date}
                    </div>
                    <div className="text-gray-800 font-semibold text-sm truncate">
                      {formatDate(openLetter.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 font-semibold mb-2">
                    {t.inbox.contentLabel}
                  </div>
                  <div className="bg-blue-50/50 border-l-4 border-blue-400 rounded-md p-4 text-gray-800 whitespace-pre-line text-sm shadow-inner">
                    {openLetter.content}
                  </div>
                </div>
                {openLetter.attachments &&
                  openLetter.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FaPaperclip /> {t.inbox.attachments}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {openLetter.attachments.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-2 min-w-0">
                              <FileTextIcon className="h-6 w-6 text-gray-500 shrink-0" />
                              <span className="text-sm text-gray-800 font-medium truncate">
                                {file.filename}
                              </span>
                            </div>
                            <div className="flex space-x-2 items-center shrink-0">
                              <button
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Guess file type from extension
                                  const ext = file.filename
                                    .split(".")
                                    .pop()
                                    ?.toLowerCase();
                                  let type = "";
                                  if (
                                    [
                                      "jpg",
                                      "jpeg",
                                      "png",
                                      "gif",
                                      "bmp",
                                      "webp",
                                    ].includes(ext || "")
                                  ) {
                                    type = `image/${
                                      ext === "jpg" ? "jpeg" : ext
                                    }`;
                                  } else if (ext === "pdf") {
                                    type = "application/pdf";
                                  }
                                  handleView(
                                    openLetter._id,
                                    file.filename,
                                    type
                                  );
                                }}
                              >
                                preview
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(openLetter._id, file.filename);
                                }}
                                disabled={isDownloadLoading[file.filename]}
                                className={`p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-200/70 rounded-md transition-colors duration-200 ${
                                  isDownloadLoading[file.filename]
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title={t.inbox.download}
                              >
                                {isDownloadLoading[file.filename] ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                <div className="mt-6 flex space-x-3 justify-end">
                  <button
                    onClick={() => setViewMode(true)}
                    disabled={isViewLoading}
                    className={`px-5 py-2 bg-[#C88B3D] text-white rounded-lg shadow-md hover:bg-[#D62E2E] transition-all duration-200 font-semibold text-base ${
                      isViewLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isViewLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        {t.inbox.loading}
                      </div>
                    ) : (
                      t.inbox.viewButton
                    )}
                  </button>
                </div>
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
                    {t.inbox.backButton}
                  </button>
                  <button
                    onClick={() => handlePrint()}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    {t.inbox.printButton}
                  </button>
                  {/* Only show forward button for non-CC letters */}
                  {!openLetter.isCC && (
                    <button
                      onClick={() => setShowForwardModal(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                    >
                      {t.inbox.forwardButton}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
      {showForwardModal && openLetter && (
        <Modal
          open={showForwardModal}
          onClose={() => setShowForwardModal(false)}
          center
          classNames={{
            modal: "custom-modal-small",
          }}
        >
          <div className="p-6 bg-white rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Forward Letter
            </h3>

            {/* Sender as Check Person */}
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeSender"
                  checked={forwardIncludeSender}
                  onChange={(e) => setForwardIncludeSender(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="includeSender"
                  className="font-semibold text-blue-700"
                >
                  Include Original Sender:
                </label>
              </div>
              <span className="text-gray-800">{openLetter.fromName}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Department
                </label>
                <DepartmentSelector
                  onChange={(value) => {
                    setSelectedDepartment(value);
                    setSelectedUsers([]); // Reset users when department changes
                  }}
                />
              </div>

              {selectedDepartment && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Select User(s)
                  </label>
                  {loadingUsers ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
                      {departmentUsers
                        .filter(
                          (u) =>
                            u.email !== user.email &&
                            u.departmentOrSector &&
                            u.departmentOrSector.trim().toLowerCase() ===
                              selectedDepartment.trim().toLowerCase()
                        )
                        .map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-100"
                          >
                            <input
                              type="checkbox"
                              id={`user-${user._id}`}
                              checked={selectedUsers.some(
                                (su) => su._id === user._id
                              )}
                              onChange={() => {
                                setSelectedUsers((prev) =>
                                  prev.some((su) => su._id === user._id)
                                    ? prev.filter((su) => su._id !== user._id)
                                    : [...prev, user]
                                );
                              }}
                              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`user-${user._id}`}
                              className="text-sm text-gray-700"
                            >
                              {user.name} ({user.email})
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="forwardComment"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Comment (Optional)
                </label>
                <textarea
                  id="forwardComment"
                  value={forwardComment}
                  onChange={(e) => setForwardComment(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Add a comment..."
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowForwardModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-semibold"
              >
                {t.inbox.cancel}
              </button>
              <button
                onClick={handleForwardLetter}
                disabled={
                  isForwardLoading ||
                  (selectedUsers.length === 0 && !forwardIncludeSender)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center text-sm font-semibold"
              >
                {isForwardLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                )}
                {t.inbox.forwardButton}
              </button>
            </div>
          </div>
        </Modal>
      )}
      <Modal
        open={previewVisible}
        onClose={handlePreviewClose}
        center
        classNames={{
          modal: "rounded-2xl shadow-2xl w-4/5 h-4/5",
          overlay: "bg-black/50 backdrop-blur-sm",
        }}
      >
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            {isPreviewLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 z-10">
                <LoadingSpinner message="Loading preview..." />
              </div>
            )}
            {previewType.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onLoad={() => setIsPreviewLoading(false)}
                onError={() => setIsPreviewLoading(false)}
              />
            ) : previewType === "application/pdf" ? (
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-lg shadow-lg"
                title="PDF Preview"
                onLoad={() => setIsPreviewLoading(false)}
                onError={() => setIsPreviewLoading(false)}
              />
            ) : (
              <div className="text-center p-8">
                <FileTextIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-2">
                  {t.inbox.previewNotAvailable}
                </p>
                <p className="text-sm text-gray-500">
                  {t.inbox.downloadToView}
                </p>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={handlePreviewClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              {t.inbox.closeButton}
            </button>
            <button
              onClick={() => {
                if (previewUrl) {
                  const link = document.createElement("a");
                  link.href = previewUrl;
                  link.download = "file";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:scale-105"
            >
              {t.inbox.downloadButton}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inbox;
