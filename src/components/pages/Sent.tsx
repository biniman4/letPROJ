import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Input, Select, Modal, Form } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SendOutlined,
  PaperClipOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  PrinterOutlined,
  MailOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import TemplateMemoLetter from "./TemplateMemoLetter";
import { useLanguage } from "./LanguageContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { useSent } from "../../context/SentContext";
import ErrorBoundary from "../common/ErrorBoundary";
import logo from "../../img icon/logo.png";

interface Attachment {
  filename: string;
  contentType: string;
  uploadDate: string;
}

interface Letter {
  _id: string;
  subject: string;
  to: string;
  toEmail: string;
  fromEmail: string;
  createdAt: string;
  status: string;
  rejectionNote?: string;
  department: string;
  priority: string;
  attachments: Attachment[];
  content: string;
  fromName: string;
}

const Sent: React.FC = () => {
  const { letters, loading, fetchLetters, refresh } = useSent();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [composeVisible, setComposeVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewType, setPreviewType] = useState<string>("");
  const [memoViewVisible, setMemoViewVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [form] = Form.useForm();
  const [attachment, setAttachment] = useState<File | null>(null);
  const memoPrintRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user.email || "";

  const handleDownload = async (letterId: string, filename: string) => {
    try {
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
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(t.sent.errorDownloadingFile);
    }
  };

  const handleView = async (
    letterId: string,
    filename: string,
    contentType: string
  ) => {
    try {
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
      toast.error(t.sent.errorViewingFile);
    }
  };

  const handlePreviewClose = () => {
    setPreviewVisible(false);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  const handleMemoView = (letter: Letter) => {
    setSelectedLetter(letter);
    setMemoViewVisible(true);
  };

  const handlePrint = () => {
    if (!selectedLetter) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const printContent = `
        <html>
          <head>
            <title>Memo - ${selectedLetter.subject}</title>
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
                          selectedLetter.createdAt
                        ).toLocaleDateString("en-GB")}</strong></p>
                        <p class="date-label">Date</p>
                    </div>
                </div>

                <div class="memo-body">
                    <p><strong>Subject:</strong> ${selectedLetter.subject}</p>
                    <p><strong>To:</strong> ${selectedLetter.to}</p>
                    <br>
                    <div class="content-body">${selectedLetter.content.replace(
                      /\n/g,
                      "<br>"
                    )}</div>
                    <div class="signature-section">
                        <p>Signature:</p>
                        <br><br>
                        <p>${selectedLetter.fromName}</p>
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

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "normal":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const columns = [
    {
      title: t.sent.subjectColumn,
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: t.sent.toColumn,
      dataIndex: "to",
      key: "to",
    },
    {
      title: t.sent.departmentColumn,
      dataIndex: "department",
      key: "department",
    },
    {
      title: t.sent.dateColumn,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t.sent.statusColumn,
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status.charAt(0).toUpperCase() + status.slice(1),
    },
    {
      title: t.sent.priorityColumn,
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityClass(
            priority
          )}`}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      ),
    },
    {
      title: t.sent.attachmentsColumn,
      key: "attachments",
      render: (record: Letter) => (
        <div className="flex gap-2">
          {record.attachments && record.attachments.length > 0 ? (
            record.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-1">
                <PaperClipOutlined className="text-gray-600" />
                <span className="text-sm text-gray-600">
                  {attachment.filename}
                </span>
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() =>
                    handleView(
                      record._id,
                      attachment.filename,
                      attachment.contentType
                    )
                  }
                  size="small"
                />
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={() =>
                    handleDownload(record._id, attachment.filename)
                  }
                  size="small"
                />
              </div>
            ))
          ) : (
            <span className="text-gray-400">{t.sent.noAttachments}</span>
          )}
        </div>
      ),
    },
    {
      title: t.sent.memoViewColumn,
      key: "memoView",
      render: (record: Letter) => (
        <Button
          type="link"
          icon={<FileTextOutlined />}
          onClick={() => handleMemoView(record)}
          size="small"
        >
          {t.sent.viewMemoButton}
        </Button>
      ),
    },
  ];

  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      letter.to.toLowerCase().includes(searchText.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "all") {
      return true;
    }

    if (statusFilter === "delivered") {
      return letter.status !== "pending";
    }

    const isPriorityFilter = ["normal", "high", "urgent"].includes(
      statusFilter
    );
    if (isPriorityFilter) {
      return letter.priority === statusFilter;
    }

    return letter.status === statusFilter;
  });

  // Pagination logic
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter]);

  const handleSendLetter = async (values: {
    subject: string;
    recipient: string;
    content: string;
    department: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("subject", values.subject);
      formData.append("to", values.recipient);
      formData.append("content", values.content);
      formData.append("department", values.department);
      formData.append("priority", "normal");
      formData.append("fromEmail", userEmail); // Add sender's email

      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await axios.post(
        "http://localhost:5000/api/letters",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh the sent letters list to include the new letter
      refresh();
      toast.success(t.sent.letterSentSuccess);
      setComposeVisible(false);
      form.resetFields();
      setAttachment(null);
    } catch (error) {
      console.error("Error sending letter:", error);
      toast.error(t.sent.failedToSendLetter);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-3 mb-2">
          <MailOutlined className="text-4xl text-[#C88B3D] animate-bounce" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#C88B3D] to-[#BFBFBF] drop-shadow-lg">
            {t.sent.title || "Sent Letters"}
          </h1>
        </div>
        <p className="text-lg text-gray-500 font-medium">
          {t.sent.manageSent || "Easily track and manage all your sent correspondence"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 justify-between">
        <div className="flex gap-4 w-full md:w-auto">
          <Input
            placeholder={t.sent.searchPlaceholder || "Search letters..."}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-xs rounded-lg shadow-sm border-blue-200 focus:border-blue-400"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-40 rounded-lg shadow-sm border-blue-200"
          >
            <Select.Option value="all">
              {t.sent.allStatus || "All Status"}
            </Select.Option>
            <Select.Option value="delivered">
              {t.sent.statusDelivered || "Delivered"}
            </Select.Option>
            <Select.Option value="pending">
              {t.sent.statusPending || "Pending"}
            </Select.Option>
            <Select.Option value="rejected">
              {t.sent.statusRejected || "Rejected"}
            </Select.Option>
            <Select.Option value="normal">
              {t.sent.priorityNormal || "Normal"}
            </Select.Option>
            <Select.Option value="high">
              {t.sent.priorityHigh || "High"}
            </Select.Option>
            <Select.Option value="urgent">
              {t.sent.priorityUrgent || "Urgent"}
            </Select.Option>
          </Select>
          <div className="flex items-center rounded-lg p-1 bg-gray-100 border border-gray-200">
            <Button
              type="text"
              icon={<AppstoreOutlined />}
              onClick={() => setViewType("grid")}
              className={
                viewType === "grid"
                  ? "text-white bg-[#003F5D]"
                  : "text-gray-500"
              }
            />
            <Button
              type="text"
              icon={<BarsOutlined />}
              onClick={() => setViewType("list")}
              className={
                viewType === "list"
                  ? "text-white bg-[#003F5D]"
                  : "text-gray-500"
              }
            />
          </div>
        </div>
        <Button
          type="primary"
          icon={<SendOutlined />}
          className="bg-gradient-to-r from-[#C88B3D] to-[#BFBFBF] text-[#003F5D] border-0 shadow-lg hover:from-[#BFBFBF] hover:to-[#C88B3D] transition-all duration-300"
          onClick={() => navigate("/new-letter")}
        >
          {t.sent.newLetterButton || "New Letter"}
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your sent letters..." />
      ) : (
        <>
          {letters.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-xl font-semibold py-20">
              <MailOutlined className="text-6xl mb-4 animate-pulse text-blue-300" />
              <div>No sent letters found.</div>
            </div>
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentLetters.map((letter) => (
                <div
                  key={letter._id}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#003F5D] hover:border-[#C88B3D] relative group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-[#003F5D] group-hover:text-[#C88B3D] transition-colors duration-300">
                      {letter.subject}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityClass(
                        letter.priority
                      )}`}
                    >
                      {letter.priority.charAt(0).toUpperCase() +
                        letter.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[#BFBFBF]">
                      To:{" "}
                      <span className="font-medium text-[#003F5D]">
                        {letter.to}
                      </span>
                    </span>
                    <span className="text-xs text-[#BFBFBF]">
                      {new Date(letter.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2 text-sm text-[#BFBFBF]">
                    Department:{" "}
                    <span className="font-medium text-[#003F5D]">
                      {letter.department}
                    </span>
                  </div>
                  <div className="mb-3 text-[#003F5D] line-clamp-2">
                    {letter.content}
                  </div>
                  <div className="flex gap-2 mb-2">
                    {letter.attachments && letter.attachments.length > 0 ? (
                      letter.attachments.map((attachment, idx) => (
                        <Button
                          key={idx}
                          type="link"
                          icon={<PaperClipOutlined />}
                          className="text-[#003F5D] hover:text-[#C88B3D]"
                          onClick={() =>
                            handleDownload(letter._id, attachment.filename)
                          }
                        >
                          {attachment.filename}
                        </Button>
                      ))
                    ) : (
                      <span className="text-[#BFBFBF] italic">
                        No attachments
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      type="default"
                      icon={<EyeOutlined />}
                      className="hover:bg-[#003F5D]/10 hover:text-[#003F5D]"
                      onClick={() =>
                        handleView(
                          letter._id,
                          letter.attachments[0]?.filename,
                          letter.attachments[0]?.contentType
                        )
                      }
                      disabled={
                        !letter.attachments || letter.attachments.length === 0
                      }
                    >
                      View
                    </Button>
                    <Button
                      type="default"
                      icon={<FileTextOutlined />}
                      className="hover:bg-[#C88B3D]/10 hover:text-[#C88B3D]"
                      onClick={() => handleMemoView(letter)}
                    >
                      Memo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {currentLetters.map((letter) => (
                <div
                  key={letter._id}
                  className="group bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-[#003F5D] hover:border-[#C88B3D] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <MailOutlined className="text-2xl text-[#003F5D]" />
                    <div className="flex-grow">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-[#003F5D] group-hover:text-[#C88B3D] transition-colors duration-300">
                          {letter.subject}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityClass(
                            letter.priority
                          )}`}
                        >
                          {letter.priority.charAt(0).toUpperCase() +
                            letter.priority.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        To: <span className="font-medium">{letter.to}</span> |
                        Dept:{" "}
                        <span className="font-medium">{letter.department}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-xs text-gray-400 mb-2">
                      {new Date(letter.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {letter.attachments && letter.attachments.length > 0 && (
                        <Button
                          type="default"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() =>
                            handleView(
                              letter._id,
                              letter.attachments[0]?.filename,
                              letter.attachments[0]?.contentType
                            )
                          }
                        >
                          View
                        </Button>
                      )}
                      <Button
                        type="default"
                        size="small"
                        icon={<FileTextOutlined />}
                        onClick={() => handleMemoView(letter)}
                      >
                        Memo
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredLetters.length > 0 && (
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
        </>
      )}

      <Modal
        title={t.sent.composeNewLetter}
        open={composeVisible}
        onCancel={() => {
          setComposeVisible(false);
          setAttachment(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSendLetter}>
          <Form.Item
            label={t.sent.subjectLabel}
            name="subject"
            rules={[{ required: true, message: t.sent.subjectRequired }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t.sent.recipientLabel}
            name="recipient"
            rules={[{ required: true, message: t.sent.recipientRequired }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t.sent.departmentLabel}
            name="department"
            rules={[{ required: true, message: t.sent.departmentRequired }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t.sent.contentLabel}
            name="content"
            rules={[{ required: true, message: t.sent.contentRequired }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label={t.sent.attachmentLabel || "Attachment"}>
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {attachment && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PaperClipOutlined />
                  <span>{attachment.name}</span>
                  <Button
                    type="link"
                    danger
                    onClick={removeAttachment}
                    size="small"
                  >
                    {t.sent.removeAttachment}
                  </Button>
                </div>
              )}
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              block
            >
              {t.sent.sendLetterButton}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title={t.sent.filePreview}
        open={previewVisible}
        onCancel={handlePreviewClose}
        footer={[
          <Button key="close" onClick={handlePreviewClose}>
            {t.sent.closeButton}
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
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
          >
            {t.sent.downloadButton}
          </Button>,
        ]}
        width={800}
      >
        <div className="w-full h-[600px] flex items-center justify-center">
          {previewType.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          ) : previewType === "application/pdf" ? (
            <iframe
              src={previewUrl}
              className="w-full h-full"
              title="PDF Preview"
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-500">{t.sent.previewNotAvailable}</p>
              <p className="text-sm text-gray-400">{t.sent.downloadToView}</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Memo View Modal */}
      <Modal
        title={t.sent.memoLetterView}
        open={memoViewVisible}
        onCancel={() => {
          setMemoViewVisible(false);
          setSelectedLetter(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setMemoViewVisible(false);
              setSelectedLetter(null);
            }}
          >
            {t.sent.closeButton}
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            {t.sent.printButton || "Print"}
          </Button>,
        ]}
        width={800}
      >
        {selectedLetter && (
          <div className="p-4" ref={memoPrintRef}>
            {selectedLetter.status === "rejected" && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">
                  {t.inbox.letterRejected}
                </h4>
                <p>
                  <span className="font-semibold">
                    {t.inbox.rejectionReason}:
                  </span>{" "}
                  {selectedLetter.rejectionNote}
                </p>
              </div>
            )}
            <TemplateMemoLetter
              subject={selectedLetter.subject}
              date={selectedLetter.createdAt}
              recipient={selectedLetter.to}
              reference={""}
              body={selectedLetter.content}
              signature={selectedLetter.fromName}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default (props: any) => (
  <ErrorBoundary>
    <Sent {...props} />
  </ErrorBoundary>
);
