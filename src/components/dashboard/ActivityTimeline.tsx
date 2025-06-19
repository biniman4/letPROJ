import React from "react";
import {
  CheckCircleIcon,
  FileTextIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { useLanguage } from '../pages/LanguageContext';

export const ActivityTimeline = () => {
  const { t } = useLanguage();
  
  const activities = [
    {
      id: 1,
      type: "approval",
      title: t.dashboard.activities.approval.title,
      description: t.dashboard.activities.approval.description,
      time: t.dashboard.activities.approval.time,
      icon: CheckCircleIcon,
      iconColor: "text-green-500 bg-green-50",
    },
    {
      id: 2,
      type: "new_letter",
      title: t.dashboard.activities.newPolicy.title,
      description: t.dashboard.activities.newPolicy.description,
      time: t.dashboard.activities.newPolicy.time,
      icon: FileTextIcon,
      iconColor: "text-blue-500 bg-blue-50",
    },
    {
      id: 3,
      type: "sent",
      title: t.dashboard.activities.meeting.title,
      description: t.dashboard.activities.meeting.description,
      time: t.dashboard.activities.meeting.time,
      icon: MailIcon,
      iconColor: "text-purple-500 bg-purple-50",
    },
    {
      id: 4,
      type: "mention",
      title: t.dashboard.activities.mention.title,
      description: t.dashboard.activities.mention.description,
      time: t.dashboard.activities.mention.time,
      icon: UserIcon,
      iconColor: "text-yellow-500 bg-yellow-50",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 transition-transform duration-200 hover:shadow-lg hover:scale-[1.03]">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{t.dashboard.recentActivity}</h3>
      </div>
      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute top-0 left-4 bottom-0 w-0.5 bg-gray-200"
            style={{
              left: "19px",
            }}
          ></div>
          {/* Activity items */}
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-start ml-6">
                <div
                  className={`absolute -left-10 mt-1 rounded-full p-2 ${activity.iconColor}`}
                >
                  <activity.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {activity.description}
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
