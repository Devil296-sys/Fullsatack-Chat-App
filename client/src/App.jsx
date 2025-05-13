import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import { useAuthStore } from "./Store/AuthStore";
import { Loader2 } from "lucide-react";
import Navbar from "./Components/Navbar";
import Settings from "./Pages/Settings";
import Notifications from "./Pages/Notifications";

const App = () => {
  const { Auth, isCheckingAuth, checkAuth, theme } = useAuthStore();
  const isAuthenticated = !!Auth;
  const isProfileSetup = Auth?.profileSetup;
  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isProfileSetup ? (
                <Dashboard />
              ) : (
                <Navigate to="/profile" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : isProfileSetup ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/profile" replace />
            )
          }
        />

        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register />
            ) : isProfileSetup ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/profile" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              isProfileSetup ? (
                <Navigate to="/" replace />
              ) : (
                <Profile />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/settings" element={<Settings />} />

        <Route
          path="/notifications"
          element={
            isAuthenticated ? (
              isProfileSetup ? (
                <Notifications />
              ) : (
                <Navigate to="/profile" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      {!Auth ? (
        <footer className="text-center text-sm text-gray-500 w-screen py-4 fixed bottom-0">
          © {new Date().getFullYear()} Arman Dhull. All rights reserved.
        </footer>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
