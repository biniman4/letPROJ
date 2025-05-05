import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboardIcon, MailPlusIcon, InboxIcon,
  ArchiveIcon, BellIcon, UsersIcon, SettingsIcon,
  MenuIcon, XIcon
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/' },
  { icon: MailPlusIcon, label: 'New Letter', path: '/new-letter' },
  { icon: InboxIcon, label: 'Inbox', path: '/inbox' },
  { icon: ArchiveIcon, label: 'Archive', path: '/archive' },
  { icon: BellIcon, label: 'Notifications', path: '/notifications' },
  { icon: UsersIcon, label: 'Users', path: '/users' },
  { icon: SettingsIcon, label: 'Settings', path: '/settings' }
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed Top Toggle Button for Mobile */}
      <div className="fixed top-0 left-0 w-full bg-white border-b md:hidden z-50 flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-gray-800">LetterFlow</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
          {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}>
        <div className="p-6 hidden md:block mt-4">
          <h1 className="text-xl font-semibold text-gray-800">LetterFlow</h1>
        </div>
        <nav className="flex flex-col pt-4 mt-12 md:mt-0">
          {navItems.map(item => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close sidebar on mobile link click
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-6 py-3 text-sm transition-all
                ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-30 md:hidden z-30" />}
    </>
  );
};
