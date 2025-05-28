import React, { useState, useEffect, useContext } from "react";
import { PaperclipIcon, SendIcon, SaveIcon, GlobeIcon } from "lucide-react";
import CCSection from "./Employees";
import { LanguageContext } from "./LanguageContext";
import axios from "axios";
import TemplateMemoLetter from "./TemplateMemoLetter";
import DepartmentSelector from "./DepartmentSelector";

const NewLetter = () => {
  const { lang, setLang } = useContext(LanguageContext);

  const [letterData, setLetterData] = useState({
    subject: "",
    reference: "",
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

  useEffect(() => {
    setLoadingUsers(true);
    axios.get("http://localhost:5000/api/users")
      .then(res => setUsers(res.data))
      .finally(() => setLoadingUsers(false));
  }, []);

  // When department changes, update letterData and reset toEmployee
  useEffect(() => {
    setLetterData(prev => ({ ...prev, department: selectedDepartment }));
    setToEmployee("");
  }, [selectedDepartment]);

  // When toEmployee changes, update letterData
  useEffect(() => {
    setLetterData(prev => ({ ...prev, to: toEmployee }));
  }, [toEmployee]);

  // Only show users matching selected department
  const filteredUsers = selectedDepartment
    ? users.filter(
        (u) =>
          u.departmentOrSector?.toLowerCase() === selectedDepartment.toLowerCase()
      )
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!letterData.content.trim()) {
      alert("Letter content is required.");
      return;
    }

    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      alert("User not logged in. Please log in again.");
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
        reference: "",
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
      alert("Letter sent successfully!");
    } catch (error: any) {
      alert("Failed to send the letter. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
      setLetterData((prev) => ({
        ...prev,
        attachments: [e.target.files[0].name],
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

  const t = {
    title: {
      en: "Create New Letter",
      am: "አዲስ ደብዳቤ ይፃፉ",
    },
    subtitle: {
      en: "Compose and send a new letter",
      am: "አዲስ ደብዳቤ ይፃፉ እና ይላኩ",
    },
    reference: {
      en: "Reference Number",
      am: "የማጣቀሻ ቁጥር",
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

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {t.title[lang]}
          </h2>
          <p className="text-gray-600">{t.subtitle[lang]}</p>
        </div>
        <button
          className="text-gray-700 hover:text-gray-900 flex items-center"
          onClick={() => setLang(lang === "en" ? "am" : "en")}
        >
          <GlobeIcon className="w-6 h-6 mr-2" />
          <span>{lang === "en" ? "English" : "አማርኛ"}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          {/* Reference */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.reference[lang]}
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                LTR-2023-
              </span>
              <input
                type="text"
                className="flex-1 block w-full px-3 py-2 rounded-none rounded-r-md border focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                placeholder="090"
                value={letterData.reference}
                onChange={(e) =>
                  setLetterData({ ...letterData, reference: e.target.value })
                }
              />
            </div>
          </div>
          {/* Department */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.department[lang]}</label>
            <DepartmentSelector
              value={selectedDepartment}
              onChange={val => setSelectedDepartment(val)}
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
              onChange={e => setToEmployee(e.target.value)}
              list="user-list"
              autoComplete="off"
              disabled={!selectedDepartment || loadingUsers}
            />
            <datalist id="user-list">
              {filteredUsers.map(user =>
                <option
                  key={user._id}
                  value={user.name}
                >
                  {user.name}
                </option>
              )}
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

          {/* Content - Use TemplateMemoLetter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.content[lang]}
            </label>
            <TemplateMemoLetter
              subject={letterData.subject}
              recipient={letterData.to}
              reference={letterData.reference}
              body={
                <textarea
                  value={letterData.content}
                  onChange={e =>
                    setLetterData({ ...letterData, content: e.target.value })
                  }
                  placeholder={
                    lang === "am"
                      ? "የደብዳቤውን ይዘት ያስገቡ"
                      : "Enter letter content"
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