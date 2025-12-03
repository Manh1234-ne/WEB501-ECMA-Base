import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        `http://localhost:3000/users?email=${form.email}`
      );

      if (res.data.length === 0) {
        toast.error("Email không tồn tại!");
        return;
      }

      const user = res.data[0];

      if (String(user.password) !== String(form.password)) {
        toast.error("Mật khẩu sai!");
        return;
      }

      toast.success("Đăng nhập thành công!");
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => navigate("/"), 600);
    } catch (error) {
      toast.error("Lỗi đăng nhập!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Đăng nhập</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
