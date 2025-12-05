import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      toast.success("Đăng nhập thành công!");

      navigate("/list"); // ✔ đúng route
    } catch (err) {
      toast.error("Email hoặc mật khẩu sai!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-2 border mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 border mb-3"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Đăng nhập
        </button>
      </form>

      <p className="text-center mt-4">
        Chưa có tài khoản? <Link className="text-blue-500" to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}

export default LoginPage;
