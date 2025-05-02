import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../layout/PublicNavbar';
import { PublicFooter } from '../layout/PublicFooter';
import {
  MailIcon,
  ClockIcon,
  ShieldCheckIcon,
  SearchIcon,
  CheckCircleIcon,
  BarChartIcon
} from 'lucide-react';

const translations = {
  am: {
    title: 'የደብዳቤ አስተዳደር ስርዓት',
    subtitle: 'የክፍል ሳይንስ እና ጀኦስፓሺያል ኢንስቲትዩት (SSGI)',
    description: 'ለSSGI የተዘጋጀ መደበኛ መዝገብን በትክክል፣ በደህናነት እና በቀና ማድረግ የሚችል መድረክ።',
    getStarted: 'መጀመሪያ ጀምር',
    login: 'ግባ',
    featuresHeading: 'የSSGI ኮሚዩኒኬሽን ፍሎውን በኃይል መሞላ',
    featuresSub: 'የዲጂታል ለውጥዎን ዛሬ ይጀምሩ።',
    ctaTitle: 'መጀመሪያ ለመጀመር ዝግጁ ነዎት?',
    ctaSubtitle: 'የነፃ ሙከራዎን ዛሬ ይጀምሩ።'
  },
  en: {
    title: 'Letter Management System',
    subtitle: 'Space Science and Geospatial Institute (SSGI)',
    description: 'A centralized platform designed for SSGI to manage, track, and organize official correspondence with precision, security, and efficiency.',
    getStarted: 'Get Started',
    login: 'Log In',
    featuresHeading: "Empowering SSGI's Communication Flow",
    featuresSub: 'Launch your digital transformation journey today.',
    ctaTitle: 'Ready to get started?',
    ctaSubtitle: 'Start your free trial today.'
  }
};

const features = [
  {
    name: {
      am: 'አንድ ቦታ ውስጥ ደብዳቤዎችን ማስተዳደር',
      en: 'Smart Document Management'
    },
    description: {
      am: 'በቀና እና በቅን እንዲያስተዳድሩ ሁሉንም ደብዳቤዎች ያንድ ቦታ ውስጥ ያደርጉ።',
      en: 'Efficiently organize and manage all your business correspondence in one place.'
    },
    icon: MailIcon
  },
  {
    name: { am: 'በእውነተኛው ጊዜ መከታተያ', en: 'Real-time Tracking' },
    description: {
      am: 'ደብዳቤዎችን በእውነተኛ ጊዜ ይከታተሉ።',
      en: 'Track the status of your letters and documents in real-time.'
    },
    icon: ClockIcon
  },
  {
    name: { am: 'የተፋጠነ ደህንነት', en: 'Advanced Security' },
    description: {
      am: 'በኢንተርፕላይዝ ደህንነት ደረጃ አስተዳደር ያድርጉ።',
      en: 'Enterprise-grade security to keep your sensitive documents safe.'
    },
    icon: ShieldCheckIcon
  },
  {
    name: { am: 'ኃይለኛ ፍለጋ', en: 'Powerful Search' },
    description: {
      am: 'አንዱን ሰነድ በቅርብ ጊዜ ያግኙ።',
      en: 'Find any document instantly with our advanced search capabilities.'
    },
    icon: SearchIcon
  },
  {
    name: { am: 'በራስ-ሰር የሚሰሩ ስራዎች', en: 'Automated Workflows' },
    description: {
      am: 'የማጽደቅ ሂደቶችን ቀላል ያድርጉ።',
      en: 'Streamline your approval processes with automated workflows.'
    },
    icon: CheckCircleIcon
  },
  {
    name: { am: 'ትክክለኛ ትንተና', en: 'Analytics & Insights' },
    description: {
      am: 'ከስራዎ ሂደቶች ጠቃሚ ትንተና ያግኙ።',
      en: 'Gain valuable insights into your document workflows.'
    },
    icon: BarChartIcon
  }
];

const Home = ({ onLogin }: { onLogin: () => void }) => {
  const [lang, setLang] = useState<'am' | 'en'>('am');
  const navigate = useNavigate();

  const t = translations[lang];

  const handleLogin = () => {
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Language Switcher */}
      <div className="bg-gray-200 p-2 text-right pr-4">
        <button onClick={() => setLang(lang === 'am' ? 'en' : 'am')}>
          {lang === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
        </button>
      </div>

      <PublicNavbar />

      <main className="flex-grow">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">{t.title}</span>
                <span className="block text-blue-600">{t.subtitle}</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                {t.description}
              </p>

              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    {t.getStarted}
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    {t.login}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-24" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t.featuresHeading}
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                {t.featuresSub}
              </p>
            </div>
            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.name.en}
                  className="bg-white pt-6 px-6 pb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div>
                    <span className="p-3 bg-blue-50 rounded-lg inline-block">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {feature.name[lang]}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">{t.ctaTitle}</span>
              <span className="block text-blue-200">{t.ctaSubtitle}</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  {t.getStarted}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default Home;
