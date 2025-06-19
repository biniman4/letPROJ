import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Trash2, Check, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../../context/NotificationContext";
import { useLanguage } from "./LanguageContext";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  priority: string;
  createdAt: string;
  relatedLetter?: {
    _id: string;
    subject: string;
    fromName: string;
  };
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { updateUnreadNotifications } = useNotifications();
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications/user/${user._id}`
        );
        setNotifications(res.data);
        // Update unread count
        const unreadCount = res.data.filter(
          (n: Notification) => !n.read
        ).length;
        updateUnreadNotifications(unreadCount);
        setLoading(false);
      } catch (err) {
        console.error(t.notifications.errorFetchingNotifications, err);
        setNotifications([]);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [updateUnreadNotifications, user._id, t.notifications.errorFetchingNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );

      // Update unread count
      const unreadCount = notifications.filter(
        (n) => !n.read && n._id !== notificationId
      ).length;
      updateUnreadNotifications(unreadCount);
    } catch (err) {
      console.error(t.notifications.errorMarkingRead, err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/user/${user._id}/read-all`
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error(t.notifications.errorMarkingAllRead, error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/${notificationId}`
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

      // Update unread count
      const unreadCount = notifications.filter(
        (n) => !n.read && n._id !== notificationId
      ).length;
      updateUnreadNotifications(unreadCount);
    } catch (err) {
      console.error(t.notifications.errorDeletingNotification, err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">{t.notifications.loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{t.notifications.title}</h2>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <CheckCircle className="w-4 h-4" />
            {t.notifications.markAllAsRead}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t.notifications.noNotifications}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t.notifications.allCaughtUp}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] ${
                notification.read
                  ? "bg-white border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        notification.priority
                      )}`}
                    >
                      {notification.priority === "high" ? t.notifications.priorityHigh :
                       notification.priority === "medium" ? t.notifications.priorityMedium :
                       t.notifications.priorityLow}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                  {notification.relatedLetter && (
                    <p className="mt-2 text-sm text-gray-500">
                      {t.notifications.relatedTo} {notification.relatedLetter.subject}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={t.notifications.markAsRead}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title={t.notifications.deleteNotification}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
