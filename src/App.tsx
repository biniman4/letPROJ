import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";
import NewLetter from "./components/pages/NewLetter";
import Inbox from "./components/pages/Inbox";
import Archive from "./components/pages/Archive";
import Notifications from "./components/pages/Notifications";
import Users from "./components/pages/Users";
import Settings from "./components/pages/Settings";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import AdminPanel from "./components/pages/AdminPanel";
import Profile from "./components/pages/Profile";
import Sent from "./components/pages/Sent";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";

import { LanguageProvider } from "./components/pages/LanguageContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Check if user is admin - you'll need to implement this logic
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.role === "admin");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const PrivateRoute = ({
    children,
    adminRequired = false,
  }: {
    children: React.ReactNode;
    adminRequired?: boolean;
  }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (adminRequired && !isAdmin) {
        navigate("/dashboard");
      }
    }, [isAuthenticated, isAdmin, navigate]);

    if (!isAuthenticated || (adminRequired && !isAdmin)) {
      return null;
    }

    return (
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar isAdmin={isAdmin} />
        <div className="flex-1 overflow-hidden">
          <Header onLogout={handleLogout} />
          <main
            className="p-6 overflow-auto"
            style={{ height: "calc(100vh - 64px)" }}
          >
            {children}
          </main>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <Router>
            <>
              <ToastContainer />
              <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPassword />}
                />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route path="/" element={<Home onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/new-letter"
                  element={
                    <PrivateRoute>
                      <NewLetter />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/inbox"
                  element={
                    <PrivateRoute>
                      <Inbox />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/sent"
                  element={
                    <PrivateRoute>
                      <Sent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/archive"
                  element={
                    <PrivateRoute>
                      <Archive />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <PrivateRoute>
                      <Notifications />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <PrivateRoute>
                      <Users />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute adminRequired={true}>
                      <AdminPanel />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </>
          </Router>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
/*******  0cfabed7-dce5-43a5-8d65-b66ce1d202f6  *******/
