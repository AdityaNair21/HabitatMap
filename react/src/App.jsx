import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import MapPage from "./components/MapPage";
import AnimalPage from "./components/AnimalPage";
import AnimalsPage from "./components/AnimalsPage";
import Dashboard from "./components/Dashboard"
import ProfilePage from "./components/ProfilePage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Check if user exists in localStorage
  const user = localStorage.getItem('user');

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render the child components
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/animal"
          element={
            <ProtectedRoute>
              <AnimalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/animal/:id"
          element={
            <ProtectedRoute>
              <AnimalPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect to login for any undefined routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);