import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';


export const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Temporary login logic: redirect to dashboard
  const handleLogin = () => {
    // Simulate login success and redirect
    navigate('/dashboard');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
  <img 
  src= "src\img icon\logo.png"  // note: no /src/public
  alt="LetterFlow logo" 
  className="h-6 w-auto object-contain"
/>
</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">services</a>

            <button
              onClick={handleLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in
            </button>

            {/* <Link
             to="/admin"
             className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
>
             Admin Login
              </Link> */}
              </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#features" className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">Features</a>
            <a href="#pricing" className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">services</a>
            <button
              onClick={handleLogin}
              className="block w-full text-left px-3 py-2 rounded-md text-blue-600 hover:text-blue-700 hover:bg-gray-50"
            >
              Log in
            </button>
            <Link
  to="/admin"
  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
>
  Admin Login
</Link>
          </div>
        </div>
      )}
    </nav>
  );
};
