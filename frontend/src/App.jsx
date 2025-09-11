import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Camera from "./pages/Camera";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/camera" element={<Camera />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
