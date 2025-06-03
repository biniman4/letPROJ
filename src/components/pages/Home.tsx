import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PublicNavbar } from "../layout/PublicNavbar";
import { PublicFooter } from "../layout/PublicFooter";
import { Modal } from "react-responsive-modal";
import axios from "axios";
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
  LockIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const translations = {
  am: {
    title: "የደብዳቤ አስተዳደር ስርዓት",
    subtitle: "የክፍል ሳይንስ እና ጀኦስፓሺያል ኢንስቲትዩት (SSGI)",
    description: "ለSSGI የተዘጋጀ መደበኛ መዝገብን በትክክል፣ በደህናነት እና በቀና ማድረግ የሚችል መድረክ።",
    getStarted: "መጀመሪያ ጀምር",
    login: "ግባ",
    featuresHeading: "የSSGI ኮሚዩኒኬሽን ፍሎውን በኃይል መሞላ",
    featuresSub: "የዲጂታል ለውጥዎን ዛሬ ይጀምሩ።",
    ctaTitle: "መጀመሪያ ለመጀመር ዝግጁ ነዎት?",
    ctaSubtitle: "የነፃ ሙከራዎን ዛሬ ይጀምሩ።",
  },
  en: {
    title: "Letter Management System",
    subtitle: "Space Science and Geospatial Institute (SSGI)",
    description:
      "A centralized platform designed for SSGI to manage, track, and organize official correspondence with precision, security, and efficiency.",
    getStarted: "Get Started",
    login: "Log In",
    featuresHeading: "Empowering SSGI's Communication Flow",
    featuresSub: "Launch your digital transformation journey today.",
    ctaTitle: "Ready to get started?",
    ctaSubtitle: "Start your free trial today.",
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
    },
  }),
};

const wordVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const features = [
  {
    name: {
      am: "አንድ ቦታ ውስጥ ደብዳቤዎችን ማስተዳደር",
      en: "Smart Document Management",
    },
    description: {
      am: "በቀና እና በቅን እንዲያስተዳድሩ ሁሉንም ደብዳቤዎች ያንድ ቦታ ውስጥ ያደርጉ።",
      en: "Efficiently organize and manage all your business correspondence in one place.",
    },
    icon: MailIcon,
  },
  {
    name: { am: "በእውነተኛው ጊዜ መከታተያ", en: "Real-time Tracking" },
    description: {
      am: "ደብዳቤዎችን በእውነተኛ ጊዜ ይከታተሉ።",
      en: "Track the status of your letters and documents in real-time.",
    },
    icon: ClockIcon,
  },
  {
    name: { am: "የተፋጠነ ደህንነት", en: "Advanced Security" },
    description: {
      am: "በኢንተርፕላይዝ ደህንነት ደረጃ አስተዳደር ያድርጉ።",
      en: "Enterprise-grade security to keep your sensitive documents safe.",
    },
    icon: ShieldCheckIcon,
  },
  {
    name: { am: "ኃይለኛ ፍለጋ", en: "Powerful Search" },
    description: {
      am: "አንዱን ሰነድ በቅርብ ጊዜ ያግኙ።",
      en: "Find any document instantly with our advanced search capabilities.",
    },
    icon: SearchIcon,
  },
  {
    name: { am: "በራስ-ሰር የሚሰሩ ስራዎች", en: "Automated Workflows" },
    description: {
      am: "የማጽደቅ ሂደቶችን ቀላል ያድርጉ።",
      en: "Streamline your approval processes with automated workflows.",
    },
    icon: CheckCircleIcon,
  },
  {
    name: { am: "ትክክለኛ ትንተና", en: "Analytics & Insights" },
    description: {
      am: "ከስራዎ ሂደቶች ጠቃሚ ትንተና ያግኙ።",
      en: "Gain valuable insights into your document workflows.",
    },
    icon: BarChartIcon,
  },
];

