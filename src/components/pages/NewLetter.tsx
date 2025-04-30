import React, { useState } from 'react';
import { PaperclipIcon, SendIcon, SaveIcon } from 'lucide-react';
import CCSection from './Employees';  // Import the CCSection component

const departments = [
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'it', label: 'IT' },
  { value: 'operations', label: 'Operations' }
];

const NewLetter = () => {
  const [letterData, setLetterData] = useState({
    subject: '',
    reference: '',
    to: '',
    department: '',
    priority: 'normal',
    content: '',
    attachments: [],
    cc: [],
    ccEmployees: {}
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Letter Data:', letterData);
    // Handle submission logic here
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Create New Letter</h2>
        <p className="text-gray-600">Compose and send a new letter</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          {/* Reference Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  LTR-2023-
                </span>
                <input
                  type="text"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                  placeholder="090"
                  value={letterData.reference}
                  onChange={e => setLetterData({ ...letterData, reference: e.target.value })}
                />
              </div>
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={letterData.department}
                onChange={e => setLetterData({ ...letterData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter letter subject"
              value={letterData.subject}
              onChange={e => setLetterData({ ...letterData, subject: e.target.value })}
            />
          </div>

          {/* To (Recipient) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Recipient(s)"
              value={letterData.to}
              onChange={e => setLetterData({ ...letterData, to: e.target.value })}
            />
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="flex space-x-4">
              {['normal', 'high', 'urgent'].map(priority => (
                <label key={priority} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="priority"
                    value={priority}
                    checked={letterData.priority === priority}
                    onChange={e => setLetterData({ ...letterData, priority: e.target.value })}
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter letter content"
              value={letterData.content}
              onChange={e => setLetterData({ ...letterData, content: e.target.value })}
            ></textarea>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
              </div>
            </div>
          </div>

          {/* CC Section */}
          <CCSection letterData={letterData} setLetterData={setLetterData} />

          {/* Submit & Save Buttons */}
          <div className="flex justify-between mt-6">
            <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center space-x-2">
              <SendIcon className="w-4 h-4" />
              <span>Send Letter</span>
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white rounded-md px-4 py-2 flex items-center space-x-2"
              onClick={() => console.log('Draft saved')}
            >
              <SaveIcon className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLetter;
