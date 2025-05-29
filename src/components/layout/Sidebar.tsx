import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboardIcon, MailPlusIcon, InboxIcon,
  ArchiveIcon, BellIcon, UsersIcon, SettingsIcon,
  MenuIcon, XIcon, ShieldIcon, ChevronsLeft, ChevronsRight
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
  const [isOpen, setIsOpen] = useState(true);

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
      <div className={`fixed z-40 top-0 left-0 h-screen bg-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-full border-r-2 border-gray-300 rounded-tr-[32px] rounded-br-[32px] relative">
          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-8 bg-white rounded-full p-1.5 border-2 border-gray-300 cursor-pointer hover:bg-gray-50"
          >
            {isOpen ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>

          {/* Logo Section */}
          <div className="px-5 py-4">
            <h1 className={`text-2xl font-bold text-gray-900 transition-all ${!isOpen && 'scale-0'}`}>LetterFlow</h1>
          </div>

          {/* Navigation Container */}
          <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* Navigation Items */}
            <nav className="px-2 py-6 flex flex-col space-y-3">
              {items.map(item => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-2.5 rounded-md text-[16px] transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-[#6b7280] hover:bg-gray-50 hover:text-gray-900'}`
                  }
                >
                  <item.icon className={`w-[22px] h-[22px] flex-shrink-0`} />
                  <span className={`transition-all ${!isOpen && 'hidden'}`}>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            {/* Spacer to push content to top */}
            <div className="flex-grow"></div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30" 
        />
      )}
    </>
  );
};