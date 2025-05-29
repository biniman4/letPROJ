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

const LetterManagement = ({ setSuccessMsg }) => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [letterDetailId, setLetterDetailId] = useState<string | null>(null);
  const [acceptedLetters, setAcceptedLetters] = useState<string[]>([]);
  const [letterSearch, setLetterSearch] = useState(""); // Letter search state
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/letters")
      .then((res) => {
        setLetters(res.data);
        setLoading(false);
      })
      .catch((err) => {
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

  const filteredLetters = letters.filter((letter) =>
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
    <>
      <div className="flex items-center mb-2 gap-2">
        <h3 className="text-2xl font-semibold text-gray-700">
          Letters Management
        </h3>
        <div className="flex items-center bg-gray-100 rounded px-2 py-1 ml-4">
          <Search className="w-4 h-4 text-gray-500 mr-1" />
          <input
            type="text"
            value={letterSearch}
            onChange={(e) => setLetterSearch(e.target.value)}
            placeholder="Search by subject..."
            className="bg-transparent outline-none px-1 py-0.5 text-sm"
          />
        </div>
      </div>
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
              {/* <span>
                <strong>Reference:</strong> {letter.reference || "N/A"}
              </span> */}
              <span>
                <strong>Priority:</strong> {letter.priority}
              </span>
            </div>
            <button
              className="text-blue-700 underline text-sm flex items-center gap-1 w-fit hover:text-blue-900"
              onClick={() => handleDetailLetter(letter._id)}
            >
              <Eye className="w-4 h-4" />{" "}
              {letterDetailId === letter._id ? "Hide Details" : "Show Details"}
            </button>
            {letterDetailId === letter._id && (
              <div className="bg-gray-50 p-3 my-2 rounded border">
                <div>
                  <strong>Content:</strong> {letter.content}
                </div>
              </div>
            )}
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
    </>
  );
};

export default LetterManagement;