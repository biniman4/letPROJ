import { useState, useRef, useEffect } from "react";
import {
  SearchIcon,
  BellIcon,
  UserIcon,
  LogOutIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0">
      {/* Left: Search */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search letters, users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Right: Notification + Profile */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <img
              src="https://ui-avatars.com/api/?name=John+Director&background=E3F2FD&color=2563EB"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">John Director</span>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-200 ${
              open
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-2 invisible"
            }`}
          >
            <div className="p-2 space-y-1">
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button 
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
