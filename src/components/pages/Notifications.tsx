import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Trash2, Check, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../../context/NotificationContext";

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
        console.error("Error fetching notifications:", err);
        setNotifications([]);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [updateUnreadNotifications, user._id]);

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
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/user/${user._id}/read-all`
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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
      console.error("Error deleting notification:", err);
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
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Notifications</h2>
          <p className="text-sm text-gray-600">Stay updated with your latest alerts</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
          >
            <CheckCircle className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No notifications
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You're all caught up! We'll notify you when something new arrives.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border ${
                notification.read
                  ? "bg-white border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        notification.priority
                      )}`}
                    >
                      {notification.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 break-words">
                    {notification.message}
                  </p>
                  {notification.relatedLetter && (
                    <p className="mt-2 text-sm text-gray-500">
                      Related to: {notification.relatedLetter.subject}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                      <span className="sm:hidden">Mark as read</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-red-600 bg-white border border-gray-300 rounded-md hover:bg-red-50"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden">Delete</span>
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
