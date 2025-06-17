import React, { useState, useEffect } from "react";
import { PaperclipIcon, SendIcon, SaveIcon } from "lucide-react";
import CCSection from "./Employees";
import { useLanguage } from "./LanguageContext";
import axios from "axios";
import TemplateMemoLetter from "./TemplateMemoLetter";
import DepartmentSelector from "./DepartmentSelector";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../types/letter.d.ts"; // Import the new interface

const NewLetter = () => {
  const { lang, setLang } = useLanguage();

  const [letterData, setLetterData] = useState<LetterData>({
    subject: "",
    to: "",
    department: "",
    priority: "normal",
    content: "",
    attachments: [],
    cc: [],
    ccEmployees: {},
    from: "",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [toEmployee, setToEmployee] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [attachment, setAttachment] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const t = {
    title: {
      en: "Create New Letter",
      am: "አዲስ ደብዳቤ ይፃፉ",
    },
    subtitle: {
      en: "Compose and send a new letter",
      am: "አዲስ ደብዳቤ ይፃፉ እና ይላኩ",
    },
    department: {
      en: "Department",
      am: "መደብ",
    },
    to: {
      en: "To",
      am: "ወደ",
    },
    subject: {
      en: "Subject",
      am: "ርዕስ",
    },
    priority: {
      en: "Priority",
      am: "ቅደም ተከተል",
    },
    content: {
      en: "Content",
      am: "ይዘት",
    },
    attachments: {
      en: "Attachments",
      am: "አባሪዎች",
    },
    upload: {
      en: "Upload a file",
      am: "ፋይል ያስገቡ",
    },
    orDrag: {
      en: "or drag and drop",
      am: "ወደዚህ ይጎትቱ",
    },
    uploadHint: {
      en: "PDF, DOC up to 10MB",
      am: "ፒዲኤፍ፣ ዶክ እስከ 10MB",
    },
    send: {
      en: "Send Letter",
      am: "ደብዳቤ ላክ",
    },
    saveDraft: {
      en: "Save as Draft",
      am: "እንደ ረቂቅ አስቀምጥ",
    },
    selectDepartment: {
      en: "Select Department",
      am: "የመደብ ምረጥ",
    },
    selectEmployee: {
      en: "Select Employee",
      am: "ሰራተኛ ምረጥ",
    },
  };

  useEffect(() => {
    setLoadingUsers(true);
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .finally(() => setLoadingUsers(false));
  }, []);

  useEffect(() => {
    setLetterData((prev) => ({ ...prev, department: selectedDepartment }));
    setToEmployee("");
  }, [selectedDepartment]);

  useEffect(() => {
    setLetterData((prev) => ({ ...prev, to: toEmployee }));
  }, [toEmployee]);

  const filteredUsers = selectedDepartment
    ? users.filter(
        (u) =>
          u.departmentOrSector?.toLowerCase() ===
          selectedDepartment.toLowerCase()
      )
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!letterData.content.trim()) {
      toast.error("Letter content is required.");
      return;
    }

    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      toast.error("User not logged in. Please log in again.");
      return;
    }

    try {
      let response;

      if (attachment) {
        const formData = new FormData();
        Object.entries(letterData).forEach(([key, value]) => {
          if (key === "ccEmployees") {
            formData.append("ccEmployees", JSON.stringify(value));
          } else if (key !== "attachments") {
            formData.append(key, value as string);
          }
        });
        formData.append("from", currentUserId);
        formData.append("attachment", attachment);

        response = await axios.post(
          "http://localhost:5000/api/letters",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post("http://localhost:5000/api/letters", {
          ...letterData,
          from: currentUserId,
          ccEmployees: JSON.stringify(letterData.ccEmployees),
        });
      }

      setLetterData({
        subject: "",
        to: "",
        department: "",
        priority: "normal",
        content: "",
        attachments: [],
        cc: [],
        ccEmployees: {},
        from: "",
      });
      setSelectedDepartment("");
      setToEmployee("");
      setAttachment(null);
      toast.success("Letter sent successfully!");
    } catch (error: any) {
      console.error("Error details:", error);
      toast.error("Failed to send the letter. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setLetterData((prev) => ({
        ...prev,
        attachments: [file.name],
      }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachment(e.dataTransfer.files[0]);
      setLetterData((prev) => ({
        ...prev,
        attachments: [e.dataTransfer.files[0].name],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeAttachment = () => {
    setAttachment(null);
    setLetterData((prev) => ({
      ...prev,
      attachments: [],
    }));
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {t.title[lang]}
          </h2>
          <p className="text-gray-600">{t.subtitle[lang]}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          {/* Department */}
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              {t.department[lang]}
            </label>
            <DepartmentSelector
              onChange={(val) => setSelectedDepartment(val)}
            />
          </div>
          {/* Recipient */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.to[lang]}
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={t.selectEmployee[lang]}
              value={toEmployee}
              onChange={(e) => setToEmployee(e.target.value)}
              list="user-list"
              autoComplete="off"
              disabled={!selectedDepartment || loadingUsers}
            />
            <datalist id="user-list">
              {filteredUsers.map((user) => (
                <option key={user._id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </datalist>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.subject[lang]}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={lang === "am" ? "ርዕሱን ያስገቡ" : "Enter letter subject"}
              value={letterData.subject}
              onChange={(e) =>
                setLetterData({ ...letterData, subject: e.target.value })
              }
            />
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.priority[lang]}
            </label>
            <div className="flex space-x-4">
              {["normal", "high", "urgent"].map((priority) => (
                <label key={priority} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="priority"
                    value={priority}
                    checked={letterData.priority === priority}
                    onChange={(e) =>
                      setLetterData({ ...letterData, priority: e.target.value })
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {lang === "am"
                      ? priority === "normal"
                        ? "መደበኛ"
                        : priority === "high"
                        ? "ከፍተኛ"
                        : "አስቸኳይ"
                      : priority}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.content[lang]}
            </label>
            <TemplateMemoLetter
              subject={letterData.subject}
              recipient={letterData.to}
              reference={""}
              body={
                <textarea
                  value={letterData.content}
                  onChange={(e) =>
                    setLetterData({ ...letterData, content: e.target.value })
                  }
                  placeholder={
                    lang === "am" ? "የደብዳቤውን ይዘት ያስገቡ" : "Enter letter content"
                  }
                  className="w-full min-h-[180px] text-base outline-none border-none bg-transparent resize-vertical"
                  style={{
                    fontFamily: "'Noto Sans Ethiopic', Arial, sans-serif",
                    lineHeight: 1.8,
                    color: "#222",
                  }}
                />
              }
            />
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.attachments[lang]}
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-1 text-center">
                <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span>{t.upload[lang]}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <p className="pl-1">{t.orDrag[lang]}</p>
                </div>
                <p className="text-xs text-gray-500">{t.uploadHint[lang]}</p>
                {attachment && (
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    <span className="text-green-600 font-medium">
                      {attachment.name}
                    </span>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CC Section */}
          <CCSection letterData={letterData} setLetterData={setLetterData} />

          {/* Submit and Save */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center space-x-2"
            >
              <SendIcon className="w-4 h-4" />
              <span>{t.send[lang]}</span>
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 flex items-center space-x-2"
            >
              <SaveIcon className="w-4 h-4" />
              <span>{t.saveDraft[lang]}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLetter;
