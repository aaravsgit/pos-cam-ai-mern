// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import POSPage from "./pages/POSPage";
import CameraPage from "./pages/CameraPage";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<POSPage />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </Router>
  );
}
