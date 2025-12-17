import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddPage({  setSinhviens }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    monhoc: "",
    nganhhoc: "",
           
  });

  const validate = () => {
    if (!form.name) {
      toast.error("Hay nhap ten");
      return false;
    }
    
    
    if (!form.age || Number(form.age) <= 0) {
      toast.error("Tuoi phải > 0");
      return false;
    }
    if (!form.monhoc) {
      toast.error("Hay nhap mon hoc");
      return false;
    }
    if (!form.nganhhoc) {
      toast.error("Hay nhap nganh hoc");
      return false;
    }
    
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:3000/sinhviens", {
        ...form,
        age: Number(form.age),
      });
      setSinhviens((prev) => [...prev, res.data]);
      toast.success("Thêm sinh vien thanh cong");
      navigate("/list");
    } catch (err) {
      toast.error("Thêm thất bại");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm sinh vien moi</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Tên sinh vien</label>
              <input type="text" name="name" className="w-full border rounded px-3 py-2"
                value={form.name} onChange={handleChange} />
            </div>


            <div>
              <label className="block mb-1">Tuoi</label>
              <input type="number" name="age" className="w-full border rounded px-3 py-2"
                value={form.age} onChange={handleChange} />
            </div>
            
            

            
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 w-full">
              Thêm sinh vien
            </button>
          </div>
          

          {/* RIGHT */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Mon hoc</label>
              <input type="text" name="monhoc" className="w-full border rounded px-3 py-2"
                value={form.monhoc} onChange={handleChange} />
            </div>

            <div>
              <label className="block mb-1">Ngành học</label>
              <select name="nganhhoc" className="w-full border rounded px-3 py-2"
                value={form.nganhhoc} onChange={handleChange}>
                <option value="">-- Chọn ngành học --</option>
                <option value="FE">FE</option>
                <option value="BE">BE</option>
                <option value="MOBILE">MOBILE</option>
              </select>
            </div>

            

            
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPage;
