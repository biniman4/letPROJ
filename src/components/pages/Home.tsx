import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../layout/PublicNavbar';
import { PublicFooter } from '../layout/PublicFooter';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import {
  MailIcon,
  ClockIcon,
  ShieldCheckIcon,
  SearchIcon,
  CheckCircleIcon,
  BarChartIcon,
  FileTextIcon,
  LayersIcon,
  SendIcon,
  UserIcon,
  LockIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5
    }
  })
};

const wordVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
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

const services = [
  {
    name: {
      am: 'የደብዳቤ ሂደት',
      en: 'Letter Processing'
    },
    description: {
      am: 'የመግቢያ እና የውጪ ይፋዊ ደብዳቤዎችን ውጤታማ ማስተናገድ',
      en: 'Efficient handling of incoming and outgoing official correspondence.'
    },
    icon: FileTextIcon
  },
  {
    name: {
      am: 'ሰነድ ማህደረ ትውስታ',
      en: 'Document Archiving'
    },
    description: {
      am: 'የተቋማት ሰነዶች ደህንነታቸው የተጠበቀ ረጅም ጊዜ ማከማቻ እና ማግኛ',
      en: 'Secure long-term storage and retrieval of institutional documents.'
    },
    icon: LayersIcon
  },
  {
    name: {
      am: 'የማጽደቅ ስራ ፍሰቶች',
      en: 'Approval Workflows'
    },
    description: {
      am: 'ለማጽደቅ እና ፊርማ የተመቻቸ መስመር',
      en: 'Streamlined routing for authorization and signatures.'
    },
    icon: SendIcon
  }
];

const Home = ({ onLogin }: { onLogin: () => void }) => {
  const [lang, setLang] = useState<'am' | 'en'>('am');
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const t = translations[lang];

  const handleLogin = () => {
    onLogin();
    navigate('/dashboard');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', adminCredentials);
      
      if (response.data.user.role === 'admin') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin();
        navigate('/admin');
      } else {
        setLoginError('Access denied. Admin privileges required.');
      }
    } catch (error) {
      setLoginError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gray-200 p-2 text-right pr-4 flex justify-between items-center">
        <button 
          onClick={() => setShowAdminLogin(true)}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <LockIcon className="w-4 h-4 mr-1" />
          Admin Login
        </button>
        <button onClick={() => setLang(lang === 'am' ? 'en' : 'am')}>
          {lang === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
        </button>
      </div>

      <PublicNavbar />

      <main className="flex-grow">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang + "-title"}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                >
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">
                      {t.title.split("").map((char, i) => (
                        <motion.span
                          key={i}
                          custom={i}
                          variants={letterVariants}
                          className="inline-block"
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </span>
                    <span className="block text-blue-600">
                      {t.subtitle.split("").map((char, i) => (
                        <motion.span
                          key={i}
                          custom={i}
                          variants={letterVariants}
                          className="inline-block"
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </span>
                  </h1>
                </motion.div>
              </AnimatePresence>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
              >
                {t.description}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
              >
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
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-24" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
              >
                {t.featuresHeading}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-lg text-gray-500"
              >
                {t.featuresSub}
              </motion.p>
            </div>
            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name.en}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-24 bg-white" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
              >
                {lang === 'am' ? 'የሙያተኛ አገልግሎቶቻችን' : 'Our Professional Services'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-lg text-gray-500"
              >
                {lang === 'am' ? 'ለSSGI የግንኙነት ፍላጎቶች የተለዩ መፍትሄዎች' : 'Specialized solutions for SSGI\'s communication needs'}
              </motion.p>
            </div>
            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.name.en}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 pt-6 px-6 pb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div>
                    <span className="p-3 bg-blue-50 rounded-lg inline-block">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {service.name[lang]}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {service.description[lang]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">{t.ctaTitle}</span>
                <span className="block text-blue-200">{t.ctaSubtitle}</span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
            >
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  {t.getStarted}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <PublicFooter />

      <Modal 
        open={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)}
        center
        classNames={{
          modal: 'rounded-lg p-6 w-full max-w-md'
        }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p className="text-gray-600">Please enter your admin credentials</p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {loginError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
                value={adminCredentials.email}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Login as Admin
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;