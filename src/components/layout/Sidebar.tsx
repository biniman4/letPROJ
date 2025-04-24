// import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboardIcon, MailPlusIcon, InboxIcon, ArchiveIcon, BellIcon, UsersIcon, SettingsIcon } from 'lucide-react';
const navItems = [{
  icon: LayoutDashboardIcon,
  label: 'Dashboard',
  path: '/dashboard' 
}, {
  icon: MailPlusIcon,
  label: 'New Letter',
  path: '/new-letter'
}, {
  icon: InboxIcon,
  label: 'Inbox',
  path: '/inbox'
}, {
  icon: ArchiveIcon,
  label: 'Archive',
  path: '/archive'
}, {
  icon: BellIcon,
  label: 'Notifications',
  path: '/notifications'
}, {
  icon: UsersIcon,
  label: 'Users',
  path: '/users'
}, {
  icon: SettingsIcon,
  label: 'Settings',
  path: '/settings'
}];
export const Sidebar = () => {
  return <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-800">LetterFlow</h1>
      </div>
      <nav className="flex-1">
        {navItems.map(item => <NavLink key={item.label} to={item.path} className={({
        isActive
      }) => `w-full flex items-center space-x-3 px-6 py-3 text-sm ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>)}
      </nav>
    </div>;
};