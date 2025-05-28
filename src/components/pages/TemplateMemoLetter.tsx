import React from "react";

// Helper to get global UTC date in dd/MM/yyyy format
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
  width: 42,
  height: 42,
  borderRadius: "50%",
  background: "#b07642",
  color: "white",
  fontSize: 22,
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
}) => (
  <div
    className="bg-white max-w-[800px] mx-auto shadow-xl border border-gray-200 rounded-lg relative"
    style={{
      fontFamily: "'Noto Sans Ethiopic', Arial, sans-serif",
      minHeight: "1100px",
      background: "white",
      paddingBottom: 0,
    }}
  >
    {/* HEADER */}
    <div className="pt-6 pb-1 px-8 border-b-8 border-[#b07642]">
      <div className="flex flex-col items-center">
        <img
          src="src/img icon/logo.png"
          alt="SSGI Logo"
          className="h-16 mb-2"
          style={{ objectFit: "contain" }}
        />
        <div className="text-[#03619c] font-bold leading-tight" style={{ fontSize: 18 }}>
          የአካባቢ ሳይንስ እና ቅጥያ ተከታታይ ኢንስቲትዩት
        </div>
        <div className="font-bold text-black tracking-wide text-lg mb-1">
          SPACE SCIENCE AND GEOSPATIAL INSTITUTE
        </div>
      </div>
      <div className="h-2 w-full mt-3 mb-0 flex items-center gap-1">
        <div className="h-2 w-1/2 bg-[#03619c] rounded-l-full" />
        <div className="h-2 w-1/4 bg-[#b07642]" />
        <div className="h-2 w-1/4 bg-[#f05323] rounded-r-full" />
      </div>
    </div>

    {/* MEMO TITLE & DATE */}
    <div className="flex justify-between items-center px-8 mt-4 mb-2">
      <div />
      <div className="text-center">
        <div className="text-[#03619c] font-bold" style={{ fontSize: 20 }}>
          የጽሁፍ ማስታወሻ
        </div>
        <div className="font-bold text-lg tracking-wide">OFFICE MEMO</div>
      </div>
      <div className="text-right text-[15px] text-[#03619c]">
        <div>
          ቀን {date || getFormattedUTCDate()}
        </div>
        <div className="text-xs text-gray-600">Date</div>
      </div>
    </div>

    {/* LETTER BODY */}
    <div className="px-10 py-2 min-h-[450px]">
      
      <div className="mb-1">
        <span className="font-semibold">{reference ? `ቁጥር ${reference}` : ""}</span>
      </div>
      
      <div className="mb-8" style={{ lineHeight: 2 }}>
        {body || children || (
          <span className="text-gray-400">[የደብዳቤ ይዘት እዚህ...]</span>
        )}
      </div>
      <div className="flex justify-end items-center space-x-12 mt-10">
      
      </div>
    </div>

    {/* CC, Copy To, etc */}
    <div className="px-10 mt-2">
      {cc && (
        <div className="mb-2">
          <div className="font-semibold underline">ኮፒ:</div>
          <div>{cc}</div>
        </div>
      )}
      {copyTo && (
        <div>
          <div className="font-semibold underline">ተቀባይዎች:</div>
          <div>{copyTo}</div>
        </div>
      )}
    </div>

    {/* FOOTER - as in your last image, no red or green lines after! */}
    <div className="w-full pt-3 pb-0 mt-6" style={{marginBottom: 0}}>
      <div
        className="w-full flex flex-col items-center"
        style={{ borderTop: "8px solid #194b5a" }}
      >
        <div className="flex w-full justify-between px-6 relative" style={{ marginTop: -24, zIndex: 2 }}>
          {/* Phone */}
          <div className="flex flex-col items-center w-1/5">
            <span style={iconStyle}>
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.54.57 1 1 0 011 1v3.61a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.61a1 1 0 011 1 11.36 11.36 0 00.57 3.54 1 1 0 01-.21 1.11l-2.2 2.2z" />
              </svg>
            </span>
            <div className="text-sm text-[#194b5a] leading-tight mt-2" style={{ fontFamily: "inherit" }}>
              +251 118 96 10 50<br />+251 115 51 84 45
            </div>
          </div>
          {/* Website */}
          <div className="flex flex-col items-center w-1/5">
            <span style={iconStyle}>
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M2 12h20M12 2c3.866 0 7 4.03 7 9s-3.134 9-7 9-7-4.03-7-9 3.134-9 7-9z" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </span>
            <a
              href="http://www.ssgi.gov.et"
              className="text-[#194b5a] underline text-sm mt-2"
              style={{ fontFamily: "inherit" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ssgi.gov.et
            </a>
          </div>
          {/* Mail/PO Box */}
          <div className="flex flex-col items-center w-1/5">
            <span style={iconStyle}>
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <rect width="18" height="14" x="3" y="5" rx="2" fill="none" stroke="white" strokeWidth="2"/>
                <polyline points="3 7 12 13 21 7" fill="none" stroke="white" strokeWidth="2"/>
              </svg>
            </span>
            <span className="text-[#194b5a] text-sm mt-2" style={{ fontFamily: "inherit" }}>
              33679 / 597
            </span>
          </div>
          {/* Email */}
          <div className="flex flex-col items-center w-1/5">
            <span style={iconStyle}>
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M8 12l2 2l4-4" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </span>
            <a
              href="mailto:info@ssgi.gov.et"
              className="text-[#194b5a] underline text-sm mt-2"
              style={{ fontFamily: "inherit" }}
            >
              info@ssgi.gov.et
            </a>
          </div>
          {/* Fax */}
          <div className="flex flex-col items-center w-1/5">
            <span style={iconStyle}>
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="white" strokeWidth="2"/>
                <path d="M8 4v4h8V4" fill="none" stroke="white" strokeWidth="2"/>
              </svg>
            </span>
            <span className="text-[#194b5a] text-sm mt-2" style={{ fontFamily: "inherit" }}>
              +251 118 72 02 83
            </span>
          </div>
        </div>
        <div className="text-center text-[#b07642] text-lg mt-1 mb-0" style={{ fontFamily: "'Noto Sans Ethiopic', Arial, sans-serif" }}>
          "አስራር አለበሰማይ..."
        </div>
      </div>
    </div>
  </div>
);

export default TemplateMemoLetter;