import React, { useEffect, useState, useRef } from "react";
import {
  Eye,
  Check,
  Send,
  Download,
  FileCheck,
  Upload,
  Search,
} from "lucide-react";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import TemplateMemoLetter from "./TemplateMemoLetter";

const getLetterSentDate = (dateString: string) => {
  const d = new Date(dateString);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const LetterManagement = ({ setSuccessMsg }) => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedLetters, setAcceptedLetters] = useState<string[]>([]);
  const [letterSearch, setLetterSearch] = useState("");
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [openLetter, setOpenLetter] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/letters")
      .then((res) => {
        setLetters(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLetters([]);
        setLoading(false);
      });
  }, []);

  const handleApproveLetter = (id: string) => {
    setLetters((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, status: "approved" } : l
      )
    );
    setSuccessMsg(`Letter ${id} approved!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleSendLetter = (id: string) => {
    setLetters((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, status: "sent" } : l
      )
    );
    setSuccessMsg(`Letter ${id} sent!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleDetailLetter = (letter) => {
    setOpenLetter(letter);
    setViewMode(false);
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  const handleAcceptFile = (id: string) => {
    setAcceptedLetters((prev) => [...prev, id]);
    setSuccessMsg(`Letter ${id} accepted by user!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleSubmitFileClick = (letterId: string) => {
    if (fileInputRefs.current[letterId]) {
      fileInputRefs.current[letterId]!.value = "";
      fileInputRefs.current[letterId]!.click();
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    letterId: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLetters((prevLetters) =>
        prevLetters.map((l) =>
          l._id === letterId
            ? { ...l, attachmentUrl: URL.createObjectURL(file) }
            : l
        )
      );
      setSuccessMsg(
        `File "${file.name}" submitted to letter ${letterId}! (demo)`
      );
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  // Chronological sort (newest first)
  const sortedLetters = [...letters].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredLetters = sortedLetters.filter((letter) =>
    (letter.subject || "")
      .toLowerCase()
      .includes(letterSearch.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        Loading letters...
      </div>
    );

  return (
    <div className="h-[70vh] flex flex-col border rounded-lg shadow">
      {/* Sticky search bar/header */}
      <div className="sticky top-0 z-10 bg-white p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <h3 className="text-2xl font-semibold text-gray-700 flex-shrink-0">Letters Management</h3>
          <div className="flex items-center bg-gray-100 rounded px-2 py-1 w-full sm:w-auto">
            <Search className="w-4 h-4 text-gray-500 mr-1" />
            <input
              type="text"
              value={letterSearch}
              onChange={(e) => setLetterSearch(e.target.value)}
              placeholder="Search by subject..."
              className="bg-transparent outline-none px-1 py-0.5 text-sm w-full min-w-0"
            />
          </div>
        </div>
        {/* Letter count */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600">
            Showing <span className="font-bold">{filteredLetters.length}</span> letter{filteredLetters.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      {/* Scrollable letter list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-6 md:grid-cols-2">
          {filteredLetters.map((letter) => (
            <div
              key={letter._id}
              className="bg-white shadow rounded-lg p-5 flex flex-col gap-2 border relative"
            >
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full font-semibold
                  ${letter.status === "approved"
                    ? "bg-green-200 text-green-800"
                    : letter.status === "sent"
                      ? "bg-blue-200 text-blue-900"
                      : "bg-yellow-200 text-yellow-800"
                  }
                `}
              >
                {letter.status
                  ? letter.status.charAt(0).toUpperCase() +
                  letter.status.slice(1)
                  : "Pending"}
              </span>
              <div className="mb-1">
                <span className="font-medium">Subject:</span> {letter.subject}
              </div>
              <div className="mb-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>
                  <strong>Sender:</strong> {letter.fromName || "Unknown"}
                </span>
                <span>
                  <strong>Receiver:</strong> {letter.to || "Unknown"}
                </span>
              </div>
              <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>
                  <strong>Priority:</strong> {letter.priority}
                </span>
              </div>
              <button
                className="text-blue-700 underline text-sm flex items-center gap-1 w-fit hover:text-blue-900"
                onClick={() => handleDetailLetter(letter)}
              >
                <Eye className="w-4 h-4" /> Show Details
              </button>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-green-700"
                  onClick={() => handleApproveLetter(letter._id)}
                  disabled={letter.status !== "pending"}
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-blue-700"
                  onClick={() => handleSendLetter(letter._id)}
                  disabled={letter.status !== "approved"}
                >
                  <Send className="w-4 h-4" /> Send
                </button>
                <button
                  className="bg-gray-700 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-gray-800"
                  onClick={() => handleDownload(letter.fileUrl)}
                >
                  <Download className="w-4 h-4" /> Letter File
                </button>
                {letter.attachmentUrl && (
                  <button
                    className="bg-gray-700 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-gray-800"
                    onClick={() => handleDownload(letter.attachmentUrl)}
                  >
                    <Download className="w-4 h-4" /> Attachment
                  </button>
                )}
                <button
                  className="bg-purple-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-purple-800"
                  onClick={() => handleSubmitFileClick(letter._id)}
                >
                  <Upload className="w-4 h-4" /> Submit File
                </button>
                <input
                  ref={el => (fileInputRefs.current[letter._id] = el)}
                  type="file"
                  className="hidden"
                  onChange={e => handleFileChange(e, letter._id)}
                  accept="*"
                />
                {acceptedLetters.includes(letter._id) ? (
                  <span className="text-green-700 flex items-center gap-1 font-semibold ml-2">
                    <FileCheck className="w-4 h-4" /> Accepted
                  </span>
                ) : (
                  <button
                    className="bg-pink-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-pink-800"
                    onClick={() => handleAcceptFile(letter._id)}
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Letter Details Modal (like Inbox) */}
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
                <strong>To:</strong> {openLetter.to || openLetter.toEmail}
              </div>
              <div className="mb-2 text-gray-700">
                <strong>From:</strong> {openLetter.fromName || openLetter.fromEmail}
              </div>
              <div className="mb-2 text-gray-700">
                <strong>Department:</strong> {openLetter.department}
              </div>
              <div className="mb-2 text-gray-700">
                <strong>Priority:</strong> {openLetter.priority}
              </div>
              <div className="mb-2 text-gray-700">
                <strong>Date:</strong> {getLetterSentDate(openLetter.createdAt)}
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
                recipient={openLetter.to || openLetter.toEmail}
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

export default LetterManagement;