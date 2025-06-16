import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { InboxProvider } from "./context/InboxContext";

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
import Forget from "./components/pages/Forget";
import ResetPassword from "./components/pages/ResetPassword";

import { LanguageProvider } from "./components/pages/LanguageContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  // Initialize states directly from localStorage for synchronous access on first render
  const initialUser = localStorage.getItem("user");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(initialUser ? JSON.parse(initialUser).role === "admin" : false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.role === "admin");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("user"); // Ensure user data is cleared from localStorage on logout
    localStorage.removeItem("userId"); // Ensure userId is cleared from localStorage on logout
  };

  const PrivateRoute = ({
    children,
    adminRequired = false,
  }: {
    children: React.ReactNode;
    adminRequired?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (adminRequired && !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar isAdmin={isAdmin} isOpen={isOpen} setIsOpen={setIsOpen} />
        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "ml-80" : "ml-12"}
          md:ml-0
          `}
        >
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
    <InboxProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <Router>
              <>
                <ToastContainer />
                <Routes>
                  <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                  />
                  <Route path="/forgot-password" element={<Forget />} />
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
    </InboxProvider>
  );
}
/*******  0cfabed7-dce5-43a5-8d65-b66ce1d202f6  *******/
