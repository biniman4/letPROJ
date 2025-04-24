import { useState, useRef, useEffect } from 'react';
import {
  SearchIcon,
  BellIcon,
  UserIcon,
  LogOutIcon,
  SettingsIcon,
  XIcon
} from 'lucide-react';

type HeaderProps = {
  onLogout: () => void;
};

export const Header = ({ onLogout }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExit = () => {
    alert('Exiting...');
    setOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Search */}
      <div className="flex items-center w-96">
        <SearchIcon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search letters, users..."
          className="ml-2 w-full outline-none text-sm"
        />
      </div>

      {/* Right: Notification + Profile */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <BellIcon className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-600" />
          </div>
          <span className="text-sm text-gray-700">John Director</span>
        </div>

        {/* Dropdown */}
        <div
          className={`absolute top-14 right-0 w-56 bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 ease-out z-50
            ${open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
        >
          <div className="divide-y divide-gray-100">
            <button className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition">
              <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
              Profile
            </button>
            <button className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition">
              <SettingsIcon className="w-4 h-4 mr-2 text-gray-500" />
              Settings
            </button>
            <button
              onClick={() => {
                onLogout(); // Call the prop from parent
                setOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition"
            >
              <LogOutIcon className="w-4 h-4 mr-2 text-gray-500" />
              Logout
            </button>
            <button
              onClick={handleExit}
              className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Exit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
