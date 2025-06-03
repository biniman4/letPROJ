import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboardIcon,
  MailPlusIcon,
  InboxIcon,
  ArchiveIcon,
  BellIcon,
  UsersIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  ShieldIcon,
  ChevronsLeft,
  ChevronsRight,
  SendIcon,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboardIcon, label: "Dashboard", path: "/dashboard" },
  { icon: MailPlusIcon, label: "New Letter", path: "/new-letter" },
  { icon: InboxIcon, label: "Inbox", path: "/inbox" },
  { icon: SendIcon, label: "Sent", path: "/sent" },
  { icon: ArchiveIcon, label: "Archive", path: "/archive" },
  { icon: BellIcon, label: "Notifications", path: "/notifications" },
  { icon: UsersIcon, label: "Users", path: "/users" },
  { icon: SettingsIcon, label: "Settings", path: "/settings" },
];

const adminItems = [{ icon: ShieldIcon, label: "Admin Panel", path: "/admin" }];

export const Sidebar = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = [...navItems, ...(isAdmin ? adminItems : [])];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        <MenuIcon className="w-6 h-6 text-gray-600" />
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="h-full w-64 bg-white shadow-lg lg:shadow-none">
          {/* Logo Section */}
          <div className="px-5 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">LetterFlow</h1>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <XIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation Container */}
          <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Navigation Items */}
            <nav className="px-2 py-4 flex flex-col space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-2.5 rounded-md text-[15px] transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};
