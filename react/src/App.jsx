import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import MapPage from "./components/MapPage";
import AnimalPage from "./components/AnimalPage";
import AnimalsPage from "./components/AnimalsPage";
import Dashboard from "./components/Dashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page, user starts here */}
        <Route path="/login" element={<Login />} />

        {/* Singup page, user starts here */}
        <Route path="/signup" element={<Signup />} />

        {/* Home page */}
        <Route path="/" element={<Dashboard />} />

        {/* Map page */}
        <Route path="/map" element={<MapPage />} />

        {/* Animal page with dynamic id */}
        <Route path="/animal/:id" element={<AnimalPage />} />

        {/* Animal page Index */}
        <Route path="/animal" element={<AnimalsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