const services = [
  {
    name: {
      am: "የደብዳቤ ሂደት",
      en: "Letter Processing",
    },
    description: {
      am: "የመግቢያ እና የውጪ ይፋዊ ደብዳቤዎችን ውጤታማ ማስተናገድ",
      en: "Efficient handling of incoming and outgoing official correspondence.",
    },
    icon: FileTextIcon,
  },
  {
    name: {
      am: "ሰነድ ማህደረ ትውስታ",
      en: "Document Archiving",
    },
    description: {
      am: "የተቋማት ሰነዶች ደህንነታቸው የተጠበቀ ረጅም ጊዜ ማከማቻ እና ማግኛ",
      en: "Secure long-term storage and retrieval of institutional documents.",
    },
    icon: LayersIcon,
  },
  {
    name: {
      am: "የማጽደቅ ስራ ፍሰቶች",
      en: "Approval Workflows",
    },
    description: {
      am: "ለማጽደቅ እና ፊርማ የተመቻቸ መስመር",
      en: "Streamlined routing for authorization and signatures.",
    },
    icon: SendIcon,
  },
];

const Home = ({ onLogin }: { onLogin: () => void }): JSX.Element => {
  const [lang, setLang] = useState<"am" | "en">("am");
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const t = translations[lang];

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");
    try {
      // Example login request (replace with your backend endpoint)
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        credentials
      );
      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      onLogin();
      // Redirect based on user role
      if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (error: any) {
      setLoginError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF]">
      <PublicNavbar lang={lang} onLanguageChange={setLang} />
      <main className="flex-grow">
        <div className="relative h-screen bg-gradient-to-b from-[#F5F8FF] via-[#FAFBFF] to-white">
          {/* Left side water drops */}
          <div className="absolute left-0 w-[15%] top-0 bottom-0 overflow-hidden">
            <div className="water-drops-left absolute inset-0"></div>
            <div className="water-drops-left-2 absolute inset-0"></div>
          </div>

          {/* Right side water drops */}
          <div className="absolute right-0 w-[15%] top-0 bottom-0 overflow-hidden">
            <div className="water-drops-right absolute inset-0"></div>
            <div className="water-drops-right-2 absolute inset-0"></div>
          </div>

          {/* Main content water drops */}
          <div className="absolute left-[15%] right-[15%] top-0 bottom-0 overflow-hidden">
            <div className="water-drops absolute inset-0"></div>
            <div className="water-drops-2 absolute inset-0"></div>
            <div className="water-drops-3 absolute inset-0"></div>
            <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[10%] left-[20%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center">
            <div className="text-center">
              <motion.div
                key={lang + "-title"}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="relative"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight font-extrabold text-gray-900">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
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
                  <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl text-blue-600">
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

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed"
              >
                {t.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-16 max-w-md mx-auto sm:flex sm:justify-center md:mt-20 gap-4"
              >
                <div className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {t.login}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="py-24 bg-white relative" id="features">
          <div className="absolute inset-0">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-50 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#E4E9FF_1px,transparent_1px)] [background-size:40px_40px] opacity-20"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {t.featuresHeading}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-xl text-gray-500"
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
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
                >
                  <div>
                    <span className="p-3 bg-blue-50 rounded-xl inline-block group-hover:bg-blue-100 transition-colors duration-200">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {feature.name[lang]}
                  </h3>
                  <p className="mt-4 text-gray-500 leading-relaxed">
                    {feature.description[lang]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-24 relative" id="services">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFF] to-white"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-[0.02]"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {lang === "am"
                  ? "የሙያተኛ አገልግሎቶቻችን"
                  : "Our Professional Services"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-xl text-gray-500"
              >
                {lang === "am"
                  ? "ለSSGI የግንኙነት ፍላጎቶች የተለዩ መፍትሄዎች"
                  : "Specialized solutions for SSGI's communication needs"}
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
                  className="group bg-gradient-to-br from-white to-blue-50/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100/20 hover:border-blue-200"
                >
                  <div>
                    <span className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl inline-block shadow-md group-hover:shadow-lg transition-all duration-200">
                      <service.icon className="h-7 w-7 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {service.name[lang]}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed text-lg">
                    {service.description[lang]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative py-24" id="cta">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(255,255,255,0.1),transparent)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_300px,rgba(255,255,255,0.08),transparent)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02]"></div>
          </div>

          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">{t.ctaTitle}</span>
                <span className="block mt-2 text-blue-200">
                  {t.ctaSubtitle}
                </span>
              </h2>
            </motion.div>
          </div>
        </div>
      </main>

      <PublicFooter />

      <Modal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        center
        classNames={{
          modal: "rounded-2xl p-4 sm:p-8 w-[95%] max-w-md bg-white shadow-2xl",
          overlay: "bg-gray-900/50 backdrop-blur-sm",
        }}
      >
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Sign In</h2>
          <p className="text-sm sm:text-base text-gray-600">Sign in with your credentials</p>
        </div>

        {loginError && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-gray-700 mb-1.5 sm:mb-2 text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
              <input
                type="email"
                className="pl-9 sm:pl-12 w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="user@example.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1.5 sm:mb-2 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
              <input
                type="password"
                className="pl-9 sm:pl-12 w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text-xs sm:text-sm text-blue-600 hover:underline focus:outline-none"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In
          </button>
        </form>
      </Modal>

      <style>
        {`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          @keyframes droplet {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            50% {
              transform: translateY(15px) scale(1.1);
              opacity: 0.7;
            }
            100% {
              transform: translateY(30px) scale(1);
              opacity: 0;
            }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .water-drops,
          .water-drops-2,
          .water-drops-3 {
            pointer-events: none;
            background-size: 200px 200px;
            animation: droplet 3s linear infinite;
            opacity: 0.6;
          }

          .water-drops {
            background-image: 
              radial-gradient(2px 2px at 40px 40px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 80px 60px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 120px 90px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 160px 120px, rgba(99, 102, 241, 0.6) 50%, transparent);
          }

          .water-drops-2 {
            animation-delay: -1s;
            background-image: 
              radial-gradient(2px 2px at 20px 50px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 60px 70px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 100px 100px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 140px 130px, rgba(99, 102, 241, 0.6) 50%, transparent);
          }

          .water-drops-3 {
            animation-delay: -2s;
            background-image: 
              radial-gradient(2px 2px at 30px 30px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 70px 80px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 110px 110px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 150px 140px, rgba(99, 102, 241, 0.6) 50%, transparent);
          }

          .water-drops-left,
          .water-drops-left-2,
          .water-drops-right,
          .water-drops-right-2 {
            pointer-events: none;
            background-size: 100px 100px;
            animation: droplet 4s linear infinite;
            opacity: 0.4;
          }

          .water-drops-left {
            background-image: 
              radial-gradient(2px 2px at 20px 20px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 40px 40px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 60px 60px, rgba(99, 102, 241, 0.6) 50%, transparent);
          }

          .water-drops-left-2 {
            animation-delay: -2s;
            background-image: 
              radial-gradient(2px 2px at 30px 30px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 50px 50px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 70px 70px, rgba(99, 102, 241, 0.6) 50%, transparent);
          }

          .water-drops-right {
            background-image: 
              radial-gradient(2px 2px at 25px 25px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 45px 45px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 65px 65px, rgba(99, 102, 241, 0.6) 50%, transparent);
          }

          .water-drops-right-2 {
            animation-delay: -2s;
            background-image: 
              radial-gradient(2px 2px at 35px 35px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 55px 55px, rgba(99, 102, 241, 0.6) 50%, transparent),
              radial-gradient(2px 2px at 75px 75px, rgba(99, 102, 241, 0.6) 50%, transparent);
          }
        `}
      </style>
    </div>
  );
};

export default Home;
