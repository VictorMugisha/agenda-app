import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
