import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LockIcon, GlobeIcon } from 'lucide-react';

interface PublicNavbarProps {
  lang?: 'am' | 'en';
  onLanguageChange?: (lang: 'am' | 'en') => void;
  onAdminLogin?: () => void;
}

export const PublicNavbar = ({ lang = 'am', onLanguageChange, onAdminLogin }: PublicNavbarProps): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setIsMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-4 group">
                <div className="relative w-16 h-16 overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/src/img icon/logo.png"
                    alt="SSGI Logo"
                    className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  LetterFlow
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, 'features')}
                className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer"
              >
                Features
              </a>
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, 'services')}
                className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer"
              >
                Services
              </a>
            </div>

            {/* Language Switch */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => onLanguageChange?.(lang === 'am' ? 'en' : 'am')}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <GlobeIcon className="w-4 h-4 mr-1.5" />
                {lang === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${
              isMobileMenuOpen ? 'block' : 'hidden'
            } md:hidden`}
          >
            <div className="pt-2 pb-3 space-y-1">
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, 'features')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Features
              </a>
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, 'services')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Services
              </a>
            </div>
            <div className="pt-2 pb-3 border-t border-gray-200">
              <button
                onClick={() => onLanguageChange?.(lang === 'am' ? 'en' : 'am')}
                className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <GlobeIcon className="w-4 h-4 mr-1.5" />
                {lang === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
