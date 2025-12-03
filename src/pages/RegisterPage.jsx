import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const check = await axios.get(
        `http://localhost:3000/users?email=${form.email}`
      );
      if (check.data.length > 0) {
        toast.error("Email đã tồn tại!");
        return;
      }

      await axios.post("http://localhost:3000/users", form);

      toast.success("Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      toast.error("Lỗi đăng ký!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Đăng ký</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Họ tên"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Đăng ký
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
