// import React from 'react';
import { CheckCircleIcon, FileTextIcon, MailIcon, UserIcon } from 'lucide-react';
const activities = [{
  id: 1,
  type: 'approval',
  title: 'Budget Proposal Approved',
  description: 'Finance department budget proposal was approved',
  time: '30 minutes ago',
  icon: CheckCircleIcon,
  iconColor: 'text-green-500 bg-green-50'
}, {
  id: 2,
  type: 'new_letter',
  title: 'New Policy Document',
  description: 'HR department published new work-from-home policy',
  time: '2 hours ago',
  icon: FileTextIcon,
  iconColor: 'text-blue-500 bg-blue-50'
}, {
  id: 3,
  type: 'sent',
  title: 'Meeting Minutes Sent',
  description: 'Q4 Planning meeting minutes distributed to all departments',
  time: '4 hours ago',
  icon: MailIcon,
  iconColor: 'text-purple-500 bg-purple-50'
}, {
  id: 4,
  type: 'mention',
  title: 'You were mentioned',
  description: 'Sarah mentioned you in IT Infrastructure proposal',
  time: 'Yesterday',
  icon: UserIcon,
  iconColor: 'text-yellow-500 bg-yellow-50'
}];
export const ActivityTimeline = () => {
  return <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-0 left-4 bottom-0 w-0.5 bg-gray-200" style={{
          left: '19px'
        }}></div>
          {/* Activity items */}
          <div className="space-y-6">
            {activities.map(activity => <div key={activity.id} className="relative flex items-start ml-6">
                <div className={`absolute -left-10 mt-1 rounded-full p-2 ${activity.iconColor}`}>
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
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};