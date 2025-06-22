import React from "react";
import { LetterStats } from "../dashboard/LetterStats";
import { RecentLetters } from "../dashboard/RecentLetters";
import { ActivityTimeline } from "../dashboard/ActivityTimeline";
import { useLanguage } from "./LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#b97b2a] via-[#cfae7b] to-[#cfc7b7] text-transparent bg-clip-text drop-shadow-md">
            {t.sidebar.dashboard}
          </h2>
          <p className="text-lg text-[#BFBFBF] font-medium">
            {t.dashboard.welcome}
          </p>
        </div>

        <div className="mb-8">
          <LetterStats />
        </div>

        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-2xl font-bold text-[#003F5D] mb-3">
            {t.dashboard.welcomeTitle}
          </h3>
          <p className="text-md text-gray-600 max-w-3xl mx-auto">
            {t.dashboard.welcomeDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* <RecentLetters /> */}
          {/* <ActivityTimeline /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
