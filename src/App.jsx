import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import HomePage from "./pages/HomePage";
import ListPage from "./pages/List";
import AddPage from "./pages/Add";
import EditPage from "./pages/Edit";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, destRes] = await Promise.all([
          axios.get("http://localhost:3000/tours"),
          axios.get("http://localhost:3000/destinations"),
        ]);
        setTours(toursRes.data || []);
        setDestinations(destRes.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            <strong>WEB501 App</strong>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-200">
              Trang chủ
            </Link>
            <Link to="/list" className="hover:text-gray-200">
              Danh sách
            </Link>
            <Link to="/add" className="hover:text-gray-200">
              Thêm mới
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="login" className="hover:text-gray-200">
              Đăng nhập
            </Link>
            <Link to="register" className="hover:text-gray-200">
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list" element={<ListPage tours={tours} setTours={setTours} />} />
          <Route path="/add" element={<AddPage destinations={destinations} setTours={setTours} />} />
          <Route path="/edit/:id" element={<EditPage setTours={setTours} destinations={destinations} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />



        </Routes>
      </div>

      <Toaster />
    </>
  );
}

export default App;
