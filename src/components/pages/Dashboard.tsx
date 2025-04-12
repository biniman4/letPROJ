import React from 'react';
import { LetterStats } from '../dashboard/LetterStats';
import { RecentLetters } from '../dashboard/RecentLetters';
import { ActivityTimeline } from '../dashboard/ActivityTimeline';
const Dashboard = () => {
  return <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <p className="text-gray-600">Welcome back, here's your overview.</p>
      </div>
      <LetterStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RecentLetters />
        <ActivityTimeline />
      </div>
    </div>;
};
export default Dashboard;