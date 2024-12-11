import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import MapPage from "./components/MapPage";
import AnimalPage from "./components/AnimalPage";
import AnimalsPage from "./components/AnimalsPage";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";

export default function App() {
  // Check if the user is logged in (user object in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the 'user' object exists in localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Only allow access to login and signup when not authenticated */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

        {/* Redirect other routes if the user is not authenticated */}
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/map" element={isAuthenticated ? <MapPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/animal/:id" element={isAuthenticated ? <AnimalPage /> : <Navigate to="/login" />} />
        <Route path="/animal" element={isAuthenticated ? <AnimalsPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
