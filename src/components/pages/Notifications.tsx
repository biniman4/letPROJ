// import React from 'react';
import { BellIcon } from 'lucide-react';
const Notifications = () => {
  return <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
        <p className="text-gray-600">
          Stay updated with your letter activities
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 text-center text-gray-500">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No new notifications</p>
        </div>
      </div>
    </div>;
};
export default Notifications;