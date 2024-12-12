import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import MapPage from "./components/MapPage";
import AnimalPage from "./components/AnimalPage";
import AnimalsPage from "./components/AnimalsPage";
import Dashboard from "./components/Dashboard"
import ProfilePage from "./components/ProfilePage";
import CreateReport from "./components/CreateReport";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        // Add more robust checking - parse and validate the user object
        const parsedUser = user ? JSON.parse(user) : null;

        // You might want to add additional checks here, such as:
        // - Checking if the token is expired
        // - Verifying the token's validity with a backend
        setIsAuthenticated(!!parsedUser);
      } catch (error) {
        // If parsing fails, consider user not authenticated
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    // Check authentication immediately
    checkAuth();

    // Optional: Listen for storage changes across tabs
    window.addEventListener('storage', checkAuth);

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location.pathname]);

  // Show loading state if still checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Replace with your actual loading component
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

// Wrapper Component that combines ProtectedRoute and CreateReport
const ProtectedReportWrapper = () => {
  return (
    <ProtectedRoute>
      <CreateReport>
        <Outlet />
      </CreateReport>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes with CreateReport Wrapper */}
        <Route element={<ProtectedReportWrapper />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/animal" element={<AnimalsPage />} />
          <Route path="/animal/:id" element={<AnimalPage />} />
        </Route>

        {/* Redirect to login for any undefined routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);