import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import MapPage from "./components/MapPage";
import AnimalPage from "./components/AnimalPage";
import AnimalsPage from "./components/AnimalsPage";
import Dashboard from "./components/Dashboard"
import CreateReport from "./components/CreateReport";

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

        {/* Singup page, user starts here */}
        <Route path="/signup" element={<Signup />} />
        {/* Wrapping authenticated routes with CreateReport from all pages user can create report*/}
        <Route element={<CreateReport />}>
          {/* Home page */}
          <Route path="/" element={<Dashboard />} />

          {/* Map page */}
          <Route path="/map" element={<MapPage />} />

          {/* Animal page with dynamic id */}
          <Route path="/animal/:id" element={<AnimalPage />} />

          {/* Animal page Index */}
          <Route path="/animal" element={<AnimalsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
