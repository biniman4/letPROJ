import React, { useRef, useState } from "react";
import {
  Eye,
  Check,
  Send,
  Download,
  FileCheck,
  Upload,
  Search,
} from "lucide-react";

const mockLetters = [
  {
    id: "l1",
    sender: { name: "Alice Smith", department: "HR" },
    receiver: { name: "Bob Jones", department: "Finance" },
    date: "2025-05-28",
    priority: "High",
    subject: "Policy Update",
    content: "Please review the updated HR policy.",
    fileUrl: "/mock-letters/policy-update.pdf",
    attachmentUrl: "/mock-attachments/policy-attachment.pdf",
    status: "pending",
  },
  {
    id: "l2",
    sender: { name: "Carol Lee", department: "IT" },
    receiver: { name: "Dana White", department: "Admin" },
    date: "2025-05-27",
    priority: "Medium",
    subject: "System Maintenance",
    content: "Scheduled system maintenance for June 1st.",
    fileUrl: "/mock-letters/it-maintenance.pdf",
    status: "pending",
  },
];

const LetterManagement = ({ setSuccessMsg }) => {
  const [letters, setLetters] = useState(mockLetters);
  const [letterDetailId, setLetterDetailId] = useState<string | null>(null);
  const [acceptedLetters, setAcceptedLetters] = useState<string[]>([]);
  const [letterSearch, setLetterSearch] = useState(""); // Letter search state
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleApproveLetter = (id: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "approved" } : l))
    );
    setSuccessMsg(`Letter ${id} approved!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };
  const handleSendLetter = (id: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "sent" } : l))
    );
    setSuccessMsg(`Letter ${id} sent!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };
  const handleDetailLetter = (id: string) => {
    setLetterDetailId((prev) => (prev === id ? null : id));
  };
  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };
  const handleAcceptFile = (id: string) => {
    setAcceptedLetters((prev) => [...prev, id]);
    setSuccessMsg(`Letter ${id} accepted by user!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  // Submit File logic (demo: attaches file to the specific letter)
  const handleSubmitFileClick = (letterId: string) => {
    if (fileInputRefs.current[letterId]) {
      fileInputRefs.current[letterId]!.value = "";
      fileInputRefs.current[letterId]!.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, letterId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLetters((prevLetters) =>
        prevLetters.map((l) =>
          l.id === letterId ? { ...l, attachmentUrl: URL.createObjectURL(file) } : l
        )
      );
      setSuccessMsg(
        `File "${file.name}" submitted to letter ${letterId}! (demo)`
      );
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  const filteredLetters = letters.filter((letter) =>
    letter.subject.toLowerCase().includes(letterSearch.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center mb-2 gap-2">
        <h3 className="text-2xl font-semibold text-gray-700">Letters Management</h3>
        <div className="flex items-center bg-gray-100 rounded px-2 py-1 ml-4">
          <Search className="w-4 h-4 text-gray-500 mr-1" />
          <input
            type="text"
            value={letterSearch}
            onChange={e => setLetterSearch(e.target.value)}
            placeholder="Search by subject..."
            className="bg-transparent outline-none px-1 py-0.5 text-sm"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filteredLetters.map((letter) => (
          <div
            key={letter.id}
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
              {letter.status.charAt(0).toUpperCase() +
                letter.status.slice(1)}
            </span>
            <div className="mb-1">
              <span className="font-medium">Subject:</span> {letter.subject}
            </div>
            <div className="mb-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span>
                <strong>Sender:</strong> {letter.sender.name} (
                {letter.sender.department})
              </span>
              <span>
                <strong>Receiver:</strong> {letter.receiver.name} (
                {letter.receiver.department})
              </span>
            </div>
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span>
                <strong>Date:</strong> {letter.date}
              </span>
              <span>
                <strong>Priority:</strong> {letter.priority}
              </span>
            </div>
            {/* Detail Toggle */}
            <button
              className="text-blue-700 underline text-sm flex items-center gap-1 w-fit hover:text-blue-900"
              onClick={() => handleDetailLetter(letter.id)}
            >
              <Eye className="w-4 h-4" />{" "}
              {letterDetailId === letter.id ? "Hide Details" : "Show Details"}
            </button>
            {letterDetailId === letter.id && (
              <div className="bg-gray-50 p-3 my-2 rounded border">
                <div>
                  <strong>Content:</strong> {letter.content}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-green-700"
                onClick={() => handleApproveLetter(letter.id)}
                disabled={letter.status !== "pending"}
              >
                <Check className="w-4 h-4" /> Approve
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-blue-700"
                onClick={() => handleSendLetter(letter.id)}
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
                onClick={() => handleSubmitFileClick(letter.id)}
              >
                <Upload className="w-4 h-4" /> Submit File
              </button>
              <input
                ref={el => (fileInputRefs.current[letter.id] = el)}
                type="file"
                className="hidden"
                onChange={e => handleFileChange(e, letter.id)}
                accept="*"
              />
              {acceptedLetters.includes(letter.id) ? (
                <span className="text-green-700 flex items-center gap-1 font-semibold ml-2">
                  <FileCheck className="w-4 h-4" /> Accepted
                </span>
              ) : (
                <button
                  className="bg-pink-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 hover:bg-pink-800"
                  onClick={() => handleAcceptFile(letter.id)}
                >
                  <Check className="w-4 h-4" /> Accept
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LetterManagement;