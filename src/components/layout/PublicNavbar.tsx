import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, LockIcon } from 'lucide-react';

interface PublicNavbarProps {
  lang?: 'am' | 'en';
  onLanguageChange?: (lang: 'am' | 'en') => void;
  onAdminLogin?: () => void;
}

export const PublicNavbar = ({ lang = 'am', onLanguageChange, onAdminLogin }: PublicNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Temporary login logic: redirect to dashboard
  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <>
      {/* Top bar for Admin Login and Language Switch */}
      <div className="bg-blue-50/80 backdrop-blur-sm border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <button 
              onClick={onAdminLogin}
              className="text-gray-600 hover:text-blue-600 flex items-center transition-colors duration-200 text-sm font-medium"
            >
              <LockIcon className="w-4 h-4 mr-1.5" />
              Admin Login
            </button>
            <button 
              onClick={() => onLanguageChange?.(lang === 'am' ? 'en' : 'am')}
              className="px-3 py-1 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow transition-all duration-200 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {lang === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="src/img icon/logo.png"
                  alt="LetterFlow logo" 
                  className="h-10 w-auto object-contain"
                />
                <span className="hidden md:block text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  LetterFlow
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#features" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Features
              </a>
              <a 
                href="#services" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Services
              </a>
              <button
                onClick={handleLogin}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Log in
              </button>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md shadow-lg border-t border-gray-100">
            <a 
              href="#features" 
              className="block px-4 py-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
            >
              Features
            </a>
            <a 
              href="#services" 
              className="block px-4 py-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
            >
              Services
            </a>
            <button
              onClick={handleLogin}
              className="block w-full text-left px-4 py-3 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium"
            >
              Log in
            </button>
            <Link
              to="/signup"
              className="block px-4 py-3 rounded-lg text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};
