import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Institutions from "./pages/Institutions";
import FreeResources from "./pages/FreeResources"; // ✅ REQUIRED
import CareerQuiz from "./pages/CareerQuizPage";   // ✅ OK
import Login from "./pages/Login";
import Register from "./pages/Register";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/resources" element={<FreeResources />} /> {/* ✅ FIX */}
        <Route path="/career-quiz" element={<CareerQuiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
