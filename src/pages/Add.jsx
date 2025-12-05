import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddPage({ destinations, setTours }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    destinationId: "",
    category: "",        
    slots: "",          
    active: true        
  });

  const validate = () => {
    if (!form.name || form.name.length < 5 || form.name.length > 100) {
      toast.error("Tên tour phải từ 5 đến 100 ký tự");
      return false;
    }
    if (!form.description || form.description.length < 10 || form.description.length > 1000) {
      toast.error("Mô tả phải từ 10 đến 1000 ký tự");
      return false;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Giá phải > 0");
      return false;
    }
    try {
      new URL(form.image);
    } catch {
      toast.error("URL hình ảnh không hợp lệ");
      return false;
    }
    if (!form.destinationId) {
      toast.error("Vui lòng chọn điểm đến");
      return false;
    }
    if (!form.category) {
      toast.error("Chọn loại tour");
      return false;
    }
    if (!form.slots || Number(form.slots) < 0) {
      toast.error("Số lượng chỗ phải ≥ 0");
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
      const res = await axios.post("http://localhost:3000/tours", {
        ...form,
        price: Number(form.price),
        slots: Number(form.slots)
      });
      setTours((prev) => [...prev, res.data]);
      toast.success("Thêm tour thành công");
      navigate("/list");
    } catch (err) {
      toast.error("Thêm thất bại");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm Tour mới</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Tên Tour</label>
              <input type="text" name="name" className="w-full border rounded px-3 py-2"
                value={form.name} onChange={handleChange} />
            </div>

            <div>
              <label className="block mb-1">Mô tả</label>
              <textarea name="description" className="w-full border rounded px-3 py-2 h-28"
                value={form.description} onChange={handleChange}></textarea>
            </div>

            <div>
              <label className="block mb-1">Giá</label>
              <input type="number" name="price" className="w-full border rounded px-3 py-2"
                value={form.price} onChange={handleChange} />
            </div>

            <div>
              <label className="block mb-1">Hình ảnh (URL)</label>
              <input type="text" name="image" className="w-full border rounded px-3 py-2"
                value={form.image} onChange={handleChange} />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 w-full">
              Thêm Tour
            </button>
          </div>
          

          {/* RIGHT */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Điểm đến</label>
              <select name="destinationId" className="w-full border rounded px-3 py-2"
                value={form.destinationId} onChange={handleChange}>
                <option value="">-- Chọn điểm đến --</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Loại tour</label>
              <select name="category" className="w-full border rounded px-3 py-2"
                value={form.category} onChange={handleChange}>
                <option value="">-- Chọn loại tour --</option>
                <option value="tour nội địa">Tour nội địa</option>
                <option value="tour quốc tế">Tour quốc tế</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Số lượng chỗ</label>
              <input type="number" name="slots" className="w-full border rounded px-3 py-2"
                value={form.slots} onChange={handleChange} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="active"
                checked={form.active} onChange={handleChange} />
              <label>Đang hoạt động</label>
            </div>

            
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPage;
