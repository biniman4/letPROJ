import React from 'react';
import { MailIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { useLanguage } from '../pages/LanguageContext';

export const LetterStats = () => {
  const { t } = useLanguage();
  
  const stats = [{
    icon: MailIcon,
    label: t.dashboard.totalLetters,
    value: '1,234',
    color: 'bg-blue-50 text-blue-600'
  }, {
    icon: CheckCircleIcon,
    label: t.dashboard.processed,
    value: '892',
    color: 'bg-green-50 text-green-600'
  }, {
    icon: ClockIcon,
    label: t.dashboard.pending,
    value: '234',
    color: 'bg-yellow-50 text-yellow-600'
  }, {
    icon: AlertCircleIcon,
    label: t.dashboard.urgent,
    value: '18',
    color: 'bg-red-50 text-red-600'
  }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-800">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};