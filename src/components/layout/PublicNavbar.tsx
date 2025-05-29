
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LockIcon, GlobeIcon } from 'lucide-react';

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon, LockIcon } from "lucide-react";


interface PublicNavbarProps {
  lang?: "am" | "en";
  onLanguageChange?: (lang: "am" | "en") => void;
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

export const PublicNavbar = ({
  lang = "am",
  onLanguageChange,
  onAdminLogin,
}: PublicNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Temporary login logic: redirect to dashboard
  const handleLogin = () => {
    navigate("/dashboard");
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
              onClick={() => onLanguageChange?.(lang === "am" ? "en" : "am")}
              className="px-3 py-1 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow transition-all duration-200 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {lang === "am" ? "Switch to English" : "ወደ አማርኛ ቀይር"}
            </button>
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="src/img icon/logo.png" // fixed slash direction
                  alt="LetterFlow logo"
                  className="h-6 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#services" className="text-gray-600 hover:text-gray-900">
                Services
              </a>
              <button
                onClick={handleLogin}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                <LockIcon className="w-4 h-4 mr-1.5" />
                Admin Login
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
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
      </nav>

      {/* Main Navigation */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >

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

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"

                onClick={(e) => handleSmoothScroll(e, 'features')}
                className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer"

                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"

              >
                Features
              </a>
              <a
                href="#services"

                onClick={(e) => handleSmoothScroll(e, 'services')}
                className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer"

                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"

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

        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
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

          {/* Admin button (optional) */}
          {/* <Link to="/admin" className="...">Admin Login</Link> */}
        </div>
      </div>
    </>

  );
};
