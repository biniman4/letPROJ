import React, { useState, useEffect } from "react";

// Example departments (replace with API call if needed)
const DEPARTMENTS = [
  "IT",
  "HR",
  "Finance",
  "Research",
  "Operations",
  "Space Science",
];

const getFormattedUTCDate = () => {
  const now = new Date();
  const day = String(now.getUTCDate()).padStart(2, "0");
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const year = now.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const iconStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "#b07642",
  color: "white",
  fontSize: 18,
  margin: "0 auto",
  zIndex: 2,
  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
};

const TemplateMemoLetter = ({
  subject,
  date,
  recipient,
  reference,
  body,
  signature,
  cc,
  copyTo,
  children,
}: {
  subject?: string;
  date?: string;
  recipient?: string;
  reference?: string;
  body?: React.ReactNode;
  signature?: React.ReactNode;
  cc?: React.ReactNode;
  copyTo?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [userDepartment, setUserDepartment] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    // Simulate fetching departments (replace with API if needed)
    setDepartments(DEPARTMENTS);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(
      user.name && user.name !== "undefined"
        ? user.name
        : user.username && user.username !== "undefined"
        ? user.username
        : user.email && user.email !== "undefined"
        ? user.email
        : ""
    );
    setUserDepartment(
      user.department && user.department !== "undefined"
        ? user.department
        : ""
    );
    setSelectedDepartment(
      user.department && user.department !== "undefined"
        ? user.department
        : ""
    );
  }, []);

  const handleSendComment = () => {
    if (comment.trim()) {
      setComments((prev) => [...prev, comment]);
      setComment("");
    }
  };

  return (
    <div
      className="bg-white w-full max-w-[850px] mx-auto shadow border border-gray-200 rounded-lg relative flex flex-col min-h-screen"
      style={{
        fontFamily: "'Noto Sans Ethiopic', Arial, sans-serif",
        background: "white",
      }}
    >
      {/* HEADER */}
      <div className="px-0 pt-4 pb-2 border-b-8 border-[#b07642]">
        <div className="flex flex-col items-center">
          {/* Bigger Logo at the top */}
          <img
            src="src/img icon/logo.png"
            alt="SSGI Logo"
            className="h-20 sm:h-24 md:h-28 mb-2"
            style={{ objectFit: "contain", maxWidth: 120 }}
          />
          <div className="text-[#03619c] font-bold leading-tight text-[15px] xs:text-[16px] sm:text-lg md:text-xl lg:text-2xl text-center">
            የስፔስ ሳይንስ እና ጂኦስፓሻል ኢንስቲትዩት
          </div>
          <div className="font-bold text-black tracking-wide text-[15px] xs:text-[16px] sm:text-lg md:text-xl lg:text-2xl mb-2 text-center">
            SPACE SCIENCE AND GEOSPATIAL INSTITUTE
          </div>
        </div>
        <div className="h-2 w-full mt-3 mb-0 flex items-center gap-[2px] px-2 sm:px-8">
          <div className="h-2 w-1/2 bg-[#03619c] rounded-l-full" />
          <div className="h-2 w-1/4 bg-[#b07642]" />
          <div className="h-2 w-1/4 bg-[#f05323] rounded-r-full" />
        </div>
      </div>

      {/* MEMO TITLE & DATE */}
      <div className="flex flex-row justify-between items-center px-2 xs:px-4 sm:px-8 mt-3 mb-2">
        <div />
        <div className="text-center flex flex-col items-center">
          <div className="text-[#03619c] font-bold text-[15px] xs:text-[16px] sm:text-lg md:text-xl lg:text-2xl leading-tight">
            የዉስጥ ማስታወሻ
          </div>
          <div className="font-bold text-[15px] xs:text-[16px] sm:text-lg md:text-xl lg:text-2xl tracking-wide">
            OFFICE MEMO
          </div>
        </div>
        <div className="text-right text-[#03619c] text-[13px] xs:text-[14px] sm:text-base md:text-lg">
          <div>
            <span className="inline-block align-middle mr-1" title="Date">
              <svg
                width="15"
                height="15"
                fill="#03619c"
                viewBox="0 0 24 24"
                style={{ display: "inline" }}
              >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z" />
              </svg>
            </span>
            {date || getFormattedUTCDate()}
          </div>
          <div className="text-[11px] sm:text-xs md:text-sm text-gray-600">
            Date
          </div>
        </div>
      </div>

      {/* SUBJECT LABEL */}
      <div className="px-2 xs:px-4 sm:px-8 mt-2 mb-1">
        <div className="font-semibold text-lg">
          <span className="text-gray-600">Subject: </span>
          <span className="text-gray-900">{subject}</span>
        </div>
      </div>

      {/* RECIPIENT */}
      {recipient && (
        <div className="px-2 xs:px-4 sm:px-8 pb-2">
          <div className="text-sm text-gray-700">
            <span className="font-medium">To: </span>
            {recipient}
          </div>
        </div>
      )}

      {/* LETTER BODY */}
      <div className="flex-1 px-2 xs:px-4 sm:px-8 pt-2 pb-0 min-h-[200px]">
        {reference && (
          <div className="mb-2 text-[13px] xs:text-sm sm:text-base md:text-lg font-semibold">{`ቁጥር ${reference}`}</div>
        )}
        <div
          className="mb-8 text-[14px] xs:text-[15px] sm:text-base md:text-lg text-gray-700"
          style={{ lineHeight: 1.85 }}
        >
          {body || children || (
            <span className="text-gray-400">Enter letter content</span>
          )}
        </div>
      </div>

      {/* COMMENT SECTION */}
      <div
        className="px-2 xs:px-4 sm:px-8 pb-2 rounded-lg mt-4"
        style={{
          background: "linear-gradient(90deg, #f3f7fa 0%, #e3f0fa 100%)",
          border: "1.5px solid #b07642",
          boxShadow: "0 2px 8px 0 rgba(176,118,66,0.07)",
        }}
      >
        {/* Department Selector */}
        <div className="flex flex-col gap-1 mb-2 pt-3">
          <label className="block text-xs text-gray-500 font-semibold mb-1">
            Department/Sector
          </label>
          <select
            className="w-full max-w-xs rounded px-3 py-2 border mb-2"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <div>
            <span className="block text-xs text-gray-500 font-semibold mb-1">
              NAME
            </span>
            <span className="block text-base font-bold text-[#03619c]">
              {userName || <span className="text-gray-400">No Name</span>}
            </span>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700 mb-2 mt-2">
          Comment:
        </div>
        <div className="flex flex-col gap-2">
          {/* List all comments */}
          {comments.length > 0 ? (
            <div className="flex flex-col gap-2">
              {comments.map((c, idx) => (
                <div
                  key={idx}
                  className="text-base text-gray-800 min-h-[40px] rounded px-3 py-2 shadow-sm"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    whiteSpace: "pre-wrap",
                    maxWidth: "100%",
                    outline: "none",
                    background: "#fffbe9",
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 text-base min-h-[40px]">
              No comment sent yet.
            </span>
          )}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b07642] text-gray-800 shadow-sm"
              placeholder="Type your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendComment();
              }}
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-line",
                maxWidth: "100%",
                background:
                  "linear-gradient(90deg, #f9e7d0 0%, #f3f7fa 50%, #e3f0fa 100%)",
              }}
            />
            <button
              className="bg-[#b07642] hover:bg-[#a06a3a] text-white font-semibold px-4 py-2 rounded shadow transition-colors flex items-center gap-1"
              onClick={handleSendComment}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 5v14m7-7H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* SIGNATURE */}
      <div className="flex justify-between items-center mx">
        {signature && (
          <div className="px-2 xs:px-4 sm:px-8 pb-2">
            <div className="text-sm font-medium text-gray-700 mt-8">
              Signature:
            </div>
            <div className="text-base text-gray-800">{signature}</div>
          </div>
        )}
      </div>

      {/* CC / CopyTo */}
      {cc && (
        <div className="px-2 xs:px-4 sm:px-8 pb-2">
          <div className="text-sm font-medium text-gray-700">CC:</div>
          <div className="text-base text-gray-800">{cc}</div>
        </div>
      )}
      {copyTo && (
        <div className="px-2 xs:px-4 sm:px-8 pb-2">
          <div className="text-sm font-medium text-gray-700">Copy To:</div>
          <div className="text-base text-gray-800">{copyTo}</div>
        </div>
      )}

      {children}

      {/* FOOTER */}
      <div className="w-full pt-2">
        <div
          className="w-full flex flex-col items-center"
          style={{ borderTop: "4px solid #194b5a" }}
        >
          <div
            className={`
            flex w-full flex-row flex-wrap justify-between
            px-0
            mt-[-18px] z-20
            gap-y-1
            xs:gap-y-1
            xs:px-2
            sm:px-6
            xs:mt-[-14px]
            sm:mt-[-18px]
            [@media(max-width:410px)]:gap-x-1
            [@media(max-width:410px)]:px-1
            [@media(max-width:410px)]:mt-[-8px]
            [@media(max-width:375px)]:mt-[-4px]
            [@media(max-width:370px)]:gap-x-0
            [@media(max-width:370px)]:px-0
            [@media(max-width:370px)]:mt-[-2px]
          `}
          >
            {/* Phone */}
            <div className="flex flex-col items-center w-1/5 min-w-[46px] mb-2">
              <span
                style={{
                  ...iconStyle,
                  width: 32,
                  height: 32,
                  fontSize: 14,
                  // Larger on desktop
                  ...(typeof window !== "undefined" && window.innerWidth >= 1024
                    ? { width: 40, height: 50, fontSize: 24 }
                    : {}),
                }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.54.57 1 1 0 011 1v3.61a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.61a1 1 0 011 1 11.36 11.36 0 00.57 3.54 1 1 0 01-.21 1.11l-2.2 2.2z" />
                </svg>
              </span>
              <div
                className="text-[12px] xs:text-xs sm:text-base md:text-lg text-[#194b5a] leading-tight mt-1 text-center"
                style={{ fontFamily: "inherit" }}
              >
                +251 118 96 10 50
                <br />
                +251 115 51 84 45
              </div>
            </div>
            {/* Website */}
            <div className="flex flex-col items-center w-1/5 min-w-[46px] mb-2">
              <span
                style={{
                  ...iconStyle,
                  width: 32,
                  height: 32,
                  fontSize: 18,
                  ...(typeof window !== "undefined" && window.innerWidth >= 1024
                    ? { width: 40, height: 40, fontSize: 24 }
                    : {}),
                }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M2 12h20M12 2c3.866 0 7 4.03 7 9s-3.134 9-7 9-7-4.03-7-9 3.134-9 7-9z"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
              <a
                href="http://www.ssgi.gov.et"
                className="text-[#194b5a] underline text-[12px] xs:text-xs sm:text-base md:text-lg mt-1 text-center"
                style={{ fontFamily: "inherit" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                www.ssgi.gov.et
              </a>
            </div>
            {/* Mail/PO Box */}
            <div className="flex flex-col items-center w-1/5 min-w-[46px] mb-2">
              <span
                style={{
                  ...iconStyle,
                  width: 32,
                  height: 32,
                  fontSize: 18,
                  ...(typeof window !== "undefined" && window.innerWidth >= 1024
                    ? { width: 40, height: 40, fontSize: 24 }
                    : {}),
                }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <rect
                    width="18"
                    height="14"
                    x="3"
                    y="5"
                    rx="2"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <polyline
                    points="3 7 12 13 21 7"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <span
                className="text-[#194b5a] text-[12px] xs:text-xs sm:text-base md:text-lg mt-1 text-center"
                style={{ fontFamily: "inherit" }}
              >
                33679 / 597
              </span>
            </div>
            {/* Email */}
            <div className="flex flex-col items-center w-1/5 min-w-[46px] mb-2">
              <span
                style={{
                  ...iconStyle,
                  width: 32,
                  height: 32,
                  fontSize: 18,
                  ...(typeof window !== "undefined" && window.innerWidth >= 1024
                    ? { width: 40, height: 40, fontSize: 24 }
                    : {}),
                }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M8 12l2 2l4-4"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
              <a
                href="mailto:info@ssgi.gov.et"
                className="text-[#194b5a] underline text-[12px] xs:text-xs sm:text-base md:text-lg mt-1 text-center"
                style={{ fontFamily: "inherit" }}
              >
                info@ssgi.gov.et
              </a>
            </div>
            {/* Fax */}
            <div className="flex flex-col items-center w-1/5 min-w-[46px] mb-2">
              <span
                style={{
                  ...iconStyle,
                  width: 32,
                  height: 32,
                  fontSize: 18,
                  ...(typeof window !== "undefined" && window.innerWidth >= 1024
                    ? { width: 40, height: 40, fontSize: 24 }
                    : {}),
                }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 4v4h8V4"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <span
                className="text-[#194b5a] text-[12px] xs:text-xs sm:text-base md:text-lg mt-1 text-center"
                style={{ fontFamily: "inherit" }}
              >
                +251 118 72 02 83
              </span>
            </div>
          </div>
          <div
            className="text-center text-[#b07642] text-[13px] xs:text-sm sm:text-base md:text-lg mt-1 mb-0"
            style={{ fontFamily: "'Noto Sans Ethiopic', Arial, sans-serif" }}
          >
            "ከምድር እስከ ህዋ..."
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateMemoLetter;