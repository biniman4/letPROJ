import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboardIcon, MailPlusIcon, InboxIcon,
  ArchiveIcon, BellIcon, UsersIcon, SettingsIcon,
  MenuIcon, XIcon, ShieldIcon
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard' },
  { icon: MailPlusIcon, label: 'New Letter', path: '/new-letter' },
  { icon: InboxIcon, label: 'Inbox', path: '/inbox' },
  { icon: ArchiveIcon, label: 'Archive', path: '/archive' },
  { icon: BellIcon, label: 'Notifications', path: '/notifications' },
  { icon: UsersIcon, label: 'Users', path: '/users' },
  { icon: SettingsIcon, label: 'Settings', path: '/settings' }
];

const adminItems = [
  { icon: ShieldIcon, label: 'Admin Panel', path: '/admin' }
];

export const Sidebar = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const items = isAdmin ? [...navItems, ...adminItems] : navItems;

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
      <div className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}>
        
        {/* Logo Section */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">LetterFlow</h1>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4">
          {items.map(item => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all mb-1
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }
            >
              <item.icon className={`w-5 h-5 flex-shrink-0`} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section - You can add user profile or logout here */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
              <img
                src="https://ui-avatars.com/api/?name=John+Director&background=E3F2FD&color=2563EB"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">John Director</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30" 
        />
      )}
    </>
  );
};