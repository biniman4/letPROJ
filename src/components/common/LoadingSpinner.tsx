import React from "react";
import { MailOutlined } from "@ant-design/icons";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading your messages...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
      <div className="relative mb-4">
        <span className="inline-block p-6 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 animate-pulse shadow-2xl">
          <MailOutlined className="text-white text-5xl animate-bounce" />
        </span>
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-ping opacity-70">
          !
        </span>
      </div>
      <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 animate-pulse">
        {message}
      </div>
      <div className="text-gray-400 text-sm italic">
        Please wait a moment...
      </div>
    </div>
  );
};

export default LoadingSpinner;
