import React from 'react';
import { SettingsIcon } from 'lucide-react';
const Settings = () => {
  return <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
        <p className="text-gray-600">Configure your application preferences</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                General Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure your basic preferences.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="text-center text-gray-500">
                <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Settings options will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Settings;