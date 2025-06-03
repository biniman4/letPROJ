import React from 'react';
import { LetterStats } from '../dashboard/LetterStats';
import { RecentLetters } from '../dashboard/RecentLetters';
import { ActivityTimeline } from '../dashboard/ActivityTimeline';

const Dashboard = () => {
  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h2>
        <p className="text-gray-600 text-sm">Welcome back, here's your overview.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="mb-6">
        <LetterStats />
      </div>

      {/* Recent Letters and Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentLetters />
        <ActivityTimeline />
      </div>
    </div>
  );
};

export default Dashboard;