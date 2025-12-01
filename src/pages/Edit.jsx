import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

function EditPage({ destinations = [], setTours }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    destination: "",
    duration: "",
    price: "",
    image: "",
    description: "",
    available: "",
    category: "Tour nội địa",
    active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/tours/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("Lỗi lấy tour:", err);
        toast.error("Tour không tồn tại!");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const priceNum = Number(form.price);
    if (!priceNum || priceNum <= 0) {
      toast.error("Giá phải là số dương.");
      return;
    }

    const updatedTour = {
      ...form,
      price: priceNum,
      available: Number(form.available) || 0,
    };

    try {
      setSaving(true);
      const res = await axios.put(`http://localhost:3000/tours/${id}`, updatedTour);

      toast.success("Cập nhật tour thành công!");

      if (typeof setTours === "function") {
        setTours((prev) =>
          prev.map((t) => (String(t.id) === String(id) ? res.data : t))
        );
      }

      setTimeout(() => navigate("/list"), 600);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Cập nhật Tour</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Tên Tour</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} type="text" className="w-full border rounded-lg px-3 py-2" required />
        </div>

        <div>
          <label htmlFor="destination" className="block font-medium mb-1">Điểm đến</label>
          <select id="destination" name="destination" value={form.destination} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-white" required>
            {destinations.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="block font-medium mb-1">Thời lượng</label>
          <input id="duration" name="duration" value={form.duration} onChange={handleChange} type="text" placeholder="Ví dụ: 3 ngày 2 đêm" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label htmlFor="price" className="block font-medium mb-1">Giá (VND)</label>
          <input id="price" name="price" value={form.price} onChange={handleChange} type="number" min="0" className="w-full border rounded-lg px-3 py-2" required />
        </div>

        <div>
          <label htmlFor="available" className="block font-medium mb-1">Số lượng còn (available)</label>
          <input id="available" name="available" value={form.available} onChange={handleChange} type="number" min="0" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label htmlFor="image" className="block font-medium mb-1">URL ảnh</label>
          <input id="image" name="image" value={form.image} onChange={handleChange} type="text" placeholder="https://example.com/pic.jpg" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">Mô tả</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows="4" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}

export default EditPage;
