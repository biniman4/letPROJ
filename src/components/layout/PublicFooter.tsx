import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../components/pages/LanguageContext';

export const PublicFooter = (): JSX.Element => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              {t.footer.about}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/about" className="hover:text-blue-700">{t.footer.instituteOverview}</Link>
              </li>
              <li>
                <Link to="/mission" className="hover:text-blue-700">{t.footer.missionVision}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-700">{t.footer.contactUs}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              {t.footer.resources}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/services" className="hover:text-blue-700">{t.footer.ourServices}</Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-blue-700">{t.footer.documentation}</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-700">{t.footer.faqs}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              {t.footer.legal}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/privacy" className="hover:text-blue-700">{t.footer.privacyPolicy}</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-700">{t.footer.termsOfUse}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              {t.footer.location}
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              {t.footer.instituteName}<br />
              {t.footer.address}<br />
              <a href="https://ssgi.gov.et" className="text-blue-600 hover:text-blue-800">
                {t.footer.website}
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
};
