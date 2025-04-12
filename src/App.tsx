import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

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
import Signup from "./components/pages/Signup"; // Added Signup page

export function App() {
  // Set isAuthenticated to true for now
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Always true for now

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true); // Set to true explicitly for now
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false); // Update authentication state
  };

  // PrivateRoute Component for authenticated routes
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate(); // useNavigate hook inside PrivateRoute
    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/"); // Redirect to home if not authenticated
      }
    }, [isAuthenticated, navigate]); // Run when authentication state changes

    if (!isAuthenticated) {
      return null;
      // Donot render protected content if not
    }

    return (
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <Header onLogout={handleLogout} />{" "}
          {/* Pass logout handler to header */}
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
    <Router>
      <Routes>
        <Route path="/" element={<Home onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} /> {/* Signup route */}
        {/* Protected Routes */}
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
      </Routes>
    </Router>
  );
}
