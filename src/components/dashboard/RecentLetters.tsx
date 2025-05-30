import React, { useEffect, useState } from "react";
import {
  FileTextIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react";
import axios from "axios";

interface Letter {
  _id: string;
  subject: string;
  department: string;
  createdAt: string;
  priority: string;
  fromName: string;
}

const getStatusIcon = (priority: string) => {
  switch (priority) {
    case "urgent":
      return <AlertCircleIcon className="w-5 h-5 text-red-500" />;
    case "normal":
      return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    case "completed":
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

export const RecentLetters = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/letters");
        // Sort by date and take only the 5 most recent letters
        const recentLetters = response.data
          .sort(
            (a: Letter, b: Letter) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);
        setLetters(recentLetters);
        setError(null);
      } catch (err) {
        setError("Failed to load recent letters");
        console.error("Error fetching letters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Letters
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
            View all
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {letters.map((letter) => (
          <div
            key={letter._id}
            className="p-4 hover:bg-gray-50 transition-colors duration-150 flex items-center"
          >
            <div className="p-2 bg-blue-50 rounded-lg mr-4">
              <FileTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-800">
                  {letter.subject}
                </h4>
                {getStatusIcon(letter.priority)}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">{letter.fromName}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  {letter.department}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  {formatDate(letter.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
