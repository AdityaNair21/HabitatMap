import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MapPage from "./components/MapPage";
import AnimalPage from "./components/AnimalPage";
import Dashboard from "./components/Dashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page, user starts here */}
        <Route path="/login" element={<Login />} />

        {/* Home page */}
        <Route path="/" element={<Dashboard />} />

        {/* Map page */}
        <Route path="/map" element={<MapPage />} />

        {/* Animal page with dynamic id */}
        <Route path="/animal/:id" element={<AnimalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
