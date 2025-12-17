import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

import ListPage from "./pages/List";
import AddPage from "./pages/Add";
import EditPage from "./pages/Edit";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [sinhviens, setSinhviens] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, d] = await Promise.all([
          axios.get("http://localhost:3000/sinhviens"),
        ]);
        setSinhviens(t.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- ProtectedRoute ---
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <>
      {/* NAVIGATION */}
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold"><strong>WEB501 App</strong></Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-200">Trang chủ</Link>
            <Link to="/list" className="hover:text-gray-200">Danh sách</Link>
            <Link to="/add" className="hover:text-gray-200">Thêm mới</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {!localStorage.getItem("token") ? (
              <>
                <Link to="/login" className="hover:text-gray-200">Đăng nhập</Link>
                <Link to="/register" className="hover:text-gray-200">Đăng ký</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="hover:text-gray-200">Đăng xuất</button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 px-4">

        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage sinhviens={sinhviens} setSinhviens={setSinhviens} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route
            path="/list"
            element={
              <ProtectedRoute>
                <ListPage sinhviens={sinhviens} setSinhviens={setSinhviens} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddPage setSinhviens={setSinhviens} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPage setSinhviens={setSinhviens} />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </div>

      <Toaster />
    </>
  );
}

export default App;
