import React, { useState } from 'react';
import { FileTextIcon, UserIcon, CalendarIcon, TagIcon, PaperclipIcon, SendIcon, SaveIcon } from 'lucide-react';
const NewLetter = () => {
  const [letterData, setLetterData] = useState({
    subject: '',
    reference: '',
    to: '',
    department: '',
    priority: 'normal',
    content: '',
    attachments: []
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Letter Data:', letterData);
    // Handle letter submission
  };
  return <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Create New Letter
        </h2>
        <p className="text-gray-600">Compose and send a new letter</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  LTR-2023-
                </span>
                <input type="text" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300" placeholder="090" value={letterData.reference} onChange={e => setLetterData({
                ...letterData,
                reference: e.target.value
              })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={letterData.department} onChange={e => setLetterData({
              ...letterData,
              department: e.target.value
            })}>
                <option value="">Select Department</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
                <option value="it">IT</option>
                <option value="operations">Operations</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter letter subject" value={letterData.subject} onChange={e => setLetterData({
            ...letterData,
            subject: e.target.value
          })} />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Recipient(s)" value={letterData.to} onChange={e => setLetterData({
            ...letterData,
            to: e.target.value
          })} />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex space-x-4">
              {['normal', 'high', 'urgent'].map(priority => <label key={priority} className="inline-flex items-center">
                  <input type="radio" className="form-radio text-blue-600" name="priority" value={priority} checked={letterData.priority === priority} onChange={e => setLetterData({
                ...letterData,
                priority: e.target.value
              })} />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {priority}
                  </span>
                </label>)}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter letter content" value={letterData.content} onChange={e => setLetterData({
            ...letterData,
            content: e.target.value
          })}></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Draft
            </button>
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <SendIcon className="h-4 w-4 mr-2" />
              Send Letter
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default NewLetter;