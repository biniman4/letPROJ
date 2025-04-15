// import React from 'react';
import { FileTextIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
const letters = [{
  id: 1,
  reference: 'LTR-2023-089',
  subject: 'Q4 Budget Planning Meeting',
  department: 'Finance',
  date: 'Today, 10:30 AM',
  status: 'urgent'
}, {
  id: 2,
  reference: 'LTR-2023-088',
  subject: 'New IT Security Policy Update',
  department: 'IT',
  date: 'Today, 9:15 AM',
  status: 'pending'
}, {
  id: 3,
  reference: 'LTR-2023-087',
  subject: 'Employee Training Schedule',
  department: 'HR',
  date: 'Yesterday',
  status: 'completed'
}, {
  id: 4,
  reference: 'LTR-2023-086',
  subject: 'Office Maintenance Notice',
  department: 'Facilities',
  date: 'Yesterday',
  status: 'completed'
}];
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'pending':
      return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    case 'urgent':
      return <AlertCircleIcon className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};
export const RecentLetters = () => {
  return <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Letters
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
            View all
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {letters.map(letter => <div key={letter.id} className="p-4 hover:bg-gray-50 transition-colors duration-150 flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-4">
              <FileTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-800">
                  {letter.subject}
                </h4>
                {getStatusIcon(letter.status)}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">
                  {letter.reference}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  {letter.department}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500">{letter.date}</span>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};