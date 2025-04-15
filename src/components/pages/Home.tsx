import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../layout/PublicNavbar';
import { PublicFooter } from '../layout/PublicFooter';
import {
  MailIcon,
  ClockIcon,
  ShieldCheckIcon,
  SearchIcon,
  CheckCircleIcon,
  BarChartIcon,
  FileTextIcon,
  LayersIcon,
  SendIcon
} from 'lucide-react';

const features = [
  {
    name: 'Smart Document Management',
    description: 'Efficiently organize and manage all your business correspondence in one place.',
    icon: MailIcon
  },
  {
    name: 'Real-time Tracking',
    description: 'Track the status of your letters and documents in real-time.',
    icon: ClockIcon
  },
  {
    name: 'Advanced Security',
    description: 'Enterprise-grade security to keep your sensitive documents safe.',
    icon: ShieldCheckIcon
  },
  {
    name: 'Powerful Search',
    description: 'Find any document instantly with our advanced search capabilities.',
    icon: SearchIcon
  },
  {
    name: 'Automated Workflows',
    description: 'Streamline your approval processes with automated workflows.',
    icon: CheckCircleIcon
  },
  {
    name: 'Analytics & Insights',
    description: 'Gain valuable insights into your document workflows.',
    icon: BarChartIcon
  }
];

const services = [
  {
    name: 'Letter Processing',
    description: 'Efficient handling of incoming and outgoing official correspondence.',
    icon: FileTextIcon
  },
  {
    name: 'Document Archiving',
    description: 'Secure long-term storage and retrieval of institutional documents.',
    icon: LayersIcon
  },
  {
    name: 'Approval Workflows',
    description: 'Streamlined routing for authorization and signatures.',
    icon: SendIcon
  }
];

const Home = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Logging in...");
    onLogin();
    navigate('/dashboard');
    console.log("Redirecting to dashboard...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-grow">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Letter Management System</span>
                <span className="block text-blue-600">Space Science and Geospatial Institute (SSGI)</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                A centralized platform designed for SSGI to manage, track, and organize official correspondence with precision, security, and efficiency.
              </p>

              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Log In
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
                Empowering SSGI's Communication Flow
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Launch your digital transformation journey today.
              </p>
            </div>
            <div className="mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="bg-white pt-6 px-6 pb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div>
                      <span className="p-3 bg-blue-50 rounded-lg inline-block">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-24 bg-white" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Professional Services
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Specialized solutions for SSGI's communication needs
              </p>
            </div>
            <div className="mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="bg-gray-50 pt-6 px-6 pb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div>
                      <span className="p-3 bg-blue-50 rounded-lg inline-block">
                        <service.icon className="h-6 w-6 text-blue-600" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-blue-200">Start your free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Get Started
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
