import React, { useState, useContext } from "react";
import { PaperclipIcon, SendIcon, SaveIcon, GlobeIcon } from "lucide-react";
import CCSection from "./Employees";
import { LanguageContext } from "./LanguageContext"; // Import LanguageContext
import axios from "axios"; // Move this import to the top

const departments = [
  { value: "finance", label: { en: "Finance", am: "ፋይናንስ" } },
  { value: "hr", label: { en: "Human Resources", am: "የሰው ኃብት" } },
  { value: "it", label: { en: "IT", am: "ቴክኖሎጂ" } },
  { value: "operations", label: { en: "Operations", am: "ኦፕሬሽን" } },
];

const NewLetter = () => {
  const { lang, setLang } = useContext(LanguageContext); // Corrected: use lang and setLang
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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the letter data to the backend API
      const response = await axios.post(
        "http://localhost:5000/api/letters",
        letterData
      );
      console.log("Letter saved successfully:", response.data);

      // Optionally, reset the form or show a success message
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
      });
      alert("Letter sent successfully!");
    } catch (error) {
      console.error(
        "Error saving letter:",
        error.response?.data || error.message
      );
      alert("Failed to send the letter. Please try again.");
    }
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
    subject: {
      en: "Subject",
      am: "ርዕስ",
    },
    to: {
      en: "To",
      am: "ወደ",
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
          {/* Reference and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.department[lang]}
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={letterData.department}
                onChange={(e) =>
                  setLetterData({ ...letterData, department: e.target.value })
                }
              >
                <option value="">
                  {lang === "am" ? "የመደብ ምረጥ" : "Select Department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label[lang]}
                  </option>
                ))}
              </select>
            </div>
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

          {/* To */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.to[lang]}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={lang === "am" ? "ተቀባዩን ያስገቡ" : "Recipient(s)"}
              value={letterData.to}
              onChange={(e) =>
                setLetterData({ ...letterData, to: e.target.value })
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
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={
                lang === "am" ? "የደብዳቤውን ይዘት ያስገቡ" : "Enter letter content"
              }
              value={letterData.content}
              onChange={(e) =>
                setLetterData({ ...letterData, content: e.target.value })
              }
            ></textarea>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.attachments[lang]}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
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
                    />
                  </label>
                  <p className="pl-1">{t.orDrag[lang]}</p>
                </div>
                <p className="text-xs text-gray-500">{t.uploadHint[lang]}</p>
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
