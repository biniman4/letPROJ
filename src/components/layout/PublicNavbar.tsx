import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobeIcon } from "lucide-react";
import { useLanguage, SupportedLang } from "../pages/LanguageContext";

export const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="/src/img icon/logo.png"
                  alt="SSGI Logo"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-semibold text-[#4169E1]">
                  {t.sidebar.letterFlow}
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {t.home.featuresHeading}
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {t.home.servicesHeading}
              </a>
              <a
                href="#video-demo"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {t.home.seeHowItWorksNav}
              </a>
              <a
                href="https://docs.google.com/forms/d/14KkSeXLDL_0OJ8KXSjnYIHGHWpBq4pTqjUFERxrOH94/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C88B3D] text-white px-4 py-2 rounded-lg hover:bg-[#a06d2a] transition-colors duration-200 font-medium"
              >
                {t.home.applyForm}
              </a>
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === SupportedLang.Am ? SupportedLang.En : SupportedLang.Am)}
              className="flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
            >
              <GlobeIcon className="w-4 h-4 mr-1.5" />
              {lang === SupportedLang.Am ? t.home.switchToEnglish : t.home.switchToAmharic}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
